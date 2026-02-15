import { FileText } from "lucide-react";

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
                No invoices processed yet
            </h3>
            <p className="text-muted-foreground">
                All invoices that pass ERP validation will be shown here.
            </p>
        </div>
    );
}