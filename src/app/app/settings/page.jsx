'use client'

import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/server-functions/contexts"
import { Button } from "@/components/ui/button"
import {
    ShieldCheck, LogOut, ChevronRight,
    Camera, Mail, Smartphone, BadgeCheck, AlertCircle, ArrowLeft,
    Lock, Loader2, User, Edit2
} from "lucide-react"
import Link from "next/link"
import { UserProfileSettings } from "@/components/app/user_setings"
import { signOut } from "next-auth/react"
import { create_otp, finalizePinSetup } from "@/server-functions/authentication"

export default function AccountManagement() {
    const { user } = useContext(UserContext)
    
    // UI States
    const [isEditing, setIsEditing] = useState(false)
    const [isPinModalOpen, setIsPinModalOpen] = useState(false)
    
    // PIN Setup Flow States
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
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

    async function startPinSetup() {
        setLoading(true)
        const res = await create_otp(user.email)
        setLoading(false)
        if (res.success) {
            setStep(1)
            setIsPinModalOpen(true)
            setPinStatus(null)
        } else {
            alert(res.error || "Failed to send verification code.")
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Profile Header */}
            <div className="bg-primary pt-12 pb-20 px-6 text-white text-center relative">
                <Link href="/app" className="absolute left-6 top-6 transition-transform active:scale-90"><ArrowLeft size={24} /></Link>
                
                <div className="relative inline-block group">
                    <div className="w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl mx-auto bg-white flex items-center justify-center text-slate-300">
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
                
                {/* 1. CONTACT INFO CARD (The part I accidentally removed!) */}
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

                {/* 2. SECURITY SETTINGS CARD */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Security & Privacy</p>
                    <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm divide-y divide-slate-50">
                        
                        <button 
                            disabled={loading}
                            onClick={startPinSetup}
                            className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-slate-900">Transaction PIN</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{user?.pin ? "Update your 4-digit security code" : "Set a code for transactions"}</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300" />
                        </button>

                        <SettingsLink 
                            icon={<ShieldCheck className="text-blue-500" />} 
                            title="Two-Factor Auth" 
                            subtitle="Add an extra layer of safety" 
                        />
                    </div>
                </div>

                <Button onClick={() => signOut()} variant="ghost" className="w-full h-16 text-red-500 font-black flex gap-2 hover:bg-red-50 rounded-[24px] border-2 border-transparent hover:border-red-100 transition-all">
                    <LogOut size={20} /> Sign Out of Account
                </Button>
            </div>

            {/* PIN MODAL OVERLAY (Kept logic same) */}
            {isPinModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[40px] p-8 animate-in slide-in-from-bottom-20 duration-500 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-slate-900">{step === 1 ? "Verify Identity" : "Secure PIN"}</h2>
                            <button onClick={() => setIsPinModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors font-bold">✕</button>
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
                                    setTimeout(() => setIsPinModalOpen(false), 2000)
                                } else {
                                    setPinStatus(res.error)
                                }
                            }
                        }}>
                            <p className="text-xs text-slate-500 font-bold mb-8 uppercase tracking-widest text-center">
                                {step === 1 ? `Code sent to ${user?.email}` : "Enter a 4-digit code"}
                            </p>

                            {step === 1 ? (
                                <input 
                                    name="otp" 
                                    type="text" 
                                    maxLength={6} 
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full h-20 text-center text-4xl font-black bg-slate-50 rounded-[24px] border-4 border-slate-50 focus:border-primary focus:bg-white outline-none transition-all"
                                    required autoFocus
                                />
                            ) : (
                                <>
                                    <input type="hidden" name="otp" value={otpCode} />
                                    <input 
                                        name="pin" 
                                        type="password" 
                                        maxLength={4} 
                                        inputMode="numeric"
                                        placeholder="••••"
                                        className="w-full h-20 text-center text-5xl tracking-[1.5rem] font-black bg-slate-50 rounded-[24px] border-4 border-slate-50 focus:border-primary focus:bg-white outline-none transition-all"
                                        required autoFocus
                                    />
                                </>
                            )}

                            {pinStatus && (
                                <p className={`text-center mt-6 text-[10px] font-black uppercase tracking-widest ${pinStatus.includes('Success') ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {pinStatus}
                                </p>
                            )}

                            <Button type="submit" disabled={loading} className="w-full h-16 rounded-[24px] mt-8 font-black text-lg shadow-xl shadow-primary/20">
                                {loading ? <Loader2 className="animate-spin" /> : (step === 1 ? "Verify Code" : "Confirm PIN")}
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
            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-primary/10 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{value}</p>
            </div>
        </div>
    )
}

function SettingsLink({ icon, title, subtitle }) {
    return (
        <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
                <div>
                    <p className="text-sm font-black text-slate-900">{title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{subtitle}</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
        </div>
    )
}