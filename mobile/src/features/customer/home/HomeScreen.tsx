import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { CartBadge, CategoryChip, FoodCard, SearchBar, SectionHeader } from '@/components/common';
import { ErrorState, GlassCard, Header, LoadingState, MetallicHero, Screen, Text } from '@/components/ui';
import { useCategories, useProducts, useRefresh } from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { spacing } from '@/theme';
import { getErrorMessage } from '@/utils/errors';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);
  const [search, setSearch] = useState('');

  const featured = useProducts({ featured: true });
  const popular = useProducts({ popular: true });
  const menu = useProducts({});
  const categories = useCategories();

  const { refreshing, onRefresh } = useRefresh(async () => {
    await Promise.all([featured.refetch(), popular.refetch(), menu.refetch(), categories.refetch()]);
  });

  const preview = useMemo(() => (menu.data ?? []).slice(0, 6), [menu.data]);
  const loading = featured.isLoading || popular.isLoading || menu.isLoading;
  const error = featured.error || popular.error || menu.error;
  const greeting = user?.name
    ? `Welcome, ${user.name.split(' ')[0]}`
    : 'Welcome, guest';

  if (loading && !menu.data) {
    return (
      <Screen safeArea="tabs">
        <Header large title="Mom's Cloud Kitchen" right={<CartBadge />} />
        <LoadingState label="Loading the kitchen..." />
      </Screen>
    );
  }

  if (error && !menu.data) {
    return (
      <Screen safeArea="tabs">
        <Header large title="Mom's Cloud Kitchen" right={<CartBadge />} />
        <ErrorState message={getErrorMessage(error)} onRetry={onRefresh} />
      </Screen>
    );
  }

  return (
    <Screen
      safeArea="tabs"
      scroll
      refreshing={refreshing}
      onRefresh={onRefresh}
      header={
        <Header
          large
          title="Mom's Cloud Kitchen"
          subtitle="Homemade · Premium comfort food"
          right={<CartBadge />}
        />
      }
    >
      <MetallicHero greeting={greeting} />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search the menu"
        onSubmit={() =>
          router.push({ pathname: '/(customer)/menu', params: { q: search.trim() } })
        }
      />

      {(categories.data?.length ?? 0) > 0 ? (
        <View style={styles.section}>
          <SectionHeader title="Categories" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {categories.data!.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.name}
                selected={false}
                onPress={() =>
                  router.push({ pathname: '/(customer)/menu', params: { categoryId: c.id } })
                }
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {(popular.data?.length ?? 0) > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Popular dishes"
            eyebrow="Most loved"
            actionLabel="Menu"
            onAction={() => router.push('/(customer)/menu')}
          />
          <FlatList
            horizontal
            data={popular.data}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
            renderItem={({ item }) => (
              <FoodCard
                product={item}
                width={196}
                onPress={() => router.push(`/(customer)/product/${item.id}`)}
                onAdd={() => addItem(item)}
              />
            )}
          />
        </View>
      ) : null}

      {(featured.data?.length ?? 0) > 0 ? (
        <View style={styles.section}>
          <SectionHeader title="Today's recommendations" eyebrow="Kitchen picks" />
          <FlatList
            horizontal
            data={featured.data}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
            renderItem={({ item }) => (
              <FoodCard
                product={item}
                width={196}
                onPress={() => router.push(`/(customer)/product/${item.id}`)}
                onAdd={() => addItem(item)}
              />
            )}
          />
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="Complete menu" actionLabel="See all" onAction={() => router.push('/(customer)/menu')} />
        <View style={styles.list}>
          {preview.map((item) => (
            <FoodCard
              key={item.id}
              product={item}
              layout="horizontal"
              onPress={() => router.push(`/(customer)/product/${item.id}`)}
              onAdd={() => addItem(item)}
            />
          ))}
        </View>
      </View>

      <GlassCard intensity="tint" elevated style={styles.story}>
        <Text variant="label" color="blue">
          Our kitchen
        </Text>
        <Text variant="h2" style={{ marginTop: spacing.xs }}>
          Comfort food, prepared with care
        </Text>
        <Text color="secondary" style={{ marginTop: spacing.sm }}>
          {"Mom's Cloud Kitchen brings homemade recipes to your door — honest ingredients, thoughtful portions, and Cash on Delivery when your meal arrives."}
        </Text>
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl, gap: spacing.md },
  chips: { gap: spacing.sm, paddingVertical: spacing.xs },
  row: { gap: spacing.md, paddingVertical: spacing.xs },
  list: { gap: spacing.md },
  story: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
});
