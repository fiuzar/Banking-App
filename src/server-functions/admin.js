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