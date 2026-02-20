// app/dashboard/not-found.tsx
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold text-brand-dark">Not found</h2>
      <p className="text-n-500 mt-2 mb-6 text-sm">The item you are looking for does not exist or you don&apos;t have access.</p>
      <Link href="/dashboard" className="text-brand-blue font-bold hover:underline">
        Back to Overview
      </Link>
    </div>
  );
}