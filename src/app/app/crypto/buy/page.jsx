'use client'

import { useState, useEffect, useContext, useCallback, useMemo } from "react"
import { AccountDetailsContext } from "@/server-functions/contexts"
import { Button } from "@/components/ui/button"
import { 
    ArrowLeft, 
    Bitcoin, 
    CheckCircle2, 
    ChevronDown, 
    DollarSign, 
    Coins, 
    Zap, 
    Loader2, 
    AlertCircle, 
    RefreshCcw, 
    XCircle,
    Info
} from "lucide-react"
import { TokenETH } from '@web3icons/react'
import Link from "next/link"

// Import the server functions
import { getCryptoRate, processBuyCrypto } from "@/server-functions/buy-crypto"

export default function BuyCryptoPage() {
    const { accountDetails } = useContext(AccountDetailsContext)
    
    // 1. Asset Configuration
    const ASSETS = useMemo(() => [
        { name: "Bitcoin", symbol: "BTC", color: "bg-orange-500", icon: <Bitcoin size={20} />, asset: accountDetails?.btc || 0 },
        { name: "Ethereum", symbol: "ETH", color: "bg-indigo-500", icon: <TokenETH variant="branded" size={20} />, asset: accountDetails?.eth || 0 },
        { name: "Tether", symbol: "USDT", color: "bg-green-500", icon: <DollarSign size={20} />, asset: accountDetails?.usdt || 0 },
        { name: "Litecoin", symbol: "LTC", color: "bg-gray-400", icon: <Coins size={20} />, asset: accountDetails?.ltc || 0 },
        { name: "Solana", symbol: "SOL", color: "bg-purple-600", icon: <Zap size={20} />, asset: accountDetails?.solana || 0 },
    ], [accountDetails]);

    // 2. State Management
    const [status, setStatus] = useState('idle') // 'idle' | 'processing' | 'success' | 'error'
    const [amount, setAmount] = useState("")
    const [selectedAsset, setSelectedAsset] = useState(ASSETS[0])
    const [showAssetList, setShowAssetList] = useState(false)
    const [price, setPrice] = useState(null)
    const [loadingPrice, setLoadingPrice] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    // 3. Price Fetching Logic
    const fetchPrice = useCallback(async () => {
        setLoadingPrice(true)
        const res = await getCryptoRate(selectedAsset.symbol)
        if (res.success && res.rate) {
            setPrice(res.rate)
        }
        setLoadingPrice(false)
    }, [selectedAsset])

    useEffect(() => {
        fetchPrice()
        const interval = setInterval(fetchPrice, 15000)
        return () => clearInterval(interval)
    }, [fetchPrice])

    // 4. Transaction Handler
    const handlePurchase = async () => {
        const numAmount = parseFloat(amount)
        const totalToPay = numAmount + 0.99 // Including the $0.99 fee

        // Local Validation
        if (!numAmount || numAmount <= 0) {
            setErrorMessage("Please enter a valid amount.")
            return
        }

        if (totalToPay > (accountDetails?.savings_balance || 0)) {
            setErrorMessage("Insufficient funds in your USD Savings.")
            return
        }

        setStatus('processing')
        setErrorMessage("")

        try {
            const formData = new FormData()
            formData.append('amount', amount)
            formData.append('asset', selectedAsset.symbol)

            const res = await processBuyCrypto(formData)

            if (res.success) {
                setStatus('success')
            } else {
                setErrorMessage(res.error || "Transaction declined by bank.")
                setStatus('error')
            }
        } catch (err) {
            setErrorMessage("Connection lost. Please check your internet.")
            setStatus('error')
        }
    }

    // 5. Conditional Rendering for States
    if (status === 'success') return <SuccessState asset={selectedAsset} amount={amount} price={price} />
    if (status === 'error') return <ErrorState message={errorMessage} onRetry={() => setStatus('idle')} />

    return (
        <div className="min-h-screen bg-slate-50 pb-10">
            {/* Header */}
            <div className="bg-green-900 p-6 text-white flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <Link href="/app"><ArrowLeft size={24} /></Link>
                    <h1 className="text-xl font-bold">Buy Crypto</h1>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Info size={20} className="text-white/60" />
                </div>
            </div>

            <div className="max-w-md mx-auto p-6 space-y-6">
                {/* Asset Selector */}
                <div className="relative">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Cryptocurrency</label>
                    <div
                        className="bg-white border border-slate-200 p-5 rounded-[24px] flex justify-between items-center cursor-pointer shadow-sm hover:border-green-800 transition-all active:scale-[0.98]"
                        onClick={() => setShowAssetList(!showAssetList)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${selectedAsset.color} rounded-full flex items-center justify-center text-white shadow-inner`}>
                                {selectedAsset.icon}
                            </div>
                            <div>
                                <p className="font-extrabold text-slate-900">{selectedAsset.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                    Balance: {parseFloat(selectedAsset.asset).toFixed(6)} {selectedAsset.symbol}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`text-slate-300 transition-transform duration-300 ${showAssetList ? 'rotate-180' : ''}`} />
                    </div>

                    {showAssetList && (
                        <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-[28px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            {ASSETS.map(asset => (
                                <div
                                    key={asset.symbol}
                                    className={`flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${asset.symbol === selectedAsset.symbol ? "bg-green-50/50" : ""}`}
                                    onClick={() => { setSelectedAsset(asset); setShowAssetList(false); }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 ${asset.color} rounded-full flex items-center justify-center text-white scale-90`}>{asset.icon}</div>
                                        <span className="font-bold text-sm text-slate-900">{asset.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300">{asset.symbol}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amount Input Card */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm text-center relative overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Buy Amount (USD)</p>
                    <div className="relative inline-block">
                        <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-3xl font-bold text-green-900/30">$</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value)
                                if(errorMessage) setErrorMessage("")
                            }}
                            placeholder="0.00"
                            className="bg-transparent text-center text-6xl font-black text-green-900 outline-none w-full max-w-[240px] placeholder:text-slate-100"
                        />
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-1">
                        {loadingPrice ? (
                            <div className="flex items-center gap-2 text-slate-300 text-[10px] font-bold animate-pulse uppercase tracking-widest">
                                <Loader2 size={12} className="animate-spin" /> Updating Market Price
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 font-bold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                1 {selectedAsset.symbol} = ${price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        )}
                        <p className="text-[11px] font-bold text-green-700 mt-2">
                            You receive ≈ { (price && amount) ? (parseFloat(amount) / price).toFixed(8) : "0.00000000" } {selectedAsset.symbol}
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center justify-center gap-2 animate-in slide-in-from-top-1">
                            <AlertCircle size={14} />
                            <span className="text-[11px] font-bold">{errorMessage}</span>
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                <div className="space-y-3">
                    <div className="bg-slate-100/50 p-5 rounded-[24px] border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-400">Payment Source</span>
                            <span className="text-slate-900">USD Savings Account</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-400">Network Fee</span>
                            <span className="text-slate-900">$0.99</span>
                        </div>
                        <div className="h-px bg-slate-200" />
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500">Total Charged</span>
                            <span className="text-lg font-black text-green-900">
                                ${ (parseFloat(amount || 0) + 0.99).toFixed(2) }
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handlePurchase}
                    disabled={!amount || parseFloat(amount) <= 0 || !price || status === 'processing'}
                    className="w-full h-18 bg-green-900 hover:bg-green-800 text-white rounded-[24px] text-lg font-bold shadow-2xl shadow-green-900/30 transition-all active:scale-95 disabled:opacity-50"
                >
                    {status === 'processing' ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="animate-spin" />
                            <span>Processing...</span>
                        </div>
                    ) : (
                        "Confirm Purchase"
                    )}
                </Button>

                <p className="text-[10px] text-center text-slate-400 font-medium px-6">
                    By confirming, you agree to the instantaneous exchange of USD for digital assets at the current market rate.
                </p>
            </div>
        </div>
    )
}

