import { useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { CartBadge, OrderCard } from '@/components/common';
import { EmptyState, ErrorState, Header, LoadingState, Screen } from '@/components/ui';
import { useMyOrders, useRefresh } from '@/hooks';
import { spacing } from '@/theme';
import { getErrorMessage } from '@/utils/errors';

export default function OrdersScreen() {
  const router = useRouter();
  const orders = useMyOrders();
  const { refreshing, onRefresh } = useRefresh(() => orders.refetch());

  return (
    <Screen safeArea="tabs" header={<Header title="My orders" right={<CartBadge />} />} padded={false}>
      {orders.isLoading && !orders.data ? (
        <LoadingState label="Loading orders..." />
      ) : orders.error && !orders.data ? (
        <ErrorState message={getErrorMessage(orders.error)} onRetry={onRefresh} />
      ) : (orders.data?.length ?? 0) === 0 ? (
        <EmptyState
          title="No orders yet"
          message="When you place an order, it will show up here."
          actionLabel="Browse menu"
          onAction={() => router.push('/(customer)/menu')}
        />
      ) : (
        <FlatList
          data={orders.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => router.push(`/(customer)/orders/${item.id}`)} />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
});
