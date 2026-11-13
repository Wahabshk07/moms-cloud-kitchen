import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { FoodImage } from '@/components/common';
import { Button, EmptyState, GlassCard, Header, IconButton, QuantityStepper, Screen, Text } from '@/components/ui';
import { useDeliveryFee } from '@/hooks';
import { selectCartCount, selectCartSubtotal, useCartStore } from '@/store/cartStore';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';

export default function CartScreen() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const { increment, decrement, removeItem } = useCartStore();
  const { deliveryFee } = useDeliveryFee();
  const total = subtotal + (count > 0 ? deliveryFee : 0);
  const hasUnavailable = items.some((i) => !i.isAvailable);

  if (items.length === 0) {
    return (
      <Screen safeArea="stack" header={<Header title="Cart" back />}>
        <EmptyState
          title="Your cart is empty"
          message="Browse the menu and add something homemade."
          actionLabel="Browse menu"
          onAction={() => router.push('/(customer)/menu')}
        />
      </Screen>
    );
  }

  return (
    <Screen
      safeArea="stack"
      scroll
      header={<Header title="Cart" back />}
      footer={
        <View style={styles.footer}>
          <Button
            label="Checkout"
            size="lg"
            disabled={hasUnavailable || subtotal <= 0}
            onPress={() => router.push('/(customer)/checkout')}
          />
          {hasUnavailable ? (
            <Text variant="caption" color="danger" align="center">
              Remove unavailable items before checkout.
            </Text>
          ) : null}
        </View>
      }
    >
      <View style={styles.list}>
        {items.map((item) => (
          <View key={item.productId} style={styles.row}>
            <FoodImage uri={item.image} style={styles.thumb} />
            <View style={styles.body}>
              <Text variant="h3" numberOfLines={1}>
                {item.name}
              </Text>
              <Text variant="bodyMedium" color={item.isAvailable ? 'price' : 'danger'}>
                {item.isAvailable ? formatPrice(item.unitPrice) : 'Unavailable'}
              </Text>
              <QuantityStepper
                value={item.quantity}
                min={1}
                size="sm"
                onIncrement={() => increment(item.productId)}
                onDecrement={() =>
                  item.quantity <= 1 ? removeItem(item.productId) : decrement(item.productId)
                }
              />
            </View>
            <IconButton
              icon={Trash2}
              variant="filled"
              color={colors.price}
              accessibilityLabel="Remove item"
              onPress={() => removeItem(item.productId)}
            />
          </View>
        ))}
      </View>

      <GlassCard intensity="strong" elevated style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text color="secondary">Products</Text>
          <Text>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text color="secondary">Delivery</Text>
          <Text>{formatPrice(deliveryFee)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text variant="h3">Total</Text>
          <Text variant="h2">{formatPrice(total)}</Text>
        </View>
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.lg, marginBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassBorderMuted,
    ...shadows.sm,
  },
  thumb: { width: 72, height: 72, borderRadius: radius.lg },
  body: { flex: 1, gap: 6 },
  summaryCard: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  footer: {
    gap: spacing.md,
  },
});
