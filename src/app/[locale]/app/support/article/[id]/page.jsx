'use client'

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Share2, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import { helpTopics } from "@/lib/helpdata"
import { Button } from "@/components/ui/button"

export default function ArticlePage() {
    const params = useParams()
    const router = useRouter()
    
    // Find the article based on the ID in the URL
    const article = helpTopics.find(t => t.id === parseInt(params.id))

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-xl font-bold">Article not found</h1>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Simple Top Nav */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-50 px-6 py-4 flex items-center justify-between z-10">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
                    <ArrowLeft size={22} className="text-brand-dark" />
                </button>
                <span className="text-xs font-bold text-n-400 uppercase tracking-widest">{article.category}</span>
                <button className="p-2 -mr-2 hover:bg-slate-50 rounded-full transition-colors">
                    <Share2 size={20} className="text-n-400" />
                </button>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-8">
                {/* Header */}
                <h1 className="text-3xl font-black text-brand-dark leading-tight mb-4">
                    {article.title}
                </h1>
                <p className="text-n-500 text-sm mb-8 italic">
                    {article.excerpt}
                </p>

                {/* Content - Formatted for readability */}
                <div className="prose prose-slate max-w-none">
                    {article.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="text-brand-dark/80 leading-relaxed mb-4 text-[15px]">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Feedback Section */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-[32px] p-8 text-center">
                        <p className="text-sm font-bold text-brand-dark mb-4">Was this article helpful?</p>
                        <div className="flex items-center justify-center gap-4">
                            <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl hover:border-primary transition-colors">
                                <ThumbsUp size={18} className="text-bank-success" />
                                <span className="text-sm font-bold">Yes</span>
                            </button>
                            <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl hover:border-red-200 transition-colors">
                                <ThumbsDown size={18} className="text-red-400" />
                                <span className="text-sm font-bold">No</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Footer */}
                <div className="mt-10 text-center">
                    <p className="text-xs text-n-400">
                        Still need help? 
                        <Link href="/app/support" className="text-primary font-bold ml-1 underline">
                            Contact our support team
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}