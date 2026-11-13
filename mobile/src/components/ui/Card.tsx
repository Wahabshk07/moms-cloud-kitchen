import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';
import { AnimatedPressable } from './AnimatedPressable';

interface CardProps {
  children?: ReactNode;
  onPress?: () => void;
  padded?: boolean;
  muted?: boolean;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  onPress,
  padded = true,
  muted = false,
  elevated = false,
  style,
  children,
}: CardProps) {
  const base = [
    styles.card,
    muted && styles.muted,
    elevated && shadows.sm,
    padded && styles.padded,
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable onPress={onPress} scaleTo={0.985} style={base}>
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={base}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glassStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorderMuted,
    overflow: 'hidden',
  },
  muted: { backgroundColor: colors.bgMuted, borderColor: colors.border },
  padded: { padding: spacing.lg },
});
