import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion } from '@/theme';

interface AnimatedPressableProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'none';
}

/** Spring scale press feedback — shared by glass cards, food tiles, CTAs. */
export function AnimatedPressable({
  children,
  onPress,
  disabled,
  scaleTo = motion.pressScale,
  style,
  accessibilityLabel,
  accessibilityRole = 'button',
}: AnimatedPressableProps) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      android_ripple={undefined}
      style={style}
      onPressIn={() => {
        scale.value = withSpring(reduced ? 0.99 : scaleTo, motion.springs.snappy);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.springs.soft);
      }}
    >
      <Animated.View style={anim}>{children}</Animated.View>
    </Pressable>
  );
}
