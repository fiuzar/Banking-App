'use server'

import { query } from "@/dbh"
import { auth } from "@/auth"
import { revalidatePath } from 'next/cache'

export async function issueVirtualCardAction(sourceAccount = 'checking') {
    const session = await auth();
    const userId = session?.user?.id;
    const CARD_FEE = 5.00;

    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        // Start a Transaction to ensure balance deduction and card creation happen together
        await query('BEGIN');

        // 1. Check if user has enough balance and get current account status
        const accountRes = await query(
            `SELECT checking_balance, savings_balance, card_details 
             FROM paysense_accounts WHERE user_id = $1 FOR UPDATE`, 
            [userId]
        );

        const account = accountRes.rows[0];

        if (account.card_details) {
            await query('ROLLBACK');
            return { success: false, error: "You already have an active card." };
        }

        const balance = parseFloat(account[`${sourceAccount}_balance`]);

        if (balance < CARD_FEE) {
            await query('ROLLBACK');
            return { success: false, error: `Insufficient funds in ${sourceAccount} account to cover the $5.00 fee.` };
        }

        // 2. Generate Card Details (In a real app, this comes from Stripe/Marqeta)
        const cardNumber = "4242" + Math.random().toString().slice(2, 14); // Mock card number
        const cvv = Math.floor(100 + Math.random() * 900).toString();
        
        const now = new Date();
        const expiryDate = new Date(now.setFullYear(now.getFullYear() + 3)); // 3 years expiry
        const expiry = `${(expiryDate.getMonth() + 1).toString().padStart(2, '0')}/${expiryDate.getFullYear().toString().slice(-2)}`;

        const newCard = {
            card_number: cardNumber,
            expiry: expiry,
            cvv: cvv,
            status: 'active',
            issued_at: new Date().toISOString(),
            type: 'Visa Virtual'
        };

        // 3. Deduct Fee and Save Card
        const {rows: create_card} = await query(
            `UPDATE paysense_accounts 
             SET ${sourceAccount}_balance = ${sourceAccount}_balance - $1,
                 card_details = $2
             WHERE user_id = $3 RETURNING *`,
            [CARD_FEE, JSON.stringify(newCard), userId]
        );

        // 4. Log the transaction for history
        await query(
            `INSERT INTO paysense_transactions (user_id, amount, type, description, account_type, status, category)
             VALUES ($1, $2, 'debit', 'Virtual Card Issuing Fee', $3, 'completed', 'Service')`,
            [userId, CARD_FEE, sourceAccount]
        );

        await query('COMMIT');
        
        revalidatePath('/app/cards');
        return { success: true, account_details: create_card[0] };

    } catch (error) {
        await query('ROLLBACK');
        console.error("Card Issuing Error:", error);
        return { success: false, error: "Internal server error. Please try again later." };
    }
}

export async function toggle_card_freeze() {
    const session = await auth()
    const userId = session?.user?.id

    if(!userId) return {success: false, error: "Session lost, login to fix issue"}

    try {
        // 1. Get current status from the JSONB column
        const res = await query(
            `SELECT card_details->>'status' as current_status 
             FROM paysense_accounts WHERE user_id = $1`, 
            [userId]
        );

        if (!res.rows[0]?.current_status) {
            return { success: false, error: "No card found to freeze." };
        }

        const newStatus = res.rows[0].current_status === 'active' ? 'frozen' : 'active';

        // 2. Update only the status field inside the JSONB object
        const { rows } = await query(
            `UPDATE paysense_accounts 
             SET card_details = jsonb_set(card_details, '{status}', $1) 
             WHERE user_id = $2 RETURNING *`,
            [JSON.stringify(newStatus), userId]
        );

        revalidatePath('/app/cards');
        return { 
            success: true, 
            message: `Card successfully ${newStatus}`,
            account_details: rows[0]
        };

    } catch (e) {
        console.error("Freeze Error:", e);
        return { success: false, error: "Database error" };
    }
}

export async function getCardTransactions() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return { success: false, transactions: [] };

    try {
        const res = await query(
            `SELECT 
                description as name, 
                TO_CHAR(created_at, 'Mon DD, HH:MI AM') as date, 
                amount, 
                status 
             FROM paysense_transactions 
             WHERE user_id = $1 AND (description ILIKE '%POS%' OR category = 'Shopping')
             ORDER BY created_at DESC LIMIT 10`,
            [userId]
        );

        return { success: true, transactions: res.rows };
    } catch (error) {
        return { success: false, transactions: [] };
    }
}