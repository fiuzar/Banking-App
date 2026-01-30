"use server"

import { auth } from "@/auth";
import { query } from "@/dbh";

export async function submitCheckDeposit(formData) {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const amount = formData.get('amount');
    const accountType = formData.get('accountType');
    const frontFile = formData.get('frontImage');
    const backFile = formData.get('backImage');

    try {
        // 1. Upload images to PHP server
        const uploadImage = async (file) => {
            const data = new FormData();
            data.append('image', file);
            
            const res = await fetch(`${process.env.STORAGE_SERVER_URL}/index.php`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            return result.url;
        };

        const frontUrl = await uploadImage(frontFile);
        const backUrl = await uploadImage(backFile);

        // 2. Insert into Database
        await query(
            `INSERT INTO paysense_check_deposits 
            (user_id, amount, account_type, front_image_url, back_image_url, status)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [session.user.id, amount, accountType, frontUrl, backUrl, 'pending']
        );

        // 3. Create a pending transaction entry for the user's history
        await query(
            `INSERT INTO paysense_transactions 
            (user_id, amount, type, account_type, description, status)
            VALUES ($1, $2, 'credit', $3, 'Mobile Check Deposit', 'pending')`,
            [session.user.id, amount, accountType]
        );

        return { success: true };
    } catch (err) {
        console.error("Check Deposit Error:", err);
        return { success: false, error: "Failed to process check images." };
    }
}