"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface InvoiceHeaderProps {
    selectedPeriod: string;
    onPeriodChange: (period: string) => void;
}

export function InvoiceHeader({ selectedPeriod, onPeriodChange }: InvoiceHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-text-primary">
                    Invoice Monitor
                </h1>
                <p className="text-text-secondary ">
                    View and monitor all invoices processed through your connected systems.
                </p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="capitalize bg-white">
                        {selectedPeriod}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPeriodChange("today")}>
                        Today
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPeriodChange("this month")}>
                        This Month
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPeriodChange("this year")}>
                        This Year
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}