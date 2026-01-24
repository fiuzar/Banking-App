'use server'

import { query } from "@/dbh"
import { auth } from "@/auth"

export async function initiateWireTransfer(amount, recipientName, routingNumber, accountNumber) {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        return { success: false, error: "Session not found, Login to fix issue" }
    }

    try {
        await client.query('BEGIN')

        // 1. LOCK & CHECK BALANCE (Wire usually comes from Checking)
        const balanceRes = await query(
            `SELECT checking_balance FROM users WHERE id = $1 FOR UPDATE`,
            [userId]
        )

        if (balanceRes.rowCount === 0) throw new Error("User not found")

        const currentBalance = balanceRes.rows[0].checking_balance

        if (currentBalance < amount) {
            throw new Error("Insufficient funds for this wire transfer")
        }

        // 2. DEDUCT FUNDS IMMEDIATELY
        await query(
            `UPDATE users SET checking_balance = checking_balance - $1 WHERE id = $2`,
            [amount, userId]
        )

        // 3. CREATE PENDING WIRE RECORD
        // Store routing details in a JSONB column or separate beneficiaries table
        await client.query(
            `INSERT INTO transactions (user_id, amount, type, status, metadata) VALUES ($1, $2, 'wire_outbound', 'pending', $3)`,
            [
                userId,
                amount,
                JSON.stringify({ recipientName, routingNumber, accountNumber })
            ]
        )

        await query('COMMIT')
        return { success: true, message: "Wire transfer initiated and pending approval." }

    } catch (error) {
        await query('ROLLBACK')
        return { success: false, error: error.message }
    }
}