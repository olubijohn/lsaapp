"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useInvoiceSettingsStore } from "@/stores/invoice-settings-store";
import {
  SimpleTemplate,
  ClassicTemplate,
  Modern01Template,
  Modern02Template,
  TemplateSettings,
  BillingInfo,
  DocumentData,
  LineItem,
  FooterInfo,
  FiscalizationCountry,
} from "./invoice-templates";
import { mapApiToUi } from "@/lib/mappings/invoice-settings";
import { Invoice } from "@/lib/api/invoices";
import { User } from "@/lib/types/auth";

interface InvoicePreviewDocumentProps {
  invoice: Invoice;
  user: User;
  organization?: {
    name?: string;
    email?: string;
    tpin?: string;
    address?: string;
    city?: string;
    country?: string;
    vatNumber?: string;
  };
  showQRCode?: boolean;
}

export function InvoicePreviewDocument({
  invoice,
  user,
  organization,
  showQRCode = true,
}: InvoicePreviewDocumentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { settings } = useInvoiceSettingsStore();

  // Simplified address handling - use invoice customer data directly
  const addressLine1 = invoice?.customerName || "";
  const addressLine2 = "";

  useEffect(() => {
    if (!showQRCode) return;
    const qrData =
      invoice?.fiscalDetails?.verificationUrl ||
      invoice?.fiscalDetails?.qrCode ||
      `DRAFT-${invoice?.invoiceNumber || Date.now()}`;
    QRCode.toDataURL(qrData)
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [
    invoice?.fiscalDetails?.verificationUrl,
    invoice?.fiscalDetails?.qrCode,
    invoice?.invoiceNumber,
    showQRCode,
  ]);

  const templateSettings: TemplateSettings = {
    logoUrl: settings?.logoUrl,
    logoPosition: mapApiToUi.logoPosition(settings?.logoPosition),
    themeColor: settings?.colorScheme || "#000000",
    layoutStyle: mapApiToUi.layoutStyle(settings?.layoutStyle),
  };
  console.log({ organization: organization?.country });

  const fiscalizationCountry: FiscalizationCountry = (() => {
    switch (organization?.country?.toLowerCase()) {
      case "ZM":
        return "zambia";
      case "ZMW":
        return "zambia";
      case "zambia":
        return "zambia";
      case "malawi":
        return "malawi";
      case "MW":
        return "malawi";
      case "MWK":
        return "malawi";
      case "ZW":
        return "zimbabwe";
      case "ZWK":
        return "zimbabwe";
      case "zimbabwe":
        return "zimbabwe";
      case "NG":
        return "nigeria";
      case "NGN":
        return "nigeria";
      case "nigeria":
        return "nigeria";
      default:
        return "zambia";
    }
  })();

  const billFrom: BillingInfo = {
    name:
      organization?.name ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    email: organization?.email || user?.email,
    address: organization?.address || "",
    city: organization?.city || "",
    country: organization?.country || "",
    tpin: invoice?.tpin || organization?.tpin,
    vatNumber: organization?.vatNumber || organization?.tpin || invoice?.tpin,
  };

  const billTo: BillingInfo = {
    name: invoice?.customerName || "Customer Name",
    email: undefined,
    address: addressLine1,
    country: addressLine2,
    tpin: invoice?.customerTpin,
  };

  const getDocumentType = (): string => {
    if (fiscalizationCountry === "malawi") {
      const receiptTypeCode = invoice?.receiptTypeCode?.toUpperCase();
      if (receiptTypeCode === "D") return "Tax Invoice";
      if (receiptTypeCode === "C") return "Credit Note";
      return invoice?.invoiceHeader || "Tax Invoice";
    }
    return invoice?.invoiceHeader || "Invoice";
  };

  const documentData: DocumentData = {
    documentNumber: invoice?.invoiceNumber,
    documentType: getDocumentType(),
    issueDate: invoice?.saleDate,
    dueDate: undefined,
    currencyCode: invoice?.currency || "ZMW",
    subtotal: invoice?.subtotal ?? 0,
    taxAmount: invoice?.totalTax ?? 0,
    totalAmount: invoice?.totalAmount ?? 0,
    exchangeRateToLocal: invoice?.conversionRate,
    notes: undefined,
    fiscalDetail: invoice?.fiscalDetails
      ? {
          countryCode: fiscalizationCountry === "malawi" ? "MW" : "ZM",
          invoiceReference: invoice.fiscalDetails.zraInvoiceNumber,
          sdcId:
            invoice.fiscalDetails.sdcId ||
            invoice.fiscalDetails.terminalId ||
            "",
          vsdcDate:
            invoice.fiscalDetails.terminalDate ||
            invoice.fiscalDetails.vsdcdate,
          invoiceSequence: 0,
          originalInvoiceSequence: null,
          taxPayerInvoiceNumber: invoice.fiscalDetails.zraInvoiceNumber,
          internalData: invoice.fiscalDetails.internalData,
          signature: invoice.fiscalDetails.signature,
          ZRAInvNum: invoice.fiscalDetails.zraInvoiceNumber,
          qrCode:
            invoice.fiscalDetails.qrCode || invoice.fiscalDetails.signature,
          tpin: invoice?.tpin || "",
          branchId:
            invoice.fiscalDetails.sdcId ||
            invoice.fiscalDetails.terminalId ||
            "",
          deviceSerialNumber: "",
          originalInvoiceNumber:
            invoice.fiscalDetails.originalInvoiceNumber ||
            invoice.fiscalDetails.originalZraInvoiceNumber ||
            undefined,
          qrCodeUrl:
            invoice.fiscalDetails.verificationUrl ||
            invoice.fiscalDetails.qrCode ||
            invoice.fiscalDetails.signature,
          clientInvoiceNumber: invoice.fiscalDetails.clientInvoiceNumber,
          fiscalInvoiceNumber: invoice.fiscalDetails.fiscalInvoiceNumber,
          receiptCounter:
            invoice.fiscalDetails.receiptCounter ||
            invoice.fiscalDetails.globalReceiptCounter?.toString(),
          terminalDate: invoice.fiscalDetails.terminalDate,
          terminalId: invoice.fiscalDetails.terminalId,
          verificationUrl: invoice.fiscalDetails.verificationUrl,
        }
      : null,
  };

  const items: LineItem[] = (invoice?.invoiceItems || []).map((line) => {
    const subtotal = line.quantity * line.unitPrice;
    const lineTotal = subtotal - (line.discountAmount || 0);

    return {
      description: line.itemDesc,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      discountAmount: line.discountAmount,
      lineTotal: lineTotal,
      taxCodes: line.taxCodes,
      invoiceItemTaxes: [],
    };
  });

  const invoiceBankDetailsFromProp = "";
  const bankDetailsText =
    invoiceBankDetailsFromProp ||
    (settings?.showBankDetailsOnInvoice ? settings?.bankDetails || "" : "");
  const memoText = settings?.showPaymentMemoOnInvoice
    ? settings?.paymentMemo || ""
    : "";

  const footer: FooterInfo = {
    bankDetailsText,
    paymentMemo: memoText,
    showBankDetails: settings?.showBankDetailsOnInvoice,
    showPaymentMemo: settings?.showPaymentMemoOnInvoice,
  };

  const TemplateComponent =
    {
      simple: SimpleTemplate,
      classic: ClassicTemplate,
      modern01: Modern01Template,
      modern02: Modern02Template,
    }[templateSettings.layoutStyle] || SimpleTemplate;

  return (
    <div className="w-full overflow-x-auto overflow-y-visible pt-3">
      <div className="min-w-180">
        <TemplateComponent
          settings={templateSettings}
          billFrom={billFrom}
          billTo={billTo}
          document={documentData}
          items={items}
          footer={footer}
          qrCodeUrl={qrCodeUrl}
          showQRCode={showQRCode}
          fiscalizationCountry={fiscalizationCountry}
          isFiscalizationEnabled={
            (settings?.isFiscalizationEnabled ?? true) &&
            !!invoice?.fiscalDetails
          }
        />
      </div>
    </div>
  );
}
