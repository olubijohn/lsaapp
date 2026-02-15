export type LayoutStyle = "simple" | "classic" | "modern01" | "modern02";

export interface TemplateSettings {
  logoUrl?: string;
  logoPosition: "left" | "right";
  themeColor: string;
  layoutStyle: LayoutStyle;
}

export type FiscalizationCountry =
  | "zambia"
  | "zimbabwe"
  | "nigeria"
  | "malawi"
  | "other";

export interface BillingInfo {
  name: string;
  email?: string;
  tpin?: string;
  address?: string;
  city?: string;
  country?: string;
  vatNumber?: string;
}

export interface DocumentData {
  documentNumber?: string;
  documentType: string;
  issueDate?: string;
  dueDate?: string;
  currencyCode: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  exchangeRateToLocal?: number;
  notes?: string;
  fiscalDetail?: {
    countryCode: string;
    invoiceReference: string;
    sdcId: string;
    vsdcDate: string;
    invoiceSequence: number;
    originalInvoiceSequence: number | null;
    taxPayerInvoiceNumber: string;
    internalData: string;
    signature: string;
    ZRAInvNum: string;
    qrCode: string;
    tpin: string;
    branchId: string;
    deviceSerialNumber: string;
    // Malawi fields
    terminalId?: string;
    receiptTypeNumber?: number;
    globalReceiptCounter?: number;
    fiscalDayNumber?: number;
    clientInvoiceNumber?: string;
    originalInvoiceNumber?: string;
    terminalDate?: string;
    hash?: string;
    receiptQrData?: string;
    qrCodeUrl?: string;
    fiscalInvoiceNumber?: string;
    receiptCounter?: string;
    verificationUrl?: string;
  } | null;
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
  taxCodes?: string[];
  invoiceItemTaxes?: Array<{
    taxCode: string;
    taxRate: number;
    taxAmount: number;
  }>;
  salesOrderItemTaxes?: Array<{
    taxCode: string;
    taxRate: number;
    taxAmount: number;
  }>;
}

export interface TaxItem {
  taxCode: string;
  rate: number;
  taxAmount: number;
  netAmount: number;
}

export interface FooterInfo {
  bankDetailsText?: string;
  paymentMemo?: string;
  showBankDetails?: boolean;
  showPaymentMemo?: boolean;
}

export interface TemplateProps {
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
