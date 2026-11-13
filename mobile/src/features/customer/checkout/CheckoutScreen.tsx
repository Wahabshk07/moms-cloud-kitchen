import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { ControlledInput, FormError } from '@/components/common';
import { Button, GlassCard, Header, Screen, Text } from '@/components/ui';
import { useCreateOrder, useDeliveryFee } from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { selectCartSubtotal, useCartStore } from '@/store/cartStore';
import { spacing } from '@/theme';
import { formatPrice } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';
import { checkoutSchema, type CheckoutForm } from '@/utils/validation';

export default function CheckoutScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore(selectCartSubtotal);
  const { deliveryFee } = useDeliveryFee();
  const createOrder = useCreateOrder();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
      instructions: '',
    },
  });

  const total = subtotal + deliveryFee;
  const availableItems = items.filter((i) => i.isAvailable);

  const onSubmit = handleSubmit(async (values) => {
    if (submitting || availableItems.length === 0) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const order = await createOrder.mutateAsync({
        customerName: values.name.trim(),
        customerPhone: values.phone.trim(),
        deliveryAddress: values.address.trim(),
        deliveryInstructions: values.instructions?.trim() || undefined,
        items: availableItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clear();
      router.replace({
        pathname: '/(customer)/order-confirmation',
        params: { orderId: order.id, orderNumber: order.orderNumber },
      });
    } catch (e) {
      setServerError(getErrorMessage(e, 'Could not place your order. Please try again.'));
      setSubmitting(false);
    }
  });

  return (
    <Screen
      safeArea="stack"
      scroll
      keyboard
      header={<Header title="Checkout" back />}
      footer={
        <View style={styles.footer}>
          <Button label={`Place order · ${formatPrice(total)}`} size="lg" loading={submitting} onPress={onSubmit} />
        </View>
      }
    >
      <FormError message={serverError} />
      <Text variant="h3" style={styles.section}>
        Delivery details
      </Text>
      <View style={styles.form}>
        <ControlledInput control={control} name="name" label="Full name" autoCapitalize="words" />
        <ControlledInput control={control} name="phone" label="Phone" keyboardType="phone-pad" />
        <ControlledInput control={control} name="address" label="Delivery address" multiline />
        <ControlledInput
          control={control}
          name="instructions"
          label="Delivery instructions (optional)"
          placeholder="Gate code, landmark..."
          multiline
        />
      </View>

      <GlassCard intensity="tint" elevated style={styles.cod}>
        <Text variant="label" color="blue">
          Payment
        </Text>
        <Text variant="h3">Cash on Delivery</Text>
        <Text color="secondary">
          Pay in cash when your order arrives. No online payment is required.
        </Text>
      </GlassCard>

      <GlassCard intensity="strong" elevated style={styles.summary}>
        <Text variant="h3">Order summary</Text>
        {availableItems.map((i) => (
          <View key={i.productId} style={styles.line}>
            <Text color="secondary" style={{ flex: 1 }}>
              {i.quantity}× {i.name}
            </Text>
            <Text>{formatPrice(i.unitPrice * i.quantity)}</Text>
          </View>
        ))}
        <View style={styles.line}>
          <Text color="secondary">Delivery</Text>
          <Text>{formatPrice(deliveryFee)}</Text>
        </View>
        <View style={styles.line}>
          <Text variant="bodyMedium">Total</Text>
          <Text variant="price">{formatPrice(total)}</Text>
        </View>
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.sm, marginBottom: spacing.md },
  form: { gap: spacing.lg },
  cod: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  summary: { marginTop: spacing.xl, gap: spacing.md, marginBottom: spacing.xl },
  line: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  footer: {
    gap: spacing.sm,
  },
});
