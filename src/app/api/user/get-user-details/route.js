import { query } from "@/dbh";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// This line forces the API to fetch fresh data every single time
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    const session = await auth();
    const user_id = session?.user?.id;

    if (!user_id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        // 1. Get User
        const { rows: user_rows } = await query(
            "SELECT id, first_name, last_name, email, phone, image FROM paysense_users WHERE id = $1", 
            [user_id]
        );

        // 2. Get Account
        let { rows: account_rows } = await query(
            "SELECT * FROM paysense_accounts WHERE user_id = $1", 
            [user_id]
        );

        // 3. Auto-Create Account if missing
        if (account_rows.length === 0) {
            const checkingNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            const savingsNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();

            const { rows: new_account } = await query(
                `INSERT INTO paysense_accounts 
                 (user_id, checking_balance, savings_balance, checking_account_number, savings_account_number) 
                 VALUES ($1, 0.00, 0.00, $2, $3) 
                 RETURNING *`, 
                [user_id, checkingNum, savingsNum]
            );
            account_rows = new_account;
        }

        console.log(user_rows[0])

        // Return fresh data
        return NextResponse.json({ 
            success: true, 
            user_details: user_rows[0], 
            account_details: account_rows[0]
        });

    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json({ success: false, message: "Database Error" }, { status: 500 });
    }
}