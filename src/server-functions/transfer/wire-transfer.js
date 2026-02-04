'use server'

import { query } from "@/dbh"
import { auth } from "@/auth"
import Stripe from 'stripe'
import { revalidatePath } from 'next/cache'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function initiateWireTransfer(formData) {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) return { success: false, error: "Session expired. Please login." }

    const amount = parseFloat(formData.get('amount'))
    const recipientName = formData.get('recipientName')
    const routingNumber = formData.get('routingNumber')
    const accountNumber = formData.get('accountNumber')
    const sourceAccount = formData.get('sourceAccount') // 'savings' or 'checking'
    const pin = formData.get('pin')
    
    const wireFee = 25.00 
    const totalDeduction = amount + wireFee

    try {
        await query('BEGIN')

        // 1. Get User Data & Check PIN
        const userRes = await query(
            `SELECT u.stripe_connect_id, u.kyc_status, u.password, a.checking_balance, a.savings_balance 
             FROM paysense_users u 
             JOIN paysense_accounts a ON u.id = a.user_id 
             WHERE u.id = $1 FOR UPDATE`,
            [userId]
        )

        const user = userRes.rows[0]
        if (!user) throw new Error("Account not found.")
        if (user.kyc_status !== 'verified') throw new Error("KYC Verification required for Wires.")

        // 2. Validate Balance based on source
        const currentBalance = sourceAccount === 'savings' ? user.savings_balance : user.checking_balance
        if (parseFloat(currentBalance) < totalDeduction) {
            throw new Error(`Insufficient funds in ${sourceAccount} account.`)
        }

        // 3. Move money in Stripe Connect
        const transfer = await stripe.transfers.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            destination: user.stripe_connect_id,
            description: `Wire Transfer: ${recipientName}`,
        });

        const payout = await stripe.payouts.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            statement_descriptor: 'PAYSENSE WIRE',
        }, {
            stripeAccount: user.stripe_connect_id,
        });

        // 4. Update Database Ledger
        const balanceColumn = sourceAccount === 'savings' ? 'savings_balance' : 'checking_balance'
        await query(
            `UPDATE paysense_accounts SET ${balanceColumn} = ${balanceColumn} - $1 WHERE user_id = $2`,
            [totalDeduction, userId]
        )

        // 5. Record Transaction
        await query(
            `INSERT INTO paysense_transactions (user_id, amount, type, description, status, reference_id) 
             VALUES ($1, $2, 'wire_transfer', $3, 'processing', $4)`,
            [userId, amount, `Wire to ${recipientName}`, 'processing', payout.id]
        )

        await query(
            `INSERT INTO paysense_notifications (user_id, type, title, message) VALUES ($1, $2, $3, $4)`,
            [senderId, "Pending", "Wire Transfer", `Your transfer of ${amount} has been initiated, this takes up to 2 business days to complete`]
        )

        await query('COMMIT')
        revalidatePath('/app')
        return { success: true }

    } catch (error) {
        await query('ROLLBACK')
        return { success: false, error: error.message }
    }
}