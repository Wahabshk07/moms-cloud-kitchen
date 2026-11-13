import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, gradients, radius, shadows, spacing } from '@/theme';
import { AnimatedPressable } from './AnimatedPressable';

type Intensity = 'soft' | 'strong' | 'tint';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Stronger fill for readability on busy backgrounds. */
  intensity?: Intensity;
  padded?: boolean;
  onPress?: () => void;
  /** Extra elevation for floating panels. */
  elevated?: boolean;
}

const FILL: Record<Intensity, string> = {
  soft: colors.glass,
  strong: colors.glassStrong,
  tint: colors.glassTint,
};

/**
 * Selective glass surface — blur when available, translucent fallback otherwise.
 * Use for interactive panels, floating chrome, and hero accents — not every list row.
 */
export function GlassCard({
  children,
  style,
  intensity = 'soft',
  padded = true,
  onPress,
  elevated = false,
}: GlassCardProps) {
  const fill = FILL[intensity];
  const blurIntensity = Platform.OS === 'ios' ? (intensity === 'strong' ? 48 : 36) : 24;

  const body = (
    <View style={[styles.shell, elevated ? shadows.float : shadows.glass, style]}>
      <LinearGradient
        colors={[...gradients.glassPanel]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {Platform.OS === 'web' ? (
        <View style={[styles.fallback, { backgroundColor: fill }, padded && styles.padded]}>{children}</View>
      ) : (
        <BlurView intensity={blurIntensity} tint="light" style={styles.blur}>
          <View style={[{ backgroundColor: fill }, padded && styles.padded, styles.inner]}>{children}</View>
        </BlurView>
      )}
      <View style={styles.highlight} pointerEvents="none" />
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable onPress={onPress} scaleTo={0.985}>
        {body}
      </AnimatedPressable>
    );
  }

  return body;
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassSoft,
  },
  blur: { overflow: 'hidden' },
  fallback: { borderRadius: radius.lg },
  inner: { borderRadius: radius.lg },
  padded: { padding: spacing.lg },
  highlight: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassHighlight,
    opacity: 0.5,
  },
});
