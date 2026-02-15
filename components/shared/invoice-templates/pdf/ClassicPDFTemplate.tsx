import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import path from "path";
import QRCode from "qrcode";
import { FiscalEdgeLogo } from "./FiscalEdgeLogo";
import {
  TemplateSettings,
  BillingInfo,
  DocumentData,
  LineItem,
  FooterInfo,
  FiscalizationCountry,
} from "../types";
import {
  formatLongDate,
  computeTaxItems,
  getDocumentTitle,
  formatCurrency,
} from "../utils";
import {
  getTotalLabel,
  CountryCode,
} from "@/lib/services/fiscal-fields-provider";
import { FiscalDetailsGrid } from "./FiscalDetailsGrid";
import { getFiscalizationConfig } from "@/lib/fiscalization-utils";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
  },
  label: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: 600,
  },
  value: {
    fontSize: 9,
    color: "#0F172A",
    fontWeight: 500,
    wordBreak: "break-all",
    maxWidth: "100%",
    flexWrap: "wrap",
    whiteSpace: "normal",
  },
  customerText: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0F172A",
  },
  companyInfo: {
    fontSize: 10,
    color: "#6B7280",
  },
  table: {
    border: "1 dashed #B9B9C5",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    padding: "8 16",
  },
  tableHeaderCell: {
    color: "#4D4D61",
    fontSize: 10,
    fontWeight: 600,
    textAlign: "center",
  },
  tableHeaderCellLeft: {
    color: "#4D4D61",
    fontSize: 10,
    fontWeight: 600,
    textAlign: "left",
  },
  tableHeaderCellRight: {
    color: "#6B7280",
    fontSize: 10,
    fontWeight: 600,
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 dashed #F5F5F7",
    padding: "8 16",
    gap: 4,
  },
  tableCell: {
    fontSize: 10,
    color: "#0F172A",
    textAlign: "center",
  },
  tableCellLeft: {
    fontSize: 10,
    color: "#0F172A",
    textAlign: "left",
  },
  tableCellRight: {
    fontSize: 10,
    color: "#0F172A",
    textAlign: "right",
    fontWeight: 500,
  },
  tableCell2: {
    fontSize: 10,
    color: "#8A8A8B",
  },
  col1: { width: "5%" },
  col2: { width: "35%" },
  col3: { width: "12%" },
  col4: { width: "15%" },
  col5: { width: "10%" },
  col6: { width: "10%" },
  col7: { width: "13%" },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "8 16",
    gap: 20,
    flexWrap: "nowrap",
    width: "100%",
  },
  taxTable: {
    width: 240,
  },
  taxTableHeader: {
    flexDirection: "row",
    padding: "8 8",
    color: "white",
    gap: 8,
  },
  taxTableRow: {
    flexDirection: "row",
    padding: "8 8",
    gap: 8,
    borderBottom: "1 dashed #F0F4F9",
  },
  taxTableCell: {
    flex: 1,
    fontSize: 10,
    whiteSpace: "nowrap",
  },
  summarySection: {
    width: 240,
    flexDirection: "column",
    gap: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 0,
  },
  divider: {
    borderBottom: "1 solid #D7D7DF",
    marginVertical: 4,
  },
  qrSection: {
    width: 120,
    height: 120,
    alignSelf: "center",
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: "#666",
  },
  continuedText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  gridItem: {
    width: "48%",
    gap: 4,
  },
});

