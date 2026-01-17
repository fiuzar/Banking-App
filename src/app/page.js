// app/page.tsx
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

import Hero from "@/components/layout/hero";
import ValuePillars from "@/components/layout/value-pillars";
import HowItWorks from "@/components/layout/how-it-works";
import { Button } from "@/components/ui/button";

import Image from "next/image"

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="grow">
                <div className="flex flex-col w-full">
                    <Hero />
                    <ValuePillars />

                    {/* Features Showcase - Kuda Style */}
                    <section className="py-24 bg-white px-screen-p">
                        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-20 items-center">
                            <Image className="order-2 md:order-1 bg-n-100 rounded-brand-card aspect-square" src="/img/home.png" width={400} height={400} alt="" />
                            {/* <div className="order-2 md:order-1 bg-n-100 rounded-brand-card aspect-square flex items-center justify-center">
                                <span className="text-n-300 font-mono italic">Card Illustration</span>
                            </div> */}
                            <div className="order-1 md:order-2">
                                <h2 className="text-3xl font-bold mb-6">International Payments made simple.</h2>
                                <ul className="space-y-4 text-n-700">
                                    <li className="flex gap-3">✅ No silent currency conversion</li>
                                    <li className="flex gap-3">✅ Real-time transfer tracking</li>
                                    <li className="flex gap-3">✅ Clear fees before confirmation</li>
                                </ul>
                                <Button className="mt-10 btn-primary">Learn More</Button>
                            </div>
                        </div>
                    </section>

                    <HowItWorks />

                    {/* Final CTA */}
                    <section className="py-20 bg-brand-blue text-white text-center">
                        <div className="mx-auto max-w-3xl px-screen-p">
                            <h2 className="text-4xl font-bold mb-6">Open your global account in minutes.</h2>
                            <p className="text-white/80 mb-10 text-lg font-medium">
                                Start managing USD and EUR the smart way. No monthly fees.
                            </p>
                            <Button className="h-14 px-12 bg-white text-brand-blue hover:bg-n-100 font-bold text-lg rounded-brand-button">
                                Get Started
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}