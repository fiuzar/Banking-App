'use client'

import { Search, ChevronRight, SearchX } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { helpTopics } from "@/lib/helpdata"
import Link from "next/link"
import { useState, useRef } from "react"

export function HelpSearch() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q')?.toString() || "")
    const [showDropdown, setShowDropdown] = useState(false)
    const inputRef = useRef(null)

    const filteredTopics = searchTerm
        ? helpTopics.filter((topic) =>
            topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : []

    function handleSearch(term) {
        setSearchTerm(term)
        setShowDropdown(!!term)
    }

    function handleSubmit(e) {
        e.preventDefault()
        setShowDropdown(false)
        const params = new URLSearchParams(searchParams)
        if (searchTerm) {
            params.set('q', searchTerm)
        } else {
            params.delete('q')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    function handleBlur() {
        // Delay to allow click on dropdown items
        setTimeout(() => setShowDropdown(false), 100)
    }

    return (
        <div className="relative shadow-xl shadow-primary/5">
            <form onSubmit={handleSubmit}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-n-300" size={18} />
                <Input
                    ref={inputRef}
                    className="h-14 pl-12 bg-white rounded-2xl border-none text-brand-dark font-medium shadow-sm"
                    placeholder="Search for help topics..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setShowDropdown(!!searchTerm)}
                    onBlur={handleBlur}
                />
            </form>
            {showDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl border border-slate-100 shadow-lg z-10 max-h-64 overflow-auto">
                    {filteredTopics.length > 0 ? (
                        filteredTopics.slice(0, 6).map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/app/support/article/${topic.id}`}
                                className="block px-5 py-3 hover:bg-slate-50 transition-colors"
                                onMouseDown={e => e.preventDefault()}
                            >
                                <div className="text-sm font-bold text-brand-dark">{topic.title}</div>
                                <div className="text-xs text-n-500 line-clamp-1">{topic.excerpt}</div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-5 text-center flex flex-col items-center">
                            <SearchX size={24} className="text-n-200 mb-1" />
                            <p className="text-xs text-n-400">No results found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export function PopularTopics() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q')?.toLowerCase() || ""

    const filteredTopics = helpTopics.filter((topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.category.toLowerCase().includes(query) ||
        topic.excerpt.toLowerCase().includes(query)
    )

    // Only show the top 4 if not searching
    const displayItems = query ? filteredTopics : helpTopics.slice(0, 4)

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest">
                    {query ? `Search Results (${filteredTopics.length})` : "Popular Topics"}
                </p>
                {query && (
                    <button 
                        onClick={() => window.history.replaceState({}, '', window.location.pathname)}
                        className="text-[10px] font-bold text-primary uppercase"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
                {displayItems.length > 0 ? (
                    displayItems.map((topic) => (
                        <FAQLink 
                            key={topic.id} 
                            id={topic.id} 
                            title={topic.title} 
                            description={topic.excerpt}
                            isSearching={query.length > 0} 
                        />
                    ))
                ) : (
                    <div className="p-10 text-center flex flex-col items-center">
                        <SearchX size={32} className="text-n-200 mb-2" />
                        <p className="text-sm font-bold text-brand-dark">No results found</p>
                        <p className="text-xs text-n-400">Try searching for &ldquo;Card&ldquo; or &ldquo;Limits&ldquo;</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function FAQLink({ title, description, id, isSearching }) {
    return (
        <Link 
            href={`/app/support/article/${id}`} 
            className="p-5 flex items-start justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
        >
            <div className="space-y-1">
                <span className="text-sm font-bold text-brand-dark group-hover:text-primary transition-colors">
                    {title}
                </span>
                {/* Show description only when the user is searching */}
                {isSearching && (
                    <p className="text-xs text-n-500 line-clamp-1 italic">{description}</p>
                )}
            </div>
            <ChevronRight size={16} className="text-n-300 mt-1" />
        </Link>
    )
}