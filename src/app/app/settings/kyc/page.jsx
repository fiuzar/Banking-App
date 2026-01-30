'use client'

import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/server-functions/contexts"
import { Button } from "@/components/ui/button"
import {
    ShieldCheck, Bell, Globe, ArrowLeft, Landmark, 
    Camera, Mail, Smartphone, Edit3, BadgeCheck, 
    AlertCircle, ChevronDown, Check, CreditCard, ExternalLink
} from "lucide-react"
import Link from "next/link"
import { UserProfileSettings } from "@/components/app/user_setings"

// --- ADD: Backend update function ---
async function updateUserLocale(locale) {
    try {
        const res = await fetch('/api/user/locale', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locale)
        })
        if (!res.ok) throw new Error('Failed to update locale')
        return { success: true }
    } catch (e) {
        return { success: false, error: e.message }
    }
}

export default function AccountManagement() {
    const { user } = useContext(UserContext)
    const [isNotificationsOn, setIsNotificationsOn] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [country, setCountry] = useState(null)
    const [countryFlag, setCountryFlag] = useState(null)
    const [isLanguageOpen, setIsLanguageOpen] = useState(false)
    const [selectedLocale, setSelectedLocale] = useState({ 
        lang: 'English (US)', 
        currency: 'USD', 
        flag: '🇺🇸' 
    })
    const [localeStatus, setLocaleStatus] = useState(null)

    // Stripe Connect & KYC Logic
    const hasStripeAccount = !!user?.stripe_connect_id;
    const kycStatus = user?.kyc_status || 'unverified'; // unverified, pending, verified, rejected
    const bankLinked = !!user?.external_account_id; // Check if user has linked their checking/savings

    function countryCodeToFlag(code) {
        return code
            .toUpperCase()
            .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()))
    }

    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                setCountry(data.country_name)
                setCountryFlag(data.country_code ? countryCodeToFlag(data.country_code) : null)
            })
            .catch(() => {
                setCountry(null)
                setCountryFlag(null)
            })
    }, [])

    async function handleLocaleChange(item) {
        setSelectedLocale(item)
        setIsLanguageOpen(false)
        setLocaleStatus(null)
        const result = await updateUserLocale(item)
        if (result.success) {
            setLocaleStatus("Language updated!")
        } else {
            setLocaleStatus("Failed to update language.")
        }
        setTimeout(() => setLocaleStatus(null), 2000)
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Profile Header */}
            <div className="bg-primary pt-12 pb-20 px-6 text-white text-center relative">
                <Link href="/app" className="absolute left-6 top-6">
                    <ArrowLeft size={24} />
                </Link>

                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden shadow-xl mx-auto bg-white flex items-center justify-center">
                        {user?.profile_image ? (
                            <img
                                src={user.profile_image}
                                alt="Profile"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="text-slate-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white text-primary p-2 rounded-full shadow-lg border border-slate-100">
                        <Camera size={16} />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <h1 className="text-2xl font-black">{`${user?.first_name ?? "User"} ${user?.last_name ?? ""}`}</h1>
                    {kycStatus === 'verified' && (
                        <BadgeCheck size={20} className="text-sky-400 fill-sky-400/20 animate-in zoom-in duration-300" />
                    )}
                </div>
                <p className="text-white/70 text-sm font-medium">
                    {country ? `${country} ${countryFlag}` : "Detecting location..."}
                </p>
            </div>

            <div className="max-w-md mx-auto px-6 mt-[-30px] space-y-6">
                
                {/* DYNAMIC STRIPE/KYC BANNER */}
                {kycStatus !== 'verified' && (
                    <div className={`p-4 rounded-[24px] flex items-center justify-between border shadow-sm animate-in slide-in-from-top-4 duration-500 ${
                        !hasStripeAccount ? 'bg-indigo-50 border-indigo-100' :
                        kycStatus === 'pending' ? 'bg-blue-50 border-blue-100' : 
                        kycStatus === 'rejected' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
                    }`}>
                        <div className="flex gap-3">
                            <div className={`p-2 rounded-xl bg-white/50 ${
                                !hasStripeAccount ? 'text-indigo-600' :
                                kycStatus === 'pending' ? 'text-blue-600' : 
                                kycStatus === 'rejected' ? 'text-red-600' : 'text-amber-600'
                            }`}>
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">
                                    {!hasStripeAccount ? "Account Setup Required" : 
                                     kycStatus === 'pending' ? "Reviewing Documents" : 
                                     kycStatus === 'rejected' ? "Verification Failed" : "Identity Check"}
                                </p>
                                <p className="text-[10px] text-slate-500 leading-tight pr-2">
                                    {!hasStripeAccount ? "Set up your Stripe Connect ID to enable transfers." : 
                                     kycStatus === 'pending' ? "Stripe is currently reviewing your profile." : 
                                     kycStatus === 'rejected' ? "Please check your email for rejection details." : "Verify your identity to increase limits."}
                                </p>
                            </div>
                        </div>
                        
                        {kycStatus !== 'pending' && (
                            <Link href={!hasStripeAccount ? "/app/settings/stripe-setup" : "/app/settings/kyc"}>
                                <Button size="sm" className={`text-[10px] h-8 font-bold rounded-xl ${
                                    !hasStripeAccount ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900'
                                }`}>
                                    {!hasStripeAccount ? 'Start' : 'Verify'}
                                </Button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Account Info Card */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Info</h2>
                        <button onClick={() => setIsEditing(true)} className="text-primary flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                            <Edit3 size={12} /> Edit
                        </button>
                    </div>
                    <div className="space-y-4">
                        <InfoRow icon={<Mail size={18} />} label="Email" value={user?.email ?? "—"} />
                        <InfoRow icon={<Smartphone size={18} />} label="Phone" value={user?.phone ?? "—"} />
                    </div>
                </div>

                {/* LINKED BANK CARD (Checking/Savings) */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked Payout Account</h2>
                        {bankLinked ? (
                             <BadgeCheck size={16} className="text-green-500" />
                        ) : (
                             <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">Missing</span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <InfoRow 
                            icon={<Landmark size={18} />} 
                            label="External Bank" 
                            value={bankLinked ? (user?.bank_name || "Primary Bank") : "No bank connected"} 
                        />
                        {bankLinked ? (
                            <p className="text-xs font-mono font-bold text-slate-400">••••{user?.last4 || "0000"}</p>
                        ) : (
                            <Link href="/app/settings/stripe-setup" className="text-primary text-xs font-bold underline">Link Bank</Link>
                        )}
                    </div>
                </div>

                {/* Settings Groups */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Preferences</p>
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
                        
                        <SettingsLink
                            icon={<ShieldCheck className="text-blue-500" />}
                            title="Security & Privacy"
                            subtitle="2FA, Biometrics, Password"
                        />

                        {/* Language Dropdown */}
                        <div className="flex flex-col">
                            <div onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Language & Region</p>
                                        <p className="text-[10px] text-slate-500">{selectedLocale.lang}, {selectedLocale.currency}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs">{selectedLocale.flag}</span>
                                    <ChevronDown size={18} className={`text-slate-300 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {isLanguageOpen && (
                                <div className="bg-slate-50/50 px-2 pb-2 animate-in slide-in-from-top-2 duration-200">
                                    {[
                                        { lang: 'English (US)', currency: 'USD', flag: '🇺🇸' },
                                        { lang: 'English (UK)', currency: 'GBP', flag: '🇬🇧' },
                                        { lang: 'French', currency: 'EUR', flag: '🇫🇷' },
                                        { lang: 'German', currency: 'EUR', flag: '🇩🇪' }
                                    ].map((item) => (
                                        <div key={item.lang} onClick={() => handleLocaleChange(item)} className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{item.flag}</span>
                                                <span className="text-xs font-bold text-slate-900">{item.lang}</span>
                                            </div>
                                            {selectedLocale.lang === item.lang && <Check size={14} className="text-primary" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notifications Toggle */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                                    <p className="text-[10px] text-slate-500">Alerts for all transactions</p>
                                </div>
                            </div>
                            <label className="relative inline-block w-10 h-5 align-middle select-none">
                                <input type="checkbox" checked={isNotificationsOn} onChange={() => setIsNotificationsOn(!isNotificationsOn)} className="peer absolute opacity-0 w-0 h-0" />
                                <span className="block w-10 h-5 bg-slate-200 rounded-full transition-colors peer-checked:bg-primary"></span>
                                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <UserProfileSettings user={user} setIsEditing={setIsEditing} />
            )}
        </div>
    )
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="text-slate-300">{icon}</div>
            <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
                <p className="text-sm font-bold text-slate-900">{value}</p>
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
            <ChevronDown className="text-slate-300 -rotate-90" size={18} />
        </div>
    )
}