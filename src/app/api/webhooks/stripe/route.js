import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/dbh';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');
    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Inside your /api/webhooks/stripe/route.js

if (event.type === 'payment_intent.succeeded' || event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, accountType, internalTxId } = session.metadata;
    const amount = (session.amount_received || session.amount_total) / 100;

    try {
        const balanceColumn = accountType === 'savings' ? 'savings_balance' : 'checking_balance';

        // 1. Transactional Update: Update Balance AND Update Transaction Status
        // We use the internalTxId we sent earlier to find the exact row
        await query('BEGIN'); // Start Transaction for safety

        // Update Balance
        await query(
            `UPDATE paysense_accounts SET ${balanceColumn} = ${balanceColumn} + $1 WHERE id = $2`,
            [amount, userId]
        );

        // Update the existing pending transaction to 'completed'
        await query(
            `UPDATE paysense_transactions 
             SET status = 'completed', 
                 reference_id = $1, 
                 description = 'Card Deposit Successful'
             WHERE id = $2 AND user_id = $3`,
            [session.id, internalTxId, userId]
        );

        // Create the notification
        await query(
            `INSERT INTO paysense_notifications (user_id, type, title, message)
             VALUES ($1, 'success', 'Deposit Successful', $2)`,
            [userId, `Successfully added $${amount.toFixed(2)} to your ${accountType} account.`]
        );

        await query('COMMIT'); // Finalize all DB changes
        console.log(`✅ Reconciliation complete for Tx: ${internalTxId}`);

    } catch (dbErr) {
        await query('ROLLBACK'); // Undo everything if one part fails
        console.error('❌ Reconcilliation Failed:', dbErr);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}

    return NextResponse.json({ received: true });
}