import { Check } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from '@/constants';
import { colors, radius, spacing } from '@/theme';
import type { OrderStatus } from '@/types';

/** Vertical status timeline for order tracking. */
export function OrderTracker({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') {
    return (
      <View style={styles.cancelled}>
        <Text variant="bodyMedium">Order cancelled</Text>
        <Text variant="caption" color="secondary">
          This order will not be prepared or delivered.
        </Text>
      </View>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <View>
      {ORDER_STATUS_FLOW.map((step, index) => {
        const done = index < currentIndex || status === 'DELIVERED';
        const current = index === currentIndex && status !== 'DELIVERED';
        const last = index === ORDER_STATUS_FLOW.length - 1;
        return (
          <View key={step} style={styles.step}>
            <View style={styles.rail}>
              <View style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]}>
                {done ? <Check size={12} color={colors.white} strokeWidth={3} /> : null}
                {current ? <View style={styles.dotInner} /> : null}
              </View>
              {!last ? <View style={[styles.line, done && styles.lineDone]} /> : null}
            </View>
            <Text
              variant={current ? 'bodyMedium' : 'body'}
              color={done || current ? 'primary' : 'tertiary'}
              style={styles.label}
            >
              {ORDER_STATUS_LABEL[step]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', gap: spacing.md, minHeight: 44 },
  rail: { alignItems: 'center', width: 22 },
  dot: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.silver,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.blue, borderColor: colors.blue },
  dotCurrent: { borderColor: colors.blue },
  dotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue },
  line: { flex: 1, width: 1.5, backgroundColor: colors.silver, marginVertical: 2 },
  lineDone: { backgroundColor: colors.blue },
  label: { paddingTop: 1 },
  cancelled: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.bgMuted,
    gap: 2,
  },
});
