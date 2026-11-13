import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing } from '@/theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 16, radius: r = radius.sm, style }: SkeletonProps) {
  const reduced = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    t.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [reduced, t]);

  const anim = useAnimatedStyle(() => ({
    opacity: reduced ? 0.55 : interpolate(t.value, [0, 1], [0.35, 0.75]),
  }));

  return (
    <Animated.View
      style={[
        styles.bone,
        { width: width as number | `${number}%`, height, borderRadius: r },
        anim,
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, style]}>
      <Skeleton height={120} radius={radius.md} />
      <Skeleton height={14} width="70%" style={{ marginTop: spacing.md }} />
      <Skeleton height={12} width="40%" style={{ marginTop: spacing.sm }} />
    </View>
  );
}

const styles = StyleSheet.create({
  bone: { backgroundColor: colors.lightSilver },
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
});
