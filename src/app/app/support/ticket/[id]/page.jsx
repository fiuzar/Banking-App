'use client'

import { Send, Paperclip } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function TicketDetail() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header with Status Badge */}
      <div className="p-6 bg-white border-b flex items-center justify-between">
         <div>
            <h2 className="text-sm font-bold text-brand-dark">Missing Wire Transfer</h2>
            <p className="text-[10px] text-n-400 font-medium">TIC-8829 • Opened Oct 24</p>
         </div>
         <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            In Progress
         </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Admin Message */}
        <div className="flex flex-col items-start max-w-[80%]">
          <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-brand-dark">
            Hello! We are currently investigating your wire transfer with our partner bank. It should clear within 2 hours.
          </div>
          <span className="text-[9px] font-bold text-n-400 mt-2 ml-1 uppercase">Support Agent • 10:30 AM</span>
        </div>

        {/* User Message */}
        <div className="flex flex-col items-end ml-auto max-w-[80%]">
          <div className="bg-primary p-4 rounded-2xl rounded-tr-none text-white shadow-lg shadow-primary/10 text-sm">
            Thank you for the update. I will wait and check my balance later.
          </div>
          <span className="text-[9px] font-bold text-n-400 mt-2 mr-1 uppercase">You • 10:45 AM</span>
        </div>
      </div>

      {/* Reply Input */}
      <div className="p-6 bg-white border-t pb-10">
        <div className="relative flex items-center">
          <button className="absolute left-4 text-n-300">
            <Paperclip size={20} />
          </button>
          <Input 
            className="h-14 pl-12 pr-16 bg-slate-50 border-none rounded-2xl text-sm font-medium"
            placeholder="Type your reply..."
          />
          <button className="absolute right-3 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}