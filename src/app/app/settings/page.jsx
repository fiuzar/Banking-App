'use client'

import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/server-functions/contexts"
import { Button } from "@/components/ui/button"
import {
    ShieldCheck, LogOut, ChevronRight,
    Camera, Mail, Smartphone, BadgeCheck, AlertCircle, ArrowLeft,
    Lock, Loader2, User, Edit2, XCircle, RefreshCw
} from "lucide-react"
import Link from "next/link"
import { UserProfileSettings } from "@/components/app/user_setings"
import { signOut } from "next-auth/react"
import { create_otp, finalizePinSetup, toggle2FA } from "@/server-functions/authentication"

export default function AccountManagement() {
    const { user, setUser } = useContext(UserContext)
    
    // UI States
    const [isEditing, setIsEditing] = useState(false)
    const [isPinModalOpen, setIsPinModalOpen] = useState(false)
    const [errorModal, setErrorModal] = useState({ show: false, message: "" })
    
    // Security Action States
    const [step, setStep] = useState(1) 
    const [loading, setLoading] = useState(false)
    const [loading2FA, setLoading2FA] = useState(false)
    const [pinStatus, setPinStatus] = useState(null)
    const [otpCode, setOtpCode] = useState("")

    // Location States
    const [country, setCountry] = useState(null)
    const [countryFlag, setCountryFlag] = useState(null)

    const kycStatus = user?.kyc_status || 'unverified';

    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                setCountry(data.country_name)
                setCountryFlag(data.country_code ? countryCodeToFlag(data.country_code) : null)
            }).catch(() => null)
    }, [])

    function countryCodeToFlag(code) {
        return code.toUpperCase().replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()))
    }

    async function handleStartPinSetup() {
        setLoading(true)
        setPinStatus(null)
        const res = await create_otp(user.email, 'pin_setup') 
        setLoading(false)
        if (res.success) {
            setStep(1)
            setIsPinModalOpen(true)
        } else {
            setErrorModal({ show: true, message: res.error || "We couldn't send the code." })
        }
    }

    async function handleToggle2FA() {
        setLoading2FA(true)
        const res = await toggle2FA(user.id, user.two_fa_enabled)
        setLoading2FA(false)
        
        if (res.success) {
            setUser({ ...user, two_fa_enabled: res.newState })
        } else {
            setErrorModal({ show: true, message: res.error || "Failed to update 2FA." })
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* 1. ERROR MODAL */}
            {errorModal.show && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-900 mb-2">Security Alert</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{errorModal.message}</p>
                        <Button 
                            onClick={() => setErrorModal({ show: false, message: "" })}
                            className="w-full h-12 rounded-2xl bg-slate-900 font-bold"
                        >
                            Got it
                        </Button>
                    </div>
                </div>
            )}

            {/* Profile Header */}
            <div className="bg-primary pt-12 pb-20 px-6 text-white text-center relative">
                <Link href="/app" className="absolute left-6 top-6 transition-transform active:scale-90">
                    <ArrowLeft size={24} />
                </Link>
                
                <div className="relative inline-block group">
                    <div className="w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl mx-auto bg-white flex items-center justify-center">
                        {user?.profile_image ? (
                            <img src={user.profile_image} alt="Profile" className="object-cover w-full h-full" />
                        ) : (
                            <User size={48} className="text-slate-200" />
                        )}
                    </div>
                    <button className="absolute bottom-1 right-1 bg-white text-primary p-2.5 rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-transform">
                        <Camera size={18} />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-5">
                    <h1 className="text-2xl font-black tracking-tight">{`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}</h1>
                    {kycStatus === 'verified' && <BadgeCheck size={22} className="text-sky-400 fill-sky-400/20" />}
                </div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">
                    {country ? `${country} ${countryFlag}` : "Detecting location..."}
                </p>
            </div>

            <div className="max-w-md mx-auto px-6 -mt-10 space-y-6 relative z-10">
                
                {/* CONTACT INFO CARD */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Information</p>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full"
                        >
                            <Edit2 size={12} /> Edit
                        </button>
                    </div>
                    
                    <div className="space-y-5">
                        <InfoRow 
                            icon={<Mail size={18} className="text-blue-500" />} 
                            label="Email Address" 
                            value={user?.email || "No email set"} 
                        />
                        <div className="h-px bg-slate-50 w-full" />
                        <InfoRow 
                            icon={<Smartphone size={18} className="text-emerald-500" />} 
                            label="Phone Number" 
                            value={user?.phone || "No phone set"} 
                        />
                    </div>
                </div>

                {/* Identity Verification Banner */}
                {kycStatus !== 'verified' && (
                    <div className={`p-4 rounded-3xl flex items-center justify-between border-2 ${kycStatus === 'pending' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100 animate-pulse'}`}>
                        <div className="flex gap-3">
                            <AlertCircle className={kycStatus === 'pending' ? 'text-blue-500' : 'text-amber-500'} size={20} />
                            <div>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{kycStatus === 'pending' ? "Verification Pending" : "Identity Verification"}</p>
                                <p className="text-[10px] text-slate-500 font-medium">{kycStatus === 'pending' ? "We're reviewing your documents." : "Verify your ID to unlock limits."}</p>
                            </div>
                        </div>
                        {kycStatus !== 'pending' && (
                            <Link href="/app/settings/kyc">
                                <Button size="sm" className="bg-slate-900 text-[10px] h-8 font-black px-4 rounded-full text-white">Verify Now</Button>
                            </Link>
                        )}
                    </div>
                )}

                {/* SECURITY SETTINGS CARD */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Security & Privacy</p>
                    <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm divide-y divide-slate-50">
                        
                        {/* Transaction PIN */}
                        <button 
                            disabled={loading}
                            onClick={handleStartPinSetup}
                            className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900">Transaction PIN</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{user?.pin ? "Security code is active" : "Set a code for transactions"}</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300" />
                        </button>

                        {/* Two-Factor Authentication Toggle */}
                        <div className="w-full p-5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-slate-900">Two-Factor Auth</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Verify login via email OTP</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleToggle2FA}
                                disabled={loading2FA}
                                className={`w-12 h-6 rounded-full transition-all relative ${user?.two_fa_enabled ? 'bg-primary' : 'bg-slate-200'}`}
                            >
                                {loading2FA ? (
                                    <Loader2 size={12} className="animate-spin mx-auto text-white" />
                                ) : (
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${user?.two_fa_enabled ? 'left-7' : 'left-1'}`} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <Button onClick={() => signOut()} variant="ghost" className="w-full h-16 text-red-500 font-black flex gap-2 hover:bg-red-50 rounded-[24px] transition-all">
                    <LogOut size={20} /> Sign Out of Account
                </Button>
            </div>

            {/* MAIN PIN MODAL */}
            {isPinModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[40px] p-8 animate-in slide-in-from-bottom-20 duration-500 shadow-2xl relative overflow-hidden">
                        
                        {pinStatus?.includes("Success") && (
                            <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                    <BadgeCheck size={48} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">PIN Secured!</h2>
                                <p className="text-slate-500 text-sm mt-2">Your transactions are now protected.</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">{step === 1 ? "Verify Identity" : "Secure PIN"}</h2>
                                <div className="h-1 w-12 bg-primary rounded-full mt-1" />
                            </div>
                            <button onClick={() => setIsPinModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors">✕</button>
                        </div>
                        
                        <form action={async (formData) => {
                            if (step === 1) {
                                setOtpCode(formData.get('otp'))
                                setStep(2)
                            } else {
                                setLoading(true)
                                const res = await finalizePinSetup(formData)
                                setLoading(false)
                                if (res.success) {
                                    setPinStatus("PIN Successfully Updated!")
                                    setTimeout(() => setIsPinModalOpen(false), 2500)
                                } else {
                                    setPinStatus(res.error)
                                }
                            }
                        }}>
                            {step === 1 ? (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-600 font-medium">Enter code sent to</p>
                                        <p className="text-sm font-black text-primary">{user?.email}</p>
                                    </div>
                                    <input 
                                        name="otp" 
                                        type="text" 
                                        maxLength={6} 
                                        placeholder="000000"
                                        className="w-full h-20 text-center text-4xl font-black bg-slate-50 rounded-[24px] border-4 border-slate-50 focus:border-primary focus:bg-white outline-none transition-all tracking-[0.3em]"
                                        required autoFocus
                                    />
                                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Didn't receive it? <button type="button" onClick={handleStartPinSetup} className="text-primary hover:underline">Resend</button>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-600 font-medium">Create your 4-digit PIN</p>
                                    </div>
                                    <input type="hidden" name="otp" value={otpCode} />
                                    <input 
                                        name="pin" 
                                        type="password" 
                                        maxLength={4} 
                                        inputMode="numeric"
                                        placeholder="••••"
                                        className="w-full h-24 text-center text-6xl tracking-[1.5rem] font-black bg-slate-50 rounded-[32px] border-4 border-slate-50 focus:border-primary focus:bg-white outline-none transition-all"
                                        required autoFocus
                                    />
                                </div>
                            )}

                            {pinStatus && !pinStatus.includes('Success') && (
                                <div className="mt-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-600 border border-red-100">
                                    <AlertCircle size={18} />
                                    <p className="text-xs font-bold uppercase tracking-tight">{pinStatus}</p>
                                </div>
                            )}

                            <Button type="submit" disabled={loading} className="w-full h-16 rounded-[24px] mt-8 font-black text-lg shadow-xl shadow-primary/20">
                                {loading ? <Loader2 className="animate-spin" /> : (step === 1 ? "Verify & Continue" : "Activate PIN")}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {isEditing && <UserProfileSettings user={user} setIsEditing={setIsEditing} />}
        </div>
    )
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{value}</p>
            </div>
        </div>
    )
}