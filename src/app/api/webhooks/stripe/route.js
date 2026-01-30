import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/dbh';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ELEGANT_VICTORY_SNAPSHOT;

export async function POST(req) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');
    let event;

    // 1. Verify Signature
    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error(`❌ Signature Verification Failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const session = event.data.object;

    // 2. Handle Successful Payments
    if (event.type === 'payment_intent.succeeded' || event.type === 'checkout.session.completed') {
        
        // Extract metadata (ensure you pass these when creating the payment)
        const metadata = session.metadata || {};
        const userId = metadata.userId;
        const accountType = metadata.accountType || 'checking'; // Default to checking
        const internalTxId = metadata.internalTxId; // May be null for "Request Payment"
        
        // Convert cents to dollars
        const amount = (session.amount_received || session.amount_total) / 100;

        // Skip if this is a test trigger without a real user attached
        if (!userId) {
            console.log('ℹ️ Event ignored: No userId found in metadata.');
            return NextResponse.json({ received: true });
        }

        try {
            const balanceColumn = accountType === 'savings' ? 'savings_balance' : 'checking_balance';

            await query('BEGIN');

            // 1. Update User Balance (Safe against NULLs)
            await query(
                `UPDATE paysense_accounts 
                 SET ${balanceColumn} = COALESCE(${balanceColumn}, 0) + $1 
                 WHERE user_id = $2`,
                [amount, userId]
            );

            // 2. Handle Transaction Record
            if (internalTxId) {
                // Scenario A: Pre-stored transaction (Update existing)
                await query(
                    `UPDATE paysense_transactions 
                     SET status = 'completed', 
                         reference_id = $1, 
                         description = 'Card Deposit Successful'
                     WHERE id = $2 AND user_id = $3`,
                    [session.id, internalTxId, userId]
                );
            } else {
                // Scenario B: "Request Payment" feature (Create new record)
                await query(
                    `INSERT INTO paysense_transactions (
                        user_id, amount, type, status, description, reference_id, metadata
                    ) VALUES ($1, $2, 'deposit', 'completed', $3, $4, $5)`,
                    [
                        userId, 
                        amount, 
                        `Payment Received (${accountType})`, 
                        session.id, 
                        JSON.stringify({ stripe_event: event.type, mode: 'direct_request' })
                    ]
                );
            }

            // 3. Create Notification
            await query(
                `INSERT INTO paysense_notifications (user_id, type, title, message)
                 VALUES ($1, 'success', 'Funds Received', $2)`,
                [userId, `Successfully added $${amount.toFixed(2)} to your ${accountType} account.`]
            );

            await query('COMMIT');
            console.log(`✅ Webhook processed successfully for User ${userId}`);

        } catch (dbErr) {
            await query('ROLLBACK');
            console.error('❌ Database Transaction Failed:', dbErr.message);
            // Return 500 so Stripe retries later
            return NextResponse.json({ error: 'Database sync failed' }, { status: 500 });
        }
    }

    // Acknowledge receipt of all other events
    return NextResponse.json({ received: true }, { status: 200 });
}