export function lineTotal(unitPrice, quantity) {
    if (unitPrice < 0 || quantity <= 0) {
        throw new Error('Invalid line pricing');
    }
    return roundMoney(unitPrice * quantity);
}
export function calculateOrderTotals(lines, deliveryFee) {
    if (!lines.length) {
        throw new Error('Order must contain at least one item');
    }
    if (deliveryFee < 0) {
        throw new Error('Invalid delivery fee');
    }
    const subtotal = roundMoney(lines.reduce((sum, line) => sum + lineTotal(line.unitPrice, line.quantity), 0));
    return {
        subtotal,
        deliveryFee: roundMoney(deliveryFee),
        total: roundMoney(subtotal + deliveryFee),
    };
}
export function roundMoney(value) {
    return Math.round(value * 100) / 100;
}
//# sourceMappingURL=order-pricing.js.map