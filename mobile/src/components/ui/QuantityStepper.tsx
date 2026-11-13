import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { Text } from './Text';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max = 20,
  size = 'md',
  disabled,
}: QuantityStepperProps) {
  const dim = size === 'sm' ? 32 : 40;
  const canDec = !disabled && value > min;
  const canInc = !disabled && value < max;

  return (
    <View style={[styles.wrap, { borderRadius: radius.pill }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        disabled={!canDec}
        onPress={onDecrement}
        hitSlop={6}
        style={[styles.btn, { width: dim, height: dim, opacity: canDec ? 1 : 0.35 }]}
      >
        <Minus size={size === 'sm' ? 15 : 17} color={colors.black} strokeWidth={2} />
      </Pressable>
      <Text variant="bodyMedium" align="center" style={[styles.value, { minWidth: size === 'sm' ? 22 : 30 }]}>
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        disabled={!canInc}
        onPress={onIncrement}
        hitSlop={6}
        style={[styles.btn, { width: dim, height: dim, opacity: canInc ? 1 : 0.35 }]}
      >
        <Plus size={size === 'sm' ? 15 : 17} color={colors.black} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.silver,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xxs,
  },
  btn: { alignItems: 'center', justifyContent: 'center' },
  value: {},
});
