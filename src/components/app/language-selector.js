'use client'
import { useLanguage } from "@/messages/LanguageProvider";
import { updateUserLocale } from "@/server-functions/authentication";
import { Globe, Check } from "lucide-react";
import { useState } from "react";

const supportedLanguages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "es", name: "Español" },
    { code: "pt", name: "Português" },
    { code: "ar", name: "العربية" },
    { code: "zh", name: "中文" },
    { code: "hi", name: "हिन्दी" }
];

export function LanguageSettingsCard({ user }) {
    const { locale, changeLanguage, t } = useLanguage();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleLanguageChange = async (newLocale) => {
        setIsUpdating(true);
        
        // 1. Save to Database (Permanent)
        if (user?.id) {
            await updateUserLocale(user.id, newLocale);
        }

        // 2. Trigger Context Change (Redirects & Updates Cookie)
        changeLanguage(newLocale);
        setIsUpdating(false);
    };

    return (
        <div className="space-y-3 mt-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                {t("AccountManagement", "language.title") || "PREFERENCES"}
            </p>
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm divide-y divide-slate-50">
                <div className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900">{t("AccountManagement", "language.label") || "App Language"}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{t("AccountManagement", "language.desc") || "Select your preferred language"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {supportedLanguages.map((lang) => (
                            <button
                                key={lang.code}
                                disabled={isUpdating}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-xs font-bold transition-all ${
                                    locale === lang.code 
                                    ? 'border-primary bg-primary/5 text-primary' 
                                    : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {lang.name}
                                {locale === lang.code && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}