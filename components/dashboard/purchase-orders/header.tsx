"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PurchaseOrderHeaderProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export function PurchaseOrderHeader({
  selectedPeriod,
  onPeriodChange,
}: PurchaseOrderHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Purchase Orders Monitor
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          View and monitor all purchase orders processed through your connected
          systems.
        </p>
      </div>
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-32 bg-white border border-[#E5E7EB] text-text-primary font-medium">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this month">This Month</SelectItem>
          <SelectItem value="this year">This Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
