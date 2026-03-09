"use client";

import { Bell, Search, Settings, HelpCircle, User, Menu, LogOut, Sparkles, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

const TopNav = ({ onMenuClick }: { onMenuClick: () => void }) => {
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/dashboard/students?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <header className="h-20 bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-6">
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2.5 -ml-2 text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col">
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <h2 className="text-xl font-black text-foreground tracking-tight leading-none">
                            Good day, {user?.name || "Agent"}!
                        </h2>
                        <span className="text-xl">👋</span>
                    </motion.div>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] sm:text-xs font-black text-[var(--primary)] uppercase tracking-widest opacity-80">
                            {user?.organisation?.toUpperCase() || "LSA ACADEMIC SYSTEM"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block group">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Find a student..." 
                        className="h-11 pl-11 pr-4 bg-[var(--background)] border border-[var(--border-color)] focus:bg-[var(--card-bg)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 rounded-2xl text-[13px] font-medium transition-all w-72 outline-none placeholder:text-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleTheme}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all"
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                    <button onClick={() => router.push('/dashboard/notice')} className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all relative group" title="Notices">
                        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-[var(--secondary)] rounded-full border-2 border-[var(--sidebar-bg)] shadow-[0_0_8px_var(--secondary)]" />
                    </button>
                    <button onClick={() => router.push('/dashboard/settings')} className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all" title="System Settings">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-8 w-px bg-[var(--border-color)] mx-1" />

                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center shadow-inner group relative overflow-hidden transition-all hover:border-[var(--primary)]/30">
                        <div className="absolute inset-0 bg-[var(--primary)] opacity-0 group-hover:opacity-[0.03] transition-opacity" />
                        <User className="w-5 h-5 text-slate-400 group-hover:text-[var(--primary)] transition-colors" />
                        
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl py-2 px-1 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                             <button 
                                onClick={() => router.push('/dashboard/profile')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-xl transition-all"
                            >
                                <User className="w-4 h-4" />
                                My Information
                            </button>
                             <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
