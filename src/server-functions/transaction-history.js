'use server'

import { query } from "@/dbh"
import { auth } from "@/auth"

export async function get_transaction_history_list(account_type, offset = 0) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return { success: false, message: "Unauthorized", history: [] };

    try {
        const res = await query(
            `SELECT 
                id, 
                description as name, 
                TO_CHAR(created_at, 'Mon DD, YYYY') as date, 
                amount, 
                type, 
                category,
                status,
                -- Logic to determine color/icon in UI
                CASE 
                    WHEN type IN ('deposit', 'crypto_sale', 'internal_transfer_in') THEN 'credit'
                    ELSE 'debit'
                END as direction
             FROM paysense_transactions 
             WHERE user_id = $1 
             AND account_type = $2
             ORDER BY created_at DESC 
             LIMIT 10 OFFSET $3`,
            [userId, account_type, offset]
        );

        return { 
            success: true, 
            history: res.rows || [],
            hasMore: res.rows.length === 10 
        };
    } catch (error) {
        console.error("Fetch History Error:", error);
        return { success: false, history: [] };
    }
}

// Add this to your server actions file
export async function getTransactionById(tx_id) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const { rows } = await query(
            `SELECT * FROM paysense_transactions 
             WHERE id = $1 AND user_id = $2`, 
            [tx_id, session.user.id]
        );

        if (rows.length === 0) return { success: false, message: "Transaction not found" };
        console.log(rows)

        return { success: true, transaction: rows[0] };
    } catch (e) {
        console.error("Fetch transaction error:", e);
        return { success: false, message: "Database error" };
    }
}