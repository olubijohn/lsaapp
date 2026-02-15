"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps extends React.ComponentProps<"input"> {
  handleClose?: () => void;
}

export function SearchInput({ 
  className, 
  handleClose, 
  placeholder = "Search...", 
  ...props 
}: SearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        className={`pl-10 pr-10 w-full bg-[#EAECF0] border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-gray-300 h-10 transition-all ${
          isFocused ? "bg-white ring-1 ring-gray-200" : ""
        } ${className}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {props.value && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
        </button>
      )}
    </div>
  );
}
