'use client'

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"

export function CustomSelect({ name, options, defaultValue, label }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options.find(o => o.value === defaultValue) || options[0]);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{label}</label>
            
            {/* Hidden Input to ensure FormData picks up the value */}
            <input type="hidden" name={name} value={selected.value} />

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full mt-1 h-12 bg-slate-50 rounded-xl px-4 flex items-center justify-between text-sm font-medium hover:bg-slate-100 transition-colors"
            >
                <span className="text-slate-900">{selected.label}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-150">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            {option.label}
                            {selected.value === option.value && <Check size={14} className="text-primary" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}