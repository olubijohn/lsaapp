import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <FileText className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        No purchase orders processed yet.
      </h3>
      <p className="text-sm text-text-tertiary max-w-sm">
        You&apos;ll see all the purchase orders that clear ERP validation right
        here.
      </p>
    </div>
  );
}
