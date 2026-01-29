'use server'

import { query } from "@/dbh"
import { auth } from "@/auth"

export async function internalTransfer(transfer_amount, from_account) {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        return { success: false, error: "Session not found, Login to fix issue" }
    }

    const amount = parseFloat(transfer_amount)
    if (isNaN(amount) || amount <= 0) {
        return { success: false, error: "Invalid transfer amount" }
    }

    const toAccount = from_account === 'checking' ? 'savings' : 'checking'

    // Columns in your PG table
    const fromColumn = from_account === 'checking' ? 'checking_balance' : 'savings_balance'
    const toColumn = toAccount === 'checking' ? 'checking_balance' : 'savings_balance'

    try {
        // 1. START TRANSACTION
        await query('BEGIN')

        // 2. CHECK SUFFICIENT BALANCE
        const balanceRes = await query(
            `SELECT ${fromColumn} FROM paysense_accounts WHERE id = $1 FOR UPDATE`,
            [userId]
        )

        if (!balanceRes.rows || !balanceRes.rows[0]) {
            await query('ROLLBACK')
            return { success: false, error: "Account not found" }
        }

        const currentBalance = balanceRes.rows[0][fromColumn]

        if (currentBalance < amount) {
            await query('ROLLBACK')
            return { success: false, error: "Insufficient funds" }
        }

        // 3. DEBIT FROM SOURCE
        await query(
            `UPDATE paysense_accounts SET ${fromColumn} = ${fromColumn} - $1 WHERE id = $2`,
            [amount, userId]
        )

        // 4. CREDIT TO DESTINATION
        const { rows: account_details } = await query(
            `UPDATE paysense_accounts SET ${toColumn} = ${toColumn} + $1 WHERE id = $2 returning id, ${toColumn}, ${fromColumn}`,
            [amount, userId]
        )

        if (!account_details || !account_details[0]) {
            await query('ROLLBACK')
            return { success: false, error: "Account update failed" }
        }

        // 5. LOG THE TRANSACTION (Optional but recommended)
        await query(
            `INSERT INTO paysense_transactions (user_id, amount, type, description, status) VALUES ($1, $2, 'internal_transfer', $3, 'completed')`,
            [userId, amount, `Transfer from ${from_account} to ${toAccount}`]
        )

        // 6. COMMIT TRANSACTION
        await query('COMMIT')

        console.log("Internal Transfer Successful")

        return { success: true, account_details: account_details[0] }

    } catch (error) {
        // 7. ROLLBACK ON ERROR
        await query('ROLLBACK')
        console.log("Internal Transfer Error:", error)
        return { success: false, error: error.message || "Conversion Failed please try again later" }
    }
}