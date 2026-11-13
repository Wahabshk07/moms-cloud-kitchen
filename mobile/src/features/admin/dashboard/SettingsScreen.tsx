import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, GlassCard, Header, Screen, Text } from '@/components/ui';
import { useDeliveryFee, useLogout } from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { spacing } from '@/theme';
import { formatPrice } from '@/utils/format';

export default function SettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { deliveryFee } = useDeliveryFee();
  const logout = useLogout();

  return (
    <Screen safeArea="tabs" scroll header={<Header large title="Profile" />}>
      <GlassCard intensity="strong" elevated style={styles.card}>
        <Text variant="label" color="secondary">
          Signed in as
        </Text>
        <Text variant="h3">{user?.name}</Text>
        <Text color="secondary">{user?.email ?? user?.phone}</Text>
      </GlassCard>

      <GlassCard intensity="tint" elevated style={styles.card}>
        <Text variant="label" color="secondary">
          Delivery fee
        </Text>
        <Text variant="h2">{formatPrice(deliveryFee)}</Text>
        <Text color="secondary">Configured on the server. COD is the only payment method.</Text>
      </GlassCard>

      <View style={styles.actions}>
        <Button label="Manage categories" variant="secondary" onPress={() => router.push('/(admin)/categories')} />
        <Button label="Log out" onPress={() => void logout()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actions: { gap: spacing.md, marginTop: spacing.md, paddingBottom: spacing.xxl },
});
