const transactions = [
  { id: 1, title: "FX Conversion", sub: "To EUR Wallet", amount: "-$1,000.00", currency: "USD", type: "debit" },
  { id: 2, title: "FX Conversion", sub: "From USD Wallet", amount: "+€917.00", currency: "EUR", type: "credit" },
  { id: 3, title: "Amazon EU", sub: "Card Purchase", amount: "-€120.00", currency: "EUR", type: "debit" },
  { id: 4, title: "Salary Credit", sub: "TechCorp Intl", amount: "+$3,200.00", currency: "USD", type: "credit" },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-brand-card p-6 shadow-soft">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-brand-dark">Recent Activity</h3>
        <button className="text-xs font-bold text-brand-blue hover:underline">View All</button>
      </div>
      
      <div className="space-y-6">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${tx.currency === 'USD' ? 'bg-usd/10 text-usd' : 'bg-eur/10 text-eur'}`}>
                {tx.currency}
              </div>
              <div>
                <p className="text-sm font-bold text-brand-dark">{tx.title}</p>
                <p className="text-[11px] text-n-500">{tx.sub}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-mono font-bold ${tx.type === 'credit' ? 'text-usd' : 'text-brand-dark'}`}>
                {tx.amount}
              </p>
              <p className="text-[10px] text-n-300 font-bold uppercase">{tx.currency}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}