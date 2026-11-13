import { useRouter } from 'expo-router';
import { ClipboardList, CookingPot, Package, ShoppingCart, UtensilsCrossed } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { OrderCard } from '@/components/common';
import { AnimatedCard, ErrorState, Header, LoadingState, Screen, Text } from '@/components/ui';
import { useDashboard, useRefresh } from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { colors, gradients, radius, shadows, spacing } from '@/theme';
import { getErrorMessage } from '@/utils/errors';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const dash = useDashboard();
  const { refreshing, onRefresh } = useRefresh(() => dash.refetch());
  const data = dash.data;

  if (dash.isLoading && !data) {
    return (
      <Screen safeArea="tabs">
        <LoadingState />
      </Screen>
    );
  }

  if (dash.error && !data) {
    return (
      <Screen safeArea="tabs">
        <ErrorState message={getErrorMessage(dash.error)} onRetry={onRefresh} />
      </Screen>
    );
  }

  const metrics = [
    {
      label: 'Total orders',
      value: String(data?.totalOrders ?? 0),
      icon: ShoppingCart,
      tone: 'primary' as const,
    },
    {
      label: 'Pending',
      value: String(data?.pendingOrders ?? 0),
      icon: ClipboardList,
      tone: 'silver' as const,
    },
    {
      label: 'Preparing',
      value: String(data?.preparingOrders ?? 0),
      icon: CookingPot,
      tone: 'silver' as const,
    },
    {
      label: 'Completed',
      value: String(data?.completedOrders ?? 0),
      icon: Package,
      tone: 'primary' as const,
    },
    {
      label: 'Products',
      value: String(data?.menuItemCount ?? 0),
      icon: UtensilsCrossed,
      tone: 'primary' as const,
    },
  ];

  return (
    <Screen
      safeArea="tabs"
      scroll
      refreshing={refreshing}
      onRefresh={onRefresh}
      header={<Header large title={`Hello,\n${user?.name?.split(' ')[0] ?? 'Admin'}`} />}
    >
      <View style={styles.grid}>
        {metrics.map((m, index) => {
          const Icon = m.icon;
          const primary = m.tone === 'primary';
          return (
            <AnimatedCard
              key={m.label}
              index={index}
              padded={false}
              perspective
              style={[styles.card, primary ? styles.cardPrimary : styles.cardSilver]}
            >
              {primary ? (
                <LinearGradient
                  colors={[...gradients.hero]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <View style={styles.cardInner}>
                <View style={[styles.iconCircle, primary ? styles.iconPrimary : styles.iconSilver]}>
                  <Icon size={18} color={primary ? colors.white : colors.deepBlue} strokeWidth={2} />
                </View>
                <Text
                  variant="caption"
                  color={primary ? 'white' : 'secondary'}
                  style={primary ? { opacity: 0.85 } : undefined}
                >
                  {m.label}
                </Text>
                <Text variant="h2" color={primary ? 'white' : 'primary'} numberOfLines={1}>
                  {m.value}
                </Text>
              </View>
            </AnimatedCard>
          );
        })}
      </View>

      <Text variant="h3" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
        Recent orders
      </Text>
      <View style={{ gap: spacing.md, paddingBottom: spacing.xxl }}>
        {(data?.recentOrders ?? []).map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            showCustomer
            onPress={() => router.push(`/(admin)/orders/${order.id}`)}
          />
        ))}
        {(data?.recentOrders?.length ?? 0) === 0 ? (
          <Text color="secondary">No orders yet.</Text>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    width: '47%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadows.sm,
  },
  cardPrimary: {
    borderColor: colors.deepBlue,
  },
  cardSilver: {
    backgroundColor: colors.glassStrong,
    borderColor: colors.glassBorderMuted,
  },
  cardInner: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconPrimary: { backgroundColor: 'rgba(255,255,255,0.16)' },
  iconSilver: { backgroundColor: colors.lightSilver },
});
