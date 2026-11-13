import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';
import type { Order } from '@/types';
import { formatDateTime, formatPrice, pluralize } from '@/utils/format';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
  /** Admin view shows the customer's name. */
  showCustomer?: boolean;
}

export function OrderCard({ order, onPress, showCustomer }: OrderCardProps) {
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.top}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="h3">{order.orderNumber}</Text>
          <Text variant="caption" color="secondary">
            {formatDateTime(order.createdAt)}
          </Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>
      <View style={styles.bottom}>
        <View style={{ flex: 1 }}>
          {showCustomer ? (
            <Text variant="bodyMedium" numberOfLines={1}>
              {order.customerName}
            </Text>
          ) : null}
          <Text variant="caption" color="secondary">
            {pluralize(itemCount, 'item')}
          </Text>
        </View>
        <Text variant="price">{formatPrice(order.total)}</Text>
        <ChevronRight size={18} color={colors.silver} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
