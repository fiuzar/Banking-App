'use server'

import { revalidatePath } from 'next/cache'
import { Pool } from 'pg'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function processLocalUSDTransfer(formData) {
  const amount = parseFloat(formData.get('amount'))
  const routingNumber = formData.get('routingNumber')
  const accountNumber = formData.get('accountNumber')
  const accountHolderName = formData.get('accountHolderName')
  
  const userId = "user_123" 
  const fee = 0.50 // Typical ACH fee is much lower than Wire
  const totalDeduction = amount + fee

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // 1. Balance & KYC Check
    const userRes = await client.query(
      `SELECT checking_balance, kyc_status FROM users WHERE id = $1 FOR UPDATE`,
      [userId]
    )

    if (userRes.rows[0].kyc_status !== 'verified') throw new Error("KYC required for transfers")
    if (userRes.rows[0].checking_balance < totalDeduction) throw new Error("Insufficient USD balance")

    // 2. Stripe: Create a Custom Bank Account Token
    // This is required to send money to an external bank without saving the full digits
    const token = await stripe.tokens.create({
      bank_account: {
        country: 'US',
        currency: 'usd',
        routing_number: routingNumber,
        account_number: accountNumber,
        account_holder_name: accountHolderName,
        account_holder_type: 'individual',
      },
    });

    // 3. Trigger the Payout
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100), // Cents
      currency: 'usd',
      method: 'standard', // ACH (usually 1-3 business days)
      description: `USD Local Transfer to ${accountHolderName}`,
    });

    // 4. Update Database Ledger
    const newBalance = userRes.rows[0].checking_balance - totalDeduction
    await client.query(
      `UPDATE users SET checking_balance = $1 WHERE id = $2`,
      [newBalance, userId]
    )

    // 5. Finalize Transaction Record with Running Balance
    await client.query(
      `INSERT INTO transactions (
        id, user_id, amount, type, status, description, running_balance
      ) VALUES ($1, $2, $3, 'local_transfer', 'processing', $4, $5)`,
      [payout.id, userId, amount, `ACH to ${accountHolderName}`, newBalance]
    )

    await client.query('COMMIT')
    revalidatePath('/app')
    return { success: true }

  } catch (error) {
    await client.query('ROLLBACK')
    return { success: false, error: error.message }
  } finally {
    client.release()
  }
}