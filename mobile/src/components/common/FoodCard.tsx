import { Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable, Badge, Text } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/theme';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/format';
import { FoodImage } from './FoodImage';

interface FoodCardProps {
  product: Product;
  onPress: () => void;
  onAdd?: () => void;
  /** `vertical` is a grid/carousel tile; `horizontal` is a list row. */
  layout?: 'vertical' | 'horizontal';
  width?: number;
  index?: number;
}

export function FoodCard({ product, onPress, onAdd, layout = 'vertical', width }: FoodCardProps) {
  const unavailable = !product.isAvailable;

  const addButton = onAdd ? (
    <AnimatedPressable
      accessibilityLabel={unavailable ? `${product.name} is unavailable` : `Add ${product.name} to cart`}
      disabled={unavailable}
      onPress={onAdd}
      scaleTo={0.9}
      style={[styles.add, unavailable && styles.addDisabled]}
    >
      <Plus size={18} color={unavailable ? colors.textTertiary : colors.white} strokeWidth={2.2} />
    </AnimatedPressable>
  ) : null;

  if (layout === 'horizontal') {
    return (
      <AnimatedPressable
        onPress={onPress}
        scaleTo={0.985}
        style={[styles.rowCard, shadows.sm]}
      >
        <View>
          <FoodImage uri={product.imageUrl} style={[styles.rowImage, unavailable && styles.dim]} />
        </View>
        <View style={styles.rowBody}>
          <Text variant="h3" numberOfLines={1}>
            {product.name}
          </Text>
          {product.category ? (
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {product.category.name}
            </Text>
          ) : null}
          {product.description ? (
            <Text variant="caption" color="secondary" numberOfLines={2}>
              {product.description}
            </Text>
          ) : null}
          <View style={styles.rowFooter}>
            <Text variant="price" color={unavailable ? 'tertiary' : 'primary'}>
              {formatPrice(product.price)}
            </Text>
            {unavailable ? <Badge label="Unavailable" tone="outline" /> : null}
          </View>
        </View>
        {addButton}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      scaleTo={0.97}
      style={[styles.tile, width ? { width } : { flex: 1 }, shadows.sm]}
    >
      <View>
        <FoodImage uri={product.imageUrl} style={[styles.tileImage, unavailable && styles.dim]} iconSize={34} />
        {unavailable ? (
          <View style={styles.sold}>
            <Badge label="Unavailable" tone="dark" />
          </View>
        ) : null}
        <View style={styles.imageSheen} pointerEvents="none" />
      </View>
      <View style={styles.tileBody}>
        <Text variant="bodyMedium" numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.tileFooter}>
          <Text variant="price" color={unavailable ? 'tertiary' : 'primary'}>
            {formatPrice(product.price)}
          </Text>
          {addButton}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.glassStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorderMuted,
    overflow: 'hidden',
  },
  tileImage: { width: '100%', aspectRatio: 1.15 },
  imageSheen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.glassBorder,
  },
  tileBody: { padding: spacing.md, gap: spacing.xs },
  tileFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sold: { position: 'absolute', top: spacing.sm, left: spacing.sm },
  dim: { opacity: 0.45 },
  add: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.deepBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addDisabled: { backgroundColor: colors.lightSilver },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.glassStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorderMuted,
  },
  rowImage: { width: 88, height: 88, borderRadius: radius.md },
  rowBody: { flex: 1, gap: 2 },
  rowFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
});
