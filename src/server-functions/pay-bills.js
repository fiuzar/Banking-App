"use server"

import { query } from "@/dbh";
import { auth } from "@/auth";
import { callAlatPayment } from "@/lib/alat";
import { revalidatePath } from "next/cache";

export async function processBillBasket(basket) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    const totalToPay = basket.reduce((sum, item) => sum + Number(item.amount), 0);

    try {
        await query("BEGIN");

        // 1. Verify Balance
        const { rows } = await query(
            "SELECT checking_balance FROM paysense_accounts WHERE user_id = $1",
            [session.user.id]
        );

        if (rows[0].checking_balance < totalToPay) {
            throw new Error("Insufficient funds for the total basket.");
        }

        const results = [];

        // 2. Loop through each bill in the basket
        for (const bill of basket) {
            const alatResponse = await callAlatPayment(bill);
            
            // In playground, successful status is usually 200 or '00'
            if (alatResponse.status === '00' || alatResponse.status === 200) {
                // Deduct from local ledger
                await query(
                    "UPDATE paysense_accounts SET checking_balance = checking_balance - $1 WHERE user_id = $2",
                    [bill.amount, session.user.id]
                );

                // Log into transactions
                await query(
                    "INSERT INTO paysense_transactions (user_id, amount, type, status, metadata) VALUES ($1, $2, $3, $4, $5)",
                    [session.user.id, bill.amount, 'bill_payment', 'completed', JSON.stringify({ 
                        alatRef: alatResponse.data?.transactionReference,
                        customerId: bill.customerId,
                        category: bill.category.name 
                    })]
                );
                results.push({ id: bill.customerId, status: 'success' });
            } else {
                results.push({ id: bill.customerId, status: 'failed', error: alatResponse.message });
            }
        }

        await query("COMMIT");
        revalidatePath("/app");
        return { success: true, results };
    } catch (e) {
        await query("ROLLBACK");
        return { success: false, message: e.message };
    }
}