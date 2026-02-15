"use client";

import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranches } from "@/lib/queries/branches";
import { useInvoice } from "@/lib/queries/invoices";
import { useAuth } from "@/lib/auth/context";
import Loader from "@/components/Loader";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const InvoiceSearch = () => {
  const router = useRouter();
  const { user } = useAuth();
  const country = user?.country;
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const { data: branches } = useBranches(country);
  const [selectedTerminalId, setSelectedTerminalId] = useState("");

  // Initialize selected terminal id when branches data is loaded
  const firstBranchId = branches?.[0]?.branchId || branches?.[0]?.SdcId;
  const terminalIdToUse = selectedTerminalId || firstBranchId || "";

  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    isLoading,
    data: invoice,
    error,
  } = useInvoice(terminalIdToUse, debouncedSearchTerm, country, {
    retry: 2,
  });

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setOpen(true);
    if (value.length >= 1) {
    }
  }, []);

  const handleSearchResultClick = () => {
    if (invoice) {
      router.push(
        `/dashboard/invoices/${debouncedSearchTerm}?terminalId=${invoice.sdcid}`,
      );
      setOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    searchRef?.current?.focus();
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-600";

    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "uploaded") {
      return "bg-green-100 text-green-700";
    } else if (lowerStatus === "error") {
      return "bg-red-100 text-red-700";
    } else {
      return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="flex-1 hidden md:block max-w-xl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative cursor-text" onClick={() => setOpen(true)}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for Invoices..."
              ref={searchRef}
              onFocus={() => setOpen(true)}
              className="pl-10 pr-32 w-full bg-[#EAECF0] border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-gray-300 h-10"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSearch();
                }}
                className="absolute inset-y-0 right-32 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                      </button>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <Select
                value={selectedTerminalId || firstBranchId || ""}
                onValueChange={setSelectedTerminalId}
              >
                <SelectTrigger className="w-[120px] h-8 border-none bg-transparent text-xs">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches?.map((branch) => (
                    <SelectItem
                      key={branch.branchId || branch.SdcId}
                      value={(branch.branchId || branch.SdcId) as string}
                    >
                      {branch.branchOfficeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="p-6 flex flex-col gap-2 w-full min-w-[300px] max-w-[500px] bg-white"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <p className="text-xl font-bold">
            {isLoading
              ? "Searching for invoices. Please wait..."
              : `Search Result for "${debouncedSearchTerm}"`}
          </p>

          {isLoading && (
            <div className="w-full flex justify-center py-8">
              <Loader />
            </div>
          )}

          {!isLoading && invoice && (
            <div
              onClick={handleSearchResultClick}
              className="bg-white cursor-pointer rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-5">
                <div className="p-3 bg-[#F0F4F9] rounded-full shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <h5 className="font-bold">Invoice Details</h5>
                  <p className="text-xs flex gap-2 items-center">
                    Amount{" "}
                    <span className="font-bold">
                      {invoice.currency}
                      {invoice.totalAmount}
                    </span>
                  </p>
                  <p className="text-xs flex gap-2 items-center">
                    No. of Items{" "}
                    <span className="font-bold">
                      {invoice.invoiceItems?.length}
                    </span>
                  </p>
                </div>
                <span
                  className={`text-xs font-bold w-fit text-center px-3 py-1.5 rounded ${getStatusColor(invoice.uploadStatus)}`}
                >
                  {invoice.uploadStatus}
                </span>
              </div>
              <hr />
              <div className="flex gap-3 items-center text-xs">
                <Clock className="h-4 w-4 text-gray-500" />
                <p> {invoice.saleDate}</p>
                <Button className="ml-auto font-bold text-xs" variant="ghost">
                  INVOICE DETAILS &rarr;
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !invoice && debouncedSearchTerm && !error && (
            <p className="text-center py-8 text-gray-500">
              Nothing found for that query
            </p>
          )}

          {!isLoading && error && (
            <p className="text-center py-8 text-red-500">
              Error: {error.message}
            </p>
          )}

          {!isLoading && !debouncedSearchTerm && (
            <p className="text-center py-8 text-gray-500">
              Enter an invoice number to search
            </p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InvoiceSearch;
