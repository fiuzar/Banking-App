'use server'

import { revalidatePath } from 'next/cache'
import { query, pool } from "@/dbh"
import { auth } from "@/auth"
import crypto from 'crypto';

export async function generateCryptomusSign(payload) {
    const apiKey = process.env.CRYPTOMUS_USER_API_KEY; // Your API Key from dashboard
    
    // 1. Convert payload to JSON string and then to Base64
    const jsonPayload = JSON.stringify(payload);
    const b64Payload = Buffer.from(jsonPayload).toString('base64');
    
    // 2. Create the HMAC hash using SHA512 and your API Key
    const hash = crypto
        .createHash('md5') // Cryptomus actually uses an MD5 concatenation for standard signs
        .update(b64Payload + apiKey)
        .digest('hex');

    return hash;
}

/**
 * Fetches the current exchange rate from Cryptomus
 */
export async function getCryptoRate(symbol) {
    if (!symbol) return { success: false, error: "Symbol is required" };

    try {
        const response = await fetch(`https://api.cryptomus.com/v1/exchange-rate/${symbol.toUpperCase()}/list`, {
            next: { revalidate: 15 } // Cache for 15 seconds
        });

        if (!response.ok) throw new Error("Cryptomus API unreachable");

        const data = await response.json();
        const usdRate = data.result?.find(r => r.to === 'USD');

        return { 
            success: true, 
            rate: usdRate ? parseFloat(usdRate.course) : null 
        };
    } catch (error) {
        console.error("Rate Fetch Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Processes the crypto purchase transaction
 */
export async function processBuyCrypto(formData) {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const usdAmount = parseFloat(formData.get('amount'));
    const asset = formData.get('asset')?.toUpperCase();
    const userId = session.user.id;
    const networkFee = 0.99;
    const totalFiatCost = usdAmount + networkFee;

    if (isNaN(usdAmount) || usdAmount <= 0) {
        return { success: false, error: "Invalid amount" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Check KYC Status
        const userRes = await client.query(
            `SELECT kyc_status FROM paysense_users WHERE id = $1 FOR UPDATE`,
            [userId]
        );

        if (userRes.rows[0]?.kyc_status !== 'verified') {
            throw new Error("Identity verification (KYC) is required to trade crypto.");
        }

        // 2. Validate Savings Balance (NULL-safe check)
        const accountRes = await client.query(
            `SELECT COALESCE(savings_balance, 0) as balance FROM paysense_accounts WHERE user_id = $1 FOR UPDATE`,
            [userId]
        );

        if (!accountRes.rows[0] || parseFloat(accountRes.rows[0].balance) < totalFiatCost) {
            throw new Error("Insufficient funds in your USD Savings account.");
        }

        // 3. Get Live Price via internal function to ensure consistency
        const rateResult = await getCryptoRate(asset);
        if (!rateResult.success || !rateResult.rate) {
            throw new Error("Could not confirm market price. Please try again.");
        }

        const currentPrice = rateResult.rate;
        const cryptoToReceive = usdAmount / currentPrice;

        // 4. Update Balances (COALESCE handles potential NULLs in coin columns)
        const assetColumn = asset.toLowerCase();
        
        // Deduct USD from Savings
        await client.query(
            `UPDATE paysense_accounts 
             SET savings_balance = COALESCE(savings_balance, 0) - $1 
             WHERE user_id = $2`,
            [totalFiatCost, userId]
        );

        // Credit Crypto Asset
        await client.query(
            `UPDATE paysense_accounts 
             SET ${assetColumn} = COALESCE(${assetColumn}, 0) + $1 
             WHERE user_id = $2`,
            [cryptoToReceive, userId]
        );

        // 5. Log Transaction
        await client.query(
            `INSERT INTO paysense_transactions (
                user_id, amount, type, status, description, metadata
            ) VALUES ($1, $2, 'crypto_purchase', 'completed', $3, $4)`,
            [
                userId,
                totalFiatCost,
                `Purchased ${cryptoToReceive.toFixed(8)} ${asset}`,
                JSON.stringify({
                    asset: asset,
                    execution_price: currentPrice,
                    crypto_amount: cryptoToReceive,
                    fiat_spent: usdAmount,
                    fee: networkFee
                })
            ]
        );

        await client.query('COMMIT');

        revalidatePath('/app');
        return { 
            success: true, 
            received: cryptoToReceive.toFixed(8), 
            asset: asset 
        };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Crypto Purchase Transaction Failed:", error.message);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
}

export async function generateStaticWallet(currency, network) {
    try {
        const merchantId = process.env.CRYPTOMUS_MERCHANT_ID;
        const apiKey = process.env.CRYPTOMUS_API_KEY;

        // Data to send to Cryptomus
        const data = {
            currency: currency,
            network: network,
            url_callback: `${process.env.WEBSITE_ADDRESS}/api/webhooks/cryptomus`,
            // Use your actual user's ID here so the webhook knows who to credit!
            order_id: `USER_${Date.now()}` 
        };

        // Cryptomus Signature Logic
        const b64 = Buffer.from(JSON.stringify(data)).toString('base64');
        const sign = crypto.createHash('md5').update(b64 + apiKey).digest('hex');

        const response = await fetch('https://api.cryptomus.com/v1/wallet', {
            method: 'POST',
            headers: {
                'merchant': merchantId,
                'sign': sign,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Cryptomus API Error:", error);
        return { error: "Failed to generate wallet" };
    }
}