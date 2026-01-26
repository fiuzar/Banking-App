'use server'

import { query } from "@/dbh"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function submitKYC(idType, file) {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        return { success: false, error: "Authentication required" }
    }

    if (!file || !idType) {
        return { success: false, error: "Missing document or ID type" }
    }

    try {
        // 1. UPLOAD LOGIC 
        // For now, we simulate getting a URL. 
        // In a real app, use: const documentUrl = await uploadToCloudinary(file)
        const documentUrl = `/uploads/kyc/${userId}-${Date.now()}.jpg`

        // 2. START TRANSACTION
        await query('BEGIN')

        // 3. UPDATE USER KYC STATUS
        // We set status to 'pending' and store the document URL
        await query(
            `UPDATE users SET 
                kyc_status = 'pending', 
                id_type = $1, 
                id_document_url = $2,
                updated_at = NOW() 
             WHERE id = $3`,
            [idType, documentUrl, userId]
        )

        // 4. LOG THE ACTIVITY
        await query(
            `INSERT INTO activity_logs (user_id, action, details) 
             VALUES ($1, 'kyc_submitted', $2)`,
            [userId, `User submitted ${idType} for verification`]
        )

        // 5. COMMIT TRANSACTION
        await query('COMMIT')

        revalidatePath('/app/settings')
        
        return { success: true }

    } catch (error) {
        // 6. ROLLBACK ON ERROR
        await query('ROLLBACK')
        console.error("KYC Submission Error:", error)
        return { success: false, error: "Failed to submit documents. Please try again." }
    }
}