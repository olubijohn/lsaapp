"use client";

import { cn } from "@/lib/utils";

interface KycSidebarProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { id: 1, title: "Business details", description: "Tell us about your business" },
  { id: 2, title: "Customize business", description: "Personalize your experience" },
];

export function KycSidebar({ currentStep, onStepChange }: KycSidebarProps) {
  return (
    <div className="hidden lg:flex w-[305px] py-12 px-8 flex-col gap-6">
      {steps.map((step) => (
        <div 
          key={step.id} 
          onClick={() => onStepChange(step.id)}
          className="flex gap-4 group items-start cursor-pointer transition-opacity hover:opacity-80"
        >
          <div className="flex flex-col items-center pt-1">
            <div 
              className={cn(
                "w-[3px] h-12 rounded-full transition-colors duration-300",
                currentStep === step.id ? "bg-[#2E90FA]" : "bg-gray-100"
              )} 
            />
          </div>
          <div className="py-1 flex flex-col justify-center">
            <h3 
              className={cn(
                "text-sm font-bold transition-colors duration-300",
                currentStep === step.id ? "text-[#101828]" : "text-[#475467]"
              )}
            >
              {step.title}
            </h3>
            <p className="text-xs text-[#667085] mt-1">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
