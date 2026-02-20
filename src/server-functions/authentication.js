"use server"

import { signIn, auth } from "@/auth"
import { query } from "@/dbh"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import crypto from "crypto";

// --- REQUEST PASSWORD RESET ---
export async function requestPasswordReset(email_input) {
    const email = email_input?.trim().toLowerCase();
    if (!email) return { success: false, message: "Email is required" };

    try {
        const { rows } = await query("SELECT id FROM paysense_users WHERE email = $1", [email]);
        if (rows.length === 0) {
            return { success: true, message: "If an account exists, a reset link has been sent." };
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000); 

        await query("DELETE FROM paysense_password_resets WHERE email = $1", [email]);
        await query(
            "INSERT INTO paysense_password_resets (email, token, expires_at) VALUES ($1, $2, $3)",
            [email, token, expiry]
        );

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
                </div>
            `
        });

        return { success: true, message: "Reset link sent successfully." };
    } catch (e) {
        return { success: false, message: "Failed to process request." };
    }
}

// --- RESET PASSWORD WITH TOKEN ---
export async function updatePasswordWithToken(token, newPassword) {
    if (!token || !newPassword) return { success: false, message: "Invalid request" };

    try {
        const { rows } = await query(
            "SELECT email FROM paysense_password_resets WHERE token = $1 AND expires_at > NOW()",
            [token]
        );
        const record = rows[0];

        if (!record) return { success: false, message: "Invalid or expired token" };

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await query("UPDATE paysense_users SET password = $1 WHERE email = $2", [hashedPassword, record.email]);
        await query("DELETE FROM paysense_password_resets WHERE email = $1", [record.email]);

        return { success: true, message: "Password updated successfully" };
    } catch (e) {
        return { success: false, message: "Failed to update password" };
    }
}

// --- GOOGLE ACTION ---
export async function googleSignIn() {
    await signIn("google", { redirectTo: "/app" });
}

// --- CREDENTIALS LOGIN (RESIZED FOR 2FA & TERMINATION) ---
export async function credentialsAction(main_email, main_password) {
    const email = main_email?.trim().toLowerCase();
    const password = main_password?.trim();

    if (!email || !password) return { success: false, message: "Email and password are required" };

    try {
        const { rows } = await query("SELECT * FROM paysense_users WHERE email = $1", [email]);
        const user = rows[0];

        if (!user || user.password === "social") return { success: false, message: "Invalid credentials" };

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return { success: false, message: "Invalid credentials" };

        // 1. TERMINATION CHECK
        if (user.terminate) {
            return { success: false, isTerminated: true, message: "Your account has been terminated." };
        }

        // 2. EMAIL VERIFICATION CHECK
        if (!user.verified) {
            await create_otp(email, "email_verification");
            return { success: false, isUnverified: true, email: user.email, message: "Please verify your email." };
        }

        // 3. 2FA CHECK
        if (user.two_fa_enabled) {
            await create_otp(email, "login_verification");
            return { success: false, requires2FA: true, email: user.email, message: "2FA Required" };
        }

        // 4. LOG THE SESSION
        await signIn("credentials", {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role || 'user',
            redirect: false
        });

        return { success: true };
    } catch (e) {
        return { success: false, message: "Login failed. Try again." };
    }
}

// --- SIGNUP ---
export async function handle_Signup(first_name, last_name, email, password, confirm_password) {
    const mail = email?.trim().toLowerCase();
    const fname = first_name?.trim();
    const lname = last_name?.trim();

    if (!fname || !lname || !mail || !password || !confirm_password) return { success: false, message: "All fields are required" };
    if (password !== confirm_password) return { success: false, message: "Passwords do not match" };

    try {
        const check = await query("SELECT id FROM paysense_users WHERE email = $1", [mail]);
        if (check.rows.length > 0) return { success: false, message: "Email already in use" };

        const hashedPassword = await bcrypt.hash(password, 12);
        await query(
            "INSERT INTO paysense_users (first_name, last_name, email, password, verified) VALUES ($1, $2, $3, $4, false)",
            [fname, lname, mail, hashedPassword]
        );

        await create_otp(mail, "email_verification");
        return { success: true, message: "Verify your email to continue" };
    } catch (e) {
        return { success: false, message: "Server error" };
    }
}

// --- UNIVERSAL OTP GENERATOR ---
export async function create_otp(email, purpose = "email_verification") {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
        await query("DELETE FROM paysense_verify_email WHERE email = $1", [email]);
        await query("INSERT INTO paysense_verify_email (email, pin) VALUES ($1, $2)", [email, pin]);

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com", port: 587,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
        });

        const subjects = {
            email_verification: "Verify your Paysense Email",
            pin_setup: "Your Security PIN Setup Code",
            login_verification: "Login Verification Code (2FA)"
        };

        await transport.sendMail({
            from: `"Paysense" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subjects[purpose] || "Security Code",
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 400px;">
                    <h2 style="color: #166534;">Security Code</h2>
                    <p>Use this code for <b>${purpose.replace('_', ' ')}</b>:</p>
                    <h1 style="letter-spacing: 8px; font-size: 36px; text-align: center; background: #f4f4f4; padding: 10px;">${pin}</h1>
                    <p style="font-size: 12px; color: #888;">Valid for 15 minutes.</p>
                </div>
            `
        });

        return { success: true };
    } catch (e) {
        return { success: false, message: "Failed to send code." };
    }
}

// --- FINALIZE PIN SETUP ---
export async function finalizePinSetup(formData) {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email;

    const otp_input = formData.get('otp');
    const new_pin = formData.get('pin');

    try {
        const { rows } = await query(
            "SELECT * FROM paysense_verify_email WHERE email = $1 AND pin = $2",
            [email, otp_input]
        );

        if (rows.length === 0) return { success: false, error: "Invalid code." };

        const hashedPin = await bcrypt.hash(new_pin, 10);
        await query("UPDATE paysense_accounts SET pin = $1 WHERE user_id = $2", [hashedPin, userId]);
        await query("DELETE FROM paysense_verify_email WHERE email = $1", [email]);

        revalidatePath('/app/settings');
        return { success: true };
    } catch (e) {
        console.error(e)
        return { success: false, error: "System error." };
    }
}

// --- OTP VERIFICATION (FOR SIGNUP/LOGIN/2FA) ---
export async function otpVerification(pin, email) {
    try {
        const { rows } = await query(
            "SELECT * FROM paysense_verify_email WHERE email = $1 AND pin = $2",
            [email, pin]
        );

        if (rows.length === 0) return { success: false, message: "Invalid Code" };

        // FIX: Ensure codeDate is parsed correctly regardless of environment
        const codeTime = new Date(rows[0].date).getTime();
        const currentTime = new Date().getTime();
        
        const diffInMinutes = (currentTime - codeTime) / (1000 * 60);

        // Debugging tip: Log this if it still fails
        // console.log(`Diff: ${diffInMinutes} mins. DB: ${rows[0].date}, Now: ${new Date().toISOString()}`);

        if (diffInMinutes > 15) {
             await query("DELETE FROM paysense_verify_email WHERE email = $1", [email]);
             return { success: false, message: "Code expired." };
        }

        await query("UPDATE paysense_users SET verified = true WHERE email = $1", [email]);
        await query("DELETE FROM paysense_verify_email WHERE email = $1", [email]);
        
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Verification failed" };
    }
}

// --- TOGGLE 2FA ---
export async function toggle2FA(userId, currentState) {
    const session = await auth();
    if (!session || session?.user?.id !== userId) return { success: false, error: "Unauthorized." };

    try {
        const newState = !currentState;
        const result = await query(
            "UPDATE paysense_users SET two_fa_enabled = $1 WHERE id = $2 RETURNING two_fa_enabled",
            [newState, userId]
        );

        if (result.rowCount === 0) return { success: false, error: "User not found." };
        return { success: true, newState: result.rows[0].two_fa_enabled };
    } catch (error) {
        return { success: false, error: "Database error." };
    }
}

// --- GET CURRENT USER (INCLUDES TERMINATE & 2FA STATUS) ---
export async function getCurrentUser() {
    noStore();
    const session = await auth();
    const user_id = session?.user?.id;

    if (!user_id) return { success: false, message: "Session missing." };

    try {
        const { rows: user_details } = await query(
            "SELECT id, first_name, last_name, email, phone, image, two_fa_enabled, terminate, verified, role FROM paysense_users WHERE id = $1", 
            [user_id]
        );

        const { rows: account_details } = await query("SELECT * FROM paysense_accounts WHERE user_id = $1", [user_id]);

        if (!account_details[0]) {
            const checkingNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            const savingsNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();

            const insert = await query(
                "INSERT INTO paysense_accounts (user_id, checking_balance, savings_balance, checking_account_number, savings_account_number) VALUES ($1, 0, 0, $2, $3) RETURNING *", 
                [user_id, checkingNum, savingsNum]
            );
            return { success: true, user_details, account_details: insert.rows };
        }
        return { success: true, user_details, account_details };
    } catch (e) {
        return { success: false, message: "Sync error." };
    }
}

// --- PROFILE UPDATE ---
export async function updateProfile(formData) {
    const first_name = formData.get('first_name')?.trim();
    const last_name = formData.get('last_name')?.trim();
    const phone = formData.get('phone');

    const session = await auth();
    const user_id = session?.user?.id;

    if (!user_id || !first_name || !last_name) return { success: false, message: 'Invalid data' };

    try {
        const result = await query(
            "UPDATE paysense_users SET first_name = $1, last_name = $2, phone = $3 WHERE id = $4 RETURNING *",
            [first_name, last_name, phone, user_id]
        );
        revalidatePath('/app/settings');
        return { success: true, user: result.rows[0] };
    } catch (err) {
        return { success: false, message: 'Update failed' };
    }
}

export async function updateUserLocale(userId, newLocale) {
    try {
        await query(
            `UPDATE paysense_users SET locale = $1 WHERE id = $2`,
            [newLocale, userId]
        );
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}