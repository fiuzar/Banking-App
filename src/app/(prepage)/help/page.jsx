import { Search, Wallet, RefreshCw, Send, CreditCard, Landmark, ShieldCheck, HelpCircle, Mail, MessageSquare } from 'lucide-react';

export default function HelpPage() {
  const categories = [
    { icon: <Wallet size={24} />, title: "Accounts & Wallets" },
    { icon: <RefreshCw size={24} />, title: "FX & Conversion" },
    { icon: <Send size={24} />, title: "Transfers" },
    { icon: <CreditCard size={24} />, title: "Cards" },
    { icon: <Landmark size={24} />, title: "Loans" },
    { icon: <ShieldCheck size={24} />, title: "Security" },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans">
      {/* 1. HEADER & SEARCH */}
      <section className="bg-brand-dark pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-8">Help & Support</h1>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for help (e.g. 'currency conversion', 'cards')" 
              className="w-full bg-accent-foreground border border-slate-700 text-white rounded-2xl py-5 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      {/* 2. QUICK HELP CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <button key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center flex flex-col items-center gap-3">
              <div className="text-accent-foreground">{cat.icon}</div>
              <span className="text-sm font-semibold text-slate-700">{cat.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-2xl font-bold mb-12 flex items-center gap-2">
          <HelpCircle className="text-blue-600" /> Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <FAQItem 
            question="What currencies are supported?" 
            answer="Currently, we support USD and EUR. Each is managed in a separate wallet to ensure total transparency and no accidental conversions." 
          />
          <FAQItem 
            question="Are conversions automatic?" 
            answer="No. To uphold our 'No Silent FX' promise, all currency conversions must be manually reviewed and confirmed by you." 
          />
          <FAQItem 
            question="Are cards linked to a specific currency?" 
            answer="Yes. Each virtual card is tied specifically to either your USD or EUR wallet. This prevents unexpected exchange rate fluctuations during transactions." 
          />
          <FAQItem 
            question="Why do I need to verify my identity?" 
            answer="Identity verification (KYC) is a regulatory requirement that keeps your funds safe and allows us to provide international banking rails." 
          />
        </div>
      </section>

      {/* 4. CONTACT & ESCALATION */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex items-start gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl text-brand-dark"><Mail /></div>
            <div>
              <h4 className="font-bold text-lg mb-1">Email Support</h4>
              <p className="text-slate-500 text-sm mb-4">Typical response time: Within 24 hours</p>
              <a href="mailto:support@paysense.com" className="text-brand-blue font-semibold hover:underline">support@paysense.com</a>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex items-start gap-6">
            <div className="bg-green-50 p-4 rounded-2xl text-green-600"><MessageSquare /></div>
            <div>
              <h4 className="font-bold text-lg mb-1">Live Chat</h4>
              <p className="text-slate-500 text-sm mb-4">Available Mon-Fri, 9am - 5pm WAT</p>
              <button className="text-green-600 font-semibold hover:underline">Start a conversation</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-slate-800">
        {question}
        <span className="transition-transform group-open:rotate-180 text-brand-blue">+</span>
      </summary>
      <div className="px-6 pb-6 text-slate-600 leading-relaxed">
        {answer}
      </div>
    </details>
  );
}