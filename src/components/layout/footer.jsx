import Link from "next/link"

// components/layout/Footer.tsx
export default function Footer() {
    return (
        <footer className="bg-white border-t border-n-300 py-16">
            <div className="mx-auto max-w-7xl px-screen-p">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-1">
                        <span className="text-xl font-bold text-brand-blue">PaySense</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-n-900 mb-4">Features</h4>
                        <ul className="space-y-2 text-sm text-n-500">
                            <li>USD Wallet</li>
                            <li>EUR Wallet</li>
                            <li>Virtual Cards</li>
                            <li>International FX</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-n-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-n-500">
                            <li>
                                <Link href="/about">About Us</Link></li>
                            <li>
                                <Link href="/compliance">Compliance</Link>
                            </li>
                            <li>
                                <Link href={`/careers`}>Careers</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-n-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-n-500">
                            <li>
                                <Link href="/privacy">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-n-100 text-[12px] text-n-500 leading-relaxed">
                    PaySense is a financial technology company, not a bank. Banking services are provided by our licensed partner banks. USD deposits are FDIC insured up to $250,000 through our partner banks.
                </div>
            </div>
        </footer>
    );
}