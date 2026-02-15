import React from "react";
import {
  getFiscalFields,
  getFiscalFieldLayout,
  CountryCode,
} from "@/lib/services/fiscal-fields-provider";
import type { Invoice } from "@/lib/api/invoices";
import { DocumentData, FiscalizationCountry } from "./types";
import { cn } from "@/lib/utils";

interface FiscalDetailsGridProps {
  document: DocumentData;
  fiscalizationCountry: FiscalizationCountry;
  containerClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  columnsOverride?: number;
  forceSingleColSpan?: boolean;
}

export function FiscalDetailsGrid({
  document,
  fiscalizationCountry,
  containerClassName = "gap-x-4 gap-y-3",
  itemClassName = "flex flex-col gap-1",
  labelClassName = "text-[9px] text-text-tertiary font-semibold",
  valueClassName = "text-[9px] text-black font-medium",
  columnsOverride,
  forceSingleColSpan = false,
}: FiscalDetailsGridProps) {
  const malawiDetails = document.fiscalDetail as
    | {
        clientInvoiceNumber?: string;
        originalInvoiceNumber?: string;
        terminalDate?: string;
        fiscalInvoiceNumber?: string;
        receiptCounter?: string | number;
      }
    | undefined;

  const invoice = {
    invoiceNumber: document.documentNumber || "",
    currencyType: document.currencyCode,
    saleDate: document.issueDate || "",
    sdcid: document.fiscalDetail?.sdcId || "",
    fiscalDetails: {
      zraInvoiceNumber: document.fiscalDetail?.ZRAInvNum || "",
      originalZraInvoiceNumber:
        document.fiscalDetail?.originalInvoiceSequence?.toString() ?? null,
      vsdcdate: document.fiscalDetail?.vsdcDate || "",
      sdcId: document.fiscalDetail?.sdcId || "",
      internalData: document.fiscalDetail?.internalData || "",
      signature: document.fiscalDetail?.signature || "",
      terminalId: document.fiscalDetail?.terminalId || "",
      receiptTypeNumber: document.fiscalDetail?.receiptTypeNumber,
      globalReceiptCounter: document.fiscalDetail?.globalReceiptCounter,
      fiscalDayNumber: document.fiscalDetail?.fiscalDayNumber,
      terminalDate:
        malawiDetails?.terminalDate ||
        document.fiscalDetail?.terminalDate ||
        "",
      clientInvoiceNumber:
        malawiDetails?.clientInvoiceNumber ||
        document.fiscalDetail?.clientInvoiceNumber ||
        "",
      originalInvoiceNumber:
        malawiDetails?.originalInvoiceNumber ||
        document.fiscalDetail?.originalInvoiceNumber ||
        "",
      fiscalInvoiceNumber:
        malawiDetails?.fiscalInvoiceNumber ||
        document.fiscalDetail?.invoiceReference ||
        document.fiscalDetail?.taxPayerInvoiceNumber ||
        "",
      receiptCounter:
        malawiDetails?.receiptCounter ||
        document.fiscalDetail?.globalReceiptCounter ||
        document.fiscalDetail?.receiptTypeNumber ||
        "",
    },
  } as unknown as Invoice;

  const fields = getFiscalFields(invoice, fiscalizationCountry as CountryCode);
  const layout = getFiscalFieldLayout(fiscalizationCountry as CountryCode);
  const resolvedColumns = columnsOverride ?? layout.columns;
  const fieldMap = new Map(fields.map((field) => [field.key, field]));
  const resolved = layout.order
    .map((item) => ({
      ...item,
      field: fieldMap.get(item.key),
    }))
    .filter((item) => item.field);

  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-3",
        resolvedColumns === 5
          ? "grid-cols-5"
          : resolvedColumns === 2
            ? "grid-cols-2"
            : "grid-cols-4",
        containerClassName,
      )}
    >
      {resolved.map(({ field, key, colSpan }, index) => (
        <div
          key={`${field?.label ?? key}-${index}`}
          className={cn(
            itemClassName,
            forceSingleColSpan
              ? "col-span-1"
              : colSpan === 2
                ? "col-span-2"
                : colSpan === 3
                  ? "col-span-3"
                  : colSpan === 4
                    ? "col-span-4"
                    : "col-span-1",
          )}
        >
          <p className={cn(labelClassName)}>{field?.label}</p>
          <p className={cn(valueClassName)}>{field?.value ?? "N/A"}</p>
        </div>
      ))}
    </div>
  );
}
