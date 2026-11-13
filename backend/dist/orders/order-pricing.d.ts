export type PricedLineInput = {
    unitPrice: number;
    quantity: number;
};
export type OrderTotals = {
    subtotal: number;
    deliveryFee: number;
    total: number;
};
export declare function lineTotal(unitPrice: number, quantity: number): number;
export declare function calculateOrderTotals(lines: PricedLineInput[], deliveryFee: number): OrderTotals;
export declare function roundMoney(value: number): number;