// 6. Full Screen States
function SuccessState({ asset, amount, price }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-8 bg-white animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle2 size={56} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Success!</h2>
                <p className="text-slate-500 max-w-[280px] mx-auto text-sm font-medium leading-relaxed">
                    Your {asset.name} has been purchased and added to your secure wallet.
                </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[40px] w-full max-w-xs border border-slate-100 shadow-sm">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Total Received</p>
                <p className="text-4xl font-black text-green-900">
                    { (parseFloat(amount) / price).toFixed(8) }
                </p>
                <p className="text-xs font-bold text-green-700 mt-1">{asset.symbol}</p>
            </div>
            <Link href="/app" className="w-full max-w-xs pt-4">
                <Button className="w-full h-16 bg-green-900 text-white rounded-[24px] font-bold text-lg shadow-xl shadow-green-900/20">
                    Back to Wallet
                </Button>
            </Link>
        </div>
    )
}

function ErrorState({ message, onRetry }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-8 bg-white animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <XCircle size={56} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Transaction Failed</h2>
                <p className="text-slate-500 text-sm font-medium px-4 leading-relaxed">
                    {message || "An unexpected error occurred. Please verify your account balance and try again."}
                </p>
            </div>
            <div className="flex flex-col w-full max-w-xs gap-4">
                <Button 
                    onClick={onRetry} 
                    className="h-16 bg-slate-900 text-white rounded-[24px] font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl"
                >
                    <RefreshCcw size={20} /> Try Again
                </Button>
                <Link href="/app" className="w-full">
                    <Button variant="ghost" className="w-full h-12 text-slate-400 font-bold hover:text-slate-600">
                        Cancel Transaction
                    </Button>
                </Link>
            </div>
        </div>
    )
}