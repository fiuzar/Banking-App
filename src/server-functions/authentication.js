"use server"

import { signIn, auth } from "@/auth"
import { query } from "@/dbh"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache";

// --- GOOGLE ACTION ---
export async function googleSignIn() {
    await signIn("google", { redirectTo: "/app" });
}

// --- CREDENTIALS LOGIN ---
export async function credentialsAction(main_email, main_password) {
    const email = main_email?.trim().toLowerCase();
    const password = main_password?.trim();

    if (!email || !password) {
        return { success: false, message: "Email and password are required" };
    }

    try {
        const { rows } = await query("SELECT * FROM paysense_users WHERE email = $1", [email]);
        const user = rows[0];

        if (!user || user.password === "social") {
            return { success: false, message: "Invalid email or password" };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return { success: false, message: "Invalid email or password" };

        if (!user.verified) {
            await create_otp(email);
            return {
                success: false,
                isUnverified: true,
                email: user.email,
                message: "Email not verified. A new OTP has been sent."
            };
        }

        await signIn("credentials", {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            redirect: false
        });

        return { success: true };
    } catch (e) {
        console.error("Login error:", e);
        return { success: false, message: "Authentication failed" };
    }
}

// --- SIGNUP ---
export async function handle_Signup(first_name, last_name, email, password, confirm_password) {
    const mail = email?.trim().toLowerCase();
    const fname = first_name?.trim();
    const lname = last_name?.trim();

    if (!fname || !lname || !mail || !password || !confirm_password) {
        return { success: false, message: "All fields are required" };
    }
    if (password !== confirm_password) return { success: false, message: "Passwords do not match" };

    try {
        const check = await query("SELECT id FROM paysense_users WHERE email = $1", [mail]);
        if (check.rows.length > 0) return { success: false, message: "Email already in use" };

        const hashedPassword = await bcrypt.hash(password, 12);

        await query(
            "INSERT INTO paysense_users (first_name, last_name, email, password, verified) VALUES ($1, $2, $3, $4, $5)",
            [fname, lname, mail, hashedPassword, false]
        );

        await create_otp(mail);
        return { success: true, message: "Verify your email to continue" };
    } catch (e) {
        console.error("Signup error:", e);
        return { success: false, message: "Server error" };
    }
}

// --- OTP LOGIC ---
export async function otpVerification(pin, email) {
    try {
        const { rows } = await query(
            "SELECT * FROM paysense_verify_email WHERE email = $1 ORDER BY date DESC LIMIT 1",
            [email]
        );
        const record = rows[0];

        if (!record || record.pin !== pin) return { success: false, message: "Invalid Code" };

        // --- expiry check (5 min) ---
        const now = new Date();
        const sent = new Date(record.date);
        if ((now - sent) / 1000 > 900) {
            await query("DELETE FROM paysense_verify_email WHERE email = $1", [email]);
            return { success: false, message: "Code expired. Please request a new one." };
        }

        // 1. Verify user
        await query("UPDATE paysense_users SET verified = true WHERE email = $1", [email]);

        // 2. Fetch the updated user to log them in automatically
        const userRes = await query("SELECT id, first_name, last_name, email FROM paysense_users WHERE email = $1", [email]);
        const user = userRes.rows[0];

        // 3. Clear used OTP
        await query("DELETE FROM paysense_verify_email WHERE email = $1", [email]);

        // 4. Log them in right now so they don't have to type their password again
        await signIn("credentials", {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            redirect: false
        });

        return { success: true };
    } catch (e) {
        console.error("OTP verification error:", e);
        return { success: false, message: "Verification failed" };
    }
}

async function create_otp(email) {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    await query("DELETE FROM paysense_verify_email WHERE email = $1", [email]);
    await query("INSERT INTO paysense_verify_email (email, pin, date) VALUES ($1, $2, $3)", [email, pin, new Date()]);

    // Nodemailer setup
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com", port: 587,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
    });

    try {
        await transport.sendMail({
            from: `"Paysense" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Verification Code",
            html: `<h2>Code: ${pin}</h2>`
        });
    } catch (e) {
        console.error("Email send error:", e);
    }
}

// --- GET CURRENT USER ---
export async function getCurrentUser() {
    const session = await auth;
    const user_id = session?.user?.id

    if (!user_id) {
        return { success: false, message: "Session not found, login in to fix issue" }
    }

    try {
        const { rows: user_details } = await query("SELECT id, first_name, last_name, email FROM paysense_users WHERE id = $1", [user_id]);
        const { rows: account_details } = await query("SELECT id, checking_balance, savings_balance FROM paysense_account_details WHERE id = $1")

        return { success: true, user_details, account_details }

    } catch (e) {
        console.error("Get current user error:", e);
        return { success: false, message: "no" };
    }
}

// --- PROFILE UPDATE & KYC SUBMISSION ---
export async function updateProfile(formData) {
    const first_name = formData.get('first_name').trim()
    const last_name = formData.get('last_name').trim()
    const phone = formData.get('phone')

    const session = await auth()
    const user = session?.user?.id

    if (!user) {
        return { success: false, message: 'User not authenticated, login to fix issue' }
    }

    if (!first_name || !last_name) {
        return { success: false, message: 'First and last name are required' }
    }

    try {
        const update_text = await query(
            "UPDATE paysense_users SET first_name = $1, last_name = $2, phone = $3 WHERE id = $4 RETURNING id, first_name, last_name, phone, email, verified, profile_img",
            [first_name, last_name, phone, user]
        );

        if (update_text.rowCount === 0) {
            return { success: false, message: 'Database update failed' }
        }
        return { success: true, user: update_text.rows[0] }

    }
    catch (err) {
        return { success: false, message: 'Database update failed' }
    }

    // LOGIC: Here you would use Prisma/Supabase to update the DB
    console.log("Updating DB with:", { name, phone })

    // Refresh the page data
    revalidatePath('/app/settings')
    return { success: true }
}

export async function submitKYC(formData) {
    const idType = formData.get('idType')
    // LOGIC: Handle document upload/verification
    console.log("KYC Submitted for type:", idType)

    revalidatePath('/app/settings')
    return { success: true, status: 'pending' }
}