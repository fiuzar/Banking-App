const ALAT_BASE_URL = "https://playground.alat.ng/api-service";

export async function callAlatPayment(bill) {
    // This matches the ALAT PartnerPayment structure
    const response = await fetch(`${ALAT_BASE_URL}/api/PartnerPayment/pay-bill`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.ALAT_SUB_KEY,
        },
        body: JSON.stringify({
            channelId: process.env.ALAT_CHANNEL_ID,
            billerId: bill.category.id, // e.g., 'elec'
            customerId: bill.customerId,
            amount: bill.amount,
            transactionReference: `PS-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        })
    });
    return response.json();
}