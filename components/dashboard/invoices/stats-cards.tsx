"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { InvoiceStats } from "@/lib/api/invoices";
import { FailedIcon, InfoIcon, PendingIcon, SuccessIcon } from "@/components/ui/icons";

interface StatsCardsProps {
    stats: InvoiceStats | undefined;
    isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
    const cards = [
        {
            title: "Total Invoices",
            value: stats?.totalInvoice || 0,
            tooltip: "Total number of invoices processed",
        },
        {
            title: "Success",
            value: stats?.successInvoice || 0,
            icon: SuccessIcon,
            tooltip: "Successfully processed invoices",
        },
        {
            title: "Pending",
            value: stats?.pendingInvoice || 0,
            icon: PendingIcon,
            tooltip: "Invoices currently being processed",
        },
        {
            title: "Failed",
            value: stats?.failedInvoice || 0,
            icon: FailedIcon,
            tooltip: "Invoices that failed to process",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title} className="ring-0 py-0">
                    <CardContent className="p-4 border-none outline-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1">
                                    <p className="text-sm font-medium text-text-tertiary">
                                        {card.title}
                                    </p>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger >
                                                <InfoIcon />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{card.tooltip}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <p className="text-2xl font-semibold text-text-primary mt-2">
                                    {isLoading ? "..." : card.value}
                                </p>
                            </div>
                            {card.icon && <card.icon className="h-10 w-10 text-muted-foreground" />}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}