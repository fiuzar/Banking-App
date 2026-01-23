'use client'

import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/server-functions/contexts"
import { Button } from "@/components/ui/button"
import {
    ShieldCheck, Bell, Globe, LogOut, ChevronRight,
    Camera, Mail, Smartphone, Edit3, BadgeCheck, AlertCircle, ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { UserProfileSettings } from "@/components/app/user_setings"

export default function AccountManagement() {
    const { user } = useContext(UserContext)
    const [isNotificationsOn, setIsNotificationsOn] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [kycStatus, setKycStatus] = useState('unverified') // 'unverified', 'pending', 'verified'
    const [country, setCountry] = useState(null)
    const [countryFlag, setCountryFlag] = useState(null)

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
                    <h1 className="text-2xl font-black">{`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}</h1>
                    {kycStatus === 'verified' && <BadgeCheck size={20} className="text-sky-400" />}
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
                {kycStatus === 'unverified' && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex gap-3">
                            <AlertCircle className="text-amber-500 shrink-0" size={20} />
                            <div>
                                <p className="text-xs font-bold text-amber-900">Verify your identity</p>
                                <p className="text-[10px] text-amber-700">Submit KYC to increase spending limits.</p>
                            </div>
                        </div>
                        <Link href="/app/settings/kyc">
                            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-[10px] h-8 font-bold">Verify</Button>
                        </Link>
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
                    <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden divide-y divide-slate-50">
                        <SettingsLink
                            icon={<ShieldCheck className="text-blue-500" />}
                            title="Security & Privacy"
                            subtitle="2FA, Biometrics, Password"
                        />
                        <SettingsLink
                            icon={<Globe className="text-primary" />}
                            title="Language & Region"
                            subtitle="English (US), USD"
                            badge="🇳🇬"
                        />
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
                <Button variant="ghost" className="w-full h-14 text-red-500 font-bold flex gap-2 hover:bg-red-50 hover:text-red-600 rounded-2xl">
                    <LogOut size={20} /> Sign Out
                </Button>
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