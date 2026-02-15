import { Text, View } from "@react-pdf/renderer";
import {
  getFiscalFields,
  getFiscalFieldLayout,
  CountryCode,
} from "@/lib/services/fiscal-fields-provider";
import type { Invoice } from "@/lib/api/invoices";
import type { ComponentProps } from "react";
import { DocumentData, FiscalizationCountry } from "../types";

type PdfStyle = ComponentProps<typeof View>["style"];

interface FiscalDetailsGridProps {
  document: DocumentData;
  fiscalizationCountry: FiscalizationCountry;
  containerStyle: PdfStyle;
  itemStyle: PdfStyle;
  labelStyle: PdfStyle;
  valueStyle: PdfStyle;
  columnsOverride?: number;
  forceSingleColSpan?: boolean;
}

export const FiscalDetailsGrid = ({
  document,
  fiscalizationCountry,
  containerStyle,
  itemStyle,
  labelStyle,
  valueStyle,
  columnsOverride,
  forceSingleColSpan = false,
}: FiscalDetailsGridProps) => {
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
  const fieldMap = new Map(fields.map((field) => [field.key, field]));
  const resolved = layout.order
    .map((item) => ({
      ...item,
      field: fieldMap.get(item.key),
    }))
    .filter((item) => item.field);

  const resolvedColumns = columnsOverride ?? layout.columns;
  const rows: (typeof resolved)[] = [];

  let currentRow: typeof resolved = [];
  let currentSpan = 0;

  for (const item of resolved) {
    const span = item.colSpan || 1;
    if (currentSpan + span > resolvedColumns) {
      rows.push(currentRow);
      currentRow = [item];
      currentSpan = span;
    } else {
      currentRow.push(item);
      currentSpan += span;
    }
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const baseWidth = 100 / resolvedColumns;

  return (
    <View style={containerStyle}>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: rowIndex < rows.length - 1 ? 4 : 0,
          }}
        >
          {row.map(({ field, key, colSpan }, colIndex) => {
            const span = colSpan || 1;
            const width = `${baseWidth * span - (resolvedColumns > 1 ? 1 : 0)}%`;

            let resolvedStyle: PdfStyle = { width };

            if (Array.isArray(itemStyle)) {
              resolvedStyle = [...itemStyle, { width }];
            } else if (itemStyle) {
              resolvedStyle = [itemStyle, { width }];
            }

            return (
              <View
                key={`${field?.label ?? key}-${rowIndex}-${colIndex}`}
                style={resolvedStyle}
              >
                <Text style={labelStyle}>{field?.label}</Text>
                <Text style={valueStyle}>{field?.value ?? "N/A"}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
