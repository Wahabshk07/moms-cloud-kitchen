import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CartBadge } from '@/components/common';
import { Button, Header, Screen, Text } from '@/components/ui';
import ProfileScreen from '@/features/customer/profile/ProfileScreen';
import { useAuthStore } from '@/store/authStore';
import { spacing } from '@/theme';

export default function ProfileRoute() {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  if (!hydrated) return null;

  if (!user) {
    return (
      <Screen safeArea="tabs" header={<Header title="Profile" right={<CartBadge />} />}>
        <View style={styles.guest}>
          <Text variant="h2">Browse as a guest</Text>
          <Text color="secondary">
            Sign in to save your address, track orders, and check out faster.
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

  if (user.role !== 'CUSTOMER') {
    return null;
  }

  return <ProfileScreen />;
}

const styles = StyleSheet.create({
  guest: { gap: spacing.md, paddingTop: spacing.lg },
});
