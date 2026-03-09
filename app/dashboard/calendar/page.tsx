"use client";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Sparkles } from "lucide-react";
import Loader from "@/components/ui/loader";

export default function CalendarPage() {
    return (
        <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100/50 border border-indigo-100"
            >
                <CalendarIcon className="w-10 h-10" />
            </motion.div>
            
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter">School Calendar</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs max-w-xs mx-auto leading-relaxed">
                    Schedules and academic events are being synchronized with the master timeline.
                </p>
            </div>

            <div className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">Available in v2.5.0</span>
            </div>
            
            <div className="pt-8 opacity-20">
                <Loader />
            </div>
        </div>
    );
}
