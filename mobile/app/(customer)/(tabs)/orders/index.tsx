import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CartBadge } from '@/components/common';
import { Button, Header, Screen, Text } from '@/components/ui';
import OrdersScreen from '@/features/customer/orders/OrdersScreen';
import { useAuthStore } from '@/store/authStore';
import { spacing } from '@/theme';

export default function OrdersRoute() {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  if (!hydrated) return null;

  if (!user) {
    return (
      <Screen safeArea="tabs" header={<Header title="My orders" right={<CartBadge />} />}>
        <View style={styles.guest}>
          <Text variant="h2">Sign in to track orders</Text>
          <Text color="secondary">
            Create an account or sign in to place Cash on Delivery orders and follow their status.
          </Text>
          <Button label="Sign in" size="lg" onPress={() => router.push('/(auth)/login')} />
          <Button
            label="Create account"
            variant="secondary"
            size="lg"
            onPress={() => router.push('/(auth)/register')}
          />
        </View>
      </Screen>
    );
  }

  if (user.role !== 'CUSTOMER') return null;

  return <OrdersScreen />;
}

const styles = StyleSheet.create({
  guest: { gap: spacing.md, paddingTop: spacing.lg },
});
