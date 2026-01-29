"use server"

import Stripe from 'stripe';
import { auth } from "@/auth";
import { query } from "@/dbh";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCardDepositIntent(amount, targetAccount) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    try {
        // 1. Create the Pending Transaction in our DB first
        // This gives us an audit trail for attempted payments
        const pendingTx = await query(
            `INSERT INTO paysense_transactions 
            (user_id, amount, type, account_type, description, status, category)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [session.user.id, amount, 'credit', targetAccount, 'Card Deposit (Initiated)', 'pending', 'Deposit']
        );

        const internalTxId = pendingTx.rows[0].id;

        // 2. Pass this internal ID to Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: session.user.id,
                accountType: targetAccount,
                internalTxId: internalTxId, // Linking Stripe to our DB Row
            },
        });

        return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
        console.error("Professional Intent Error:", error);
        return { error: "Security initialization failed. Please try again." };
    }
}

// Logic to actually update the DB after success
export async function finalizeDeposit(amount, account_type) {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) return { success: false, message: "Unauthorized" }

    try {
        // 1. Update the correct balance column based on account_type
        const balanceColumn = account_type === 'savings' ? 'savings_balance' : 'checking_balance'
        
        await query(
            `UPDATE paysense_users 
             SET ${balanceColumn} = ${balanceColumn} + $1 
             WHERE id = $2`,
            [amount, userId]
        )

        // 2. Insert into the transaction history table we updated today
        await query(
            `INSERT INTO paysense_transactions 
            (user_id, amount, type, account_type, description, category, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                userId, 
                amount, 
                'credit', 
                account_type, 
                'Card Deposit via Stripe', 
                'Deposit', 
                'completed'
            ]
        )

        return { success: true }
    } catch (error) {
        console.error("Finalize Deposit Error:", error)
        return { success: false, message: "Database update failed" }
    }
}

export async function createFlexibleRequestLink(description, targetAccount) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    try {
        // 1. Create a Product for the request
        const product = await stripe.products.create({
            name: `Payment to ${session.user.first_name}`,
            description: description || "PaySense Open Payment",
        });

        // 2. Create a Price with 'custom_unit_amount'
        const price = await stripe.prices.create({
            currency: 'usd',
            custom_unit_amount: { enabled: true }, // THIS ALLOWS THE PAYER TO TYPE THE AMOUNT
            product: product.id,
        });

        // 3. Create the Link
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: price.id, quantity: 1 }],
            metadata: {
                receiverId: session.user.id,
                targetAccount: targetAccount,
                type: 'flexible_request'
            }
        });

        return { url: paymentLink.url };
    } catch (error) {
        console.error("Flexible Link Error:", error);
        return { error: error.message };
    }
}