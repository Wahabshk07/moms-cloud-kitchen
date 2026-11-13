import type { OrderStatus } from '@/types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY_FOR_DELIVERY: 'Ready for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

/** Happy-path progression used for tracking UI and the admin updater. */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_DELIVERY',
  'DELIVERED',
];

export const ALL_ORDER_STATUSES: OrderStatus[] = [...ORDER_STATUS_FLOW, 'CANCELLED'];

export const ORDER_STATUS_HINT: Record<OrderStatus, string> = {
  PENDING: 'We have received your order and will confirm it shortly.',
  CONFIRMED: 'Your order is confirmed. The kitchen will start soon.',
  PREPARING: 'Your meal is being freshly prepared.',
  READY_FOR_DELIVERY: 'Your order is packed and ready for delivery.',
  DELIVERED: 'Delivered. Enjoy your meal.',
  CANCELLED: 'This order was cancelled.',
};
