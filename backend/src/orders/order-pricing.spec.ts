import { describe, expect, it } from 'vitest';
import { calculateOrderTotals, lineTotal } from './order-pricing.js';

describe('order pricing', () => {
  it('computes line totals', () => {
    expect(lineTotal(120.5, 2)).toBe(241);
  });

  it('sums subtotal with delivery fee', () => {
    expect(
      calculateOrderTotals(
        [
          { unitPrice: 450, quantity: 2 },
          { unitPrice: 200, quantity: 1 },
        ],
        50,
      ),
    ).toEqual({ subtotal: 1100, deliveryFee: 50, total: 1150 });
  });

  it('rejects empty orders', () => {
    expect(() => calculateOrderTotals([], 50)).toThrow(
      'Order must contain at least one item',
    );
  });
});
