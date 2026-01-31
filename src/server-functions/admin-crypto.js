"use server"

import { query } from "@/dbh";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function finalizeCryptoTrade(txId, txHash) {
    const session = await auth();
    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    try {
        // Update the transaction with the blockchain hash and mark as completed
        await query(
            `UPDATE paysense_transactions 
             SET status = 'completed', 
                 metadata = jsonb_set(metadata, '{tx_hash}', $1),
                 updated_at = NOW() 
             WHERE id = $2`,
            [`"${txHash}"`, txId]
        );

        revalidatePath("/admin/crypto");
        return { success: true };
    } catch (e) {
        console.error("Crypto Settlement Error:", e);
        return { success: false, message: "Failed to update crypto transaction" };
    }
}