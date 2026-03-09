"use client";

import { motion } from "framer-motion";
import { School, Sparkles } from "lucide-react";
import Loader from "@/components/ui/loader";

export default function LibraryPage() {
    return (
        <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 rounded-[2rem] bg-amber-50 flex items-center justify-center text-amber-600 shadow-xl shadow-amber-100/50 border border-amber-100"
            >
                <School className="w-10 h-10" />
            </motion.div>
            
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Library Portal</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs max-w-xs mx-auto leading-relaxed">
                    Digital inventory and book tracking systems are being cataloged.
                </p>
            </div>

            <div className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-amber-200">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">Available in v2.5.0</span>
            </div>
            
            <div className="pt-8 opacity-20">
                <Loader />
            </div>
        </div>
    );
}
