// app/privacy/page.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck, Database, Eye, Share2, Lock } from "lucide-react";

const policySections = [
  {
    id: "collect",
    title: "1. Information We Collect",
    icon: <Database className="w-5 h-5 text-brand-blue" />,
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-n-900 text-sm mb-2">A. Personal Information</h4>
          <p className="text-n-500 text-sm">Full name, email address, phone number, date of birth, and country of residence.</p>
        </div>
        <div>
          <h4 className="font-bold text-n-900 text-sm mb-2">B. Financial Information</h4>
          <p className="text-n-500 text-sm">Wallet balances, transaction history, FX conversions, and loan records.</p>
        </div>
        <div>
          <h4 className="font-bold text-n-900 text-sm mb-2">C. Technical Data</h4>
          <p className="text-n-500 text-sm">Device information, IP address, and login activity (time, location, device type).</p>
        </div>
      </div>
    ),
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    icon: <Eye className="w-5 h-5 text-brand-blue" />,
    content: (
      <ul className="list-disc pl-5 space-y-2 text-n-500 text-sm">
        <li>To provide and manage your USD & EUR banking services.</li>
        <li>To process transactions and FX conversions securely.</li>
        <li>To comply with international financial regulations and AML laws.</li>
        <li>To prevent fraud and unauthorized access to your account.</li>
        <li>To send you important service updates and security alerts.</li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "3. Data Sharing",
    icon: <Share2 className="w-5 h-5 text-brand-blue" />,
    content: (
      <p className="text-n-500 text-sm leading-relaxed">
        We share your data with regulated financial partners, payment networks (Visa/Mastercard), 
        and fraud-prevention providers. <span className="font-bold text-brand-dark">We never sell your data to advertisers.</span>
      </p>
    ),
  },
  {
    id: "security",
    title: "4. Security Measures",
    icon: <Lock className="w-5 h-5 text-brand-blue" />,
    content: (
      <div className="bg-n-100 p-4 rounded-brand-card">
        <p className="text-n-700 text-sm font-medium">
          PaySense uses bank-grade encryption (AES-256) for data at rest and TLS for data in transit. 
          We maintain strict access controls and monitor our systems 24/7 for unauthorized activity.
        </p>
      </div>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-n-100/50 border-b border-n-100 py-20">
        <div className="mx-auto max-w-3xl px-screen-p text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4" />
            Security First
          </div>
          <h1 className="text-4xl font-extrabold text-brand-dark mb-4">Privacy Policy</h1>
          <p className="text-n-500 max-w-lg mx-auto">
            At PaySense, your privacy is a priority. Learn how we collect, use, and protect your personal and financial data.
          </p>
        </div>
      </div>

      {/* Accordion Content */}
      <div className="mx-auto max-w-3xl px-screen-p py-16">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {policySections.map((section) => (
            <AccordionItem 
              key={section.id} 
              value={section.id} 
              className="border border-n-100 rounded-brand-card px-6 overflow-hidden data-[state=open]:border-brand-blue/20 transition-all"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  {section.icon}
                  <span className="text-lg font-bold text-brand-dark">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-8 pt-2">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Footer Legal Note */}
        <div className="mt-16 p-8 bg-brand-dark rounded-brand-card text-white">
          <h3 className="text-xl font-bold mb-4">Your Rights</h3>
          <p className="text-n-300 text-sm leading-relaxed mb-6">
            Under international data protection laws, you have the right to access, correct, or request the deletion of your data. 
            Financial records must be retained for a minimum period as required by law.
          </p>
          <a href="mailto:privacy@paysense.com" className="inline-block btn-primary bg-white! text-brand-dark! px-6 py-2 h-auto text-sm">
            Contact Privacy Officer
          </a>
        </div>
      </div>
    </div>
  );
}