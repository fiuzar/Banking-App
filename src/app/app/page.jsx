'use client'

import "@/i18n"
import { useTranslation } from "react-i18next"
import { useState, useEffect, useRef, useContext } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
	ArrowUpRight, Landmark, RefreshCw, Bitcoin,
	FileText, UserPlus, CreditCard, Wallet, CheckSquare, Plus, Lock
} from "lucide-react"
import Link from "next/link"
import { UserContext, AccountDetailsContext } from "@/server-functions/contexts"

export default function Dashboard() {
	const { accountDetails } = useContext(AccountDetailsContext)
	const { user } = useContext(UserContext)
	const { t, i18n } = useTranslation()
	const [currentCard, setCurrentCard] = useState(0)
	const cardsContainerRef = useRef(null)
	const autoSwitchInterval = 5000 

	const formatAmount = (amount) => {
		const num = parseFloat(amount)
		return isNaN(num) ? "0.00" : num.toFixed(2)
	}

	const maskAcc = (number) => {
		if (!number) return ".... 0000";
		return `.... ${number.slice(-4)}`;
	};

	// 1. Defined Account Data
	const accountCards = [
		{ 
			type: "savings",
			title: t("savings", "SAVINGS"), 
			amount: `$${formatAmount(accountDetails?.savings_balance)}`, 
			acc: maskAcc(accountDetails?.savings_account_number), 
			color: "from-green-800 to-green-950" 
		},
		{ 
			type: "checking",
			title: t("checking", "CHECKING"), 
			amount: `$${formatAmount(accountDetails?.checking_balance)}`, 
			acc: maskAcc(accountDetails?.checking_account_number), 
			color: "from-green-800 to-slate-950" 
		}
	];

	const hasCard = !!accountDetails?.card_details;
	const cardData = accountDetails?.card_details;

	// 2. Carousel Logic
	useEffect(() => {
		if (cardsContainerRef.current) {
			const container = cardsContainerRef.current
			const card = container.children[currentCard]
			if (card) {
				card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
			}
		}
	}, [currentCard])

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentCard(prev => (prev + 1) % 3) // 3 items total
		}, autoSwitchInterval)
		return () => clearInterval(interval)
	}, [])

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

	const langLabels = { en: "🇬🇧 English", fr: "🇫🇷 Français", es: "🇪🇸 Español" }
	const langLabel = langLabels[i18n.language?.split('-')[0]] || i18n.language

	return (
		<div className="w-full bg-slate-50 min-h-screen">
			{/* HEADER SECTION */}
			<header className="p-4 flex justify-between items-center bg-green-900 text-white md:px-8 md:py-6">
				<div className="flex items-center gap-2 text-xs border border-white/20 rounded-full px-4 py-1.5 bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition">
					<span className="uppercase">{langLabel}</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="hidden md:block text-sm font-medium opacity-80">
						{t("welcome", `Welcome back, ${user?.first_name || 'User'}`)}
					</span>
					<div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white/30 shadow-lg flex items-center justify-center">
						{user?.profile_image ? (
							<img src={user.profile_image} alt="Profile" className="object-cover w-full h-full" />
						) : (
							<div className="bg-slate-200 w-full h-full flex items-center justify-center text-slate-500 font-bold">
								{user?.first_name?.[0]}
							</div>
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

					{/* VIRTUAL CARD SLOT */}
					{hasCard ? (
						/* ACTIVE CARD VIEW */
						<Card className={`bg-slate-900 text-white border-none min-w-[95%] md:min-w-full snap-center relative overflow-hidden transition-all ${cardData.status === 'frozen' ? 'opacity-75 grayscale' : ''}`}>
							<CardContent className="p-7">
								<div className="flex justify-between items-start mb-8 relative z-10">
									<div className="h-8 w-12 bg-white/20 rounded-md border border-white/10" />
									<CreditCard className="h-6 w-6 text-white/50" />
								</div>
								<p className="text-xl font-mono tracking-[0.2em] mb-1 relative z-10">
									•••• •••• •••• {cardData.card_number?.slice(-4)}
								</p>
								<div className="flex justify-between items-end relative z-10">
									<div>
										<p className="text-[10px] font-bold text-white/40 uppercase mb-1">{t("virtual_card", "Virtual Card • USD")}</p>
										<p className="text-[10px] font-medium uppercase tracking-tighter">{user?.first_name} {user?.last_name}</p>
									</div>
									<div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-bold uppercase ${cardData.status === 'frozen' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
										<div className={`h-1.5 w-1.5 rounded-full ${cardData.status === 'frozen' ? 'bg-red-500' : 'bg-emerald-400'}`} />
										{cardData.status}
									</div>
								</div>
								<div className="mt-8 relative z-10">
									<Link href="/app/cards">
										<Button size="sm" variant="secondary" className="w-full bg-white/10 hover:bg-white/20 border-none text-white text-[10px] font-bold h-10 rounded-xl">
											{t("manage_card", "MANAGE CARD")}
										</Button>
									</Link>
								</div>
								{/* Decorative blur */}
								<div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
							</CardContent>
						</Card>
					) : (
						/* ISSUE CARD PLACEHOLDER */
						<Card className="bg-white/5 border-2 border-dashed border-white/20 text-white min-w-[95%] md:min-w-full snap-center flex flex-col items-center justify-center p-7 transition-colors hover:bg-white/10">
							<div className="bg-white/10 p-3 rounded-full mb-3">
								<Plus className="text-white/60" size={20} />
							</div>
							<h4 className="font-bold text-sm mb-1">{t("get_card", "Issue Virtual Card")}</h4>
							<p className="text-[9px] text-white/40 text-center mb-6 max-w-[180px]">
								{t("card_promo", "Spend safely online with an instant Visa virtual card.")}
							</p>
							<Link href="/app/cards" className="w-full">
								<Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] h-10 rounded-xl uppercase">
									{t("get_started", "Issue for $5.00")}
								</Button>
							</Link>
						</Card>
					)}
				</div>

				{/* Dots Indicator */}
				<div className="flex justify-center mt-4 gap-2">
					{[0, 1, 2].map((idx) => (
						<button
							key={idx}
							className={`w-2 h-2 rounded-full transition-all duration-200 ${currentCard === idx ? "bg-white w-4" : "bg-white/30"}`}
							onClick={() => setCurrentCard(idx)}
						/>
					))}
				</div>
			</div>

			{/* QUICK ACTIONS GRID */}
			<div className="max-w-4xl mx-auto bg-white rounded-t-[40px] md:rounded-[40px] -mt-8 p-8 md:mt-8 md:shadow-xl border border-gray-100">
				<h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-8 text-center md:text-left">
					{t("quick_services", "Quick Services")}
				</h3>
				<div className="grid grid-cols-3 gap-y-10 gap-x-4">
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

function AccountCard({ title, amount, acc, color, type }) {
	return (
		<Card className={`min-w-[95%] md:min-w-full snap-center bg-gradient-to-br ${color} border-white/10 text-white p-7 shadow-2xl relative overflow-hidden`}>
			<div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
			<p className="text-[10px] tracking-[0.2em] font-bold opacity-50 mb-2">{title}</p>
			<h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8">{amount}</h1>

			<div className="flex justify-between items-end">
				<div>
					<p className="text-[9px] opacity-40 uppercase font-bold mb-1">Account Number</p>
					<p className="font-mono text-sm tracking-widest">{acc}</p>
				</div>
				<Link href={`/app/accounts/${type}`}>
					<Button 
						size="sm" 
						className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold rounded-xl px-4 h-9 backdrop-blur-md transition-all active:scale-95 flex items-center gap-2"
					>
						<div className="w-4 h-4 bg-white text-green-900 rounded-full flex items-center justify-center font-black text-xs">+</div>
						ADD MONEY
					</Button>
				</Link>
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