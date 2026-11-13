import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { FoodImage } from '@/components/common';
import { Badge, EmptyState, ErrorState, Header, IconButton, LoadingState, Screen, Text } from '@/components/ui';
import { useProducts, useRefresh } from '@/hooks';
import { spacing } from '@/theme';
import { formatPrice } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

export default function ProductsScreen() {
  const router = useRouter();
  const products = useProducts({ admin: true });
  const { refreshing, onRefresh } = useRefresh(() => products.refetch());

  return (
    <Screen
      safeArea="tabs"
      padded={false}
      header={
        <Header
          title="Products"
          right={
            <IconButton
              icon={Plus}
              variant="dark"
              accessibilityLabel="Add product"
              onPress={() => router.push('/(admin)/products/new')}
            />
          }
        />
      }
    >
      {products.isLoading && !products.data ? (
        <LoadingState />
      ) : products.error && !products.data ? (
        <ErrorState message={getErrorMessage(products.error)} onRetry={onRefresh} />
      ) : (products.data?.length ?? 0) === 0 ? (
        <EmptyState title="No products" message="Add your first dish to the menu." actionLabel="Add product" onAction={() => router.push('/(admin)/products/new')} />
      ) : (
        <FlatList
          data={products.data}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => router.push(`/(admin)/products/${item.id}`)}>
              <FoodImage uri={item.imageUrl} style={styles.thumb} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="h3" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text variant="caption" color="secondary">
                  {formatPrice(item.price)} · {item.category?.name ?? 'Uncategorised'}
                </Text>
                <Badge label={item.isAvailable ? 'Available' : 'Unavailable'} tone={item.isAvailable ? 'blue' : 'outline'} />
              </View>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  thumb: { width: 72, height: 72, borderRadius: 12 },
});
