"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
}

// Deduplicating and cleaning up the list based on the user provided list
const COLORS = [
    { value: "#000000", label: "Black" },
    { value: "#FFFFFF", label: "White" },
    { value: "#FF0000", label: "Red" },
    { value: "#00FF00", label: "Green" },
    { value: "#0000FF", label: "Blue" },
    { value: "#FFFF00", label: "Yellow" },
    { value: "#FF00FF", label: "Magenta" },
    { value: "#00FFFF", label: "Cyan" },
    { value: "#FFA500", label: "Orange" },
    { value: "#800080", label: "Purple" },
    { value: "#FFC0CB", label: "Pink" },
    { value: "#A52A2A", label: "Brown" },
    { value: "#808080", label: "Gray" },
    { value: "#000080", label: "Navy" },
    { value: "#008000", label: "Dark Green" },
    { value: "#800000", label: "Maroon" },
    { value: "#808000", label: "Olive" },
    { value: "#008080", label: "Teal" },
    { value: "#C0C0C0", label: "Silver" },
];

export function ColorPicker({ value = "#0000FF", onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Sync tempColor when value changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTempColor(value);
    }
  }, [isOpen, value]);

  const handleSave = () => {
    onChange(tempColor);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempColor(value);
    setIsOpen(false);
  };

  const handleColorBoxClick = () => {
    colorInputRef.current?.click();
  };

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempColor(e.target.value);
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full h-11 justify-start gap-3 px-3 border-gray-200 hover:bg-gray-50 text-base font-normal rounded-lg"
      >
        <div
          className="w-5 h-5 rounded border border-gray-200 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <span className="text-[#344054]">{(
            COLORS.find(c => c.value.toLowerCase() === value.toLowerCase())?.label || value
        ).toUpperCase()}</span>
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-[#101828]">Invoice Theme</h2>
                    <button 
                        type="button"
                        onClick={handleCancel} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Custom Color Section */}
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-bold text-[#101828] block">Custom Color</label>
                            <p className="text-sm text-[#475467]">Choose any shade that fits your Branding</p>
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs font-semibold text-[#344054]">Custom Color Picker</label>
                             <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-2 px-3 shadow-sm h-11 relative">
                                <div 
                                    className="w-6 h-6 rounded border border-gray-200 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                                    style={{ backgroundColor: tempColor }}
                                    onClick={handleColorBoxClick}
                                />
                                <input 
                                    type="color"
                                    ref={colorInputRef}
                                    value={tempColor}
                                    onChange={handleNativeColorChange}
                                    className="absolute opacity-0 pointer-events-none"
                                />
                                <input
                                    type="text"
                                    value={tempColor}
                                    onChange={(e) => setTempColor(e.target.value)}
                                    className="flex-1 text-sm font-semibold text-[#101828] focus:outline-none uppercase"
                                />
                             </div>
                        </div>
                    </div>

                    {/* Preset Colors Section */}
                    <div className="space-y-3">
                         <div>
                            <label className="text-sm font-bold text-[#101828] block">Preset Colors</label>
                            <p className="text-sm text-[#475467]">Pick from ready-made brand color themes designed for readability and balance.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {COLORS.map((color) => {
                                const isSelected = tempColor.toLowerCase() === color.value.toLowerCase();
                                return (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setTempColor(color.value)}
                                        className={cn(
                                            "h-12 rounded-lg border-2 transition-all relative flex items-center justify-center",
                                            isSelected ? "border-[#2E90FA] ring-2 ring-[#2E90FA]/20" : "border-transparent hover:border-gray-200"
                                        )}
                                        style={{ backgroundColor: color.value }}
                                    >
                                        {/* Show checkmark if selected (white for dark colors, black for light) */}
                                        {isSelected && (
                                            <div className="bg-white/20 rounded-full p-1 backdrop-blur-sm">
                                                <Check className={cn(
                                                    "w-4 h-4",
                                                    color.value === "#FFFFFF" ? "text-black" : "text-white"
                                                )} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex gap-3 bg-white sticky bottom-0 rounded-b-2xl">
                    <Button 
                        type="button"
                        variant="ghost" 
                        className="flex-1 h-11 text-base font-semibold text-[#475467] hover:bg-gray-50 hover:text-[#101828]"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="button"
                        className="flex-1 h-11 bg-[#2E90FA] hover:bg-[#1570EF] text-white text-base font-bold shadow-sm"
                        onClick={handleSave}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}
