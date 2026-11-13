import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { CartBadge, CategoryChip, FoodCard, SearchBar } from '@/components/common';
import { EmptyState, ErrorState, Header, LoadingState, Screen } from '@/components/ui';
import { useCategories, useDebounce, useProducts, useRefresh } from '@/hooks';
import { useCartStore } from '@/store/cartStore';
import { spacing } from '@/theme';
import { getErrorMessage } from '@/utils/errors';

export default function MenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; categoryId?: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const [search, setSearch] = useState(params.q ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(params.categoryId ?? null);
  const debounced = useDebounce(search, 250);

  useEffect(() => {
    if (params.q) setSearch(params.q);
    if (params.categoryId) setCategoryId(params.categoryId);
  }, [params.q, params.categoryId]);

  const categories = useCategories();
  const products = useProducts({
    search: debounced || undefined,
    categoryId: categoryId || undefined,
  });
  const { refreshing, onRefresh } = useRefresh(async () => {
    await Promise.all([products.refetch(), categories.refetch()]);
  });

  const data = useMemo(() => products.data ?? [], [products.data]);

  return (
    <Screen
      safeArea="tabs"
      header={<Header title="Menu" right={<CartBadge />} />}
      padded={false}
    >
      <View style={styles.top}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search dishes" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <CategoryChip label="All" selected={!categoryId} onPress={() => setCategoryId(null)} />
          {(categories.data ?? []).map((c) => (
            <CategoryChip
              key={c.id}
              label={c.name}
              selected={categoryId === c.id}
              onPress={() => setCategoryId(c.id)}
            />
          ))}
        </ScrollView>
      </View>

      {products.isLoading && !products.data ? (
        <LoadingState label="Loading menu..." />
      ) : products.error && !products.data ? (
        <ErrorState message={getErrorMessage(products.error)} onRetry={onRefresh} />
      ) : data.length === 0 ? (
        <EmptyState title="No dishes found" message="Try another category or search term." />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <FoodCard
              product={item}
              layout="horizontal"
              onPress={() => router.push(`/(customer)/product/${item.id}`)}
              onAdd={() => addItem(item)}
            />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: spacing.lg, gap: spacing.md, marginBottom: spacing.md },
  chips: { gap: spacing.sm },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
});
