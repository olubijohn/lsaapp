import { LineItem, TaxItem } from './types';

export const formatInternalData = (data?: string) => {
    return data?.split('-').join('\u00AD') || '';
};

export const formatLongDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A';

export const formatCurrency = (value: number | undefined, currency: string, decimals: number = 2) =>
    `${currency} ${(value ?? 0).toFixed(decimals)}`;

export const computeTaxItems = (items: LineItem[], subtotal: number, totalTaxAmount: number): TaxItem[] => {
    const groupedTaxes = new Map<string, { taxCode: string; rate: number; taxAmount: number; netAmount: number }>();

    items.forEach((line) => {
        const taxes = line?.invoiceItemTaxes || line?.salesOrderItemTaxes || [];
        const lineTotal = line.lineTotal || 0;

        taxes.forEach((t) => {
            const key = `${t.taxCode}@${t.taxRate}`;
            const prev = groupedTaxes.get(key) || { taxCode: t.taxCode, rate: t.taxRate, taxAmount: 0, netAmount: 0 };
            prev.taxAmount += t.taxAmount || 0;
            prev.netAmount += lineTotal;
            groupedTaxes.set(key, prev);
        });
    });

    const computedTaxItems = Array.from(groupedTaxes.values()).map((g) => ({
        taxCode: g.taxCode,
        rate: g.rate,
        taxAmount: g.taxAmount,
        netAmount: g.netAmount,
    }));

    return computedTaxItems.length ? computedTaxItems : [
        {
            taxCode: 'A',
            rate: 0.16,
            taxAmount: totalTaxAmount || 0,
            netAmount: subtotal || 0
        }
    ];
};

export const getDocumentTitle = (documentType: string) => {
    switch (documentType) {
        case 'CreditNote':
            return 'CREDIT NOTE';
        case 'SalesOrder':
            return 'SALES ORDER';
        case 'PurchaseOrder':
            return 'PURCHASE ORDER';
        default:
            return 'TAX INVOICE';
    }
};