"use server"

import { signIn, auth } from "@/auth"
import { query } from "@/dbh"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache";
import crypto from "crypto"; // Native Node.js module
import {unstable_noStore as noStore} from "next/cache"

// --- REQUEST PASSWORD RESET ---
export async function requestPasswordReset(email_input) {
    const email = email_input?.trim().toLowerCase();
    if (!email) return { success: false, message: "Email is required" };

    try {
        // 1. Check if user exists
        const { rows } = await query("SELECT id FROM paysense_users WHERE email = $1", [email]);
        if (rows.length === 0) {
            // We return success even if user doesn't exist for security (prevent email harvesting)
            return { success: true, message: "If an account exists, a reset link has been sent." };
        }

        // 2. Generate a secure random token
        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        // 3. Store token in DB (Delete old tokens for this email first)
        await query("DELETE FROM paysense_password_resets WHERE email = $1", [email]);
        await query(
            "INSERT INTO paysense_password_resets (email, token, expires_at) VALUES ($1, $2, $3)",
            [email, token, expiry]
        );

        // 4. Send Email
        const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com", port: 587,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
        });

        await transport.sendMail({
            from: `"Paysense" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your Password",
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>Click the button below to reset your password. This link expires in 1 hour.</p>
                    <a href="${resetLink}" style="background: #166534; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `
        });

        return { success: true, message: "Reset link sent successfully." };
    } catch (e) {
        console.error("Reset request error:", e);
        return { success: false, message: "Failed to process request." };
    }
}

// --- RESET PASSWORD WITH TOKEN ---
export async function updatePasswordWithToken(token, newPassword) {
    if (!token || !newPassword) return { success: false, message: "Invalid request" };

    try {
        // 1. Verify token and check expiry
        const { rows } = await query(
            "SELECT email FROM paysense_password_resets WHERE token = $1 AND expires_at > NOW()",
            [token]
        );
        const record = rows[0];

        if (!record) {
            return { success: false, message: "Invalid or expired token" };
        }

        // 2. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // 3. Update User Password
        await query(
            "UPDATE paysense_users SET password = $1 WHERE email = $2",
            [hashedPassword, record.email]
        );

        // 4. Delete the used token
        await query("DELETE FROM paysense_password_resets WHERE email = $1", [record.email]);

        return { success: true, message: "Password updated successfully" };
    } catch (e) {
        console.error("Password update error:", e);
        return { success: false, message: "Failed to update password" };
    }
}

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
        // Query the user from your custom table
        const { rows } = await query("SELECT * FROM paysense_users WHERE email = $1", [email]);
        const user = rows[0];

        // 1. Check if user exists and isn't a social-only account
        if (!user || user.password === "social") {
            return { success: false, message: "Invalid email or password" };
        }

        // 2. Verify Bcrypt password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return { success: false, message: "Invalid email or password" };

        // 3. Handle Email Verification Redirect
        if (!user.verified) {
            await create_otp(email); // Re-send OTP if they aren't verified
            return {
                success: false,
                isUnverified: true,
                email: user.email,
                message: "Please verify your email to continue."
            };
        }

        // 4. Log the session via NextAuth
        // Note: Make sure your auth.ts is configured to handle 'role' in the session
        await signIn("credentials", {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role || 'user', // Essential for your Admin section
            redirect: false
        });

        return { success: true };
    } catch (e) {
        console.error("Login error:", e);
        return { success: false, message: "Something went wrong. Please try again." };
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

export async function create_otp(email) {
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
    noStore()
    const session = await auth();
    const user_id = session?.user?.id

    if (!user_id) {
        return { success: false, message: "Session not found, login in to fix issue" }
    }

    try {
        // 1. Get User Details
        const { rows: user_details } = await query(
            "SELECT id, first_name, last_name, email, phone, image FROM paysense_users WHERE id = $1", 
            [user_id]
        );

        // 2. Get Account Details (Including the new account number columns)
        const { rows: account_details } = await query(
            `SELECT * FROM paysense_accounts WHERE user_id = $1`, 
            [user_id]
        );

        // 3. If no account exists, create one with unique numbers
        if (!account_details[0]) {
            // Generate two different 10-digit numbers
            const checkingNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            const savingsNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();

            const insert_account_details = await query(
                `INSERT INTO paysense_accounts 
                 (user_id, checking_balance, savings_balance, checking_account_number, savings_account_number) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING id, user_id, checking_balance, savings_balance, checking_account_number, savings_account_number`, 
                [user_id, 0.00, 0.00, checkingNum, savingsNum]
            );

            return { success: true, user_details, account_details: insert_account_details.rows };
        }
        return { success: true, user_details, account_details };

    } catch (e) {
        // If a duplicate key error happens (highly unlikely with 10 digits), 
        // the unique constraint will catch it here.
        console.error("Get current user error:", e);
        return { success: false, message: "Database sync error" };
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
            "UPDATE paysense_users SET first_name = $1, last_name = $2, phone = $3 WHERE id = $4 RETURNING id, first_name, last_name, phone, email, verified, image",
            [first_name, last_name, phone, user]
        );

        if (update_text.rowCount === 0) {
            return { success: false, message: 'Profile update failed' }
        }
        console.log("Updated user:", update_text.rows[0])
        return { success: true, user: update_text.rows[0] }

    }
    catch (err) {
    console.log(err)
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