import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
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
import { FiscalDetailsGrid } from "./FiscalDetailsGrid";
import { getFiscalizationConfig } from "@/lib/fiscalization-utils";

// Font.register({
//     family: 'Inter',
//     src: path.join(process.cwd(), 'public', 'fonts', 'Inter-VariableFont.ttf')
// });
// Font.register({
//     family: 'InterItalic',
//     src: path.join(process.cwd(), 'public', 'fonts', 'Inter-Italic-VariableFont.ttf')
// });

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
    fontSize: 12,
    fontWeight: 600,
    textAlign: "center",
  },
  tableHeaderCellLeft: {
    color: "#4D4D61",
    fontSize: 12,
    fontWeight: 600,
    textAlign: "left",
  },
  tableHeaderCellRight: {
    color: "#6B7280",
    fontSize: 12,
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
  },
  tableCell2: {
    fontSize: 10,
    color: "#8A8A8B",
  },
  col1: { width: "5%" },
  col2: { width: "32%" },
  col3: { width: "12%" },
  col4: { width: "17%" },
  col5: { width: "11%" },
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
    flex: 1,
  },
  taxTableHeader: {
    flexDirection: "row",
    padding: "8 16",
    color: "white",
    gap: 8,
  },
  taxTableRow: {
    flexDirection: "row",
    padding: "8 16",
    gap: 8,
    borderTop: "1 solid #E5E7EB",
  },
  taxTableCell: {
    flex: 1,
    fontSize: 10,
    color: "#0F172A",
    fontWeight: 500,
  },
  taxTableCellHeader: {
    flex: 1,
    fontSize: 10,
    color: "white",
    fontWeight: 600,
  },
  summarySection: {
    flex: 1,
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
    width: 96,
    height: 96,
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
  fiscalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  fiscalGridItem: {
    gap: 4,
  },
});

interface SimplePDFTemplateProps {
  settings: TemplateSettings;
  billFrom: BillingInfo;
  billTo: BillingInfo;
  document: DocumentData;
  items: LineItem[];
  footer: FooterInfo;
  fiscalizationCountry?: FiscalizationCountry;
  isFiscalizationEnabled?: boolean;
}

