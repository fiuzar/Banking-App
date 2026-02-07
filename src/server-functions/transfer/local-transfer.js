'use server'

import { revalidatePath } from 'next/cache'
import { query, pool } from "@/dbh"
import { auth } from "@/auth"

/**
 * Verifies recipient and identifies account type
 */
export async function getRecipientDetails(accountNumber) {
    if (accountNumber.length !== 10) return { success: false };
    try {
        const res = await query(
            `SELECT u.first_name, u.last_name, 
             CASE 
                WHEN a.savings_account_number = $1 THEN 'Savings'
                WHEN a.checking_account_number = $1 THEN 'Checking'
             END as type
             FROM paysense_users u 
             JOIN paysense_accounts a ON u.id = a.user_id 
             WHERE a.savings_account_number = $1 OR a.checking_account_number = $1`, 
            [accountNumber]
        );
        
        if (res.rows[0]) {
            return { 
                success: true, 
                name: `${res.rows[0].first_name} ${res.rows[0].last_name}`, 
                type: res.rows[0].type 
            };
        }
        return { success: false };
    } catch (e) {
        return { success: false };
    }
}

export async function processLocalUSDTransfer(formData) {
    const session = await auth();
    const senderId = session?.user?.id;
    
    if (!senderId) return { success: false, error: "Authentication required" };

    // REMOVED "as string" - this is standard JS now
    const amount = parseFloat(formData.get('amount'));
    const targetAccNo = formData.get('accountNumber');
    
    const fee = Math.max(2.00, amount * 0.01);
    const totalDeduction = amount + fee;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Check Sender Balance
        const senderCheck = await client.query(
            `SELECT checking_balance FROM paysense_accounts WHERE user_id = $1 FOR UPDATE`,
            [senderId]
        );

        if (parseFloat(senderCheck.rows[0].checking_balance) < totalDeduction) {
            throw new Error("Insufficient funds in your Checking account.");
        }

        // 2. Subtract from Sender
        const {rows: account_details} = await client.query(
            `UPDATE paysense_accounts SET checking_balance = checking_balance - $1 WHERE user_id = $2 returning *`,
            [totalDeduction, senderId]
        );

        // 3. Credit Recipient (Checking if number hits Savings or Checking column)
        const recipientUpdate = await client.query(
            `UPDATE paysense_accounts 
             SET 
               savings_balance = CASE WHEN savings_account_number = $1 THEN savings_balance + $2 ELSE savings_balance END,
               checking_balance = CASE WHEN checking_account_number = $1 THEN checking_balance + $2 ELSE checking_balance END
             WHERE savings_account_number = $1 OR checking_account_number = $1`,
            [targetAccNo, amount]
        );

        if (recipientUpdate.rowCount === 0) {
            throw new Error("Recipient account not found.");
        }

        await query(
            `INSERT INTO paysense_notifications (user_id, type, title, message) VALUES ($1, $2, $3, $4)`,
            [senderId, "success", "Local Transfer", `Successfully transferred $${amount} to ${targetAccNo}`]
        )

        await client.query('COMMIT');
        revalidatePath('/app');
        return { success: true, account_details: account_details[0] };
        
    } catch (e) {
        await client.query('ROLLBACK');
        console.log(e)
        return { success: false, error: e.message };
    } finally {
        client.release();
    }
}