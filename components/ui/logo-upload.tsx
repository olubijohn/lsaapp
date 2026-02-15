"use client";

import { useState, useRef } from "react";
import { CloudUpload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
          isDragging ? "border-[#2E90FA] bg-[#F5FAFF]" : "border-gray-200 bg-[#F9FAFB] hover:border-[#2E90FA] hover:bg-[#F5FAFF]",
          value && "border-solid border-[#2E90FA] bg-white"
        )}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
          accept="image/png,image/jpeg,image/gif,image/svg+xml"
        />

        {value ? (
          <div className="relative w-full aspect-[4/1] max-w-[200px]">
            <Image 
              src={value} 
              alt="Uploaded Logo" 
              fill 
              className="object-contain"
            />
            <button
              type="button"
              onClick={clearLogo}
              className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3">
              <CloudUpload className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#101828]">
                <span className="text-[#2E90FA]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-[#667085] mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </>
        )}
      </div>
      <p className="text-xs text-[#667085]">Uploaded logo appears on all invoices.</p>
    </div>
  );
}
