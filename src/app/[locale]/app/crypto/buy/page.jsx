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
    XCircle,
    Wallet
} from "lucide-react"
import { TokenETH } from '@web3icons/react'
import Link from "next/link"
import { getCryptoRate, processCryptoTrade } from "@/server-functions/buy-crypto"
import { useLanguage } from "@/messages/LanguageProvider"

export default function BuyCryptoPage() {
    const { t } = useLanguage()
    const { accountDetails, setAccountDetails } = useContext(AccountDetailsContext)
    
    const ASSETS = useMemo(() => [
        { name: "Bitcoin", symbol: "BTC", color: "bg-orange-500", minUsd: 10, icon: <Bitcoin size={20} />, balance: accountDetails?.bitcoin || 0 },
        { name: "Ethereum", symbol: "ETH", color: "bg-indigo-500", minUsd: 10, icon: <TokenETH variant="branded" size={20} />, balance: accountDetails?.ethereum || 0 },
        { name: "Tether", symbol: "USDT", color: "bg-green-500", minUsd: 5, icon: <DollarSign size={20} />, balance: accountDetails?.usdt || 0 },
        { name: "Litecoin", symbol: "LTC", color: "bg-gray-400", minUsd: 2, icon: <Coins size={20} />, balance: accountDetails?.litecoin || 0 },
        { name: "Solana", symbol: "SOL", color: "bg-purple-600", minUsd: 5, icon: <Zap size={20} />, balance: accountDetails?.solana || 0 },
    ], [accountDetails])

    const [mode, setMode] = useState<'buy' | 'sell'>('buy')
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
    const [amount, setAmount] = useState("")
    const [selectedAsset, setSelectedAsset] = useState(ASSETS[0])
    const [showAssetList, setShowAssetList] = useState(false)
    const [price, setPrice] = useState<number | null>(null)
    const [loadingPrice, setLoadingPrice] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const savingsBalance = parseFloat(accountDetails?.savings_balance || 0)

    const fetchPrice = useCallback(async () => {
        setLoadingPrice(true)
        const res = await getCryptoRate(selectedAsset.symbol)
        if (res.success && res.rate) setPrice(res.rate)
        setLoadingPrice(false)
    }, [selectedAsset])

    useEffect(() => {
        fetchPrice()
        const interval = setInterval(fetchPrice, 15000)
        return () => clearInterval(interval)
    }, [fetchPrice])

    const handleTransaction = async () => {
        const numAmount = parseFloat(amount)
        if (!numAmount || numAmount <= 0) {
            setErrorMessage(t("CryptoTrade", "errors.invalidAmount"))
            return
        }

        if (numAmount < selectedAsset.minUsd) {
            setErrorMessage(t("CryptoTrade", "errors.minTrade")
                .replace("{{name}}", selectedAsset.name)
                .replace("{{amount}}", `$${selectedAsset.minUsd}`))
            return
        }

        const fee = 0.99
        if (mode === 'buy' && (numAmount + fee) > savingsBalance) {
            setErrorMessage(t("CryptoTrade", "errors.insufficientSavings"))
            return
        }

        const cryptoToSell = numAmount / (price || 1)
        if (mode === 'sell' && cryptoToSell > parseFloat(selectedAsset.balance)) {
            setErrorMessage(t("CryptoTrade", "errors.insufficientCrypto").replace("{{symbol}}", selectedAsset.symbol))
            return
        }

        setStatus('processing')
        setErrorMessage("")

        try {
            const formData = new FormData()
            formData.append('amount', amount)
            formData.append('asset', selectedAsset.symbol)
            formData.append('mode', mode)

            const res = await processCryptoTrade(formData)
            if (res.success) {
                setAccountDetails(res.updatedData)
                setStatus('success')
            } else {
                setErrorMessage(res.error || t("CryptoTrade", "errors.declined"))
                setStatus('error')
            }
        } catch {
            setErrorMessage(t("CryptoTrade", "errors.connection"))
            setStatus('error')
        }
    }

    if (status === 'success') return <SuccessState t={t} mode={mode} asset={selectedAsset} amount={amount} price={price} />
    if (status === 'error') return <ErrorState t={t} message={errorMessage} onRetry={() => setStatus('idle')} />

    return (
        <div className="min-h-screen bg-slate-50 pb-10">
            {/* Header */}
            <div className="bg-green-900 p-8 pt-12 text-white rounded-b-[40px] shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/app" className="p-2 bg-white/10 rounded-full"><ArrowLeft size={20}/></Link>
                    <div className="bg-white/10 px-4 py-1 rounded-full flex items-center gap-2">
                        <Wallet size={14} className="text-green-400" />
                        <span className="text-xs font-bold uppercase tracking-widest">
                            {t("CryptoTrade", "header.savingsLabel")} ${savingsBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
                <h1 className="text-2xl font-black">{t("CryptoTrade", "header.title")}</h1>
                <p className="text-white/60 text-xs">{t("CryptoTrade", "header.subtitle")}</p>
            </div>

            <div className="max-w-md mx-auto p-6 -mt-8 space-y-4">
                {/* Buy/Sell Toggle */}
                <div className="bg-white p-1 rounded-2xl flex shadow-sm border border-slate-200">
                    <button
                        onClick={() => { setMode('buy'); setAmount(""); }}
                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${mode === 'buy' ? 'bg-green-900 text-white shadow-md' : 'text-slate-400'}`}
                    >
                        {t("CryptoTrade", "toggle.buy")}
                    </button>
                    <button
                        onClick={() => { setMode('sell'); setAmount(""); }}
                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${mode === 'sell' ? 'bg-green-900 text-white shadow-md' : 'text-slate-400'}`}
                    >
                        {t("CryptoTrade", "toggle.sell")}
                    </button>
                </div>

                {/* Asset Selector */}
                <div className="relative">
                    <div
                        className="bg-white border border-slate-200 p-5 rounded-[24px] flex justify-between items-center cursor-pointer shadow-sm"
                        onClick={() => setShowAssetList(!showAssetList)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${selectedAsset.color} rounded-full flex items-center justify-center text-white`}>{selectedAsset.icon}</div>
                            <div>
                                <p className="font-extrabold text-slate-900">{selectedAsset.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">
                                    {t("CryptoTrade", "assetSelector.balanceLabel").replace("{{symbol}}", selectedAsset.symbol)} {parseFloat(selectedAsset.balance).toFixed(6)}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`text-slate-300 transition-transform ${showAssetList ? 'rotate-180' : ''}`} />
                    </div>

                    {showAssetList && (
                        <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-[28px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            {ASSETS.map(asset => (
                                <div
                                    key={asset.symbol}
                                    className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50 border-b border-slate-50 last:border-none"
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

                {/* Amount Input */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-xl text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        {mode === 'buy' ? t("CryptoTrade", "input.spendLabel") : t("CryptoTrade", "input.receiveLabel")}
                    </p>
                    <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-green-900/30 mr-2">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => { setAmount(e.target.value); setErrorMessage(""); }}
                            placeholder={t("CryptoTrade", "input.placeholder")}
                            className="bg-transparent text-center text-6xl font-black text-green-900 outline-none w-full max-w-[200px] placeholder:text-slate-100"
                        />
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-2">
                        {loadingPrice ? (
                            <Loader2 size={16} className="animate-spin text-slate-300" />
                        ) : (
                            <p className="text-xs text-slate-500 font-bold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                {t("CryptoTrade", "input.rateLabel")
                                    .replace("{{symbol}}", selectedAsset.symbol)
                                    .replace("{{rate}}", price?.toFixed(2) || "0.00")}
                            </p>
                        )}
                        <p className="text-[11px] font-black text-green-700">
                            {t("CryptoTrade", `input.estimation.${mode}`)
                                .replace("{{amount}}", price && amount ? (parseFloat(amount) / price).toFixed(8) : "0.00000000")
                                .replace("{{symbol}}", selectedAsset.symbol)
                            }
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2 animate-in slide-in-from-top-1">
                            <AlertCircle size={14} />
                            <span className="text-[11px] font-bold">{errorMessage}</span>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="bg-slate-100/50 p-5 rounded-[24px] border border-slate-100 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                        <span>{t("CryptoTrade", "summary.marketPrice")}</span>
                        <span className="text-slate-900">${price?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                        <span>{t("CryptoTrade", "summary.fee")}</span>
                        <span className="text-slate-900">$0.99</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-xs font-bold text-slate-500">
                            {mode === 'buy' ? t("CryptoTrade", "summary.totalPay") : t("CryptoTrade", "summary.totalReceive")}
                        </span>
                        <span className={`text-xl font-black ${mode === 'buy' ? 'text-red-600' : 'text-green-900'}`}>
                            ${mode === 'buy' ? (parseFloat(amount || 0) + 0.99).toFixed(2) : (parseFloat(amount || 0) - 0.99).toFixed(2)}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={handleTransaction}
                    disabled={!amount || !price || status === 'processing'}
                    className="w-full h-16 bg-green-900 hover:bg-green-800 text-white rounded-[24px] text-lg font-black shadow-xl"
                >
                    {status === 'processing' ? t("CryptoTrade", "actions.processing") : t("CryptoTrade", "actions.confirm").replace("{{mode}}", mode.toUpperCase())}
                </Button>
            </div>
        </div>
    )
}

function SuccessState({ t, mode, asset, amount, price }) {
    const cryptoAmount = (parseFloat(amount) / price).toFixed(8)
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
            <div className="w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={56} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">{t("CryptoTrade", "success.title")}</h2>
            <p className="text-slate-500 text-sm mb-8">
                {mode === 'buy' 
                    ? t("CryptoTrade", "success.buyDescription").replace("{{amount}}", cryptoAmount).replace("{{symbol}}", asset.symbol)
                    : t("CryptoTrade", "success.sellDescription").replace("{{amount}}", cryptoAmount).replace("{{symbol}}", asset.symbol)
                }
            </p>
            <Link href="/app" className="w-full max-w-xs">
                <Button className="w-full h-16 bg-green-900 text-white rounded-[24px] font-bold">
                    {t("CryptoTrade", "success.action")}
                </Button>
            </Link>
        </div>
    )
}

function ErrorState({ t, message, onRetry }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <XCircle size={56} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Failed</h2>
            <p className="text-slate-500 text-sm mb-8">{message}</p>
            <Button onClick={onRetry} className="w-full max-w-xs h-16 bg-slate-900 text-white rounded-[24px] font-bold">Try Again</Button>
        </div>
    )
}
