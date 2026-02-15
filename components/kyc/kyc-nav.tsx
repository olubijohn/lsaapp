"use client";

import Image from "next/image";
import Link from "next/link";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KycNav() {
  return (
    <nav className="fixed top-0 left-0 w-full h-[68px] border-b border-gray-100 px-4 md:px-8 lg:px-20 pt-5 pb-3 flex items-center justify-between bg-white z-50 shadow-[0px_4px_6px_0px_rgba(11,40,86,0.05),0px_10px_15px_-3px_rgba(11,40,86,0.1)]">
      <div className="flex items-center">
        <Image
          src="/images/logowhite.svg"
          alt="FiscalEdge Logo"
          width={140}
          height={36}
          className="h-9 w-auto"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-[#667085] hidden sm:inline">Got Questions?</span>
        <Button 
          variant="outline" 
          className="h-10 px-4 border-gray-200 text-[#344054] font-semibold flex gap-2 hover:bg-gray-50 transition-colors"
        >
          <Headphones className="w-4 h-4" />
          <span className="hidden sm:inline">Contact Support</span>
          <span className="sm:hidden">Support</span>
        </Button>
      </div>
    </nav>
  );
}
