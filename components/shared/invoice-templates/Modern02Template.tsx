import React from "react";
import Image from "next/image";
import Logo from "@/components/ui/logo";
import {
  TemplateSettings,
  BillingInfo,
  DocumentData,
  LineItem,
  FooterInfo,
  FiscalizationCountry,
} from "./types";
import {
  formatLongDate,
  formatCurrency,
  computeTaxItems,
  getDocumentTitle,
} from "./utils";
import { getFiscalizationConfig } from "@/lib/fiscalization-utils";
import { FiscalDetailsGrid } from "./FiscalDetailsGrid";

interface Modern02TemplateProps {
  settings: TemplateSettings;
  billFrom: BillingInfo;
  billTo: BillingInfo;
  document: DocumentData;
  items: LineItem[];
  footer: FooterInfo;
  qrCodeUrl?: string;
  showQRCode?: boolean;
  fiscalizationCountry?: FiscalizationCountry;
  isFiscalizationEnabled?: boolean;
}

export function Modern02Template({
  settings,
  billFrom,
  billTo,
  document,
  items,
  footer,
  qrCodeUrl,
  showQRCode = true,
  fiscalizationCountry = "zambia",
  isFiscalizationEnabled = false,
}: Modern02TemplateProps) {
  const isCreditNote = document.documentType === "CreditNote";
  const isPurchaseOrder = document.documentType === "PurchaseOrder";
  const taxItems = computeTaxItems(
    items,
    document.subtotal,
    document.taxAmount,
  );
  const isMalawi = fiscalizationCountry === "malawi";
  const documentTitle = isMalawi
    ? isCreditNote
      ? "CREDIT NOTE"
      : "TAX INVOICE"
    : document.documentType;
  const fiscalizationConfig = getFiscalizationConfig(fiscalizationCountry);
  const taxIdLabel = isMalawi ? "TIN" : fiscalizationConfig.taxIdLabel;
  const resolvedQrCodeUrl =
    qrCodeUrl ||
    (isMalawi
      ? document.fiscalDetail?.verificationUrl ||
        document.fiscalDetail?.qrCodeUrl
      : document.fiscalDetail?.qrCodeUrl);

  return (
    <div className="invoice-document relative bg-white shadow-lg">
      <div
        className="h-full flex flex-col gap-6"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="absolute -top-3 inset-x-0 flex items-center justify-center gap-2 place-items-center z-10">
          <div className="bg-gray-600 shadow rounded-full px-3 py-1 text-white text-sm font-semibold">
            PREVIEW {documentTitle}
          </div>
        </div>

        <div className="pt-10 px-6 flex flex-col gap-6">
          <div
            className={`flex items-center ${settings.logoPosition === "right" ? "flex-row-reverse" : ""} justify-between`}
          >
            <div className="rounded-2xl">
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt="Company Logo"
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <Logo variant="black" height={48} />
              )}
            </div>
            <h1 className="text-3xl font-bold text-text-primary">
              {documentTitle}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-1">
              <p className="text-text-tertiary font-semibold text-xs">
                Bill From:
              </p>
              <p className="text-text-primary font-bold text-left">
                {billFrom.name}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-text-tertiary font-semibold text-xs text-right">
                Bill To:
              </p>
              <p className="text-text-primary font-bold text-right">
                {billTo.name}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-text-tertiary font-medium text-xs text-left">
                Email: {billFrom.email || "N/A"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-text-tertiary font-medium text-xs text-right">
                Email: {billTo.email || "N/A"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-black font-medium text-xs text-left">
                {taxIdLabel}: {billFrom.tpin || "N/A"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-black font-medium text-xs text-right">
                {taxIdLabel}: {billTo.tpin || "N/A"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-text-secondary text-left">
                Address: {billFrom.address}
                {billFrom.city ? `, ${billFrom.city}` : ""}
                {billFrom.country ? `, ${billFrom.country}` : ""}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-text-secondary text-right">
                Address: {billTo.address || "N/A"}
              </p>
            </div>
          </div>

          {isPurchaseOrder ? (
            <div className="flex justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-text-tertiary font-semibold">
                  PO NO:
                </p>
                <p className="text-[10px] text-primary font-medium">
                  {document.documentNumber
                    ? `#${document.documentNumber}`
                    : "DRAFT"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-text-tertiary font-semibold">
                  Order Date:
                </p>
                <p className="text-[10px] text-black font-medium">
                  {formatLongDate(document.issueDate)}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-text-tertiary font-semibold">
                  Expected Delivery:
                </p>
                <p className="text-[10px] text-black font-medium">
                  {formatLongDate(document.dueDate)}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-text-tertiary font-semibold">
                  Currency
                </p>
                <p className="text-[10px] text-black font-medium">
                  {document.currencyCode}
                </p>
              </div>
            </div>
          ) : isFiscalizationEnabled && document.fiscalDetail ? (
            <FiscalDetailsGrid
              document={document}
              fiscalizationCountry={fiscalizationCountry}
              containerClassName="text-sm grid-cols-5"
              itemClassName="flex flex-col gap-1 min-w-[160px]"
              labelClassName="text-[10px] text-[#8A8A8B] font-semibold"
            />
          ) : (
            <div className="flex justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-text-tertiary font-semibold">
                  Document No:
                </p>
                <p className="text-[10px] text-primary font-medium">
                  {document.documentNumber
                    ? `#${document.documentNumber}`
                    : "DRAFT"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-text-tertiary font-semibold">
                  Issued on:
                </p>
                <p className="text-[10px] text-black font-medium">
                  {formatLongDate(document.issueDate)}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-text-tertiary font-semibold">
                  Due on:
                </p>
                <p className="text-[10px] text-black font-medium">
                  {formatLongDate(document.dueDate)}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-text-tertiary font-semibold">
                  Currency
                </p>
                <p className="text-[10px] text-black font-medium">
                  {document.currencyCode}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-md border border-dashed border-[#B9B9C5]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead
                  className="text-white"
                  style={{ backgroundColor: settings.themeColor }}
                >
                  <tr>
                    <th className="px-4 py-2 text-xs font-semibold text-left w-[5%] whitespace-nowrap">
                      No.
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-left w-[35%] whitespace-nowrap">
                      Item
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-center w-[12%] whitespace-nowrap">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-right w-[15%] whitespace-nowrap">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-right w-[10%] whitespace-nowrap">
                      Discount
                    </th>
                    <th className="px-4 py-2 text-xs shrink-0 text-nowrap font-semibold text-center w-[10%] whitespace-nowrap">
                      Tax code
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-right w-[13%] whitespace-nowrap">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t text-xs font-medium">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        {formatCurrency(item.unitPrice, document.currencyCode)}
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        {formatCurrency(
                          item.discountAmount,
                          document.currencyCode,
                        )}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {Array.isArray(item.taxCodes)
                          ? item.taxCodes.join(", ")
                          : item.taxCodes}
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        {formatCurrency(item.lineTotal, document.currencyCode)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between gap-10 p-2">
              <table className="w-full text-xs font-medium mb-4 flex-1">
                <thead
                  className="text-white whitespace-nowrap"
                  style={{ backgroundColor: settings.themeColor }}
                >
                  <tr>
                    <th className="px-4 py-2 text-xs font-semibold text-left whitespace-nowrap">
                      Tax Code
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-left">
                      Tax
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-left whitespace-nowrap">
                      Net Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {taxItems.map((item) => (
                    <tr
                      key={item.taxCode}
                      className="border-t text-xs font-medium"
                    >
                      <td className="px-4 py-2">
                        {item.taxCode} - {item.rate * 100}%
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatCurrency(item.taxAmount, document.currencyCode)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatCurrency(item.netAmount, document.currencyCode)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-sm flex-1">
                <div className="flex justify-between">
                  <span className=" text-text-secondary">Subtotal</span>
                  <span className=" text-text-primary font-medium whitespace-nowrap">
                    {formatCurrency(document.subtotal, document.currencyCode)}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className=" text-text-secondary">Tax</span>
                  <span className=" text-text-primary font-medium whitespace-nowrap">
                    {formatCurrency(document.taxAmount, document.currencyCode)}
                  </span>
                </div>
                <hr className=" border-[#D7D7DF]" />
                <div className="flex justify-between ">
                  <span className=" text-text-secondary">Total</span>
                  <span className=" text-text-primary font-medium whitespace-nowrap">
                    {formatCurrency(
                      document.totalAmount,
                      document.currencyCode,
                    )}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between text-xs text-gray-600">
                  <span className=" text-text-secondary">Conversion Rate</span>
                  <span className=" text-text-primary font-medium">
                    {document.exchangeRateToLocal || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6" style={{ backgroundColor: settings.themeColor }}>
          <div className="flex justify-between items-start gap-8 text-text-tertiary font-medium text-xs mb-2">
            <div className="flex-1 ">
              <h6 className="font-medium text-white text-xs mb-2">
                Payment Details
              </h6>
              <div className=" text-white">
                <p>
                  Account Name: {fiscalizationConfig.bankDetails?.accountName}
                </p>
                <p>
                  Account Number:{" "}
                  {fiscalizationConfig.bankDetails?.accountNumber}
                </p>
                <p>Bank Name: {fiscalizationConfig.bankDetails?.bankName}</p>
              </div>
            </div>
            <div className="flex-1 text-white">
              <h6 className="mb-2">Payment Memo</h6>
              <div className=" ">
                <p>{fiscalizationConfig.notes}</p>
              </div>
            </div>
            <div className="shrink-0">
              {resolvedQrCodeUrl ? (
                <img
                  src={resolvedQrCodeUrl}
                  alt="QR Code"
                  width={96}
                  height={96}
                  className="w-24 h-24"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                  QR Code
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/20 pt-4">
            <p className="text-white/90 font-medium text-sm">
              POWERED BY FISCAL EDGE (C) 2025., All Rights Reserved.
            </p>
            <p className="text-white/90 font-medium text-sm">
              www.fiscaledge.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
