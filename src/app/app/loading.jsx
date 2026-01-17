// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Wallet Card Skeleton */}
      <div className="h-[200px] w-full max-w-md bg-n-300/30 rounded-brand-card" />
      
      {/* Action Buttons Skeleton */}
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 w-24 bg-n-300/20 rounded-brand-button" />
        ))}
      </div>

      {/* Transaction List Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-n-300/20 rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full bg-white border border-n-300 rounded-brand-card" />
        ))}
      </div>
    </div>
  );
}