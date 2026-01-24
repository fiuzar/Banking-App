'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowUpDown } from "lucide-react"
import { SuccessState, FailureState, AccountBox } from "@/components/app/transfer-success-receipt"
import Link from "next/link"
import { internalTransfer } from "@/server-functions/transfer/internal-transfer"

export default function InternalTransfer() {
	const [isSavingsToChecking, setIsSavingsToChecking] = useState(true)
	const [amount, setAmount] = useState("")
	const [result, setResult] = useState(null)
	const [loading, setLoading] = useState(false)

	const accountData = {
		savings: { label: "USD Savings", balance: "$5,010,876.00" },
		checking: { label: "USD Checking", balance: "$12,450.00" }
	}

	const handleTransfer = async () => {
		setLoading(true)
		setResult(null)
		const from_account = isSavingsToChecking ? "savings" : "checking"
		const res = await internalTransfer(amount, from_account)
		setResult({
			...res,
			details: {
				from_account_name: from_account,
				to_account_name: from_account === "savings" ? "checking" : "savings",
				amount
			}
		})
		setLoading(false)
	}

	if (result?.success) {
		return <SuccessState details={result.details} />
	}
	if (result && !result.success) {
		return <FailureState error={result.error} details={result.details} />
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="bg-primary p-6 text-white flex items-center gap-4">
				<Link href="/app"><ArrowLeft size={24} /></Link>
				<h1 className="text-xl font-bold">Internal Transfer</h1>
			</div>

			<div className="max-w-md mx-auto p-6 space-y-8">
				{/* The Swap UI */}
				<div className="relative space-y-2">
					<AccountBox
						label="From"
						name={isSavingsToChecking ? accountData.savings.label : accountData.checking.label}
						balance={isSavingsToChecking ? accountData.savings.balance : accountData.checking.balance}
					/>

					{/* Swap Button */}
					<button
						onClick={() => setIsSavingsToChecking(!isSavingsToChecking)}
						className="absolute left-1/2 -translate-x-1/2 top-[42%] z-10 bg-primary text-white p-3 rounded-full border-4 border-background shadow-lg active:scale-90 transition-transform"
					>
						<ArrowUpDown size={20} />
					</button>

					<AccountBox
						label="To"
						name={isSavingsToChecking ? accountData.checking.label : accountData.savings.label}
						balance={isSavingsToChecking ? accountData.checking.balance : accountData.savings.balance}
					/>
				</div>

				{/* Amount Input */}
				<div className="text-center space-y-2">
					<label className="text-meta font-bold uppercase tracking-widest">Amount to Transfer</label>
					<div className="relative">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-n-300">$</span>
						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0.00"
							className="w-full bg-transparent text-center balance-xl text-primary outline-none py-6 border-b-2 border-n-100 focus:border-primary transition-colors"
						/>
					</div>
				</div>

				<div className="bg-secondary p-4 rounded-brand-card">
					<div className="flex justify-between text-xs font-medium">
						<span className="text-n-500 uppercase">Transfer Speed</span>
						<span className="text-bank-success font-bold">INSTANT</span>
					</div>
				</div>

				<Button
					onClick={handleTransfer}
					disabled={!amount || parseFloat(amount) <= 0 || loading}
					className="btn-primary w-full h-14 text-lg shadow-xl shadow-primary/20"
				>
					{loading ? "Processing..." : "Confirm Transfer"}
				</Button>
			</div>
		</div>
	)
}