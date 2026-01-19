'use client'

// components/layout/Header.tsx
// import Link from 'next/link';

// export default function Header() {
//   return (
//     <nav className="sticky top-0 z-50 w-full border-b border-n-300 bg-white/80 backdrop-blur-md">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-screen-p">
//         <div className="flex items-center gap-8">
//           <Link href="/" className="text-2xl font-bold text-brand-blue tracking-tighter">
//             PaySense
//           </Link>
//           <div className="hidden md:flex items-center gap-6 text-sm font-medium text-n-700">
//             <Link href="/personal" className="hover:text-brand-blue">Personal</Link>
//             <Link href="/business" className="hover:text-brand-blue">Business</Link>
//             <Link href="/company" className="hover:text-brand-blue">Company</Link>
//             <Link href="/help" className="hover:text-brand-blue">Help</Link>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-4">
//           <Link href="/login" className="hidden text-sm font-semibold text-brand-blue md:block">
//             Log In
//           </Link>
//           <Link href="/signup" className="btn-primary !h-10 text-sm">
//             Join PaySense
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"

import { Sun, Moon, SearchIcon, MenuIcon, User, X } from "lucide-react"

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="w-full h-14 sticky top-0 z-50 lg:px-4 backdrop-filter backdrop-blur-xl bg-opacity-5 border-b">
            <div className="sm:container h-full max-sm:px-3 flex items-center justify-between mx-auto gap-2">
                <div className="flex items-center gap-9 flex-auto">
                    <Logo />
                    <div className="lg:flex hidden lg:justify-center flex-auto items-center gap-5 text-sm font-medium text-black dark:text-muted-foreground">
                        <Link href="/personal" className="hover:text-primary transition-colors p-2">Personal</Link>
                        <Link href="/business" className="hover:text-primary transition-colors p-2">Business</Link>
                        <Link href="/help" className="hover:text-primary transition-colors p-2">Help</Link>
                    </div>
                </div>

                <div>
                    <Button
                        variant="ghost"
                        className="lg:hidden cursor-pointer dark:bg-zinc-900 bg-zinc-100"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Open menu"
                    >
                        <MenuIcon className="block" size={16} />
                    </Button>
                    <Link href="/login">
                        <Button variant="ghost" className="hidden lg:block cursor-pointer dark:bg-zinc-900 bg-zinc-100 px-auto" size="icon">
                            <User className="block mx-auto" size={16} />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="absolute bg-background lg:hidden w-full flex flex-col justify-center gap-1 p-4 text-sm font-medium text-black dark:text-muted-foreground shadow-lg animate-in fade-in slide-in-from-top-2 z-50">
                    <Link className="p-2" href={`/personal`} onClick={() => setIsMobileMenuOpen(false)}>Personal</Link>
                    <Link className="p-2" href={`/business`} onClick={() => setIsMobileMenuOpen(false)}>Business</Link>
                    <Link className="p-2" href={`/help`} onClick={() => setIsMobileMenuOpen(false)}>Help</Link>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="cursor-pointer dark:bg-zinc-900 bg-zinc-100 w-full mt-2" size="icon">
                            <User className="block" size={16} />
                            <span className="ml-2">Login</span>
                        </Button>
                    </Link>
                </div>
            )}
        </nav>
    )
}

function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3">
            <Image src={`/img/logo.png`} className="w-8 h-8 rounded-sm object-cover" width={400} height={400} alt="Amoke Emmanuel" />
        </Link>
    );
}