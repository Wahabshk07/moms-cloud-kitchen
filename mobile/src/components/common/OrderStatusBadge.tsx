import { Badge, type BadgeTone } from '@/components/ui';
import { ORDER_STATUS_LABEL } from '@/constants';
import type { OrderStatus } from '@/types';

const tone: Record<OrderStatus, BadgeTone> = {
  PENDING: 'neutral',
  CONFIRMED: 'blue',
  PREPARING: 'blue',
  READY_FOR_DELIVERY: 'solidBlue',
  DELIVERED: 'dark',
  CANCELLED: 'outline',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge label={ORDER_STATUS_LABEL[status]} tone={tone[status]} />;
}
