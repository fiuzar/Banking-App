import { query } from "@/dbh";

export async function logAdminAction(adminId, type, targetId, details) {
    try {
        await query(
            "INSERT INTO paysense_audit_logs (admin_id, action_type, target_user_id, details) VALUES ($1, $2, $3, $4)",
            [adminId, type, targetId, JSON.stringify(details)]
        );
    } catch (e) {
        console.error("Audit Log Failure:", e);
        // We don't throw here so the main transaction doesn't fail if logging hiccups
    }
}