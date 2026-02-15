"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PurchaseOrderStats } from "@/lib/api/purchase-orders";
import {
  FailedIcon,
  InfoIcon,
  PendingIcon,
  SuccessIcon,
} from "@/components/ui/icons";

interface StatsCardsProps {
  stats: PurchaseOrderStats | undefined;
  isLoading: boolean;
}

export function PurchaseOrderStatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total PO",
      value: stats?.totalPO || 0,
      tooltip: "Total number of purchase orders",
    },
    {
      title: "Processing",
      value: stats?.processing || 0,
      icon: SuccessIcon,
      tooltip: "Purchase orders currently being processed",
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      icon: PendingIcon,
      tooltip: "Purchase orders pending processing",
    },
    {
      title: "Failed",
      value: stats?.failed || 0,
      icon: FailedIcon,
      tooltip: "Purchase orders that failed to process",
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
                      <TooltipTrigger>
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
              {card.icon && (
                <card.icon className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
