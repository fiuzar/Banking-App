'use client'

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { AccountDetailsContext } from "@/server-functions/contexts"
import {
	ArrowLeft,
	ArrowUpRight,
	ArrowDownLeft,
	Copy,
	Search,
	Filter,
	Download
} from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { get_transaction_history_list } from "@/server-functions/transaction-history"

export default function AccountDetails() {
	const { data: session } = useSession()
	const user_id = session?.user?.id
	const search_params = useSearchParams();
	const account_type = search_params.get("currency")
	const { accountDetails, setAccountDetails } = useContext(AccountDetailsContext)
	const [transactions_history, setTransactionHistory] = useState([])

	useState(() => {

		async function get_transaction_history() {
			if (!user_id) return

			const {success, message, history} = await get_transaction_history_list(account_type, start, end, offset)

			if(success) {
				setTransactionHistory(history)
			}
		}

		get_transaction_history()
	}, [user_id])

	// Mock Transaction Data
	const transactions = [
		{ id: 1, name: "Apple Store", date: "Jan 22, 2026", amount: "-$1,299.00", type: "debit", category: "Shopping" },
		{ id: 2, name: "Wire Transfer: Stripe", date: "Jan 20, 2026", amount: "+$4,500.00", type: "credit", category: "Income" },
		{ id: 3, name: "Internal: To Checking", date: "Jan 18, 2026", amount: "-$500.00", type: "debit", category: "Transfer" },
		{ id: 4, name: "ATM Withdrawal", date: "Jan 15, 2026", amount: "-$200.00", type: "debit", category: "Cash" },
	]

	return (
		<div className="min-h-screen bg-white">
			{/* Header Section */}
			<div className="bg-primary pt-8 pb-24 px-6 text-white relative">
				<div className="flex justify-between items-center mb-8">
					<Link href="/app">
						<ArrowLeft size={24} />
					</Link>
					<button className="p-2 bg-white/10 rounded-full">
						<Download size={20} />
					</button>
				</div>

				<div className="space-y-1">
					<p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
						{isSavings = "savings" ? 'USD Savings Account' : 'USD Checking Account'}
					</p>
					<h1 className="balance-xl">
						{isSavings = "savings" ? `$${parseFloat(accountDetails.savings_balance) || 0.00}s` : `$${parseFloat(accountDetails.savings_balance) || 0.00}c`}
					</h1>
				</div>

				{/* Account Details Mini-Card */}
				{/* <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex justify-between items-center">
          <div>
            <p className="text-[9px] uppercase opacity-50 font-bold mb-1">Account Number</p>
            <p className="text-sm font-mono tracking-widest">0092 1102 4456</p>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Copy size={16} className="text-white/60" />
          </button>
        </div> */}
			</div>

			{/* Transactions Section */}
			<div className="bg-white rounded-t-[40px] -mt-10 min-h-[60vh] p-6 shadow-2xl relative z-10">
				<div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />

				<div className="flex justify-between items-center mb-6">
					<h2 className="text-lg font-black text-brand-dark">History</h2>
					<div className="flex gap-2">
						<button className="p-2 bg-secondary rounded-full text-n-500"><Search size={18} /></button>
						<button className="p-2 bg-secondary rounded-full text-n-500"><Filter size={18} /></button>
					</div>
				</div>

				<div className="space-y-6">
					{transactions_history.map((tx) => (
						<div key={tx.id} className="flex justify-between items-center group cursor-pointer">
							<div className="flex items-center gap-4">
								<div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-bank-success/10 text-bank-success' : 'bg-slate-100 text-slate-500'}`}>
									{tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
								</div>
								<div>
									<p className="font-bold text-brand-dark group-hover:text-primary transition-colors">{tx.name}</p>
									<p className="text-[10px] text-n-500 font-medium uppercase tracking-tighter">{tx.date} • {tx.category}</p>
								</div>
							</div>
							<div className="text-right">
								<p className={`font-bold ${tx.type === 'credit' ? 'text-bank-success' : 'text-brand-dark'}`}>
									{tx.amount}
								</p>
								<p className="text-[9px] text-n-300 font-bold uppercase">Settled</p>
							</div>
						</div>
					))}
				</div>

				<Button variant="ghost" className="w-full mt-10 text-n-400 font-bold text-xs uppercase tracking-widest">
					View Statement
				</Button>
			</div>
		</div>
	)
}