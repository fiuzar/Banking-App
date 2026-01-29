'use client'

import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/server-functions/contexts"
import { Button } from "@/components/ui/button"
import {
    ShieldCheck, Bell, Globe, LogOut, ChevronRight,
    Camera, Mail, Smartphone, Edit3, BadgeCheck, AlertCircle, ArrowLeft,
    ChevronDown, Check
} from "lucide-react"
import Link from "next/link"
import { UserProfileSettings } from "@/components/app/user_setings"
import { signOut } from "next-auth/react"

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
    const [localeStatus, setLocaleStatus] = useState(null) // For feedback

    const locales = [
        { lang: 'English (US)', currency: 'USD', flag: '🇺🇸' },
        { lang: 'English (UK)', currency: 'GBP', flag: '🇬🇧' },
        { lang: 'French', currency: 'EUR', flag: '🇫🇷' },
        { lang: 'German', currency: 'EUR', flag: '🇩🇪' },
        { lang: 'English', currency: 'NGN', flag: '🇳🇬' }
    ]
    
    // 1. LINK TO REAL DATA: Use the kyc_status from your context/database
    const kycStatus = user?.kyc_status || 'unverified'; // unverified, pending, verified, rejected
    const rejectionReason = user?.rejection_reason;

    function countryCodeToFlag(code) {
        // Converts country code to emoji flag
        return code
            .toUpperCase()
            .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()))
    }

    useEffect(() => {
        // Fetch country info from a public IP geolocation API
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

    // --- Handle locale change and upload to backend ---
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
                            // Use Next.js Image for optimization
                            <img
                                src={user.profile_image}
                                alt="Profile"
                                className="object-cover w-full h-full"
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : (
                            // Fallback: User icon (Lucide's User icon)
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-slate-300"
                                width={64}
                                height={64}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white text-primary p-2 rounded-full shadow-lg border border-slate-100">
                        <Camera size={16} />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                    {/* {JSON.stringify(user)} */}
                    <h1 className="text-2xl font-semibold font-black">{`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}</h1>
                    
                    {/* 2. DYNAMIC BADGE: Only show blue check if status is strictly 'verified' */}
                    {kycStatus === 'verified' && (
                        <BadgeCheck size={20} className="text-sky-400 fill-sky-400/20 animate-in zoom-in duration-300" />
                    )}
                </div>
                <p className="text-white/70 text-sm font-medium">
                    {country ? (
                        <>
                            {country} {countryFlag}
                        </>
                    ) : (
                        "Detecting location..."
                    )}
                </p>
            </div>

            <div className="max-w-md mx-auto px-6 mt-3 space-y-6">
                {kycStatus !== 'verified' && (
                    <div className={`p-4 rounded-2xl flex items-center justify-between border animate-in slide-in-from-top-4 duration-500 ${
                        kycStatus === 'pending' ? 'bg-blue-50 border-blue-200' : 
                        kycStatus === 'rejected' ? 'bg-red-50 border-red-200' : 
                        'bg-amber-50 border-amber-200'
                    }`}>
                        <div className="flex gap-3">
                            <AlertCircle className={
                                kycStatus === 'pending' ? 'text-blue-500' : 
                                kycStatus === 'rejected' ? 'text-red-500' : 
                                'text-amber-500'
                            } size={20} />
                            <div>
                                <p className={`text-xs font-bold ${
                                    kycStatus === 'pending' ? 'text-blue-900' : 
                                    kycStatus === 'rejected' ? 'text-red-900' : 
                                    'text-amber-900'
                                }`}>
                                    {kycStatus === 'pending' && "Verification in Progress"}
                                    {kycStatus === 'rejected' && "Verification Rejected"}
                                    {kycStatus === 'unverified' && "Verify your identity"}
                                </p>
                                <p className={`text-[10px] ${
                                    kycStatus === 'pending' ? 'text-blue-700' : 
                                    kycStatus === 'rejected' ? 'text-red-700' : 
                                    'text-amber-700'
                                }`}>
                                    {kycStatus === 'pending' && "We are reviewing your documents (2-4h)."}
                                    {kycStatus === 'rejected' && (rejectionReason || "Please re-submit clear documents.")}
                                    {kycStatus === 'unverified' && "Submit KYC to increase spending limits."}
                                </p>
                            </div>
                        </div>
                        
                        {/* Only show 'Verify' button if NOT pending */}
                        {kycStatus !== 'pending' && (
                            <Link href="/app/settings/kyc">
                                <Button size="sm" className={`${
                                    kycStatus === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'
                                } text-[10px] h-8 font-bold`}>
                                    {kycStatus === 'rejected' ? 'Try Again' : 'Verify'}
                                </Button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Account Info Card */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-[10px] font-bold text-n-500 uppercase tracking-widest">Personal Information</h2>
                        <button onClick={() => setIsEditing(true)} className="text-primary flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                            <Edit3 size={12} /> Edit
                        </button>
                    </div>
                    <div className="space-y-4">
                        <InfoRow icon={<Mail size={18} />} label="Email" value={user?.email ?? "—"} />
                        <InfoRow icon={<Smartphone size={18} />} label="Phone" value={user?.phone ?? "—"} />
                    </div>
                </div>

                {/* Settings Groups */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest ml-1">General Settings</p>
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
                        <SettingsLink
                            icon={<ShieldCheck className="text-blue-500" />}
                            title="Security & Privacy"
                            subtitle="2FA, Biometrics, Password"
                        />
                        {/* Language & Region Dropdown Group */}
                        <div className="flex flex-col">
                            <div 
                                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-secondary rounded-lg text-primary">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-brand-dark">Language & Region</p>
                                        <p className="text-[10px] text-n-500">{selectedLocale.lang}, {selectedLocale.currency}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs">{selectedLocale.flag}</span>
                                    <ChevronDown size={18} className={`text-n-300 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Dropdown Options */}
                            {isLanguageOpen && (
                                <div className="bg-slate-50/50 px-2 pb-2 animate-in slide-in-from-top-2 duration-200">
                                    {locales.map((item) => (
                                        <div 
                                            key={item.lang}
                                            onClick={() => handleLocaleChange(item)}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{item.flag}</span>
                                                <span className="text-xs font-bold text-brand-dark">{item.lang}</span>
                                                <span className="text-[10px] text-n-400">({item.currency})</span>
                                            </div>
                                            {selectedLocale.lang === item.lang && <Check size={14} className="text-primary" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Feedback message */}
                            {localeStatus && (
                                <div className="px-4 py-2 text-xs text-green-700">{localeStatus}</div>
                            )}
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-brand-dark">Push Notifications</p>
                                    <p className="text-[10px] text-n-500">Alerts for all transactions</p>
                                </div>
                            </div>
                            <label className="relative inline-block w-10 h-5 align-middle select-none">
                                <input
                                    type="checkbox"
                                    checked={isNotificationsOn}
                                    onChange={() => setIsNotificationsOn(!isNotificationsOn)}
                                    className="peer absolute opacity-0 w-0 h-0"
                                />
                                <span className="block w-10 h-5 bg-slate-200 rounded-full transition-colors peer-checked:bg-primary"></span>
                                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                {/* <Button onClick={signOut()} variant="ghost" className="w-full h-14 text-red-500 font-bold flex gap-2 hover:bg-red-50 hover:text-red-600 rounded-2xl">
                    <LogOut size={20} /> Sign Out
                </Button> */}
            </div>

            {/* Edit Profile Overlay */}
            {isEditing && (
                <UserProfileSettings user={user} setIsEditing={setIsEditing} />
            )}
        </div>
    )
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="text-n-300">{icon}</div>
            <div>
                <p className="text-[10px] text-n-500 font-bold uppercase">{label}</p>
                <p className="text-sm font-medium text-brand-dark">{value}</p>
            </div>
        </div>
    )
}

function SettingsLink({ icon, title, subtitle, badge }) {
    return (
        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
                {icon && <div className="p-2 bg-secondary rounded-lg">{icon}</div>}
                <div>
                    <p className="text-sm font-bold text-brand-dark">{title}</p>
                    <p className="text-[10px] text-n-500">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {badge && <span className="text-xs">{badge}</span>}
                <ChevronRight size={18} className="text-n-300" />
            </div>
        </div>
    )
}