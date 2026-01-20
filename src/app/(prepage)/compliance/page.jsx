import { ShieldCheck, UserCheck, Search, Database, AlertCircle, Mail } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 px-6 lg:pt-48 lg:pb-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Compliance and regulatory responsibility
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We operate with a strong commitment to regulatory compliance, 
            financial security, and responsible banking practices.
          </p>
        </div>
      </section>

      {/* 2. REGULATORY FRAMEWORK */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-700 mb-8">
            We operate in accordance with applicable financial regulations and industry standards in the regions where our services are offered. This includes compliance with requirements related to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {['Financial licensing', 'Anti-money laundering (AML)', 'Counter-terrorist financing (CTF)', 'Data protection and privacy'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                <ShieldCheck className="text-blue-600" size={20} />
                <span className="font-medium text-slate-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. KYC & KYB VERIFICATION */}
        <div className="space-y-12 py-12 border-t border-slate-100">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <UserCheck className="text-blue-600" /> Identity Verification
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Individual (KYC)</h3>
              <p className="text-slate-600 mb-4">To use our services, individuals are required to verify their identity. This may include:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>Government-issued identification</li>
                <li>Proof of address</li>
                <li>Biometric verification</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Business (KYB)</h3>
              <p className="text-slate-600 mb-4">Businesses must complete verification before activation, which may include:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>Business registration documents (CAC)</li>
                <li>Ownership and control information</li>
                <li>Director or shareholder verification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. AML & MONITORING */}
        <div className="py-12 border-t border-slate-100">
          <div className="bg-slate-900 text-white p-10 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-blue-600/20 p-4 rounded-2xl text-blue-400">
              <Search size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">AML & Monitoring</h3>
              <p className="text-slate-400">We maintain systems designed to detect, prevent, and report suspicious activity, including ongoing transaction monitoring and risk-based reviews.</p>
            </div>
          </div>
        </div>

        {/* 5. CURRENCY CONTROLS & RISK */}
        <div className="grid md:grid-cols-2 gap-12 py-12 border-t border-slate-100">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Database size={20} className="text-blue-600"/> Data Protection
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We protect personal and business data using industry-standard security measures, including encryption and access controls. We process data in line with applicable data protection regulations.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-600"/> Risk Disclosure
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Financial services involve risk, including exchange rate fluctuations and transaction delays. Users are responsible for reviewing transaction details before confirmation.
            </p>
          </div>
        </div>

        {/* 6. COMPLIANCE CONTACT */}
        <div className="mt-12 p-8 bg-secondary border border-blue-100 rounded-2xl text-center">
          <p className="text-slate-700 font-medium mb-4 flex items-center justify-center gap-2">
            <Mail size={18} className="text-blue-600"/> For compliance-related inquiries, contact:
          </p>
          <a href="mailto:support@paysense.com" className="text-2xl font-bold text-brand-blue hover:underline">
            support@paysense.com
          </a>
        </div>
      </section>
    </div>
  );
}