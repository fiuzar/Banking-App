'use client'

import Link from "next/link"
import {useLanguage} from "@/messages/LanguageProvider"

// components/layout/Footer.tsx
export default function Footer() {

    const {t, locale} = useLanguage()

    return (
        <footer className="bg-white border-t border-n-300 py-16">
            <div className="mx-auto max-w-7xl px-screen-p">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-1">
                        <span className="text-xl font-bold text-brand-blue">PaySense</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-n-900 mb-4">{t('Footer', 'features')}</h4>
                        <ul className="space-y-2 text-sm text-n-500">
                            <li>{t('Footer', 'usdWallet')}</li>
                            <li>{t('Footer', 'eurWallet')}</li>
                            <li>{t('Footer', 'virtualCards')}</li>
                            <li>{t('Footer', 'internationalFx')}</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-n-900 mb-4">{t('company')}</h4>
                        <ul className="space-y-2 text-sm text-n-500">
                            <li>
                                <Link href={`/about`}>{t('Footer', 'aboutUs')}</Link></li>
                            <li>
                                <Link href={`/compliance`}>{t('Footer', 'compliance')}</Link>
                            </li>
                            <li>
                                <Link href={`/careers`}>{t('Footer', 'careers')}</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-n-900 mb-4">{t('legal')}</h4>
                        <ul className="space-y-2 text-sm text-n-500">
                            <li>
                                <Link href={`/privacy`}>{t('Footer', 'privacyPolicy')}</Link>
                            </li>
                            <li>
                                <Link href={`/terms`}>{t('Footer', 'termsOfService')}</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-n-100 text-[12px] text-n-500 leading-relaxed">
                    {t('Footer', 'disclaimer')}
                </div>
            </div>
        </footer>
    );
}