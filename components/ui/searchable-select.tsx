"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableSelectProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className,
    disabled = false,
  }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = query === ""
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                  "flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors shadow-sm",
                  disabled ? "cursor-not-allowed opacity-50 bg-gray-50" : "cursor-pointer hover:bg-gray-50"
                )}
                role="combobox"
                aria-expanded={isOpen}
            >
                <span className={value ? "text-[#101828]" : "text-[#667085]"}>{selectedLabel}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 animate-in fade-in-0 zoom-in-95">
                     <div className="flex items-center px-3 py-1 bg-gray-50 rounded-md border border-gray-200 mb-2">
                     <Search className="w-4 h-4 text-gray-400 mr-2"/>
                     <input 
                        // Auto-focus logic
                        autoFocus
                        className="bg-transparent border-none outline-none text-sm w-full h-8 placeholder:text-muted-foreground focus:ring-0"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()} 
                     />
                 </div>
                    <div className="max-h-[200px] overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="text-sm text-gray-500 py-6 text-center">No results found.</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "flex items-center px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 transition-colors",
                                        value === option.value && "bg-blue-50 text-blue-600 font-medium"
                                    )}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setQuery("");
                                    }}
                                >
                                    {option.label}
                                    {value === option.value && (
                                        <Check className="ml-auto h-4 w-4" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
  }