export const SimplePDFTemplate = async ({
  settings,
  billFrom,
  billTo,
  document,
  items,
  footer,
  fiscalizationCountry = "zambia",
  isFiscalizationEnabled = false,
}: SimplePDFTemplateProps) => {
  const fiscalizationConfig = getFiscalizationConfig(fiscalizationCountry);
  const isMalawi = fiscalizationCountry === "malawi";
  const isCreditNote = document.documentType === "CreditNote";
  const resolvedQrCodeUrl =
    document?.fiscalDetail?.verificationUrl ||
    document?.fiscalDetail?.qrCodeUrl ||
    document?.fiscalDetail?.qrCode ||
    `DRAFT-${document?.documentNumber || "PDF"}`;
  const qrCodeUrl = await QRCode.toDataURL(resolvedQrCodeUrl);
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
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <View style={{ width: "48%", gap: 4 }}>
                    <Text style={[styles.label, { fontWeight: "bold" }]}>
                      Bill From:
                    </Text>
                    <Text style={[styles.customerText, { textAlign: "left" }]}>
                      {billFrom.name}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 4 }}>
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
                  <View style={{ width: "48%", gap: 4 }}>
                    <Text style={[styles.companyInfo, { textAlign: "left" }]}>
                      Email: {billFrom.email || "N/A"}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 4 }}>
                    <Text style={[styles.companyInfo, { textAlign: "right" }]}>
                      Email: {billTo.email || "N/A"}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 4 }}>
                    <Text style={[styles.value, { textAlign: "left" }]}>
                      {isMalawi ? "TIN" : "TPIN"}: {billFrom.tpin || "N/A"}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 4 }}>
                    <Text style={[styles.value, { textAlign: "right" }]}>
                      {isMalawi ? "TIN" : "TPIN"}: {billTo.tpin || "N/A"}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 4 }}>
                    <Text style={[styles.companyInfo, { textAlign: "left" }]}>
                      Address: {billFrom.address}
                      {billFrom.city ? `, ${billFrom.city}` : ""}
                      {billFrom.country ? `, ${billFrom.country}` : ""}
                    </Text>
                  </View>
                  <View style={{ width: "48%", gap: 4 }}>
                    <Text style={[styles.companyInfo, { textAlign: "right" }]}>
                      Address: {billTo.address || "N/A"}
                    </Text>
                  </View>
                </View>

                {isFiscalizationEnabled ? (
                  <FiscalDetailsGrid
                    document={document}
                    fiscalizationCountry={fiscalizationCountry}
                    containerStyle={styles.fiscalGrid}
                    itemStyle={styles.fiscalGridItem}
                    labelStyle={styles.label}
                    valueStyle={styles.value}
                  />
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 16,
                      marginBottom: 24,
                    }}
                  >
                    <View style={{ flexDirection: "column", gap: 4 }}>
                      <Text style={styles.label}>Document No:</Text>
                      <Text style={styles.value}>
                        {document?.documentNumber
                          ? `#${document.documentNumber}`
                          : "DRAFT"}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "column", gap: 4 }}>
                      <Text style={styles.label}>Issued on:</Text>
                      <Text style={styles.value}>
                        {formatLongDate(document?.issueDate)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "column", gap: 4 }}>
                      <Text style={styles.label}>Due on:</Text>
                      <Text style={styles.value}>
                        {formatLongDate(document?.dueDate)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "column", gap: 4 }}>
                      <Text style={styles.label}>Currency</Text>
                      <Text style={styles.value}>{document?.currencyCode}</Text>
                    </View>
                  </View>
                )}
              </>
            )}

            {!isFirstPage && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.title}>
                  {isMalawi ? "TAX INVOICE" : "INVOICE"} (Continued)
                </Text>
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
                    styles.tableHeaderCell,
                    styles.col4,
                    { color: "white", textAlign: "right" },
                  ]}
                >
                  Unit Price
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCell,
                    styles.col5,
                    { color: "white", textAlign: "right" },
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
                      <Text style={styles.taxTableCellHeader}>Tax Code</Text>
                      <Text style={styles.taxTableCellHeader}>Tax</Text>
                      <Text style={styles.taxTableCellHeader}>Net Amount</Text>
                    </View>
                    {taxItems.map((item) => (
                      <View
                        key={`${item.taxCode}-${item.rate}`}
                        style={styles.taxTableRow}
                      >
                        <Text style={styles.taxTableCell}>
                          {item.taxCode} - {(item.rate * 100).toFixed(0)}%
                        </Text>
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
                      <Text style={[styles.tableCell, { color: "#6B7280" }]}>
                        Subtotal
                      </Text>
                      <Text style={[styles.tableCell, { fontWeight: 500 }]}>
                        {formatCurrency(document.subtotal, currency)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                      <Text style={[styles.tableCell, { color: "#6B7280" }]}>
                        Tax
                      </Text>
                      <Text style={[styles.tableCell, { fontWeight: 500 }]}>
                        {formatCurrency(document.taxAmount, currency)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                      <Text style={[styles.tableCell, { color: "#6B7280" }]}>
                        Total
                      </Text>
                      <Text style={[styles.tableCell, { fontWeight: 500 }]}>
                        {formatCurrency(document.totalAmount, currency)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={[styles.summaryRow, { paddingBottom: 8 }]}>
                      <Text
                        style={[
                          styles.tableCell,
                          { color: "#6B7280", fontSize: 9 },
                        ]}
                      >
                        Conversion Rate
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          { fontWeight: 500, fontSize: 9 },
                        ]}
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
                  marginTop: 8,
                  marginBottom: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[styles.tableCell2, { fontSize: 9, fontWeight: 500 }]}
                >
                  POWERED BY FISCAL EDGE (C) 2025., All Rights Reserved.
                </Text>
                <Text
                  style={[styles.tableCell2, { fontSize: 9, fontWeight: 500 }]}
                >
                  www.fiscaledge.com
                </Text>
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
