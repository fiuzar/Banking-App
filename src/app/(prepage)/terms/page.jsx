// app/terms/page.tsx
import { ScrollArea } from "@/components/ui/scroll-area";

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "definitions", title: "2. Definitions" },
  { id: "eligibility", title: "3. Eligibility" },
  { id: "security", title: "4. Account Security" },
  { id: "wallets", title: "5. Wallets & Currencies" },
  { id: "fx", title: "7. FX Conversion" },
  { id: "loans", title: "9. Loans" },
  { id: "compliance", title: "11. Compliance & KYC" },
];

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Simple Hero Header */}
      <div className="border-b border-n-100 py-16 bg-n-100/50">
        <div className="mx-auto max-w-7xl px-screen-p">
          <h1 className="text-4xl font-bold text-brand-dark mb-4">Terms & Conditions</h1>
          <p className="text-n-500 font-medium">Last updated: January 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-screen-p py-12 flex flex-col md:flex-row gap-12">
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden md:block w-64 sticky top-24 h-fit">
          <nav className="space-y-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block py-2 px-3 text-sm font-medium text-n-500 hover:text-brand-blue hover:bg-brand-blue/5 rounded-md transition-colors"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl space-y-12 pb-24">
          <section id="intro" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">1. Introduction</h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>This document governs the use of the PaySense app, website, and all associated services. By creating an account, you explicitly agree to be bound by these terms.</p>
              <p>These terms apply to all users globally, regardless of their country of residence, subject to local regulatory requirements.</p>
            </div>
          </section>

          <section id="wallets" className="scroll-mt-24 p-8 bg-blue-50/50 rounded-brand-card border border-brand-blue/10">
            <h2 className="text-2xl font-bold text-brand-blue mb-4">5. Wallets & Currencies</h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>PaySense allows users to hold separate **USD and EUR wallets**. These balances are distinct and are shown per currency.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                <li>Wallets do not perform automatic conversions.</li>
                <li>Conversion only occurs when you explicitly approve the transaction.</li>
                <li>Balances are held securely with our regulated partner banks.</li>
              </ul>
            </div>
          </section>

          <section id="fx" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">7. FX Conversion</h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>Transparency is our core principle. Exchange rates and all applicable fees are shown in the app before you confirm any conversion.</p>
              <p className="bg-n-100 p-4 rounded-brand-input border-l-4 border-brand-blue font-semibold italic text-sm">
                "Once confirmed, FX conversions are final and cannot be reversed."
              </p>
              <p>The app does not perform "silent" or hidden conversions. The rate you see is the rate you get.</p>
            </div>
          </section>

          <section id="loans" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">9. Loans</h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>Loans are strictly currency-specific (USD or EUR). To protect users from market volatility, **repayments must be made in the same currency as the loan principal.**</p>
              <p>FX conversion is not permitted for the purpose of loan repayment to ensure zero FX risk for the borrower.</p>
            </div>
          </section>

          <section id="compliance" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">11. Compliance & KYC</h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>To prevent fraud and comply with international AML (Anti-Money Laundering) regulations, all users are required to undergo identity verification (KYC).</p>
              <p>Failure to provide accurate documentation may result in account restrictions or termination.</p>
            </div>
          </section>

          <div className="pt-12 border-t border-n-100">
            <p className="text-sm text-n-500 italic">
              Questions about these terms? Contact us at <span className="text-brand-blue font-bold">legal@paysense.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}