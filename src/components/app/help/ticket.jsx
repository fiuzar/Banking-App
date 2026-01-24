'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Assuming you have this shadcn component
import { X } from "lucide-react"

export function CreateTicketModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-brand-dark">Open a Ticket</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full"><X size={18} /></button>
        </div>
        
        <form className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-n-400 ml-1">Subject</label>
            <Input placeholder="e.g., Missing Deposit" className="rounded-xl h-12 bg-slate-50 border-none" />
          </div>
          
          <div>
            <label className="text-[10px] font-bold uppercase text-n-400 ml-1">Category</label>
            <select className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-medium border-none outline-none appearance-none">
              <option>Transaction Issue</option>
              <option>Account Access</option>
              <option>Card Replacement</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-n-400 ml-1">Description</label>
            <Textarea 
              placeholder="Tell us more about the issue..." 
              className="rounded-xl min-h-[120px] bg-slate-50 border-none" 
            />
          </div>

          <Button className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20">
            Submit Ticket
          </Button>
        </form>
      </div>
    </div>
  )
}