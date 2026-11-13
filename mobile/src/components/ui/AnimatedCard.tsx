import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, motion, radius, shadows, spacing } from '@/theme';
import { AnimatedPressable } from './AnimatedPressable';

interface AnimatedCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Stagger index for entrance. */
  index?: number;
  padded?: boolean;
  muted?: boolean;
  /** Subtle 3D tilt on press / entrance. */
  perspective?: boolean;
}

/**
 * Elevated surface with spring entrance and optional perspective depth.
 * Prefer GlassCard for frosted panels; AnimatedCard for solid interactive tiles.
 */
export function AnimatedCard({
  children,
  onPress,
  style,
  index = 0,
  padded = true,
  muted = false,
  perspective = true,
}: AnimatedCardProps) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    progress.value = withDelay(
      reduced ? 0 : index * motion.stagger,
      withSpring(1, motion.springs.soft),
    );
  }, [index, progress, reduced]);

  const enter = useAnimatedStyle(() => {
    const t = progress.value;
    return {
      opacity: t,
      transform: [
        { translateY: interpolate(t, [0, 1], [16, 0], Extrapolation.CLAMP) },
        ...(perspective && !reduced
          ? [
              { perspective: 900 },
              { rotateX: `${interpolate(t, [0, 1], [8, 0], Extrapolation.CLAMP)}deg` },
            ]
          : []),
        { scale: interpolate(t, [0, 1], [0.97, 1], Extrapolation.CLAMP) },
      ],
    };
  });

  const body = (
    <Animated.View
      style={[
        styles.card,
        muted && styles.muted,
        padded && styles.padded,
        shadows.sm,
        enter,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <AnimatedPressable onPress={onPress} scaleTo={0.98}>
        {body}
      </AnimatedPressable>
    );
  }

  return body;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  muted: { backgroundColor: colors.bgMuted, borderColor: colors.bgMuted },
  padded: { padding: spacing.lg },
});
