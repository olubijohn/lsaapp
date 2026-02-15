"use client";

import { useState } from "react";
import Sidebar from "./_components/sidebar";
import TopNav from "./_components/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300">
        <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 overflow-x-hidden pt-4 px-4 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
