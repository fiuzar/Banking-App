'use server'

import { query } from "@/dbh";
import { revalidatePath } from "next/cache";
import {auth} from "@/auth"

// Helper to get current user
async function getUserId() {
    const session = await auth()
    return session?.user?.id;
}

// 1. GET TICKET LIST
export async function getTicketList() {
    const userId = await getUserId();
    const result = await query(
        `SELECT * FROM paysense_tickets WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
}

// 2. GET TICKET DETAILS & MESSAGES
export async function getTicketDetails(ticketId) {
    const ticket = await query(`SELECT * FROM paysense_tickets WHERE id = $1`, [ticketId]);
    
    // Get messages linked via the conversation
    const messages = await query(
        `SELECT m.* FROM paysense_messages m
         JOIN paysense_conversations c ON m.conversation_id = c.id
         WHERE c.ticket_id = $1
         ORDER BY m.created_at ASC`,
        [ticketId]
    );

    return {
        ticket: ticket.rows[0],
        replies: messages.rows
    };
}

// 3. GET CHAT LIST (Active Conversations)
export async function getChatList() {
    const userId = await getUserId();
    const result = await query(
        `SELECT c.*, t.subject, 
        (SELECT message_text FROM paysense_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_msg
        FROM paysense_conversations c
        JOIN paysense_tickets t ON c.ticket_id = t.id
        WHERE t.user_id = $1
        ORDER BY c.created_at DESC`,
        [userId]
    );
    return result.rows;
}

// 4. GET CHAT DETAILS (Messages only)
export async function getChatDetails(conversationId) {
    const messages = await query(
        `SELECT * FROM paysense_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
        [conversationId]
    );
    
    // Mark messages as read when user opens the chat
    await query(
        `UPDATE paysense_messages SET is_read = TRUE 
         WHERE conversation_id = $1 AND sender_role = 'ADMIN'`,
        [conversationId]
    );

    return messages.rows;
}

// 5. SEND MESSAGE (Works for both Live Chat and Ticket Replies)
export async function sendMessage(conversationId, text) {
    const userId = await getUserId();
    
    const result = await query(
        `INSERT INTO paysense_messages (conversation_id, sender_id, sender_role, message_text)
         VALUES ($1, $2, 'USER', $3) RETURNING *`,
        [conversationId, userId, text]
    );

    revalidatePath(`/app/support/chats/${conversationId}`);
    return result.rows[0];
}

// 6. CHECK IF AGENTS ARE ONLINE
export async function getAgentAvailability() {
    const result = await query(
        `SELECT COUNT(*) as online_count FROM paysense_agent_status WHERE is_online = TRUE`,
        []
    );
    return parseInt(result.rows[0].online_count) > 0;
}

export async function createTicket(formData) {
    const userId = await getUserId();
    const subject = formData.get("subject");
    const description = formData.get("description");
    const priority = formData.get("priority") || 'MEDIUM';

    // Generate unique IDs (or use UUID/CUID)
    const ticketId = `tkt_${Math.random().toString(36).substr(2, 9)}`;
    const conversationId = `conv_${Math.random().toString(36).substr(2, 9)}`;

    try {
        // 1. Insert the Ticket
        await query(
            `INSERT INTO paysense_tickets (id, user_id, subject, description, priority, status)
             VALUES ($1, $2, $3, $4, $5, 'OPEN')`,
            [ticketId, userId, subject, description, priority]
        );

        // 2. Insert the initial Conversation linked to that Ticket
        await query(
            `INSERT INTO paysense_conversations (id, ticket_id, is_active)
             VALUES ($1, $2, TRUE)`,
            [conversationId, ticketId]
        );

        // 3. Optional: Add the user's description as the FIRST message in the chat
        await query(
            `INSERT INTO paysense_messages (conversation_id, sender_id, sender_role, message_text)
             VALUES ($1, $2, 'USER', $3)`,
            [conversationId, userId, description]
        );

        revalidatePath('/app/support/tickets');
        revalidatePath('/app/support/chats');

        return { success: true, conversationId };
    } catch (error) {
        console.error("Failed to create ticket:", error);
        return { success: false, error: error.message };
    }
}