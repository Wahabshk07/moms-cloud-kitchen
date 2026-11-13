export type PricedLineInput = {
  unitPrice: number;
  quantity: number;
};

export type OrderTotals = {
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export function lineTotal(unitPrice: number, quantity: number): number {
  if (unitPrice < 0 || quantity <= 0) {
    throw new Error('Invalid line pricing');
  }
  return roundMoney(unitPrice * quantity);
}

export function calculateOrderTotals(
  lines: PricedLineInput[],
  deliveryFee: number,
): OrderTotals {
  if (!lines.length) {
    throw new Error('Order must contain at least one item');
  }
  if (deliveryFee < 0) {
    throw new Error('Invalid delivery fee');
  }

  const subtotal = roundMoney(
    lines.reduce((sum, line) => sum + lineTotal(line.unitPrice, line.quantity), 0),
  );

  return {
    subtotal,
    deliveryFee: roundMoney(deliveryFee),
    total: roundMoney(subtotal + deliveryFee),
  };
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
