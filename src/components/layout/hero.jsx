// components/home/Hero.tsx
import { Button } from "@/components/ui/button";
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24">
      <div className="mx-auto max-w-7xl px-screen-p flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-[1.1] tracking-tight mb-6">
            Send, spend, and manage money globally <span className="text-brand-blue">in USD & EUR.</span>
          </h1>
          <p className="text-lg md:text-xl text-n-500 mb-10 max-w-xl">
            Transparent international payments, currency-bound cards, and compliant loans. No hidden FX. No surprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button className="btn-primary text-lg px-10 h-14">Get Started</Button>
            <Button variant="outline" className="h-14 px-10 rounded-brand-button border-n-300 text-brand-blue font-bold">
              Log In
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-n-500">
            <span className="flex items-center gap-1">🛡️ Regulated & Compliant</span>
            <span className="flex items-center gap-1">⚡ Real-time FX</span>
          </div>
        </div>
        
        <div className="flex-1 relative w-full max-w-[500px]">
          <Image src="/img/hero.png" width={400} height={400} className="w-full" alt="" />
          {/* This represents the Kuda-style phone mock with your brand colors */}
          {/* <div className="aspect-[9/19] bg-brand-dark rounded-[3rem] border-[8px] border-n-900 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 w-full h-full bg-gradient-to-b from-brand-blue/20 to-transparent p-6">
                <div className="h-8 w-24 bg-white/10 rounded-full mb-8" />
                <div className="space-y-4">
                  <div className="h-32 w-full bg-white/10 rounded-2xl" />
                  <div className="h-20 w-full bg-white/5 rounded-2xl" />
                </div>
             </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}