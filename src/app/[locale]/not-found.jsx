// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 rounded-full bg-n-100 p-6">
        <span className="text-4xl">🔍</span>
      </div>
      <h1 className="mb-2 text-3xl font-bold text-n-900">Page not found</h1>
      <p className="mb-8 max-w-md text-n-500 text-sm">
        We couldn’t find the page you’re looking for. It might have been moved or doesn’t exist.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}