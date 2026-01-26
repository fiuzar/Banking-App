'use server'

import { Pool } from 'pg'
import { revalidatePath } from 'next/cache'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function addVerifiedBeneficiary(formData) {
  const userId = "user_123"
  const accountNumber = formData.get('accountNumber')
  const routingNumber = formData.get('routingNumber')
  const bankName = formData.get('bankName')
  const type = formData.get('type')

  try {
    // 1. VERIFICATION STEP
    // Here you would call Stripe or an external API to verify the name
    // const verifiedName = await verifyBankAccount(accountNumber, routingNumber);
    const verifiedName = "Seyi Adewale" // Mocked result from API

    // 2. SAVE TO PG
    const client = await pool.connect()
    try {
      await client.query(
        `INSERT INTO beneficiaries (user_id, name, account_number, routing_number, bank_name, type, verified)
         VALUES ($1, $2, $3, $4, $5, $6, true)`,
        [userId, verifiedName, accountNumber, routingNumber, bankName, type]
      )
    } finally {
      client.release()
    }

    revalidatePath('/app/beneficiary')
    return { success: true, name: verifiedName }
  } catch (error) {
    return { success: false, error: "Could not verify account details" }
  }
}