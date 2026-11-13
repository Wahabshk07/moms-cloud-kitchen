import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, GlassCard, Header, Screen, SuccessState, Text } from '@/components/ui';
import { spacing } from '@/theme';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId, orderNumber } = useLocalSearchParams<{ orderId?: string; orderNumber?: string }>();

  return (
    <Screen safeArea="stack" orbs header={<Header title="Order placed" />}>
      <SuccessState
        title="Order confirmed"
        message="Your Cash on Delivery order has been received by Mom's Cloud Kitchen."
      />
      <GlassCard intensity="strong" elevated style={styles.card}>
        <Text variant="label" color="blue">
          Order number
        </Text>
        <Text variant="h2">{orderNumber ?? '—'}</Text>
        <Text color="secondary" style={{ marginTop: spacing.sm }}>
          Status: Pending — we will confirm shortly. Pay in cash when your order arrives.
        </Text>
      </GlassCard>
      <View style={styles.actions}>
        {orderId ? (
          <Button label="View order" onPress={() => router.replace(`/(customer)/orders/${orderId}`)} />
        ) : null}
        <Button label="Back to home" variant="secondary" onPress={() => router.replace('/(customer)/home')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  actions: { marginTop: spacing.xl, gap: spacing.md },
});
