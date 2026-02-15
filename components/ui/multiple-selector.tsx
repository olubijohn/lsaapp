
"use client";

import * as React from "react";
import { X, ChevronDown, Search, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Option {
    label: string;
    value: string;
}

interface MultipleSelectorProps {
    options: Option[];
    value: Option[];
    onChange: (value: Option[]) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    emptyIndicator?: React.ReactNode;
}

export default function MultipleSelector({
    options,
    value = [],
    onChange,
    placeholder = "Select...",
    disabled = false,
    className,
    emptyIndicator
}: MultipleSelectorProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

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

    const toggleOption = (option: Option) => {
        const isSelected = value.some((v) => v.value === option.value);
        if (isSelected) {
            onChange(value.filter((v) => v.value !== option.value));
        } else {
            onChange([...value, option]);
        }
    };

    const removeOption = (val: string) => {
        onChange(value.filter((v) => v.value !== val));
    };

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                    "flex min-h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm transition-colors shadow-sm cursor-pointer",
                    disabled ? "cursor-not-allowed opacity-50 bg-gray-50" : "hover:bg-gray-50"
                )}
            >
                <div className="flex flex-wrap gap-1">
                    {value.length > 0 ? (
                        value.map((val) => (
                            <Badge
                                key={val.value}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1 pr-1"
                            >
                                {val.label}
                                <X
                                    className="h-3 w-3 cursor-pointer hover:text-blue-900"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeOption(val.value);
                                    }}
                                />
                            </Badge>
                        ))
                    ) : (
                        <span className="text-[#667085]">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 ml-2" />
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 animate-in fade-in-0 zoom-in-95">
                    <div className="flex items-center px-3 py-1 bg-gray-50 rounded-md border border-gray-200 mb-2">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input
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
                            emptyIndicator || <div className="text-sm text-gray-500 py-6 text-center">No results found.</div>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = value.some((v) => v.value === option.value);
                                return (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            "flex items-center px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 transition-colors",
                                            isSelected && "bg-blue-50 text-blue-600 font-medium"
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOption(option);
                                        }}
                                    >
                                        {option.label}
                                        {isSelected && <Check className="ml-auto h-4 w-4" />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
