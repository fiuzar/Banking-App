'use server'

import { query } from "@/dbh"
import { auth } from "@/auth"

export async function get_transaction_history_list(account_type, start, end, offset = 0) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return { success: false, message: "Unauthorized", history: [] };
    }

    try {
        const res = await query(
            `SELECT 
                id, 
                description as name, 
                TO_CHAR(created_at, 'Mon DD, YYYY') as date, 
                amount, 
                type, 
                category,
                status
             FROM paysense_transactions 
             WHERE user_id = $1 
             AND account_type = $2
             ORDER BY created_at DESC 
             LIMIT 20 OFFSET $3`,
            [userId, account_type, offset]
        );

        // Return the rows, or an empty array if none found
        return { 
            success: true, 
            message: "History fetched", 
            history: res.rows || [] 
        };
    } catch (error) {
        console.error("Fetch History Error:", error);
        return { 
            success: false, 
            message: "Database error", 
            history: [] 
        };
    }
}