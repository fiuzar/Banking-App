"use server"

import { query } from "@/dbh";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function approveWireTransfer(txId, userId, amount, type) {
    const session = await auth();
    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    try {
        await query("BEGIN");

        // 1. Update the transaction status
        await query(
            "UPDATE paysense_transactions SET status = 'completed', updated_at = NOW() WHERE id = $1",
            [txId]
        );

        // 2. Adjust the user's balance
        // If deposit: add money. If withdrawal: it was likely already deducted/held.
        if (type === 'deposit') {
            await query(
                "UPDATE paysense_accounts SET checking_balance = checking_balance + $1 WHERE user_id = $2",
                [amount, userId]
            );
        }

        await query("COMMIT");
        revalidatePath("/admin/wires");
        return { success: true };
    } catch (e) {
        await query("ROLLBACK");
        console.error("Wire Approval Error:", e);
        return { success: false, message: "Transaction failed" };
    }
}