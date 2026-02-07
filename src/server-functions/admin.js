"use server"

import { query } from "@/dbh";
import { auth } from "@/auth";

export async function getAdminUsers() {
    const session = await auth();
    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    try {
        const { rows } = await query(
            `SELECT id, first_name, last_name, email, role, verified, kyc_status, stripe_connect_id, created_at 
             FROM paysense_users 
             ORDER BY created_at DESC`, 
            []
        );
        return { success: true, users: rows };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to fetch users" };
    }
}

export async function getFullUserManagementData(userId) {
    const session = await auth();
    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    try {
        const [userRes, accountRes, transRes] = await Promise.all([
            query(`SELECT * FROM paysense_users WHERE id = $1`, [userId]),
            query(`SELECT * FROM paysense_accounts WHERE user_id = $1`, [userId]),
            query(`SELECT * FROM paysense_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`, [userId])
        ]);

        return {
            success: true,
            user: userRes.rows[0],
            account: accountRes.rows[0],
            transactions: transRes.rows
        };
    } catch (e) {
        console.error(e);
        return { success: false };
    }
}

export default async function terminate_user(id){
    const session = await auth()
    if (session?.user?.role != "admin") throw New Error("Unauthorized")

    try {
        const { rows } = await query(
            `UPDATE paysense_users SET terminate = $1 WHERE id = $2`, 
            [true, id]
        );
        return { success: true};
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to terminate user" };
    }
}

export async function updateKycStatus(userId, status) {
    const session = await auth();
    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    try {
        await query("UPDATE paysense_users SET kyc_status = $1 WHERE id = $2", [status, userId]);
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}