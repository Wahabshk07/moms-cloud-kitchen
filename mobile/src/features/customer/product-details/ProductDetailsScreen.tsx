import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bike, Clock, Heart, Leaf } from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { FoodImage } from '@/components/common';
import {
  Badge,
  Button,
  ErrorState,
  GlassCard,
  Header,
  IconButton,
  LoadingState,
  QuantityStepper,
  Screen,
  Text,
} from '@/components/ui';
import { useProduct, useProducts } from '@/hooks';
import { useCartStore } from '@/store/cartStore';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';


export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const productQuery = useProduct(id);
  const popular = useProducts({ popular: true });
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [descExpanded, setDescExpanded] = useState(false);

  const product = productQuery.data;
  const withItems = useMemo(
    () => (popular.data ?? []).filter((p) => p.id !== id && p.isAvailable).slice(0, 8),
    [popular.data, id],
  );

  if (productQuery.isLoading) {
    return (
      <Screen safeArea="stack" header={<Header title="Dish" back />}>
        <LoadingState />
      </Screen>
    );
  }

  if (productQuery.error || !product) {
    return (
      <Screen safeArea="stack" header={<Header title="Dish" back />}>
        <ErrorState
          message={getErrorMessage(productQuery.error, 'Dish not found')}
          onRetry={() => void productQuery.refetch()}
        />
      </Screen>
    );
  }

  const description = product.description ?? '';
  const shortDesc = description.length > 120 && !descExpanded ? `${description.slice(0, 120).trim()}…` : description;

  const addToCart = () => {
    if (!product.isAvailable) return;
    addItem(product, qty);
  };

  const orderNow = () => {
    addToCart();
    router.push('/(customer)/checkout');
  };

  return (
    <Screen
      safeArea="stack"
      scroll
      header={
        <Header
          back
          right={
            <IconButton
              icon={Heart}
              variant="filled"
              accessibilityLabel="Favorite"
              onPress={() => undefined}
            />
          }
        />
      }
      footer={
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Button
              label="Add to Cart"
              variant="secondary"
              size="lg"
              disabled={!product.isAvailable}
              onPress={() => {
                addToCart();
                router.push('/(customer)/cart');
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="Order"
              size="lg"
              disabled={!product.isAvailable}
              onPress={orderNow}
            />
          </View>
        </View>
      }
    >
      <View style={styles.heroWrap}>
        <FoodImage uri={product.imageUrl} style={styles.hero} iconSize={48} />
      </View>

      <View style={styles.titleBlock}>
        <View style={styles.titleRow}>
          <Text variant="h1" style={{ flex: 1 }}>
            {product.name}
          </Text>
          {!product.isAvailable ? <Badge label="Unavailable" tone="outline" /> : null}
        </View>
        <Text variant="h2" color="price">
          {formatPrice(product.price)}
        </Text>
        {product.category ? (
          <Text variant="caption" color="secondary">
            {product.category.name}
          </Text>
        ) : null}
      </View>

      <GlassCard intensity="soft" elevated style={styles.attrsCard}>
        <View style={styles.attrs}>
          <Attr icon={<Bike size={18} color={colors.deepBlue} strokeWidth={1.8} />} label="COD delivery" />
          <Attr icon={<Clock size={18} color={colors.deepBlue} strokeWidth={1.8} />} label="25–35 min" />
          <Attr icon={<Leaf size={18} color={colors.deepBlue} strokeWidth={1.8} />} label="Homemade" />
        </View>
      </GlassCard>

      <GlassCard intensity="strong" style={styles.qtyCard}>
        <View style={styles.qtyRow}>
          <Text variant="bodyMedium">Quantity</Text>
          <QuantityStepper
            value={qty}
            onIncrement={() => setQty((q) => q + 1)}
            onDecrement={() => setQty((q) => Math.max(1, q - 1))}
            disabled={!product.isAvailable}
          />
        </View>
      </GlassCard>

      {product.ingredients.length > 0 ? (
        <View style={styles.section}>
          <Text variant="h3">Ingredients</Text>
          <View style={styles.chips}>
            {product.ingredients.map((ing) => (
              <View key={ing} style={styles.chip}>
                <Text variant="caption">{ing}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {description ? (
        <View style={styles.section}>
          <Text variant="h3">Description</Text>
          <Text color="secondary">{shortDesc}</Text>
          {description.length > 120 ? (
            <Pressable onPress={() => setDescExpanded((v) => !v)} hitSlop={8}>
              <Text variant="bodyMedium">{descExpanded ? 'Less' : 'More...'}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {withItems.length > 0 ? (
        <View style={[styles.section, { paddingBottom: spacing.xxl }]}>
          <Text variant="h3">Often order with</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.withRow}>
            {withItems.map((item) => (
              <Pressable
                key={item.id}
                style={styles.withCard}
                onPress={() => router.push(`/(customer)/product/${item.id}`)}
              >
                <FoodImage uri={item.imageUrl} style={styles.withImage} />
                <Text variant="caption" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text variant="caption" color="price">
                  {formatPrice(item.price)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </Screen>
  );
}

function Attr({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View style={styles.attr}>
      <View style={styles.attrIcon}>{icon}</View>
      <Text variant="caption" color="secondary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: { alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.xl },
  hero: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 6,
    borderColor: colors.white,
    ...shadows.hero,
  },
  titleBlock: { gap: spacing.xs, marginBottom: spacing.lg },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  attrsCard: { marginBottom: spacing.xl },
  attrs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  attr: { flex: 1, alignItems: 'center', gap: spacing.xs },
  attrIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyCard: { marginBottom: spacing.xl },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: { gap: spacing.md, marginBottom: spacing.xl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassBorderMuted,
  },
  withRow: { gap: spacing.md, paddingVertical: spacing.xs },
  withCard: { width: 96, gap: spacing.xs },
  withImage: { width: 96, height: 96, borderRadius: radius.lg },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
