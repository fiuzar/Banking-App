"use server"

import { query } from "@/dbh";
import { auth } from "@/auth";

export async function getAdminStats() {
    const session = await auth();
    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    try {
        // 1. Total User Count
        const userCount = await query("SELECT COUNT(*) FROM paysense_users", []);
        
        // 2. Total Deposits (Liquidity in System)
        const liquidity = await query("SELECT SUM(checking_balance + savings_balance) as total FROM paysense_accounts", []);

        // 3. Pending Wires (Attention Needed)
        const pendingWires = await query("SELECT COUNT(*) FROM paysense_transactions WHERE status = 'pending'", []);

        // 4. KYC Status Split
        const kycStats = await query("SELECT kyc_status, COUNT(*) FROM paysense_users GROUP BY kyc_status", []);

        return {
            totalUsers: userCount.rows[0].count,
            totalLiquidity: liquidity.rows[0].total || 0,
            pendingActions: pendingWires.rows[0].count,
            kycData: kycStats.rows
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}