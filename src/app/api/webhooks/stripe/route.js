import Stripe from 'stripe';
import { Pool } from 'pg';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const amount = session.amount / 100; // Convert cents to USD

    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE users SET checking_balance = checking_balance + $1 WHERE id = $2',
        [amount, userId]
      );
    } finally {
      client.release();
    }
  }

  return new Response('Success', { status: 200 });
}