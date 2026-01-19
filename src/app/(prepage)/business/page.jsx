import { Building2, Briefcase, Users, ShoppingCart, ShieldCheck, Landmark, Globe, Receipt, ArrowRight } from 'lucide-react';
import Image from "next/image"

export default function BusinessPage() {
  return (
    <div className="bg-white text-slate-900 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 px-6 lg:py-32 bg-brand-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 text-left">
          <div>
            <span className="inline-block py-1 px-3 mb-6 text-sm font-medium bg-accent-foreground/20 text-primary-foreground rounded-full border border-secondary/30">
              For Modern Enterprises
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
              International banking <br /> 
              <span className="text-accent">for businesses.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mb-10 leading-relaxed">
              Manage USD and EUR, pay international vendors, and control team spending from one powerful dashboard. Built for the global African business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-brand-blue text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent-foreground transition-all flex items-center justify-center gap-2">
                Open business account <ArrowRight size={18} />
              </button>
              <button className="bg-transparent border border-slate-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all">
                Talk to sales
              </button>
            </div>
          </div>
          {/* Illustration Mockup placeholder */}
          <div className="hidden lg:block relative">
            <Image className="w-full rounded-lg" src="/img/home1.png" width={400} height={400} alt="" />
          </div>
        </div>
      </section>

      {/* 2. WHO IT'S FOR */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-400 mb-12">Who we serve</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Briefcase size={20}/>, label: 'Freelancers' },
              { icon: <Building2 size={20}/>, label: 'Startups & SMEs' },
              { icon: <Users size={20}/>, label: 'Remote Teams' },
              { icon: <ShoppingCart size={20}/>, label: 'Merchants' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-slate-600">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">{item.icon}</div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BUSINESS FEATURES (Bento Style) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureBox 
            icon={<Landmark className="text-brand-blue" />}
            title="USD & EUR Business Wallets"
            desc="Separate balances for your global operations. No forced conversion; hold your revenue in the currency you earned it."
          />
          <FeatureBox 
            icon={<Globe className="text-brand-blue" />}
            title="International Transfers"
            desc="Pay vendors in 100+ countries via SWIFT, ACH, or SEPA. Transparent fees confirmed by you before every send."
          />
          <FeatureBox 
            icon={<Receipt className="text-brand-blue" />}
            title="Business Cards"
            desc="Issue virtual cards to your team. Set limits, track spending, and handle international subscriptions with ease."
          />
          <FeatureBox 
            icon={<ShieldCheck className="text-brand-blue" />}
            title="Business Loans"
            desc="Access capital in USD or EUR based on your cash flow. Simple repayment terms with zero hidden markups."
          />
        </div>
      </section>

      {/* 4. HOW IT WORKS (The Verification Flow) */}
      <section className="py-24 border-t border-slate-100 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">The Onboarding Process</h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <Step num="1" title="Create Account" desc="Provide basic company and owner details." />
            <Step num="2" title="Verify Business" desc="Upload CAC documents and complete KYB checks." />
            <Step num="3" title="Start Operating" desc="Access your wallets and start transacting globally." />
          </div>
        </div>
      </section>

      {/* 5. COMPLIANCE & CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-brand-dark rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Scale your business globally</h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto">Join the new era of African business. Verification is required to ensure a secure ecosystem for all partners.</p>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all">
              Open business account
            </button>
            <p className="mt-6 text-xs text-slate-500 uppercase tracking-widest font-semibold">Business verification required</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureBox({ icon, title, desc }) {
  return (
    <div className="p-10 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-200 transition-colors">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ num, title, desc }) {
  return (
    <div className="relative">
      <div className="text-6xl font-black text-slate-100 absolute -top-10 left-1/2 -translate-x-1/2 -z-10">{num}</div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-slate-500 text-sm">{desc}</p>
    </div>
  );
}