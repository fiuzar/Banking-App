import { Target, Star, TrendingUp, MapPin, ArrowUpRight, Mail } from 'lucide-react';

export default function CareersPage() {
  const teams = ["Engineering", "Product & Design", "Compliance & Risk", "Operations", "Customer Support", "Business & Partnerships"];

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 bg-indigo-50/30 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-7xl font-bold tracking-tight mb-8">
            Build the future of <br />
            <span className="text-indigo-600">international banking.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Join a team focused on transparency, security, and building financial products that work across borders.
          </p>
        </div>
      </section>

      {/* 2. WHY WORK WITH US */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <CultureCard 
            icon={<Target className="text-indigo-600" />} 
            title="Meaningful Work" 
            desc="Build products that help individuals and businesses manage money internationally." 
          />
          <CultureCard 
            icon={<Star className="text-indigo-600" />} 
            title="High Standards" 
            desc="We value clear thinking, responsibility, and quality execution in everything we do." 
          />
          <CultureCard 
            icon={<TrendingUp className="text-indigo-600" />} 
            title="Growth-Oriented" 
            desc="Opportunities to learn, take ownership, and grow alongside the company." 
          />
          <CultureCard 
            icon={<MapPin className="text-indigo-600" />} 
            title="Flexible Work" 
            desc="Remote or hybrid work options, designed for the modern global workforce." 
          />
        </div>
      </section>

      {/* 3. TEAMS & ROLES */}
      <section className="py-24 bg-slate-900 text-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Our Teams</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, idx) => (
              <div key={idx} className="p-6 border border-slate-700 rounded-2xl hover:border-indigo-500 transition-colors group">
                <h3 className="text-xl font-semibold flex items-center justify-between">
                  {team} <ArrowUpRight className="text-slate-500 group-hover:text-indigo-400" size={18} />
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OPEN POSITIONS & PROCESS */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 mb-24">
          <h2 className="text-3xl font-bold mb-6">Open Positions</h2>
          <p className="text-slate-600 mb-8 italic">
            &ldquo;We’re growing and regularly open roles across engineering, product, compliance, and operations.&ldquo;
          </p>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            View open positions
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-12">Hiring Process</h2>
          <div className="space-y-8">
            {[
              { step: "01", title: "Application Review", desc: "We review your CV, portfolio, and background." },
              { step: "02", title: "Initial Interview", desc: "A brief conversation about your experience and the role." },
              { step: "03", title: "Role-Specific Assessment", desc: "A practical challenge to showcase your technical or creative skills." },
              { step: "04", title: "Final Decision", desc: "A final culture-fit chat followed by an offer." }
            ].map((s, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <span className="text-indigo-600 font-mono font-bold">{s.step}</span>
                <div>
                  <h4 className="font-bold text-lg">{s.title}</h4>
                  <p className="text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DIVERSITY & CTA */}
      <section className="py-24 px-6 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 max-w-2xl mx-auto">
             <h3 className="font-bold text-xl mb-4">Inclusion Statement</h3>
             <p className="text-slate-600">We are committed to building an inclusive workplace and encourage applications from people of diverse backgrounds and experiences.</p>
          </div>
          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
            <h2 className="text-3xl font-bold mb-4">Interested in joining us?</h2>
            <p className="text-slate-500 mb-10">Send your CV or portfolio to our careers team.</p>
            <div className="flex flex-col items-center gap-4">
               <a href="mailto:careers@company.com" className="text-2xl font-bold text-indigo-600 hover:underline flex items-center gap-2">
                 <Mail size={24}/> careers@company.com
               </a>
               <button className="mt-4 bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-black transition-all">
                 Apply now
               </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CultureCard({ icon, title, desc }) {
  return (
    <div className="space-y-4 text-center lg:text-left">
      <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}