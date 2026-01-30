'use server'

import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'
import { query } from "@/dbh"
import {auth} from "@/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function processLocalUSDTransfer(formData) {
    const amount = parseFloat(formData.get('amount'));
    const amountInCents = Math.round(amount * 100);
    const accountHolderName = formData.get('accountHolderName');
    
    // Internal platform fee (optional)
    const fee = 0.50; 
    const totalDeduction = amount + fee;

    const session = await auth()
    const userId = session?.user?.id

    if(!userId) return {success: false, error: "Session not found, login to fix"}

    try {
        // --- START DATABASE TRANSACTION ---
        await query('BEGIN');

        // 1. Fetch User and Account Balance
        const userRes = await query(
            `SELECT u.stripe_connect_id, u.kyc_status, a.checking_balance 
             FROM paysense_users u 
             JOIN paysense_accounts a ON u.id = a.user_id 
             WHERE u.id = $1 FOR UPDATE`,
            [userId]
        );

        const user = userRes.rows[0];

        // 2. Safety Checks
        if (!user) throw new Error("User record not found.");
        if (!user.stripe_connect_id) throw new Error("Please complete KYC/Bank setup first.");
        if (user.kyc_status !== 'verified') throw new Error("Your account is pending verification.");
        if (parseFloat(user.checking_balance) < totalDeduction) throw new Error("Insufficient funds.");

        // 3. STEP 1: Move funds from Platform Balance to User's Stripe Account
        const transfer = await stripe.transfers.create({
            amount: amountInCents,
            currency: 'usd',
            destination: user.stripe_connect_id,
            description: `Withdrawal for ${userId}`,
            metadata: { internal_user_id: userId }
        });

        // 4. STEP 2: Trigger Payout from User's Stripe Account to their Bank
        // We use the connected account ID in the options object
        const payout = await stripe.payouts.create({
            amount: amountInCents,
            currency: 'usd',
            description: `PaySense Transfer: ${accountHolderName}`,
            statement_descriptor: 'PAYSENSE TRF'
        }, {
            stripeAccount: user.stripe_connect_id, 
        });

        // 5. Update Local Ledger (Deduct Balance)
        await query(
            `UPDATE paysense_accounts 
             SET checking_balance = checking_balance - $1 
             WHERE user_id = $2`,
            [totalDeduction, userId]
        );

        // 6. Record the Transaction
        const txRes = await query(
            `INSERT INTO paysense_transactions (
                user_id, amount, type, description, status, reference_id
            ) VALUES ($1, $2, 'withdrawal', $3, 'processing', $4)
            RETURNING id`,
            [
                userId, 
                amount, 
                `ACH Transfer to ${accountHolderName}`, 
                'processing', 
                payout.id
            ]
        );

        // 7. Create Success Notification
        await query(
            `INSERT INTO paysense_notifications (user_id, type, title, message)
             VALUES ($1, 'info', 'Transfer Dispatched', $2)`,
            [userId, `Your transfer of $${amount.toFixed(2)} to ${accountHolderName} is on the way.`]
        );

        await query('COMMIT');
        // --- END DATABASE TRANSACTION ---

        revalidatePath('/app');
        return { success: true, payoutId: payout.id };

    } catch (error) {
        await query('ROLLBACK');
        console.error("Local Transfer Failed:", error.message);
        return { success: false, error: error.message };
    }
}