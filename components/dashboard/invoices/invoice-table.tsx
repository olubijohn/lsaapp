"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { Transaction, PaginationData } from "@/lib/api/invoices";
import { EmptyState } from "./empty-state";
import { ThreeCircles } from "react-loader-spinner";
import { cn, formatDateTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface InvoiceTableProps {
  data: Transaction[] | undefined;
  pagination: PaginationData | undefined;
  isLoading: boolean;
  onTabChange: (status: string) => void;
  onSortChange: (sort: string) => void;
  onPageChange: (page: number) => void;
  currentTab: string;
  currentSort: string;
  currentPage: number;
}

export function InvoiceTable({
  data,
  pagination,
  isLoading,
  onTabChange,
  onSortChange,
  onPageChange,
  currentTab,
  currentSort,
  currentPage,
}: InvoiceTableProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { totalPages, hasPreviousPage, hasNextPage } = pagination;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return (
      <Pagination>
        <PaginationContent className=" w-full flex items-center justify-between">
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                hasPreviousPage && handlePageChange(currentPage - 1)
              }
              className={cn(
                !hasPreviousPage
                  ? "pointer-events-none opacity-50 w-full"
                  : "cursor-pointer w-full",
                " border border-[#E5E7EB] rounded-none rounded-l-[12px] px-3 h-9",
              )}
            />
          </PaginationItem>
          <div className=" flex items-center">
            {pages.map((page, index) => (
              <PaginationItem key={index} className="">
                {page === "..." ? (
                  <PaginationEllipsis className=" px-3 py-2 border border-[#E5E7EB] rounded-none w-fit text-text-secondary font-medium text-sm" />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page as number)}
                    isActive={page === currentPage}
                    className="cursor-pointer px-3 py-2 border border-[#E5E7EB] rounded-none w-fit text-text-secondary font-medium text-sm"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
          </div>
          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
              className={cn(
                !hasNextPage
                  ? "pointer-events-none opacity-50 w-full"
                  : "cursor-pointer w-full",
                " border border-[#E5E7EB] rounded-none rounded-r-[12px] px-3 h-9",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <Card className=" ring-0">
      <CardContent className="p-6 py-0 ring-0 outline-none border-none">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-text-primary">Invoices</h2>

          <div className="flex flex-wrap items-center justify-between">
            <Tabs value={currentTab} onValueChange={onTabChange}>
              <TabsList variant={"line"}>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Uploaded">Uploaded</TabsTrigger>
                <TabsTrigger value="Pending">Pending</TabsTrigger>
                <TabsTrigger value="Error">Failed</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={currentSort} onValueChange={onSortChange}>
              <SelectTrigger className="w-48 bg-[#F3F4F6] border border-[#E5E7EB] text-text-secondary font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest-to-oldest">
                  Newest to Oldest
                </SelectItem>
                <SelectItem value="oldest-to-newest">
                  Oldest to Newest
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(!data || data.length === 0) && !isLoading ? (
            <EmptyState />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow key="loading">
                        <TableCell colSpan={6} className="py-12">
                          <div className="flex justify-center items-center">
                            <ThreeCircles
                              visible={true}
                              height="32"
                              width="32"
                              color="#4fa94d"
                              ariaLabel="three-circles-loading"
                              innerCircleColor="#2D2D2D"
                              middleCircleColor="#D9D9D9"
                              outerCircleColor="#D9D9D9"
                              wrapperStyle={{}}
                              wrapperClass=""
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.map((invoice, index) => {
                        const { date, time } = formatDate(invoice.createDate);
                        return (
                          <TableRow
                            key={`${invoice.invoiceNumber}-${index}`}
                            onClick={() =>
                              router.push(
                                `/dashboard/invoices/${invoice.invoiceNumber}?terminalId=${invoice.terminalId}`,
                              )
                            }
                          >
                            <TableCell>{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.totalAmount}</TableCell>
                            <TableCell>{invoice.invoiceType}</TableCell>
                            <TableCell>
                              <StatusBadge status={invoice.uploadStatus} />
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatDateTime(invoice.createDate)}
                            </TableCell>
                            <TableCell>
                              <Button
                                className=" cursor-pointer"
                                variant="link"
                                size="sm"
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              {renderPagination()}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