export const ClassicPDFTemplate = async ({
  settings,
  billFrom,
  billTo,
  document,
  items,
  footer,
  fiscalizationCountry = "zambia",
  isFiscalizationEnabled = false,
}: {
  settings: TemplateSettings;
  billFrom: BillingInfo;
  billTo: BillingInfo;
  document: DocumentData;
  items: LineItem[];
  footer: FooterInfo;
  fiscalizationCountry?: FiscalizationCountry;
  isFiscalizationEnabled?: boolean;
}) => {
  const fiscalizationConfig = getFiscalizationConfig(fiscalizationCountry);
  const isMalawi = fiscalizationCountry === "malawi";
  const isCreditNote = document.documentType === "CreditNote";
  const qrData =
    document?.fiscalDetail?.verificationUrl ||
    document?.fiscalDetail?.qrCodeUrl ||
    document?.fiscalDetail?.qrCode ||
    `DRAFT-${document?.documentNumber || "PDF"}`;
  const qrCodeUrl = await QRCode.toDataURL(qrData);
  const documentTitle = isMalawi
    ? isCreditNote
      ? "CREDIT NOTE"
      : "TAX INVOICE"
    : getDocumentTitle(document.documentType);

  const currency = document.currencyCode;

  const taxItems = computeTaxItems(
    items,
    document.subtotal,
    document.taxAmount,
  );

  const bankDetailsText = footer?.bankDetailsText || "";
  const memoText = footer?.paymentMemo || document?.notes || "";

  const logoPosition = settings.logoPosition;
  const themeColor = settings.themeColor;

  const ITEMS_ON_FIRST_PAGE = 10;
  const ITEMS_ON_MIDDLE_PAGES = 10;

  const totalItems = items.length;
  const pageRanges: { start: number; end: number }[] = [];

  const firstPageItems = Math.min(ITEMS_ON_FIRST_PAGE, totalItems);
  pageRanges.push({ start: 0, end: firstPageItems });

  if (totalItems > firstPageItems) {
    let remainingItems = totalItems - firstPageItems;
    let currentIndex = firstPageItems;

    while (remainingItems > 0) {
      const itemsForThisPage = Math.min(ITEMS_ON_MIDDLE_PAGES, remainingItems);
      pageRanges.push({
        start: currentIndex,
        end: currentIndex + itemsForThisPage,
      });

      currentIndex += itemsForThisPage;
      remainingItems -= itemsForThisPage;
    }
  }

  const lastPageItems =
    pageRanges[pageRanges.length - 1].end -
    pageRanges[pageRanges.length - 1].start;
  const hasFooterPage = totalItems > 3 && lastPageItems > 3;

  if (hasFooterPage) {
    pageRanges.push({ start: -1, end: -1 });
  }

  const pageCount = pageRanges.length;

  return (
    <Document>
      {Array.from({ length: pageCount }).map((_, pageIndex) => {
        const { start, end } = pageRanges[pageIndex];
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === pageCount - 1;

        return (
          <Page key={pageIndex} size={[683, 842]} style={styles.page}>
            {isFirstPage && (
              <>
                <View
                  style={{
                    flexDirection:
                      logoPosition === "right" ? "row-reverse" : "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  {settings?.logoUrl ? (
                    <View style={{ marginLeft: -20 }}>
                      <Image
                        src={settings.logoUrl}
                        style={{
                          height: 48,
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </View>
                  ) : (
                    <View style={{ marginLeft: -20 }}>
                      <FiscalEdgeLogo height={40} />
                    </View>
                  )}
                  <Text style={styles.title}>{documentTitle}</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 12,
                  }}
                >
                  <View style={{ width: "48%", gap: 2 }}>
                    <Text style={[styles.label, { fontWeight: "bold" }]}>
                      Bill From:
                    </Text>
                    <Text style={[styles.customerText, { textAlign: "left" }]}>
                      {billFrom.name}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 2 }}>
                    <Text
                      style={[
                        styles.label,
                        { fontWeight: "bold", textAlign: "right" },
                      ]}
                    >
                      {document.documentType === "PurchaseOrder"
                        ? "Order To:"
                        : "Bill To:"}
                    </Text>
                    <Text style={[styles.customerText, { textAlign: "right" }]}>
                      {billTo.name}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 2 }}>
                    <Text style={[styles.companyInfo, { textAlign: "left" }]}>
                      Email: {billFrom.email || "N/A"}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 2 }}>
                    <Text style={[styles.companyInfo, { textAlign: "right" }]}>
                      Email: {billTo.email || "N/A"}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 2 }}>
                    <Text style={[styles.value, { textAlign: "left" }]}>
                      {fiscalizationConfig.taxIdLabel}:{" "}
                      {billFrom.tpin || billFrom.vatNumber || "N/A"}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 2 }}>
                    <Text style={[styles.value, { textAlign: "right" }]}>
                      {fiscalizationConfig.taxIdLabel}: {billTo.tpin || "N/A"}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 2 }}>
                    <Text style={[styles.companyInfo, { textAlign: "left" }]}>
                      Address: {billFrom.address}
                      {billFrom.city ? `, ${billFrom.city}` : ""}
                      {billFrom.country ? `, ${billFrom.country}` : ""}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 2 }}>
                    <Text style={[styles.companyInfo, { textAlign: "right" }]}>
                      Address: {billTo.address || "N/A"}
                    </Text>
                  </View>
                </View>

                {isFiscalizationEnabled && document.fiscalDetail ? (
                  <FiscalDetailsGrid
                    document={document}
                    fiscalizationCountry={fiscalizationCountry}
                    containerStyle={styles.gridContainer}
                    itemStyle={styles.gridItem}
                    labelStyle={styles.label}
                    valueStyle={styles.value}
                    columnsOverride={2}
                    forceSingleColSpan
                  />
                ) : (
                  <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                      <Text style={styles.label}>Document No:</Text>
                      <Text style={styles.value}>
                        {document?.documentNumber
                          ? `#${document.documentNumber}`
                          : "DRAFT"}
                      </Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={styles.label}>Issued on:</Text>
                      <Text style={styles.value}>
                        {formatLongDate(document?.issueDate)}
                      </Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={styles.label}>Due on:</Text>
                      <Text style={styles.value}>
                        {formatLongDate(document?.dueDate)}
                      </Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={styles.label}>Currency</Text>
                      <Text style={styles.value}>{document?.currencyCode}</Text>
                    </View>
                  </View>
                )}
              </>
            )}

            {!isFirstPage && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.title}>INVOICE (Continued)</Text>
                <Text style={styles.customerText}>
                  Document No: {document?.documentNumber || "DRAFT"}
                </Text>
              </View>
            )}

            <View style={styles.table}>
              <View
                style={[styles.tableHeader, { backgroundColor: themeColor }]}
              >
                <Text
                  style={[
                    styles.tableHeaderCellLeft,
                    styles.col1,
                    { color: "white" },
                  ]}
                >
                  No.
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCellLeft,
                    styles.col2,
                    { color: "white" },
                  ]}
                >
                  Item
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCell,
                    styles.col3,
                    { color: "white" },
                  ]}
                >
                  Quantity
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCellRight,
                    styles.col4,
                    { color: "white" },
                  ]}
                >
                  Unit Price
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCellRight,
                    styles.col5,
                    { color: "white" },
                  ]}
                >
                  Discount
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCell,
                    styles.col6,
                    { color: "white" },
                  ]}
                >
                  Tax code
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCellRight,
                    styles.col7,
                    { color: "white" },
                  ]}
                >
                  Total
                </Text>
              </View>

              {items?.slice(start, end).map((item, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCellLeft, styles.col1]}>
                    {start + index + 1}
                  </Text>
                  <Text style={[styles.tableCellLeft, styles.col2]}>
                    {item?.description}
                  </Text>
                  <Text style={[styles.tableCell, styles.col3]}>
                    {item?.quantity}
                  </Text>
                  <Text style={[styles.tableCellRight, styles.col4]}>
                    {formatCurrency(item?.unitPrice, currency)}
                  </Text>
                  <Text style={[styles.tableCellRight, styles.col5]}>
                    {formatCurrency(item?.discountAmount, currency)}
                  </Text>
                  <Text style={[styles.tableCell, styles.col6]}>
                    {item?.taxCodes?.join(", ") || "A"}
                  </Text>
                  <Text style={[styles.tableCellRight, styles.col7]}>
                    {formatCurrency(item?.lineTotal, currency)}
                  </Text>
                </View>
              ))}

              {isLastPage && (
                <View style={styles.bottomSection}>
                  <View style={styles.taxTable}>
                    <View
                      style={[
                        styles.taxTableHeader,
                        { backgroundColor: themeColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.taxTableCell,
                          { color: "white", fontSize: 10, fontWeight: 600 },
                        ]}
                      >
                        Tax code
                      </Text>
                      <Text
                        style={[
                          styles.taxTableCell,
                          { color: "white", fontSize: 10, fontWeight: 600 },
                        ]}
                      >
                        Tax
                      </Text>
                      <Text
                        style={[
                          styles.taxTableCell,
                          { color: "white", fontSize: 10, fontWeight: 600 },
                        ]}
                      >
                        Net Amount
                      </Text>
                    </View>
                    {taxItems.map((item) => (
                      <View
                        key={`${item.taxCode}-${item.rate}`}
                        style={styles.taxTableRow}
                      >
                        <Text
                          style={styles.taxTableCell}
                        >{`${item.taxCode} - ${item.rate * 100}%`}</Text>
                        <Text style={styles.taxTableCell}>
                          {formatCurrency(item.taxAmount, currency)}
                        </Text>
                        <Text style={styles.taxTableCell}>
                          {formatCurrency(item.netAmount, currency)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.summarySection}>
                    <View style={styles.summaryRow}>
                      <Text style={{ fontSize: 10, color: "#6B7280" }}>
                        Subtotal
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#0F172A",
                          fontWeight: 500,
                        }}
                      >
                        {formatCurrency(document.subtotal, currency)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                      <Text style={{ fontSize: 10, color: "#6B7280" }}>
                        Tax
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#0F172A",
                          fontWeight: 500,
                        }}
                      >
                        {formatCurrency(document.taxAmount, currency)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#6B7280",
                          fontWeight: 600,
                        }}
                      >
                        Total
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#0F172A",
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(document.totalAmount, currency)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                      <Text style={{ fontSize: 9, color: "#6B7280" }}>
                        Conversion Rate
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          color: "#0F172A",
                          fontWeight: 500,
                        }}
                      >
                        {document.exchangeRateToLocal || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {!isLastPage && (
              <Text style={styles.continuedText}>
                Continued on next page...
              </Text>
            )}

            {isLastPage && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 32,
                  marginTop: 16,
                  alignItems: "flex-start",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.label, { marginBottom: 8, fontWeight: 500 }]}
                  >
                    Payment Details
                  </Text>
                  {fiscalizationConfig.bankDetails ? (
                    <View style={{ gap: 2 }}>
                      <Text style={[styles.value, { color: "#0F172A" }]}>
                        Account Name:{" "}
                        {fiscalizationConfig.bankDetails.accountName}
                      </Text>
                      <Text style={[styles.value, { color: "#0F172A" }]}>
                        Account Number:{" "}
                        {fiscalizationConfig.bankDetails.accountNumber}
                      </Text>
                      <Text style={[styles.value, { color: "#0F172A" }]}>
                        Bank Name: {fiscalizationConfig.bankDetails.bankName}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.value}>N/A</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.label, { marginBottom: 8, fontWeight: 500 }]}
                  >
                    Payment Memo
                  </Text>
                  <Text style={[styles.value, { color: "#0F172A" }]}>
                    {fiscalizationConfig.notes || "N/A"}
                  </Text>
                </View>
                <View style={{ flexShrink: 0 }}>
                  <Image style={styles.qrSection} src={qrCodeUrl} />
                </View>
              </View>
            )}

            {isLastPage && (
              <View
                style={{
                  marginTop: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={[styles.tableCell2]}>
                  POWERED BY FISCAL EDGE (C) 2025., All Rights Reserved.
                </Text>
                <Text style={[styles.tableCell2]}>www.fiscaledge.com</Text>
              </View>
            )}

            <Text style={styles.pageNumber}>
              Page {pageIndex + 1} of {pageCount}
            </Text>
          </Page>
        );
      })}
    </Document>
  );
};
