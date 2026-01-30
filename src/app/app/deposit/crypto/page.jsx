'use client'

import { useState } from 'react'
import { ArrowLeft, Copy, Check, QrCode, ShieldCheck, Info, ChevronRight } from 'lucide-react'
import { TokenETH, TokenBTC, TokenUSDT, TokenSOL, TokenLTC } from '@web3icons/react'
import Link from 'next/link'
import { generateStaticWallet } from '@/server-functions/buy-crypto'

const COINS = [
    { name: "Bitcoin", symbol: "BTC", network: "BTC", icon: <TokenBTC variant="branded" size={32} />, color: "bg-orange-500" },
    { name: "Ethereum", symbol: "ETH", network: "ETH", icon: <TokenETH variant="branded" size={32} />, color: "bg-indigo-500" },
    { name: "Tether", symbol: "USDT", network: "ETH", icon: <TokenUSDT variant="branded" size={32} />, color: "bg-green-500" },
    { name: "Litecoin", symbol: "LTC", network: "LTC", icon: <TokenLTC variant="branded" size={32} />, color: "bg-gray-400" },
    { name: "Solana", symbol: "SOL", network: "SOL", icon: <TokenSOL variant="branded" size={32} />, color: "bg-purple-600" },
]

export default function CryptoDeposit() {
    const [selectedCoin, setSelectedCoin] = useState(null)
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleSelectCoin = async (coin) => {
        setSelectedCoin(coin)
        setLoading(true)
        const res = await generateStaticWallet(coin.symbol, coin.network)
        if (res.result?.address) {
            setAddress(res.result.address)
        }
        setLoading(false)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-10">
            {/* Header - Back to Green-900 */}
            <div className="bg-green-900 pt-8 pb-24 px-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="flex items-center gap-4 relative z-10">
                    <Link href="/app" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">Deposit Crypto</h1>
                </div>
            </div>

            <div className="px-6 -mt-12 max-w-md mx-auto relative z-20">
                {!selectedCoin ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-4 rounded-[32px] shadow-sm border border-slate-100">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Choose an asset to deposit</p>
                             
                             {/* Added gap and padding to prevent overlapping */}
                             <div className="flex flex-col gap-3">
                                {COINS.map((coin) => (
                                    <button
                                        key={coin.symbol}
                                        onClick={() => handleSelectCoin(coin)}
                                        className="w-full bg-slate-50/50 p-4 rounded-[24px] border border-transparent hover:border-green-800 hover:bg-white transition-all active:scale-[0.98] flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white p-2 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                                                {coin.icon}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-900">{coin.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                                    Network: <span className="text-green-700">{coin.network}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-green-800 transition-colors" />
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 text-center space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <button onClick={() => {setSelectedCoin(null); setAddress('');}} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-green-800 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secure {selectedCoin.symbol} Wallet</span>
                            <div className="w-9" /> {/* Spacer for centering */}
                        </div>

                        {loading ? (
                            <div className="py-16 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-slate-100 border-t-green-800 rounded-full animate-spin" />
                                <p className="text-xs font-bold text-slate-400 animate-pulse">Assigning unique address...</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-slate-50 p-6 rounded-[32px] inline-block border-2 border-dashed border-slate-200">
                                    {/* Using a placeholder for QR - you can use 'qrcode.react' here */}
                                    <div className="bg-white p-4 rounded-2xl shadow-inner">
                                        <QrCode size={160} className="text-slate-900 mx-auto" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div 
                                        onClick={copyToClipboard}
                                        className="bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50/50 hover:border-green-200 transition-all group relative overflow-hidden"
                                    >
                                        <code className="text-[12px] font-bold text-slate-800 break-all leading-tight">
                                            {address || 'Error fetching address'}
                                        </code>
                                        <div className="mt-2 flex items-center gap-1.5 text-green-700">
                                            {copied ? (
                                                <><Check size={14} className="font-bold" /> <span className="text-[10px] font-black uppercase">Copied!</span></>
                                            ) : (
                                                <><Copy size={14} /> <span className="text-[10px] font-black uppercase">Click to copy</span></>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-2xl border border-red-100">
                                        <Info size={14} className="text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-[9px] text-red-600 font-bold text-left leading-tight">
                                            WARNING: Sending assets via networks other than {selectedCoin.network} will result in permanent loss.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        onClick={() => setSelectedCoin(null)}
                                        className="w-full py-4 rounded-2xl text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
                                    >
                                        Deposit a different coin
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption</span>
                    </div>
                    <p className="text-[9px] text-slate-400 text-center px-8 leading-relaxed">
                        Funds will reflect in your balance after network confirmations. This usually takes 5-30 minutes depending on network traffic.
                    </p>
                </div>
            </div>
        </div>
    )
}