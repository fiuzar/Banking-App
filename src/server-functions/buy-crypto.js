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

export async function processCryptoTrade(formData) {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const usdAmount = parseFloat(formData.get('amount')); // The USD value the user wants to trade
    const assetSymbol = formData.get('asset')?.toUpperCase(); 
    const mode = formData.get('mode'); // 'buy' or 'sell'
    const userId = session.user.id;
    const networkFee = 0.99;
    
    // Mapping Symbols to Database Column Names
    const symbolToColumn = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'USDT': 'usdt',
        'SOL': 'solana',
        'LTC': 'litecoin'
    };

    const assetColumn = symbolToColumn[assetSymbol];
    if (!assetColumn) return { success: false, error: "Unsupported crypto asset" };
    if (isNaN(usdAmount) || usdAmount <= 0) return { success: false, error: "Invalid amount" };

    try {
        await query('BEGIN');

        // 1. Get Live Price
        const rateResult = await getCryptoRate(assetSymbol);
        if (!rateResult.success || !rateResult.rate) {
            throw new Error("Could not confirm market price. Please try again.");
        }

        const currentPrice = rateResult.rate;
        const cryptoEquivalent = usdAmount / currentPrice;

        // 2. Fetch current balances with a row lock
        const accountRes = await query(
            `SELECT savings_balance, ${assetColumn} FROM paysense_accounts WHERE user_id = $1 FOR UPDATE`,
            [userId]
        );
        const account = accountRes.rows[0];

        if (mode === 'buy') {
            const totalCost = usdAmount + networkFee;
            if (parseFloat(account.savings_balance) < totalCost) {
                throw new Error("Insufficient USD Savings balance.");
            }

            // Deduct USD, Add Crypto
            await query(
    `UPDATE paysense_accounts 
     SET savings_balance = CAST(savings_balance AS NUMERIC) - $1, 
         ${assetColumn} = COALESCE(CAST(${assetColumn} AS NUMERIC), 0) + $2 
     WHERE user_id = $3`,
    [totalCost, cryptoEquivalent, userId]
);

        } else if (mode === 'sell') {
            if (parseFloat(account[assetColumn]) < cryptoEquivalent) {
                throw new Error(`Insufficient ${assetSymbol} balance to complete this sale.`);
            }

            const netCredit = usdAmount - networkFee;

            // Deduct Crypto, Add USD
            await query(
    `UPDATE paysense_accounts 
     SET ${assetColumn} = CAST(${assetColumn} AS NUMERIC) - $1, 
         savings_balance = COALESCE(CAST(savings_balance AS NUMERIC), 0) + $2 
     WHERE user_id = $3`,
    [cryptoEquivalent, netCredit, userId]
);
        }

        // 3. Log the Transaction
        await query(
            `INSERT INTO paysense_transactions (
                user_id, amount, type, status, description, metadata
            ) VALUES ($1, $2, $3, 'completed', $4, $5)`,
            [
                userId,
                usdAmount,
                mode === 'buy' ? 'crypto_purchase' : 'crypto_sale',
                `${mode === 'buy' ? 'Bought' : 'Sold'} ${cryptoEquivalent.toFixed(8)} ${assetSymbol}`,
                JSON.stringify({
                    asset: assetSymbol,
                    execution_price: currentPrice,
                    crypto_amount: cryptoEquivalent,
                    fee: networkFee,
                    mode: mode
                })
            ]
        );

        await query('COMMIT');
        // Fetch fresh data to return to the frontend
        const updatedAccount = await query(
            "SELECT * FROM paysense_accounts WHERE user_id = $1",
            [userId]
        );

        revalidatePath('/app');
        
        return { 
            success: true, 
            received: mode === 'buy' ? cryptoEquivalent.toFixed(8) : usdAmount.toFixed(2), 
            asset: assetSymbol,
            updatedData: updatedAccount.rows[0] // Add this!
        };

    } catch (error) {
        await query('ROLLBACK');
        console.log(error);
        return { success: false, error: error.message };
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