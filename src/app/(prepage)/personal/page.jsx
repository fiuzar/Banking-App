import { ShieldCheck, Globe, CreditCard, Zap, ArrowRight, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from 'next/link';

export default function PersonalPage() {
    return (
        <div className="bg-[#fcfcfd] text-[#1a1a1a] font-sans">
            {/* 1. HERO SECTION */}
            <section className="relative pt-24 pb-16 px-6 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1 px-3 mb-6 text-sm font-medium bg-blue-50 text-brand-blue rounded-full border border-blue-100">
                        For Individuals
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
                        International banking <br />
                        <span className="text-brand-blue italic font-serif">for individuals.</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Open USD and EUR accounts from Nigeria in minutes. Receive global payments,
                        spend anywhere with virtual cards, and move money at the real exchange rate.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link className="mx-auto" href="/register">
                            <Button className="bg-brand-dark text-white px-8 py-4 rounded-xl font-semibold hover:bg-black transition-all flex items-center justify-center gap-2">
                                Open personal account <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* Subtle background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent via-transparent to-transparent z-0" />
            </section>

            {/* 2. BENTO FEATURES GRID */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Feature: Wallets */}
                    <div className="md:col-span-2 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-6">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">USD & EUR Wallets</h3>
                        <p className="text-slate-600">Get your own dedicated US Routing and European IBAN. Receive money from clients or employers as if you lived there.</p>
                        <div className="mt-8 flex gap-3">
                            <div className="h-20 w-32 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-xs text-slate-400">USD Account</div>
                            <div className="h-20 w-32 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-xs text-slate-400">EUR IBAN</div>
                        </div>
                    </div>

                    {/* Feature: Cards */}
                    <div className="p-8 bg-[#1a1a1a] text-white rounded-3xl overflow-hidden relative group">
                        <CreditCard className="text-secondary-foreground mb-6" size={24} />
                        <h3 className="text-2xl font-bold mb-3">Virtual Cards</h3>
                        <p className="text-slate-400">Instant USD cards for Netflix, Amazon, and international ads. 3D Secure enabled.</p>
                        {/* Visual card element */}
                        <div className="mt-12 bg-linear-to-br from-brand-blue to-accent-foreground h-40 w-full rounded-xl p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="text-xs opacity-80 uppercase tracking-widest">Virtual Debit</div>
                            <div className="mt-4 font-mono">**** **** **** 4290</div>
                        </div>
                    </div>

                    {/* Small Feature: FX */}
                    <div className="p-8 bg-white border border-slate-200 rounded-3xl">
                        <Zap className="text-yellow-500 mb-4" size={24} />
                        <h4 className="font-bold text-lg mb-2">Real FX Conversion</h4>
                        <p className="text-sm text-slate-600">Swap currencies at the mid-market rate with zero hidden markups.</p>
                    </div>

                    {/* Small Feature: Loans */}
                    <div className="p-8 bg-white border border-slate-200 rounded-3xl">
                        <ArrowRight className="text-green-500 mb-4" size={24} />
                        <h4 className="font-bold text-lg mb-2">Instant Loans</h4>
                        <p className="text-sm text-slate-600 text-blue-600 font-medium italic">Coming Soon: Access credit lines based on your history.</p>
                    </div>

                    {/* Small Feature: Security */}
                    <div className="p-8 bg-white border border-slate-200 rounded-3xl">
                        <Lock className="text-blue-600 mb-4" size={24} />
                        <h4 className="font-bold text-lg mb-2">Protected Funds</h4>
                        <p className="text-sm text-slate-600">Your money is held in segregated accounts with Tier-1 banks.</p>
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS */}
            <section className="py-24 bg-slate-50 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
                    <div className="space-y-12">
                        {[
                            { step: '01', title: 'Sign up', desc: 'Create your account with just your phone number.' },
                            { step: '02', title: 'Verify identity', desc: 'Quick biometric and BVN check for instant approval.' },
                            { step: '03', title: 'Start transacting', desc: 'Fund your wallet and move money across borders.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-8 items-start">
                                <span className="text-4xl font-serif italic text-blue-200">{item.step}</span>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                                    <p className="text-slate-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. COMPLIANCE & CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-brand-blue p-12 rounded-[3rem] text-white">
                    <ShieldCheck className="mx-auto mb-6" size={48} />
                    <h2 className="text-3xl font-bold mb-4">Regulated. Protected. Safe.</h2>
                    <p className="opacity-90 mb-10">We are a technology platform, not a bank. Banking services are provided by our licensed infrastructure partners.</p>
                    <Link href={`/register`}>
                        <Button className="bg-white text-brand-blue px-10 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                            Open your personal account
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}