import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoryChip, FoodImage, OrderStatusBadge, OrderTracker } from '@/components/common';
import { Divider, ErrorState, Header, LoadingState, Screen, Text } from '@/components/ui';
import { ALL_ORDER_STATUSES, ORDER_STATUS_LABEL } from '@/constants';
import { useOrder, useUpdateOrderStatus } from '@/hooks';
import { spacing } from '@/theme';
import type { OrderStatus } from '@/types';
import { formatDateTime, formatPrice } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

export default function AdminOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderQuery = useOrder(id);
  const updateStatus = useUpdateOrderStatus(id);
  const [error, setError] = useState<string | null>(null);
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

  const setStatus = async (status: OrderStatus) => {
    setError(null);
    try {
      await updateStatus.mutateAsync(status);
    } catch (e) {
      setError(getErrorMessage(e, 'Could not update status.'));
    }
  };

  return (
    <Screen safeArea="tabs" scroll header={<Header title={order.orderNumber} back />}>
      <View style={styles.top}>
        <OrderStatusBadge status={order.status} />
        <Text color="secondary">{formatDateTime(order.createdAt)}</Text>
      </View>
      <OrderTracker status={order.status} />

      <Text variant="h3" style={{ marginTop: spacing.xl }}>
        Update status
      </Text>
      {error ? (
        <Text color="danger" style={{ marginTop: spacing.sm }}>
          {error}
        </Text>
      ) : null}
      <View style={styles.chips}>
        {ALL_ORDER_STATUSES.map((s) => (
          <CategoryChip
            key={s}
            label={ORDER_STATUS_LABEL[s]}
            selected={order.status === s}
            onPress={() => void setStatus(s)}
          />
        ))}
      </View>

      <Divider spaced />
      <Text variant="h3">Customer</Text>
      <Text style={{ marginTop: spacing.sm }}>{order.customerName}</Text>
      <Text color="secondary">{order.phone}</Text>
      <Text color="secondary">{order.address}</Text>
      {order.instructions ? <Text color="secondary">Note: {order.instructions}</Text> : null}

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
      <View style={styles.row}>
        <Text color="secondary">Total</Text>
        <Text variant="price">{formatPrice(order.total)}</Text>
      </View>
      <Text color="secondary" style={{ marginTop: spacing.sm }}>
        Payment: Cash on Delivery
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  items: { marginTop: spacing.md, gap: spacing.md },
  item: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  thumb: { width: 56, height: 56, borderRadius: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});
