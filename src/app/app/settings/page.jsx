'use client'

import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/server-functions/contexts"
import { Button } from "@/components/ui/button"
import {
    ShieldCheck, Bell, Globe, LogOut, ChevronRight,
    Camera, Mail, Smartphone, Edit3, BadgeCheck, AlertCircle, ArrowLeft,
    ChevronDown, Check, Lock, Loader2
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
    const [isLanguageOpen, setIsLanguageOpen] = useState(false)
    
    // PIN Setup Flow States
    const [step, setStep] = useState(1) // 1: OTP, 2: PIN Entry
    const [loading, setLoading] = useState(false)
    const [pinStatus, setPinStatus] = useState(null)
    const [otpCode, setOtpCode] = useState("")

    // Location/Locale States
    const [country, setCountry] = useState(null)
    const [countryFlag, setCountryFlag] = useState(null)
    const [selectedLocale, setSelectedLocale] = useState({ lang: 'English (US)', currency: 'USD', flag: '🇺🇸' })

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

    // Step 1: Trigger Email OTP
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
                <Link href="/app" className="absolute left-6 top-6"><ArrowLeft size={24} /></Link>
                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden shadow-xl mx-auto bg-white flex items-center justify-center text-slate-300">
                        {user?.profile_image ? <img src={user.profile_image} alt="Profile" className="object-cover w-full h-full" /> : <Lock size={40} />}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white text-primary p-2 rounded-full shadow-lg border border-slate-100"><Camera size={16} /></button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <h1 className="text-2xl font-black">{`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}</h1>
                    {kycStatus === 'verified' && <BadgeCheck size={20} className="text-sky-400 fill-sky-400/20" />}
                </div>
                <p className="text-white/70 text-sm font-medium">{country ? `${country} ${countryFlag}` : "Detecting location..."}</p>
            </div>

            <div className="max-w-md mx-auto px-6 mt-3 space-y-6">
                {/* KYC Status Banner */}
                {kycStatus !== 'verified' && (
                    <div className={`p-4 rounded-2xl flex items-center justify-between border ${kycStatus === 'pending' ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex gap-3">
                            <AlertCircle className={kycStatus === 'pending' ? 'text-blue-500' : 'text-amber-500'} size={20} />
                            <div>
                                <p className="text-xs font-bold text-slate-900 uppercase">{kycStatus === 'pending' ? "Verification Pending" : "Identity Verification"}</p>
                                <p className="text-[10px] text-slate-600">{kycStatus === 'pending' ? "We're reviewing your docs." : "Verify to enable all features."}</p>
                            </div>
                        </div>
                        {kycStatus !== 'pending' && <Link href="/app/settings/kyc"><Button size="sm" className="bg-slate-900 text-[10px] h-8 font-bold text-white">Verify</Button></Link>}
                    </div>
                )}

                {/* Account Settings */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Security</p>
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
                        
                        {/* THE PIN SETUP BUTTON */}
                        <button 
                            disabled={loading}
                            onClick={startPinSetup}
                            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900">Transaction PIN</p>
                                    <p className="text-[10px] text-slate-500">{user?.pin ? "Update your 4-digit code" : "Setup your 4-digit code"}</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300" />
                        </button>

                        <SettingsLink icon={<ShieldCheck className="text-blue-500" />} title="Privacy & Security" subtitle="Manage your account safety" />
                    </div>
                </div>

                <Button onClick={() => signOut()} variant="ghost" className="w-full h-14 text-red-500 font-bold flex gap-2 hover:bg-red-50 rounded-2xl">
                    <LogOut size={20} /> Sign Out
                </Button>
            </div>

            {/* PIN MODAL OVERLAY */}
            {isPinModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900">{step === 1 ? "Verify Identity" : "New Secure PIN"}</h2>
                            <button onClick={() => setIsPinModalOpen(false)} className="text-slate-400 text-xl font-bold">✕</button>
                        </div>
                        
                        <form action={async (formData) => {
                            if (step === 1) {
                                // Just visual transition to next step, OTP is verified in the final submit
                                setOtpCode(formData.get('otp'))
                                setStep(2)
                            } else {
                                setLoading(true)
                                const res = await finalizePinSetup(formData)
                                setLoading(false)
                                if (res.success) {
                                    setPinStatus("PIN Updated Successfully!")
                                    setTimeout(() => setIsPinModalOpen(false), 2000)
                                } else {
                                    setPinStatus(res.error)
                                }
                            }
                        }}>
                            <p className="text-sm text-slate-500 mb-6">
                                {step === 1 ? `Enter the code sent to ${user?.email}` : "Choose a 4-digit code for all transactions."}
                            </p>

                            {step === 1 ? (
                                <input 
                                    name="otp" 
                                    type="text" 
                                    maxLength={6} 
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full h-16 text-center text-3xl font-black bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none"
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
                                        placeholder="* * * *"
                                        className="w-full h-16 text-center text-4xl tracking-[1rem] font-black bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none"
                                        required autoFocus
                                    />
                                </>
                            )}

                            {pinStatus && (
                                <p className={`text-center mt-4 text-xs font-bold ${pinStatus.includes('Success') ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {pinStatus}
                                </p>
                            )}

                            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl mt-8 font-black text-lg bg-primary text-white">
                                {loading ? <Loader2 className="animate-spin" /> : (step === 1 ? "Continue" : "Save Secure PIN")}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {isEditing && <UserProfileSettings user={user} setIsEditing={setIsEditing} />}
        </div>
    )
}

// Reusable Components
function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="text-slate-300">{icon}</div>
            <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
                <p className="text-sm font-semibold text-slate-900">{value}</p>
            </div>
        </div>
    )
}

function SettingsLink({ icon, title, subtitle }) {
    return (
        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
                <div>
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-[10px] text-slate-500">{subtitle}</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
        </div>
    )
}