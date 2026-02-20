// app/dashboard/error.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center px-6">
      <div className="mb-6 rounded-full bg-bank-error/10 p-4 text-bank-error">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-brand-dark mb-2">Something went wrong</h2>
      <p className="text-n-500 mb-8 max-w-sm">
        We couldn&apos;t load your financial data. This might be a temporary connection issue.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.href = '/admin'} className="rounded-brand-button">
          Go to Dashboard
        </Button>
        <Button onClick={() => reset()} className="btn-primary">
          Try Again
        </Button>
      </div>
    </div>
  );
}