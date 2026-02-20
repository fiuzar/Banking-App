'use client'

import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/server-functions/contexts"
import { useLanguage } from "@/messages/LanguageProvider"
import { Button } from "@/components/ui/button"
import {
    ShieldCheck, Bell, Globe, ArrowLeft, Landmark, 
    Camera, Mail, Smartphone, Edit3, BadgeCheck, 
    AlertCircle, ChevronDown, Check
} from "lucide-react"
import Link from "next/link"
import { UserProfileSettings } from "@/components/app/user_setings"

export default function AccountManagement() {
    const { user } = useContext(UserContext)
    const { t } = useLanguage()

    const [isNotificationsOn, setIsNotificationsOn] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [location, setLocation] = useState({ name: null, flag: null })
    const [isLanguageOpen, setIsLanguageOpen] = useState(false)
    const [selectedLocale, setSelectedLocale] = useState({ 
        lang: 'English (US)', currency: 'USD', flag: '🇺🇸' 
    })
    const [localeStatus, setLocaleStatus] = useState(null)

    const hasStripeAccount = !!user?.stripe_connect_id
    const kycStatus = user?.kyc_status || 'unverified'
    const bankLinked = !!user?.external_account_id

    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                const flag = data.country_code ? data.country_code.toUpperCase().replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt())) : ""
                setLocation({ name: data.country_name, flag })
            })
            .catch(() => setLocation({ name: null, flag: null }))
    }, [])

    async function handleLocaleChange(item) {
        setSelectedLocale(item)
        setIsLanguageOpen(false)
        setLocaleStatus(t("AccountSettings", "preferences.language.status"))
        setTimeout(() => setLocaleStatus(null), 2000)
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Profile Header */}
            <div className="bg-green-900 pt-12 pb-24 px-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <Link href="/app" className="absolute left-6 top-8 p-2 bg-white/10 rounded-full">
                    <ArrowLeft size={20} />
                </Link>

                <div className="relative inline-block mt-4">
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl mx-auto bg-slate-200 flex items-center justify-center">
                        {user?.profile_image ? (
                            <img src={user.profile_image} alt="Profile" className="object-cover w-full h-full" />
                        ) : (
                            <Camera size={32} className="text-slate-400" />
                        )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white text-green-900 p-2 rounded-full shadow-lg">
                        <Camera size={14} />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <h1 className="text-2xl font-black tracking-tight">{`${user?.first_name ?? "User"} ${user?.last_name ?? ""}`}</h1>
                    {kycStatus === 'verified' && <BadgeCheck size={20} className="text-sky-400" />}
                </div>
                <p className="text-green-300/80 text-xs font-bold uppercase tracking-widest mt-1">
                    {location.name ? `${location.name} ${location.flag}` : t("AccountSettings", "header.locationDetecting")}
                </p>
            </div>

            <div className="max-w-md mx-auto px-6 -mt-12 space-y-6 relative z-10">

                {/* Status Banner */}
                {kycStatus !== 'verified' && (
                    <div className={`p-4 rounded-3xl border shadow-sm flex items-center justify-between ${
                        !hasStripeAccount ? 'bg-indigo-50 border-indigo-100' : 'bg-amber-50 border-amber-100'
                    }`}>
                        <div className="flex gap-3">
                            <AlertCircle className={!hasStripeAccount ? 'text-indigo-600' : 'text-amber-600'} />
                            <div>
                                <p className="text-[11px] font-black uppercase text-slate-900">
                                    {!hasStripeAccount ? t("AccountSettings", "onboarding.stripeRequired.title") : t("AccountSettings", "onboarding.kycStart.title")}
                                </p>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                    {!hasStripeAccount ? t("AccountSettings", "onboarding.stripeRequired.desc") : t("AccountSettings", "onboarding.kycStart.desc")}
                                </p>
                            </div>
                        </div>
                        <Link href={!hasStripeAccount ? "/app/settings/stripe-setup" : "/app/settings/kyc"}>
                            <Button size="sm" className="h-8 rounded-xl text-[10px] font-bold">
                                {!hasStripeAccount ? t("AccountSettings", "onboarding.stripeRequired.action") : t("AccountSettings", "onboarding.kycStart.action")}
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Personal Info Card */}
                <CardSection title={t("AccountSettings", "personalInfoTitle") || "Personal Info"} action={<button onClick={() => setIsEditing(true)} className="text-green-700 text-[10px] font-black flex items-center gap-1 uppercase tracking-tighter"><Edit3 size={12}/> Edit</button>}>
                    <InfoRow icon={<Mail size={18} />} label={t("AccountSettings", "contactInfo.emailLabel")} value={user?.email} />
                    <InfoRow icon={<Smartphone size={18} />} label={t("AccountSettings", "contactInfo.phoneLabel")} value={user?.phone} />
                </CardSection>

                {/* Payout Card */}
                <CardSection title={t("AccountSettings", "payouts.title")} action={bankLinked ? <BadgeCheck className="text-green-500" size={16}/> : null}>
                    <div className="flex items-center justify-between">
                        <InfoRow 
                            icon={<Landmark size={18} />} 
                            label="External Bank" 
                            value={bankLinked ? (user?.bank_name || t("AccountSettings", "payouts.status.connected")) : t("AccountSettings", "payouts.action.placeholder")} 
                        />
                        {!bankLinked && (
                            <Link href="/app/settings/stripe-setup" className="text-green-700 text-xs font-bold underline">
                                {t("AccountSettings", "payouts.action.link")}
                            </Link>
                        )}
                        {bankLinked && <span className="text-xs font-mono font-bold text-slate-400">••••{user?.last4}</span>}
                    </div>
                </CardSection>

                {/* Preferences */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t("AccountSettings", "preferences.title")}</p>
                    <div className="bg-white rounded-[32px] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                        
                        <SettingsItem 
                            icon={<ShieldCheck className="text-blue-500" />} 
                            title="Security & Privacy" 
                            subtitle="2FA, Biometrics, Password" 
                        />

                        {/* Language Selector */}
                        <div className="flex flex-col">
                            <div onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-50 text-slate-600 rounded-xl"><Globe size={20} /></div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{t("AccountSettings", "preferences.language.label")}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{selectedLocale.lang} • {selectedLocale.currency}</p>
                                    </div>
                                </div>
                                <ChevronDown size={18} className={`text-slate-300 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                            </div>
                            {isLanguageOpen && (
                                <div className="bg-slate-50/50 px-3 pb-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {[
                                        { lang: 'English (US)', currency: 'USD', flag: '🇺🇸' },
                                        { lang: 'French', currency: 'EUR', flag: '🇫🇷' },
                                        { lang: 'German', currency: 'EUR', flag: '🇩🇪' }
                                    ].map((item) => (
                                        <div key={item.lang} onClick={() => handleLocaleChange(item)} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white cursor-pointer transition-all">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{item.flag}</span>
                                                <span className="text-xs font-bold text-slate-900">{item.lang}</span>
                                            </div>
                                            {selectedLocale.lang === item.lang && <Check size={14} className="text-green-700" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notifications Toggle */}
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-orange-50 text-orange-500 rounded-xl"><Bell size={20} /></div>
                                <div>
                                    <p className="text-sm font-black text-slate-900">{t("AccountSettings", "preferences.notifications.label")}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{t("AccountSettings", "preferences.notifications.desc")}</p>
                                </div>
                            </div>
                            <Toggle enabled={isNotificationsOn} setEnabled={setIsNotificationsOn} />
                        </div>
                    </div>
                </div>
                
                {localeStatus && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                        {localeStatus}
                    </div>
                )}
            </div>

            {isEditing && <UserProfileSettings user={user} setIsEditing={setIsEditing} />}
        </div>
    )
}

// --- Local Components (kept simple for clean layout) ---

function CardSection({ title, children, action }) {
    return (
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h2>
                {action}
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    )
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">{icon}</div>
            <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{label}</p>
                <p className="text-sm font-black text-slate-900">{value ?? "—"}</p>
            </div>
        </div>
    )
}

function SettingsItem({ icon, title, subtitle }) {
    return (
        <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
                <div>
                    <p className="text-sm font-black text-slate-900">{title}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{subtitle}</p>
                </div>
            </div>
            <ChevronDown className="-rotate-90 text-slate-300" size={18} />
        </div>
    )
}

function Toggle({ enabled, setEnabled }) {
    return (
        <button onClick={() => setEnabled(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-green-700' : 'bg-slate-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    )
}