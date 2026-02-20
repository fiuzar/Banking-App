'use client'

// components/home/Hero.tsx
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {useLanguage} from "@/messages/LanguageProvider"

export default function Hero() {
    const {t} = useLanguage()
    
    return (
        <section className="relative overflow-hidden bg-white pt-16 pb-24">
            <div className="mx-auto max-w-7xl px-screen-p flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-[1.1] tracking-tight mb-6">
                        {t('Hero', 'title')} <span className="text-brand-blue">{t('Hero', 'subtitleHighlight')}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-n-500 mb-10 max-w-xl">
                        {t('Hero', 'description')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link href="/register">
                            <Button className="btn-primary text-lg px-10 h-14">{t('Hero', 'getStarted')}</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" className="h-14 px-10 rounded-brand-button border-n-300 text-brand-blue font-bold">
                                {t('Hero', 'logIn')}
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-n-500">
                        <span className="flex items-center gap-1">🛡️ {t('Hero', 'regulated')}</span>
                        <span className="flex items-center gap-1">⚡ {t('Hero', 'realtimeFx')}</span>
                    </div>
                </div>

                <div className="flex-1 relative w-full max-w-[500px]">
                    <Image src="/img/hero.png" width={400} height={400} className="w-full" alt="" />
                </div>
            </div>
        </section>
    );
}