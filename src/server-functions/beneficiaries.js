'use server'

import { query } from "@/dbh"
import { auth } from "@/auth"
import { revalidatePath } from 'next/cache'

export async function addBeneficiaryAction(data) {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) return { success: false, error: "Session lost, login to fix issue" }

    try {
        await query(
            `INSERT INTO beneficiaries (user_id, name, account_number, routing_number, bank_name, type, nickname)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                userId, 
                data.fullName, 
                data.accountNumber, 
                data.type === 'local' ? data.routingNumber : data.swiftCode, 
                data.bankName, 
                data.type,
                data.nickname
            ]
        )

        revalidatePath('/app/beneficiary')
        return { success: true }
    } catch (error) {
        console.error("DB Error:", error)
        return { success: false, error: "Database error. Please check your inputs." }
    }
}

export async function getBeneficiariesAction() {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) return { success: false, error: "Unauthorized" }

    try {
        const res = await query(
            `SELECT 
                id, 
                name, 
                account_number as "accountNumber", 
                routing_number as "routingNumber", 
                bank_name as "bankName", 
                type, 
                nickname,
                created_at
             FROM beneficiaries 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [userId]
        )

        return { success: true, beneficiaries: res.rows || [] }
    } catch (error) {
        console.error("Fetch Beneficiaries Error:", error)
        return { success: false, error: "Could not retrieve beneficiaries" }
    }
}