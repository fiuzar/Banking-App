'use client'
import "@/i18n"
import { useTranslation } from "react-i18next"
import { useState, useEffect, useRef, useContext } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
	ArrowUpRight, Landmark, RefreshCw, Bitcoin,
	FileText, UserPlus, CreditCard, Wallet, CheckSquare
} from "lucide-react"
import Link from "next/link"
import { UserContext, AccountDetailsContext } from "@/server-functions/contexts"

export default function Dashboard() {
	const { accountDetails, setAccountDetails } = useContext(AccountDetailsContext)
	const { user, setUser } = useContext(UserContext)
	const { t, i18n } = useTranslation()
	const [currentCard, setCurrentCard] = useState(0)
	const accountCards = [
		{ title: t("savings", "SAVINGS"), amount: `$${parseFloat(accountDetails.savings_balance) || "0.00"}`, acc: ".... 6708", color: "from-green-800 to-green-950" },
		{ title: t("checking", "CHECKING"), amount: `$${parseFloat(accountDetails.checking_balance) || "0.00"}`, acc: ".... 1234", color: "from-green-800 to-slate-950" },
		{ isVirtual: true }
	]
	const cardsContainerRef = useRef(null)
	const autoSwitchInterval = 4000 // ms

	// Scroll to card on currentCard change
	useEffect(() => {
		if (cardsContainerRef.current) {
			const container = cardsContainerRef.current
			const card = container.children[currentCard]
			if (card) {
				card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
			}
		}
	}, [currentCard])

	// Auto-switch at interval
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentCard(prev => (prev + 1) % accountCards.length)
		}, autoSwitchInterval)
		return () => clearInterval(interval)
	}, [accountCards.length])

	// Listen for manual scroll to update dot
	function handleScroll() {
		if (!cardsContainerRef.current) return
		const container = cardsContainerRef.current
		const children = Array.from(container.children)
		const containerRect = container.getBoundingClientRect()
		let minDiff = Infinity
		let idx = 0
		children.forEach((child, i) => {
			const rect = child.getBoundingClientRect()
			const diff = Math.abs(rect.left - containerRect.left)
			if (diff < minDiff) {
				minDiff = diff
				idx = i
			}
		})
		setCurrentCard(idx)
	}

	// Language label for header
	const langLabels = {
		en: "🇬🇧 English",
		fr: "🇫🇷 Français",
		es: "🇪🇸 Español"
	}
	const langLabel = langLabels[i18n.language?.split('-')[0]] || i18n.language

	return (
		<div className="w-full bg-slate-50 min-h-screen">
			{/* HEADER SECTION */}
			<header className="p-4 flex justify-between items-center bg-green-900 text-white md:px-8 md:py-6">
				<div className="flex items-center gap-2 text-xs border border-white/20 rounded-full px-4 py-1.5 bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition">
					<span className="uppercase">{langLabel}</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="hidden md:block text-sm font-medium opacity-80">{t("welcome", `Welcome back, ${user.first_name} ${user.last_name}`)}</span>
					<div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white/30 shadow-lg">
						 {user?.profile_image ? (
                            // Use Next.js Image for optimization
                            <img
                                src={user.profile_image}
                                alt="Profile"
                                className="object-cover w-full h-full"
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : (
                            // Fallback: User icon (Lucide's User icon)
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-slate-300"
                                width={64}
                                height={64}
                                viewBox="0 0 10 10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        )}

					</div>
				</div>
			</header>

			{/* SLIDABLE ACCOUNTS SECTION */}
			<div className="bg-green-900 pt-2 pb-12 px-4 md:py-16">
				<div
					className="max-w-6xl mx-auto flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-4 no-scrollbar"
					ref={cardsContainerRef}
					onScroll={handleScroll}
				>
					<AccountCard {...accountCards[0]} />
					<AccountCard {...accountCards[1]} />
					<Card className="bg-slate-900 text-white overflow-hidden relative border-none min-w-19/20 md:min-w-full snap-center">
						<CardContent className="p-6">
							<div className="flex justify-between items-start mb-8">
								<div className="h-8 w-12 bg-white/20 rounded-md animate-pulse" />
								<CreditCard className="h-6 w-6 text-white/50" />
							</div>
							<p className="text-sm font-mono tracking-widest mb-1 text-white/60">•••• •••• •••• 4290</p>
							<div className="flex justify-between items-end">
								<p className="text-xs font-medium">{t("virtual_card", "Virtual Card • USD")}</p>
								<div className="h-2 w-2 bg-emerald-400 rounded-full" />
							</div>
							<div className="mt-8 grid grid-cols-2 gap-2">
								<Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px]">{t("freeze", "Freeze")}</Button>
								<Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px]">{t("details", "Details")}</Button>
							</div>
						</CardContent>
					</Card>
				</div>
				{/* Dots Indicator */}
				<div className="flex justify-center mt-4 gap-2">
					{accountCards.map((_, idx) => (
						<button
							key={idx}
							className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${currentCard === idx ? "bg-white" : "bg-white/30"}`}
							onClick={() => setCurrentCard(idx)}
							aria-label={`Go to card ${idx + 1}`}
							tabIndex={0}
						/>
					))}
				</div>
			</div>

			{/* 3x3 QUICK ACTIONS GRID */}
			<div className="max-w-4xl mx-auto bg-white rounded-t-[40px] md:rounded-[40px] -mt-8 p-8 md:mt-8 md:shadow-xl border border-gray-100">
				<h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-8 text-center md:text-left">{t("quick_services", "Quick Services")}</h3>
				<div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-y-10 gap-x-4">
					<ActionItem icon={<ArrowUpRight />} label={t('wire', 'Wire Transfer')} url_link="/app/transfer/wire" />
					<ActionItem icon={<Landmark />} label={t('local', 'Local Transfer')} url_link="/app/transfer/local" />
					<ActionItem icon={<RefreshCw />} label={t('internal', 'Internal Transfer')} url_link="/app/transfer/internal" />
					<ActionItem icon={<Bitcoin />} label={t('crypto', 'Buy Crypto')} url_link="/app/crypto/buy" />
					<ActionItem icon={<FileText />} label={t('bills', 'Pay Bills')} url_link={`/app/bills`} />
					<ActionItem icon={<UserPlus />} label={t('add', 'Add Beneficiary')} url_link={`/app/beneficiary`} />
					<ActionItem icon={<CreditCard />} label={t('card_deposit', 'Card Deposit')} url_link={`/app/deposit/card`} />
					<ActionItem icon={<Wallet />} label={t('crypto_deposit', 'Crypto Deposit')} url_link={`/app/deposit/crypto`} />
					<ActionItem icon={<CheckSquare />} label={t('check_deposit', 'Check Deposit')} url_link={`/app/deposit/check`} />
				</div>
			</div>
		</div>
	)
}

function AccountCard({ title, amount, acc, color }) {
	return (
		<Card className={`min-w-19/20 md:min-w-full snap-center bg-linear-to-br ${color} border-white/10 text-white p-7 shadow-2xl relative overflow-hidden`}>
			<div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
			<p className="text-[10px] tracking-[0.2em] font-bold opacity-50 mb-2">{title}</p>
			<h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8">{amount}</h1>

			<div className="flex justify-between items-end">
				<div>
					<p className="text-[9px] opacity-40 uppercase font-bold mb-1">Account Number</p>
					<p className="font-mono text-sm tracking-widest">{acc}</p>
				</div>
				<div className="flex gap-6 text-right">
					{/* <div>
						<p className="text-[8px] opacity-40 uppercase font-bold">Credit</p>
						<p className="text-xs font-semibold">$0.00</p>
					</div>
					<div>
						<p className="text-[8px] opacity-40 uppercase font-bold">Debit</p>
						<p className="text-xs font-semibold">$0.00</p>
					</div> */}
				</div>
			</div>
		</Card>
	)
}

function ActionItem({ icon, label, url_link }) {
	return (
		<Link href={url_link} className="flex flex-col items-center gap-3 group outline-none">
			<div className="p-4 bg-green-800 text-white rounded-2xl shadow-md group-hover:bg-green-700 group-active:scale-90 transition-all duration-200">
				{icon}
			</div>
			<span className="text-[11px] md:text-xs font-semibold text-gray-500 text-center leading-tight">
				{label}
			</span>
		</Link>
	)
}