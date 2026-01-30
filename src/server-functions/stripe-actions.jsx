'use server'

import { stripe } from "@/lib/stripe"
import { query } from "@/dbh" // Importing your specific query tool
import { auth } from "@/auth" // Or however you get the session

export async function createStripeAccountLink() {
  try {
    // 1. Get the current user from session
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    // 2. Query your DB to see if they already have a Stripe ID
    const userResult = await query(
      "SELECT id, stripe_connect_id FROM users WHERE email = $1", 
      [session.user.email]
    )
    const user = userResult.rows[0]

    let stripeAccountId = user?.stripe_connect_id

    // 3. Create the Connect Account if it doesn't exist in your DB
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
        business_type: 'individual',
        email: session.user.email,
      })
      
      stripeAccountId = account.id

      // 4. Update your table using a SQL Query
      await query(
        "UPDATE users SET stripe_connect_id = $1 WHERE email = $2",
        [stripeAccountId, session.user.email]
      )
    }

    // 5. Generate the Link for the frontend redirect
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/app/settings/stripe-setup`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/app/settings?status=success`,
      type: 'account_onboarding',
    })

    return { url: accountLink.url }

  } catch (error) {
    console.error("Stripe SQL Error:", error)
    return { error: "Failed to initialize secure setup." }
  }
}