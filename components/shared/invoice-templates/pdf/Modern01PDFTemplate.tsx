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
import { FiscalDetailsGrid } from "./FiscalDetailsGrid";
import { getFiscalizationConfig } from "@/lib/fiscalization-utils";

Font.register({
  family: "Inter",
  src: path.join(process.cwd(), "public", "fonts", "Inter-VariableFont.ttf"),
});
Font.register({
  family: "InterItalic",
  src: path.join(
    process.cwd(),
    "public",
    "fonts",
    "Inter-Italic-VariableFont.ttf",
  ),
});

const createStyles = (themeColor: string) =>
  StyleSheet.create({
    page: {
      padding: 0,
      backgroundColor: "#fff",
      fontFamily: "Inter",
      overflow: "hidden",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    label: {
      fontSize: 9,
      color: "#6B7280",
      marginBottom: 4,
      fontWeight: 600,
    },
    labelWhite: {
      fontSize: 9,
      color: "rgba(255, 255, 255, 0.8)",
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
    valueWhite: {
      fontSize: 9,
      color: "#FFFFFF",
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
    customerTextWhite: {
      fontSize: 12,
      fontWeight: 700,
      color: "#FFFFFF",
    },
    companyInfo: {
      fontSize: 10,
      color: "#6B7280",
    },
    companyInfoWhite: {
      fontSize: 10,
      color: "rgba(255, 255, 255, 0.9)",
    },
    billSection: {
      backgroundColor: themeColor,
      padding: 16,
      marginBottom: 16,
    },
    contentSection: {
      paddingHorizontal: 40,
      paddingTop: 12,
    },
    logoTitleSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16,
      marginBottom: 16,
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
      fontFamily: "InterItalic",
      fontSize: 10,
      color: "#666",
      textAlign: "center",
      marginTop: 10,
    },
    fiscalGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 12,
    },
    fiscalGridItem: {
      gap: 4,
    },
  });

export const Modern01PDFTemplate = async ({
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
    : document.documentType;

  const currency = document.currencyCode;

  const taxItems = computeTaxItems(
    items,
    document.subtotal,
    document.taxAmount,
  );
  const subtotalBase = document.subtotal;
  const totalTaxAmount = document.taxAmount;

  const bankDetailsText = footer?.bankDetailsText || "";
  const memoText = footer?.paymentMemo || document?.notes || "";

  const logoPosition = settings.logoPosition;
  const themeColor = settings.themeColor;
  const styles = createStyles(themeColor);

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
                <View style={styles.billSection}>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <View style={{ width: "48%", gap: 2 }}>
                      <Text style={[styles.labelWhite, { fontWeight: "bold" }]}>
                        Bill From:
                      </Text>
                      <Text
                        style={[
                          styles.customerTextWhite,
                          { textAlign: "left" },
                        ]}
                      >
                        {billFrom.name}
                      </Text>
                    </View>
                    <View style={{ width: "48%", gap: 2 }}>
                      <Text
                        style={[
                          styles.labelWhite,
                          { fontWeight: "bold", textAlign: "right" },
                        ]}
                      >
                        {document.documentType === "PurchaseOrder"
                          ? "Order To:"
                          : "Bill To:"}
                      </Text>
                      <Text
                        style={[
                          styles.customerTextWhite,
                          { textAlign: "right" },
                        ]}
                      >
                        {billTo.name}
                      </Text>
                    </View>
                    <View style={{ width: "48%", gap: 2 }}>
                      <Text
                        style={[styles.companyInfoWhite, { textAlign: "left" }]}
                      >
                        Email: {billFrom.email || "N/A"}
                      </Text>
                    </View>
                    <View style={{ width: "48%", gap: 2 }}>
                      <Text
                        style={[
                          styles.companyInfoWhite,
                          { textAlign: "right" },
                        ]}
                      >
                        Email: {billTo.email || "N/A"}
                      </Text>
                    </View>
                    <View style={{ width: "48%", gap: 2 }}>
                      <Text style={[styles.valueWhite, { textAlign: "left" }]}>
                        {fiscalizationConfig.taxIdLabel}:{" "}
                        {billFrom.tpin || billFrom.vatNumber || "N/A"}
                      </Text>
                    </View>
                    <View style={{ width: "48%", gap: 2 }}>
                      <Text style={[styles.valueWhite, { textAlign: "right" }]}>
                        {fiscalizationConfig.taxIdLabel}: {billTo.tpin || "N/A"}
                      </Text>
                    </View>
                    <View style={{ width: "48%", gap: 2 }}>
                      <Text
                        style={[styles.companyInfoWhite, { textAlign: "left" }]}
                      >
                        Address: {billFrom.address}
                        {billFrom.city ? `, ${billFrom.city}` : ""}
                        {billFrom.country ? `, ${billFrom.country}` : ""}
                      </Text>
                    </View>
                    <View style={{ width: "48%", gap: 2 }}>
                      <Text
                        style={[
                          styles.companyInfoWhite,
                          { textAlign: "right" },
                        ]}
                      >
                        Address: {billTo.address || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.contentSection}>
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
                        marginBottom: 12,
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
                        <Text style={styles.value}>
                          {document?.currencyCode}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}

            {!isFirstPage && (
              <View style={[styles.contentSection, { paddingTop: 40 }]}>
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.title}>INVOICE (Continued)</Text>
                  <Text style={styles.customerText}>
                    Document No: {document?.documentNumber || "DRAFT"}
                  </Text>
                </View>
              </View>
            )}

            <View style={[styles.table, { marginHorizontal: 40 }]}>
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
                      <Text style={[styles.taxTableCellHeader]}>Tax code</Text>
                      <Text style={[styles.taxTableCellHeader]}>Tax</Text>
                      <Text style={[styles.taxTableCellHeader]}>
                        Net Amount
                      </Text>
                    </View>
                    {(taxItems.length
                      ? taxItems
                      : [
                          {
                            taxCode: "A",
                            rate: 0.16,
                            taxAmount: totalTaxAmount || 0,
                            netAmount: subtotalBase || 0,
                          },
                        ]
                    ).map((item) => (
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
                      <Text style={[styles.tableCell, { color: "#6B7280" }]}>
                        Subtotal
                      </Text>
                      <Text style={[styles.tableCell, { fontWeight: 500 }]}>
                        {formatCurrency(subtotalBase, currency)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                      <Text style={[styles.tableCell, { color: "#6B7280" }]}>
                        Tax
                      </Text>
                      <Text style={[styles.tableCell, { fontWeight: 500 }]}>
                        {formatCurrency(totalTaxAmount, currency)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                      <Text
                        style={[
                          styles.tableCell,
                          { color: "#6B7280", fontWeight: 600 },
                        ]}
                      >
                        Total
                      </Text>
                      <Text style={[styles.tableCell, { fontWeight: 600 }]}>
                        {formatCurrency(
                          document?.totalAmount ??
                            subtotalBase + totalTaxAmount,
                          currency,
                        )}
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
                  gap: 16,
                  marginTop: 24,
                  marginHorizontal: 40,
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
              <>
                <View
                  style={[
                    styles.logoTitleSection,
                    {
                      marginHorizontal: 40,
                      flexDirection:
                        logoPosition === "right" ? "row-reverse" : "row",
                    },
                  ]}
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
                  <Text style={[styles.title, { color: "#000000" }]}>
                    {isCreditNote
                      ? "CREDIT NOTE"
                      : document?.documentType === "SalesOrder"
                        ? "SALES ORDER"
                        : document?.documentType === "PurchaseOrder"
                          ? "PURCHASE ORDER"
                          : "TAX INVOICE"}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 40,
                  }}
                >
                  <Text style={[styles.tableCell2]}>
                    POWERED BY FISCAL EDGE (C) 2025., All Rights Reserved.
                  </Text>
                  <Text style={[styles.tableCell2]}>www.fiscaledge.com</Text>
                </View>
              </>
            )}

            <Text style={[styles.pageNumber, { right: 40, bottom: 20 }]}>
              Page {pageIndex + 1} of {pageCount}
            </Text>
          </Page>
        );
      })}
    </Document>
  );
};
