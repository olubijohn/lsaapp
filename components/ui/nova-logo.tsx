import React from "react";
import { cn } from "@/lib/utils";

interface NovaLogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    onlyBadge?: boolean;
}

const NovaLogo: React.FC<NovaLogoProps> = ({ className = "", size = "md", onlyBadge = false }) => {
    const sizeClasses = {
        sm: "w-10 h-10 border-[3px]",
        md: "w-28 h-28 border-[4px]",
        lg: "w-13 h-13 border-[5px]",
    };

    const logoSizeClasses = {
        sm: "w-4 h-4",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    };

    const textSizeClasses = {
        sm: "text-[10px]",
        md: "text-lg",
        lg: "text-xl",
    };

    return (
        <div className={cn("flex flex-col items-center", size === "sm" ? "gap-1" : "gap-3", className)}>
            {/* Circular Badge */}
            <div className={cn(
                "relative flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] border-slate-100/60 overflow-hidden shrink-0",
                sizeClasses[size]
            )}>
                {/* Red Wavy N Logo - Refined Wave Size */}
                <svg
                    className={cn(logoSizeClasses[size], "text-[#E31E24]")}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M25 75V25C25 25 45 25 50 50C55 75 75 75 75 75V25"
                        stroke="currentColor"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* LSA Text - Refined Blue and Spacing */}
            {!onlyBadge && (
                <div className={cn(
                    "font-extrabold tracking-[0.25em] text-[#7DD3FC] uppercase",
                    textSizeClasses[size]
                )}>
                    LSA
                </div>
            )}
        </div>
    );
};

export default NovaLogo;
