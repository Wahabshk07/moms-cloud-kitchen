import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { CategoryChip, OrderCard } from '@/components/common';
import { EmptyState, ErrorState, Header, LoadingState, Screen } from '@/components/ui';
import { ALL_ORDER_STATUSES, ORDER_STATUS_LABEL } from '@/constants';
import { useAllOrders, useRefresh } from '@/hooks';
import { spacing } from '@/theme';
import type { OrderStatus } from '@/types';
import { getErrorMessage } from '@/utils/errors';

export default function AdminOrdersScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const orders = useAllOrders(status);
  const { refreshing, onRefresh } = useRefresh(() => orders.refetch());

  return (
    <Screen safeArea="tabs" padded={false} header={<Header title="Orders" />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <CategoryChip label="All" selected={!status} onPress={() => setStatus(null)} />
        {ALL_ORDER_STATUSES.map((s) => (
          <CategoryChip
            key={s}
            label={ORDER_STATUS_LABEL[s]}
            selected={status === s}
            onPress={() => setStatus(s)}
          />
        ))}
      </ScrollView>

      {orders.isLoading && !orders.data ? (
        <LoadingState />
      ) : orders.error && !orders.data ? (
        <ErrorState message={getErrorMessage(orders.error)} onRetry={onRefresh} />
      ) : (orders.data?.length ?? 0) === 0 ? (
        <EmptyState title="No orders" message="Incoming orders will appear here." />
      ) : (
        <FlatList
          data={orders.data}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              showCustomer
              onPress={() => router.push(`/(admin)/orders/${item.id}`)}
            />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
});
