'use server'

import { query } from "@/dbh"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// 1. Fetch notifications for the logged-in user
export async function get_notification_list() {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) return { success: false, notifications: [] }

    try {
        const res = await query(
            `SELECT 
    id, 
    type, 
    title, 
    message, 
    is_read, 
    created_at AT TIME ZONE 'UTC' as created_at FROM paysense_notifications 
             WHERE user_id = $1 
             ORDER BY created_at DESC LIMIT 50`,
            [userId]
        )
        return { success: true, notifications: res.rows }
    } catch (error) {
        console.error("Fetch Notifications Error:", error)
        return { success: false, notifications: [] }
    }
}

// 2. Mark a single or ALL notifications as read
export async function mark_notification_read(notificationId) {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) return { success: false }

    try {
        if (notificationId) {
            // Mark specific one
            await query(
                `UPDATE paysense_notifications SET is_read = true WHERE id = $1 AND user_id = $2`,
                [notificationId, userId]
            )
        } else {
            // Mark ALL as read
            await query(
                `UPDATE paysense_notifications SET is_read = true WHERE user_id = $1`,
                [userId]
            )
        }
        
        revalidatePath('/app/notifications')
        return { success: true }
    } catch (error) {
        return { success: false }
    }
}

// 3. Clear History (Delete)
export async function clear_notification_history() {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) return { success: false }

    try {
        await query(`DELETE FROM paysense_notifications WHERE user_id = $1`, [userId])
        revalidatePath('/app/notifications')
        return { success: true }
    } catch (error) {
        return { success: false }
    }
}

// server-functions/notifications.js
export async function get_unread_notification_count() {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) return { success: false, count: 0 }

    try {
        const res = await query(
            `SELECT COUNT(*) as unread_count 
             FROM paysense_notifications 
             WHERE user_id = $1 AND is_read = false`,
            [userId]
        )

        return { 
            success: true, 
            count: parseInt(res.rows[0].unread_count) || 0 
        }
    }
    catch(e) {
        return { success: false, count: 0 }
    }
}