export const helpTopics = [
  {
    id: 1,
    title: "Limits & Verification",
    category: "Account",
    excerpt: "Learn how to upgrade your account to Level 2 and send up to $50,000 daily.",
    content: `To ensure the security of our financial ecosystem, Paysense operates with tiered transaction limits. By default, new accounts (Level 1) are limited to $2,000 in daily transfers.\n\nTo upgrade to Level 2 ($50,000 limit):\n1. Go to Settings > Profile > Verification.\n2. Upload a high-resolution photo of your Government ID (Passport or Driver's License).\n3. Complete the 3D Liveness Selfie check.\n4. Verification usually takes 10–30 minutes. Once approved, your new limits are active immediately.`
  },
  {
    id: 2,
    title: "Card Security & Freezing",
    category: "Security",
    excerpt: "Instant steps to take if your virtual card is compromised.",
    content: `If you notice a transaction you didn't authorize, or if you've misplaced your device, you should immediately Freeze your card.\n\nSteps to secure your funds:\n1. Navigate to the Cards tab in your bottom navigation.\n2. Select the active virtual card.\n3. Toggle the Freeze Card switch to 'On'.\n4. This will instantly decline any new transaction attempts. You can unfreeze it just as easily if you find your card, or click 'Request Replacement' to permanently kill the card and get a new number.`
  },
  {
    id: 3,
    title: "Wire Transfer Timelines",
    category: "Transfers",
    excerpt: "Why domestic wires take 1-3 business days to clear.",
    content: `While Paysense processes outbound wires instantly, the global banking system still moves in batches.\n\nDomestic Wires (US to US): Usually arrive within 24 hours if sent before 2:00 PM EST.\nInternational Wires: Can take 1–3 business days.\n\nNote: Wires are not processed on weekends or federal bank holidays. If your transfer status says 'Completed' in Paysense but hasn't arrived in the recipient's bank, it is likely sitting in the 'Intermediary Bank' for final clearing.`
  },
  {
    id: 4,
    title: "Crypto Deposit Issues",
    category: "Crypto",
    excerpt: "What to do if your USDT deposit is 'Pending' on the chain.",
    content: `Crypto deposits are automated but depend entirely on blockchain confirmations.\n\nWrong Network: Always ensure you are sending USDT via the TRC20 (Tron) network or BTC via the native Bitcoin network. Sending to the wrong network may result in permanent loss.\nConfirmations: We require 12 confirmations for USDT. This usually takes 2–5 minutes.\nCheck your Hash: If 30 minutes have passed, copy your Transaction Hash (TXID) and send it to our Live Chat team for manual tracking.`
  },
  {
    id: 5,
    title: "Resetting 2FA",
    category: "Security",
    excerpt: "How to recover your account if you lost your authenticator app.",
    content: `Lost your phone or deleted your Google Authenticator app? Don't worry, but for security, this process is strict.\n\n1. Locate the Recovery Codes provided to you during your initial 2FA setup.\n2. Enter one of those codes in the 2FA field during login.\n3. If you do not have recovery codes, click 'Contact Support' on the login screen.\n4. Our team will require a 'Selfie with ID and today's date written on paper' to manually disable 2FA for you. This takes approximately 6 hours.`
  },
  {
    id: 6,
    title: "International Wire Fees",
    category: "Fees",
    content: "Paysense charges a flat fee for wires, but intermediary banks may deduct additional 'routing fees' ranging from $15 to $50 per transaction.",
    excerpt: "Breakdown of intermediary bank charges for global wires."
  },
  {
    id: 7,
    title: "ACH vs Wire",
    category: "Transfers",
    content: "ACH is free but takes 2-3 days. Wires are instant or same-day but carry a processing fee. Use ACH for bills and Wires for urgent large payments.",
    excerpt: "Understanding the difference in speed and cost for US transfers."
  },
  {
    id: 8,
    title: "Reporting Fraud",
    category: "Security",
    content: "To report fraud, select the transaction in your history and click 'Dispute.' Our security team will investigate and freeze relevant assets within 60 minutes.",
    excerpt: "How to dispute a transaction you don't recognize."
  },
  {
    id: 9,
    title: "Adding Beneficiaries",
    category: "Transfers",
    content: "Go to 'Transfer' > 'Add New.' We verify the recipient's name against the routing number to ensure your money reaches the right person safely.",
    excerpt: "Saving bank details for one-tap future transfers."
  },
  {
    id: 10,
    title: "Stripe Payment Failures",
    category: "Deposits",
    content: "Most card deposits fail due to '3D Secure' authentication or bank-imposed limits. Try using a different card or contacting your bank to authorize Paysense.",
    excerpt: "Common reasons why your card deposit was declined."
  },
  {
    id: 11,
    title: "Cryptomus Rates",
    category: "Crypto",
    content: "We provide real-time mid-market rates. A small spread of 0.5% is applied to cover network volatility during the exchange process.",
    excerpt: "How we calculate the spread on crypto-to-fiat swaps."
  },
  {
    id: 12,
    title: "Business Accounts",
    category: "Account",
    content: "Business accounts require Articles of Incorporation and EIN verification. This allows for higher corporate payroll and mass-payment features.",
    excerpt: "Requirements for opening a Paysense Business entity."
  },
  {
    id: 13,
    title: "Virtual Card Limits",
    category: "Card",
    content: "By default, virtual cards have a $5,000 monthly spending limit. You can request an increase in the 'Card Settings' section after 3 months of use.",
    excerpt: "Daily spending caps and how to adjust them in settings."
  },
  {
    id: 14,
    title: "Tax Statements",
    category: "Documents",
    content: "Annual tax documents are generated every January. You can download your 1099-K or 1099-B directly from the 'Documents' tab in Settings.",
    excerpt: "How to download your annual 1099-K or transaction history."
  },
  {
    id: 15,
    title: "Network Confirmations",
    category: "Crypto",
    content: "BTC requires 3 confirmations (30 mins), while ETH and USDT on Tron require 12-20 confirmations (2-5 mins) for security reasons.",
    excerpt: "Why some coins require 3 vs 12 confirmations."
  },
  {
    id: 16,
    title: "Refund Policy",
    category: "Legal",
    content: "Refunds for card purchases usually take 5-10 business days to appear on your statement after the merchant has processed the reversal.",
    excerpt: "Processing times for reversed card transactions."
  },
  {
    id: 17,
    title: "Biometric Login",
    category: "Security",
    content: "Enable Biometrics in Settings > Security to use FaceID or TouchID. This adds an extra layer of protection beyond your password.",
    excerpt: "Enabling FaceID or Fingerprint for faster app access."
  },
  {
    id: 18,
    title: "Direct Deposit",
    category: "Deposits",
    content: "Share your routing and account number found in the 'Checking' tab with your employer to get paid up to 2 days early via ACH.",
    excerpt: "Finding your routing and account number for payroll."
  },
  {
    id: 19,
    title: "KYC Document Guide",
    category: "Account",
    content: "We accept Passports, Driver's Licenses, and National IDs. Ensure the photo is clear, all 4 corners are visible, and the document is not expired.",
    excerpt: "Valid ID types we accept for global verification."
  },
  {
    id: 20,
    title: "Account Statements",
    category: "Documents",
    content: "Generate monthly PDF statements for any date range in the last 7 years. These are officially stamped and accepted for visa applications.",
    excerpt: "Generating a PDF for proof of funds or visa applications."
  }
];