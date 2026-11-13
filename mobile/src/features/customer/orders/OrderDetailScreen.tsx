import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { FoodImage, OrderStatusBadge, OrderTracker } from '@/components/common';
import { Divider, ErrorState, Header, LoadingState, Screen, Text } from '@/components/ui';
import { ORDER_STATUS_HINT } from '@/constants';
import { useMyOrder } from '@/hooks';
import { spacing } from '@/theme';
import { formatDateTime, formatPrice } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderQuery = useMyOrder(id);
  const order = orderQuery.data;

  if (orderQuery.isLoading) {
    return (
      <Screen safeArea="tabs" header={<Header title="Order" back />}>
        <LoadingState />
      </Screen>
    );
  }

  if (orderQuery.error || !order) {
    return (
      <Screen safeArea="tabs" header={<Header title="Order" back />}>
        <ErrorState message={getErrorMessage(orderQuery.error, 'Order not found')} onRetry={() => void orderQuery.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen safeArea="tabs" scroll header={<Header title={order.orderNumber} back />}>
      <View style={styles.top}>
        <OrderStatusBadge status={order.status} />
        <Text color="secondary">{formatDateTime(order.createdAt)}</Text>
      </View>
      <Text color="secondary" style={{ marginVertical: spacing.md }}>
        {ORDER_STATUS_HINT[order.status]}
      </Text>
      <OrderTracker status={order.status} />

      <Divider spaced />
      <Text variant="h3">Items</Text>
      <View style={styles.items}>
        {order.items.map((item) => (
          <View key={item.id} style={styles.item}>
            <FoodImage uri={item.imageUrl} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium">{item.productName}</Text>
              <Text variant="caption" color="secondary">
                {item.quantity} × {formatPrice(item.unitPrice)}
              </Text>
            </View>
            <Text variant="price">{formatPrice(item.lineTotal)}</Text>
          </View>
        ))}
      </View>

      <Divider spaced />
      <View style={styles.summary}>
        <Row label="Subtotal" value={formatPrice(order.subtotal)} />
        <Row label="Delivery" value={formatPrice(order.deliveryFee)} />
        <Row label="Total" value={formatPrice(order.total)} strong />
        <Row label="Payment" value="Cash on Delivery" />
      </View>

      <Divider spaced />
      <Text variant="h3">Delivery</Text>
      <Text style={{ marginTop: spacing.sm }}>{order.customerName}</Text>
      <Text color="secondary">{order.phone}</Text>
      <Text color="secondary">{order.address}</Text>
      {order.instructions ? (
        <Text color="secondary" style={{ marginTop: spacing.sm }}>
          Note: {order.instructions}
        </Text>
      ) : null}
    </Screen>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text color={strong ? 'primary' : 'secondary'} variant={strong ? 'bodyMedium' : 'body'}>
        {label}
      </Text>
      <Text variant={strong ? 'price' : 'body'}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  items: { marginTop: spacing.md, gap: spacing.md },
  item: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  thumb: { width: 56, height: 56, borderRadius: 10 },
  summary: { gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});
