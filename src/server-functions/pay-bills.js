"use server"

import { query } from "@/dbh";
import { auth } from "@/auth";
import { callAlatPayment } from "@/lib/alat";
import { revalidatePath } from "next/cache";
import { crypto } from "crypto"; // For generating unique refs

export async function processBillBasket(basket) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    const userId = session.user.id;
    const totalToPay = basket.reduce((sum, item) => sum + Number(item.amount), 0);

    try {
        await query("BEGIN");

        // 1. Check Balance from your accounts table
        const { rows: accountRows } = await query(
            "SELECT checking_balance FROM paysense_accounts WHERE user_id = $1 FOR UPDATE", 
            [userId]
        );

        if (!accountRows[0] || accountRows[0].checking_balance < totalToPay) {
            throw new Error("Insufficient funds for the total basket.");
        }

        const successLogs = [];

        // 2. Process each bill
        for (const bill of basket) {
            // Call the actual payment gateway (ALAT/Stripe/etc)
            const alatResponse = await callAlatPayment(bill);
            
            if (alatResponse.status === '00' || alatResponse.status === 200) {
                
                // Construct a clean description for the transaction history
                const txDescription = `${bill.category.name} Payment: ${bill.identifier}`;
                const referenceId = `PS-BILL-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;

                // Deduct balance
                const {rows: deduct_baclacne } = await query(
                    "UPDATE paysense_accounts SET checking_balance = checking_balance - $1 WHERE user_id = $2 returning *",
                    [bill.amount, userId]
                );

                // Insert into your paysense_transactions table
                // Note: amount is stored as negative because it's an expense
                await query(
                    `INSERT INTO paysense_transactions 
                    (user_id, amount, type, description, status, reference_id) 
                    VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        userId, 
                        -Math.abs(bill.amount), // Force negative
                        'bill_payment', 
                        txDescription, 
                        'completed', 
                        referenceId
                    ]
                );

                successLogs.push({ identifier: bill.identifier, ref: referenceId, account_details: deduct_baclacne });
            } else {
                // If a single bill in the basket fails, you could choose to throw an error 
                // to rollback everything, or continue. 
                // For banking, we usually ROLLBACK the whole basket if one fails.
                throw new Error(`Payment failed for ${bill.category.name} (${bill.identifier})`);
            }
        }

        await query("COMMIT");
        revalidatePath("/app");
        return { success: true, results: successLogs };

    } catch (e) {
        await query("ROLLBACK");
        console.error("BILLS_ERROR:", e.message);
        return { success: false, message: e.message };
    }
}