'use server'

import { revalidatePath } from 'next/cache'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function processBuyCrypto(formData: FormData) {
  const usdAmount = parseFloat(formData.get('amount') as string)
  const asset = formData.get('asset') as string // e.g., 'BTC', 'ETH'
  const userId = "user_123"

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // 1. Lock User Row & Validate Fiat Balance
    const userRes = await client.query(
      `SELECT checking_balance, kyc_status FROM users WHERE id = $1 FOR UPDATE`,
      [userId]
    )

    if (userRes.rows[0].kyc_status !== 'verified') {
      throw new Error("KYC verification required to purchase crypto.")
    }

    if (userRes.rows[0].checking_balance < usdAmount) {
      throw new Error("Insufficient funds in your checking account.")
    }

    // 2. Fetch Live Price (Using Cryptomus or Public Price API)
    // For a demo, we assume a stable price or mock the fetch
    // Real call: fetch(`https://api.cryptomus.com/v1/exchange-rate/${asset}/USD`)
    const mockPrice = asset === 'BTC' ? 95000 : 2500
    const cryptoAmount = usdAmount / mockPrice

    // 3. The Swap: Deduct Checking (Fiat) -> Credit Savings (Crypto)
    await client.query(
      `UPDATE users SET checking_balance = checking_balance - $1 WHERE id = $2`,
      [usdAmount, userId]
    )

    await client.query(
      `UPDATE users SET savings_balance = savings_balance + $1 WHERE id = $2`,
      [usdAmount, userId] // We store the value in USD for your dashboard logic
    )

    // 4. Record Transaction
    await client.query(
      `INSERT INTO transactions (
        user_id, amount, type, status, description, metadata
      ) VALUES ($1, $2, 'crypto_purchase', 'completed', $3, $4)`,
      [
        userId, 
        usdAmount, 
        `Bought ${cryptoAmount.toFixed(8)} ${asset}`,
        JSON.stringify({ asset, rate: mockPrice, cryptoAmount })
      ]
    )

    await client.query('COMMIT')
    revalidatePath('/app')
    return { success: true, cryptoAmount }

  } catch (error: any) {
    await client.query('ROLLBACK')
    return { success: false, error: error.message }
  } finally {
    client.release()
  }
}