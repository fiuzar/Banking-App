"use server"

import { query } from "@/dbh";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * TOGGLE ADMIN ONLINE STATUS
 * Uses an "UPSERT" pattern: Checks if record exists, inserts if not, updates if yes.
 */

export async function getAdminUsers() {
    const session = await auth();
    if (session?.user?.role !== "admin") return {success: false};

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
    if (session?.user?.role !== "admin") return {success: false};

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

export async function terminate_user(id){
    const session = await auth()
    if (session?.user?.role != "admin") return {success: false};

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
    if (session?.user?.role !== "admin") return {success: false};

    try {
        await query("UPDATE paysense_users SET kyc_status = $1 WHERE id = $2", [status, userId]);
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}


export async function toggleAdminStatus(isOnline) {
    const session = await auth();
    if (session?.user?.role !== "admin") return { success: false };

    const adminId = session.user.id;

    try {
        // ON CONFLICT (agent_id) handles the "if not exist, insert" logic automatically
        await query(`
            INSERT INTO paysense_agent_status (agent_id, is_online, last_seen)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (agent_id) 
            DO UPDATE SET 
                is_online = $2, 
                last_seen = CURRENT_TIMESTAMP
        `, [adminId, isOnline]);

        revalidatePath('/admin/support');
        return { success: true, isOnline };
    } catch (e) {
        console.error("Toggle Status Error:", e);
        return { success: false };
    }
}

/**
 * GET INITIAL STATUS
 * Fetches the current online state for the logged-in admin.
 */
export async function getInitialStatus() {
    const session = await auth();
    if (session?.user?.role !== "admin") return { success: false, isOnline: false };

    try {
        const { rows } = await query(
            `SELECT is_online FROM paysense_agent_status WHERE agent_id = $1`, 
            [session.user.id]
        );
        
        // If no row exists yet, they are definitely offline
        return { 
            success: true, 
            isOnline: rows.length > 0 ? rows[0].is_online : false 
        };
    } catch (e) {
        return { success: false, isOnline: false };
    }
}

export async function getAllActiveTickets() {
    const session = await auth();
    if (session?.user?.role !== "admin") return { success: false };

    try {
        const { rows } = await query(`
            SELECT 
                t.id, t.subject, t.priority, t.status, t.created_at as ticket_created,
                c.id as conversation_id,
                u.first_name, u.last_name,
                -- 1. Get the text of the latest message
                (SELECT message_text FROM paysense_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_msg_text,
                -- 2. Get the type of the last sender (USER or ADMIN)
                (SELECT sender_role FROM paysense_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_sender_role,
                -- 3. Determine 'Last Activity' for sorting (Message time or Ticket time)
                COALESCE(
                    (SELECT created_at FROM paysense_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1),
                    t.created_at
                ) as last_activity
            FROM paysense_tickets t
            LEFT JOIN paysense_conversations c ON t.id = c.ticket_id
            LEFT JOIN paysense_users u ON t.user_id = u.id
            WHERE t.status != 'RESOLVED'
            ORDER BY last_activity DESC
        `, []);

        return { success: true, tickets: rows };
    } catch (e) {
        console.error(e);
        return { success: false, tickets: [] };
    }
}

/**
 * GET DASHBOARD STATS
 */
export async function getAdminDashboardStats() {
    const session = await auth();
    if (session?.user?.role !== "admin") return { success: false };

    try {
        const { rows } = await query(`
            SELECT 
                COUNT(*) FILTER (WHERE status = 'OPEN') as open,
                COUNT(*) FILTER (WHERE priority = 'URGENT' AND status = 'OPEN') as urgent,
                COUNT(*) FILTER (WHERE status = 'RESOLVED') as resolved
            FROM paysense_tickets
        `, []);

        return { 
            success: true, 
            stats: {
                open: parseInt(rows[0].open || 0),
                urgent: parseInt(rows[0].urgent || 0),
                resolved: parseInt(rows[0].resolved || 0)
            } 
        };
    } catch (e) {
        return { success: false };
    }
}