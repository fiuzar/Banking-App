'use client'

import { useState, useEffect, useContext, useCallback , useMemo} from "react"
import { AccountDetailsContext, UserContext } from "@/server-functions/contexts"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bitcoin, CheckCircle2, ChevronDown, Info, DollarSign, Coins, Zap } from "lucide-react"
import { TokenETH } from '@web3icons/react';
import Link from "next/link"

import {getCryptoRate} from "@/server-functions/buy-crypto"

export default function BuyCryptoPage() {
	const { accountDetails } = useContext(AccountDetailsContext)
    
    // 1. Move ASSETS into a useMemo so it updates when accountDetails changes
    const ASSETS = useMemo(() => [
        { name: "Bitcoin", symbol: "BTC", color: "bg-orange-500", icon: <Bitcoin size={20} />, coingeckoId: "bitcoin", asset: accountDetails?.bitcoin || 0 },
        { name: "Ethereum", symbol: "ETH", color: "bg-indigo-500", icon: <TokenETH variant="branded" size={20} />, coingeckoId: "ethereum", asset: accountDetails?.ethereum || 0 },
        { name: "Tether", symbol: "USDT", color: "bg-green-500", icon: <DollarSign size={20} />, coingeckoId: "tether", asset: accountDetails?.usdt || 0 },
        { name: "Litecoin", symbol: "LTC", color: "bg-gray-400", icon: <Coins size={20} />, coingeckoId: "litecoin", asset: accountDetails?.litecoin || 0 },
        { name: "Solana", symbol: "SOL", color: "bg-purple-600", icon: <Zap size={20} />, coingeckoId: "solana", asset: accountDetails?.solana || 0 },
    ], [accountDetails]);

    const [amount, setAmount] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState(ASSETS[2]) // Default USDT
    const [showAssetList, setShowAssetList] = useState(false)
    const [price, setPrice] = useState(null)
    const [loadingPrice, setLoadingPrice] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

	// FETCH PRICE FROM CRYPTOMUS VIA YOUR BACKEND
	const fetchCryptomusPrice = useCallback(async () => {
    setLoadingPrice(true)
    
    // Call the server function directly
    const res = await getCryptoRate(selectedAsset.symbol)

    if (res.success && res.rate) {
        setPrice(res.rate)
    } else {
        console.error("Rate fetch failed:", res.error)
    }
    
    setLoadingPrice(false)
}, [selectedAsset])

	useEffect(() => {
		fetchCryptomusPrice()
		const interval = setInterval(fetchCryptomusPrice, 15000) // 15s is standard for crypto volatility
		return () => clearInterval(interval)
	}, [fetchCryptomusPrice])

	const handlePurchase = async () => {
		setIsProcessing(true)
		// 1. Check if balance is sufficient
		const totalToPay = parseFloat(amount) + 0.99
		if (totalToPay > accountDetails.savings_balance) {
			alert("Insufficient funds in USD Savings")
			setIsProcessing(false)
			return
		}

		// 2. Call your Python Backend (main.py)
		// Pass the current 'price' as a 'quote_id' or 'locked_price'
		const res = await fetch('/api/crypto/buy', {
			method: 'POST',
			body: JSON.stringify({
				asset: selectedAsset.symbol,
				amount: amount,
				lockedPrice: price
			})
		})

		if (res.ok) setIsSuccess(true)
		setIsProcessing(false)
	}

	if (isSuccess) return <SuccessState asset={selectedAsset} amount={amount} price={price} />

	return (
        <div className="min-h-screen bg-slate-50 pb-10">
            {/* Header */}
            <div className="bg-green-900 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/app"><ArrowLeft size={24} /></Link>
                    <h1 className="text-xl font-bold">Buy Crypto</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto p-6 space-y-8">
                {/* Asset Selector */}
                <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Select Asset</label>
                    <div
                        className="bg-white border border-slate-100 p-4 rounded-[24px] flex justify-between items-center cursor-pointer shadow-sm"
                        onClick={() => setShowAssetList(!showAssetList)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${selectedAsset.color} rounded-full flex items-center justify-center text-white`}>
                                {selectedAsset.icon}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{selectedAsset.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">
                                    Balance: {parseFloat(selectedAsset.asset).toFixed(4)} {selectedAsset.symbol}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className="text-slate-300" />
                    </div>

                    {showAssetList && (
                        <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-100 rounded-[24px] shadow-xl z-30 overflow-hidden">
                            {ASSETS.map(asset => (
                                <div
                                    key={asset.symbol}
                                    className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${asset.symbol === selectedAsset.symbol ? "bg-slate-50" : ""}`}
                                    onClick={() => { setSelectedAsset(asset); setShowAssetList(false); }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 ${asset.color} rounded-full flex items-center justify-center text-white`}>
                                            {asset.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{asset.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold">{asset.symbol}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-900">{parseFloat(asset.asset).toFixed(4)}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Current Hold</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

				{/* Input Section */}
				<div className="text-center space-y-4 py-6">
					<p className="text-meta font-bold uppercase tracking-[0.2em]">Enter USD Amount</p>
					<div className="relative">
						<span className="absolute left-1/2 -translate-x-[110px] top-1/2 -translate-y-1/2 text-3xl font-bold text-primary">$</span>
						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0.00"
							className="w-full bg-transparent text-center balance-xl text-primary outline-none py-4 border-b-2 border-n-100 focus:border-primary transition-colors"
						/>
					</div>
					<p className="text-xs text-n-500 font-medium">
						You will receive:{" "}
						<span className="text-brand-dark font-bold">
							{price && amount ? (parseFloat(amount) / price).toFixed(6) : "0.000000"} {selectedAsset.symbol}
						</span>
					</p>
				</div>

				{/* Payment Source */}
				<div className="space-y-3">
					<p className="text-[10px] font-bold text-n-500 uppercase tracking-widest ml-1">Pay with</p>
					<div className="bg-secondary p-4 rounded-brand-card flex justify-between items-center border border-border">
						<div>
							<p className="text-sm font-bold text-brand-dark">USD Savings</p>
							<p className="text-[10px] text-n-500">Balance: ${parseFloat(accountDetails.savings_balance)}</p>
						</div>
						<div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
					</div>
				</div>

				{/* Summary */}
				<div className="bg-n-100/50 p-5 rounded-brand-card border border-n-100 space-y-3">
					<div className="flex justify-between text-xs font-medium">
						<span className="text-n-500 uppercase">Network Fee</span>
						<span className="font-bold">$0.99</span>
					</div>
					<div className="flex justify-between text-xs font-medium">
						<span className="text-n-500 uppercase">Total to Pay</span>
						<span className="font-bold text-brand-dark">
							${(parseFloat(amount || "0") + 0.99).toFixed(2)}
						</span>
					</div>
				</div>

				<Button
					onClick={handlePurchase}
					disabled={!amount || parseFloat(amount) <= 0 || !price}
					className="btn-primary w-full h-14 text-lg shadow-xl shadow-primary/20"
				>
					Confirm Purchase
				</Button>
			</div>
		</div>
	)
}

function SuccessState({ asset, amount, price }) {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in zoom-in-95">
			<div className="w-24 h-24 bg-bank-success/20 text-bank-success rounded-full flex items-center justify-center">
				<CheckCircle2 size={56} strokeWidth={3} />
			</div>
			<div>
				<h2 className="text-3xl font-black text-brand-dark">Purchase Success!</h2>
				<p className="text-n-500 mt-2 max-w-[280px] mx-auto">
					You've successfully purchased {asset.symbol} using your USD Savings account.
				</p>
			</div>
			<div className="bg-secondary p-6 rounded-brand-card w-full max-w-xs border border-border">
				<p className="text-meta uppercase font-bold tracking-widest mb-1">Asset Received</p>
				<p className="balance-md text-primary">
					{price && amount ? (parseFloat(amount) / price).toFixed(6) : "0.000000"} {asset.symbol}
				</p>
			</div>
			<Link href="/app" className="w-full max-w-xs">
				<Button variant="outline" className="w-full h-12 border-primary text-primary font-bold">Return to Wallet</Button>
			</Link>
		</div>
	)
}