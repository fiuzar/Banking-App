'use client'
import { useState } from 'react'
import { createFlexibleRequestLink } from '@/server-functions/stripe'
import { Button } from '@/components/ui/button'
import { Copy, Share2, Check, Globe } from 'lucide-react'

export default function RequestMoneyOpen() {
    const [link, setLink] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const generateOpenLink = async () => {
        setLoading(true)
        const res = await createFlexibleRequestLink("Account Deposit", "checking")
        if (res.url) setLink(res.url)
        setLoading(false)
    }

    return (
        <div className="p-8 bg-white rounded-[40px] shadow-2xl max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-800 rounded-full flex items-center justify-center mx-auto">
                <Globe size={32} />
            </div>
            
            <div>
                <h2 className="text-2xl font-black text-slate-900">Open Payment Link</h2>
                <p className="text-sm text-slate-500 mt-1">
                    The person paying can choose any amount they wish to send.
                </p>
            </div>

            {!link ? (
                <Button 
                    onClick={generateOpenLink} 
                    disabled={loading}
                    className="w-full h-16 bg-green-900 text-white font-bold rounded-3xl"
                >
                    {loading ? "Generating..." : "Create Shareable Link"}
                </Button>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 break-all text-[11px] font-mono text-slate-600">
                        {link}
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => {
                                navigator.clipboard.writeText(link);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }} 
                            variant="outline" 
                            className="flex-1 h-14 rounded-2xl border-slate-200"
                        >
                            {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                        </Button>
                        <Button className="flex-[2] h-14 bg-green-900 rounded-2xl gap-2 font-bold text-white">
                            <Share2 size={20} /> Share Link
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}