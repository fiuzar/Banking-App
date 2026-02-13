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
        `SELECT * FROM paysense_tickets WHERE user_id = $1 AND type= $2 ORDER BY created_at DESC`,
        [userId, 'TICKET']
    );
    return result.rows;
}

// 2. GET TICKET DETAILS & MESSAGES
export async function getTicketDetails(id) {
    try {
        // 1. Find the ticket and its linked conversation in one go
        const result = await query(`
            SELECT t.*, c.id as conversation_id 
            FROM paysense_tickets t
            JOIN paysense_conversations c ON t.id = c.ticket_id
            WHERE t.id = $1::text OR c.id = $1::text
        `, [id]);

        if (result.rows.length === 0) {
            return { success: false, message: "Ticket not found" };
        }

        const ticket = result.rows[0];

        // 2. Get all messages for that conversation
        const messages = await query(
            `SELECT * FROM paysense_messages 
             WHERE conversation_id = $1::text 
             ORDER BY created_at ASC`,
            [ticket.conversation_id]
        );

        return {
            success: true,
            ticket: ticket,
            replies: messages.rows
        };
    } catch (error) {
        console.error("Fetch Details Error:", error);
        return { success: false };
    }
}

// 3. GET CHAT LIST (Active Conversations)
export async function getChatList() {
    const userId = await getUserId();
    const result = await query(
        `SELECT c.*, t.subject 
         FROM paysense_conversations c
         JOIN paysense_tickets t ON c.ticket_id = t.id
         WHERE t.user_id = $1  AND t.type = 'CHAT' -- Only get live chat sessions
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

    const ticketId = `tkt_${Math.random().toString(36).substr(2, 9)}`;
    const conversationId = `conv_${Math.random().toString(36).substr(2, 9)}`;

    try {
        // 1. Insert the Ticket (Added 'type' column)
        await query(
            `INSERT INTO paysense_tickets (id, user_id, subject, description, priority, status, type)
             VALUES ($1, $2, $3, $4, $5, 'OPEN', 'TICKET')`,
            [ticketId, userId, subject, description, priority]
        );

        // 2. Insert the Conversation
        await query(
            `INSERT INTO paysense_conversations (id, ticket_id, is_active)
             VALUES ($1, $2, TRUE)`,
            [conversationId, ticketId]
        );

        // 3. Insert the first message
        // IMPORTANT: Ensure userId is cast to text if it's an integer in the DB
        await query(
            `INSERT INTO paysense_messages (conversation_id, sender_id, sender_role, message_text)
             VALUES ($1, $2::text, 'USER', $3)`,
            [conversationId, userId, description]
        );

        revalidatePath('/app/support/tickets');
        return { success: true, conversationId, ticketId };
    } catch (error) {
        console.error("Failed to create ticket:", error);
        return { success: false, error: error.message };
    }
}

export async function createNewChat(subject = "Live Support") {
    const session = await auth()
    const userId = session?.user?.id

    if(!userId) return {success: false}

    const ticketId = `tkt_${Math.random().toString(36).substr(2, 9)}`;
    const conversationId = `conv_${Math.random().toString(36).substr(2, 9)}`;

    try {
        // FIX: Match placeholders ($1-$6) to the number of arguments
        await query(
            `INSERT INTO paysense_tickets (id, user_id, subject, status, priority, type)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [ticketId, userId, subject, 'OPEN', 'MEDIUM', 'CHAT']
        );

        // FIX: Ensure 'CHAT' type is passed here too if your DB uses it
        await query(
            `INSERT INTO paysense_conversations (id, ticket_id, is_active, type)
             VALUES ($1, $2, TRUE, $3)`,
            [conversationId, ticketId, 'CHAT']
        );

        revalidatePath('/app/support/chats');
        return { success: true, conversationId };
    } catch (error) {
        console.error("New Chat Error:", error);
        return { success: false, error: "Could not start a new session." };
    }
}