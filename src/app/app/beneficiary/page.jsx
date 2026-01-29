'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus, Globe, Landmark } from "lucide-react"
import Link from "next/link"
import { addBeneficiaryAction } from "@/server-functions/beneficiaries"

// Simple modal for error messages
function ErrorModal({ open, message, onClose }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 max-w-xs w-full shadow-lg text-center">
                <div className="mb-4 text-red-600 font-bold text-lg">Error</div>
                <div className="mb-6 text-n-700">{message}</div>
                <Button onClick={onClose} className="w-full">Close</Button>
            </div>
        </div>
    )
}

export default function AddBeneficiary() {
    const [type, setType] = useState('local') // 'local' or 'international'
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        fullName: '',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        swiftCode: '',
        nickname: ''
    })

    const handleSubmit = async () => {
        if (!formData.fullName || !formData.accountNumber) {
            setError("Please fill in required fields")
            return
        }
        
        setLoading(true)
        const res = await addBeneficiaryAction({ ...formData, type })
        setLoading(false)

        if (res.success) {
            setIsSuccess(true)
        } else {
            setError(res.error)
        }
    }

    if (isSuccess) return <SuccessState />

    return (
        <div className="min-h-screen bg-background">
            {/* Error Modal */}
            <ErrorModal open={!!error} message={error} onClose={() => setError(null)} />

            <div className="bg-primary p-6 text-white flex items-center gap-4">
                <Link href="/app"><ArrowLeft size={24} /></Link>
                <h1 className="text-xl font-bold">Add Beneficiary</h1>
            </div>

            <div className="max-w-md mx-auto p-6 space-y-6">
                {/* Switcher */}
                <div className="flex p-1 bg-secondary rounded-xl border border-border">
                    <button 
                        onClick={() => setType('local')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${type === 'local' ? 'bg-white text-primary shadow-sm' : 'text-n-500'}`}
                    >
                        <Landmark size={16} /> Local
                    </button>
                    <button 
                        onClick={() => setType('international')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${type === 'international' ? 'bg-white text-primary shadow-sm' : 'text-n-500'}`}
                    >
                        <Globe size={16} /> International
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold uppercase text-n-500">Full Name</Label>
                        <Input 
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            placeholder="Recipient Legal Name" 
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold uppercase text-n-500">Bank Name</Label>
                        <Input 
                            value={formData.bankName}
                            onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                            placeholder="e.g. JPMorgan Chase" 
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold uppercase text-n-500">Account Number</Label>
                        <Input 
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                            placeholder="Enter Account Number" 
                        />
                    </div>

                    {type === 'local' ? (
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-bold uppercase text-n-500">Routing Number (ABA)</Label>
                            <Input 
                                value={formData.routingNumber}
                                onChange={(e) => setFormData({...formData, routingNumber: e.target.value})}
                                placeholder="9 Digits" 
                            />
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-bold uppercase text-n-500">SWIFT / BIC Code</Label>
                            <Input 
                                value={formData.swiftCode}
                                onChange={(e) => setFormData({...formData, swiftCode: e.target.value})}
                                placeholder="8-11 Characters" 
                            />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold uppercase text-n-500">Nickname (Optional)</Label>
                        <Input 
                            value={formData.nickname}
                            onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                            placeholder="e.g. My Savings" 
                        />
                    </div>
                </div>

                <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="btn-primary w-full h-14 text-lg"
                >
                    {loading ? "Saving..." : "Save Beneficiary"}
                </Button>
            </div>
        </div>
    )
}

function SuccessState() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <UserPlus size={40} />
            </div>
            <h2 className="text-2xl font-black text-brand-dark">Beneficiary Added</h2>
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <Link href="/app/transfer/wire"><Button className="btn-primary w-full h-12">Send Money Now</Button></Link>
                <Link href="/app"><Button variant="ghost" className="w-full">Return Home</Button></Link>
            </div>
        </div>
    )
}