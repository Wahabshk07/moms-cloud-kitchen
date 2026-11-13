import { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion } from '@/theme';

interface FloatingOrbProps {
  color: string;
  size?: number;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

/** Soft ambient light blob — Reanimated float, no 3D engine. */
export function FloatingOrb({
  color,
  size = 120,
  duration = motion.orbLoop,
  delay = 0,
  style,
}: FloatingOrbProps) {
  const reduced = useReducedMotion();
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduced) {
      y.value = 0;
      x.value = 0;
      scale.value = 1;
      return;
    }
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-14, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
          withTiming(10, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
    x.value = withDelay(
      delay + 200,
      withRepeat(
        withSequence(
          withTiming(8, { duration: duration * 0.6, easing: Easing.inOut(Easing.sin) }),
          withTiming(-6, { duration: duration * 0.4, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: duration * 0.55, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.94, { duration: duration * 0.45, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
  }, [delay, duration, reduced, scale, x, y]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: x.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orb,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        anim,
        style,
      ]}
    />
  );
}

/** Lightweight alias matching the redesign brief naming. */
export const Floating3DElement = FloatingOrb;

const styles = StyleSheet.create({
  orb: { opacity: 1 },
});
