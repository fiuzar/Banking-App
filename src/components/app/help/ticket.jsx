'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Loader2, AlertCircle } from "lucide-react"
import { CustomSelect } from "@/components/ui/custom-select"
import { createTicket } from "@/server-functions/support"

export function CreateTicketModal({ isOpen, onClose }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Custom error state

    if (!isOpen) return null;

    const categories = [
        { label: "Transaction Issue", value: "TRANSACTION" },
        { label: "Account Access", value: "ACCOUNT" },
        { label: "Card Replacement", value: "CARD" },
        { label: "Other", value: "OTHER" }
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous errors
        
        try {
            const formData = new FormData(e.currentTarget);
            const result = await createTicket(formData);

            if (result.success) {
                onClose();
                router.push(`/app/support/chats/${result.conversationId}`);
            } else {
                setError("We couldn't create your ticket. Please check your connection and try again.");
            }
        } catch (err) {
            setError("A system error occurred. Please try again later.");
            console.error("Submission error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-middle duration-300 shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-black text-brand-dark italic">Open a Ticket</h2>
                    <button 
                        onClick={() => { setError(null); onClose(); }} 
                        className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Custom Error Banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="text-red-500 shrink-0" size={18} />
                            <p className="text-xs font-bold text-red-600 leading-tight">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Subject</label>
                        <Input 
                            name="subject" 
                            required 
                            placeholder="e.g., Missing Deposit" 
                            className="rounded-xl h-12 bg-slate-50 border-none mt-1 focus-visible:ring-primary/20" 
                        />
                    </div>
                    
                    <CustomSelect 
                        label="Category" 
                        name="category" 
                        options={categories} 
                        defaultValue="TRANSACTION" 
                    />

                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Description</label>
                        <Textarea 
                            name="description"
                            required
                            placeholder="Tell us more about the issue..." 
                            className="rounded-xl min-h-[120px] bg-slate-50 border-none mt-1 resize-none focus-visible:ring-primary/20" 
                        />
                    </div>

                    <Button 
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Processing...</span>
                            </>
                        ) : (
                            "Submit Ticket"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}