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
  /**
   * Frosted blur behind content. Off by default on Android so TextInputs
   * stay fully tappable (Samsung / BlurView quirks).
   */
  blur?: boolean;
}

const FILL: Record<Intensity, string> = {
  soft: colors.glass,
  strong: colors.glassStrong,
  tint: colors.glassTint,
};

/**
 * Glass surface with decorative layers *behind* children.
 * Never stack absolute overlays on top of form content — that breaks typing on Android.
 */
export function GlassCard({
  children,
  style,
  intensity = 'soft',
  padded = true,
  onPress,
  elevated = false,
  blur = Platform.OS === 'ios',
}: GlassCardProps) {
  const fill = FILL[intensity];
  const blurIntensity = intensity === 'strong' ? 48 : 36;

  const body = (
    <View style={[styles.shell, elevated ? shadows.float : shadows.glass, style]}>
      {/* Decorations first (under content) */}
      <LinearGradient
        colors={[...gradients.glassPanel]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {blur && Platform.OS !== 'web' ? (
        <BlurView
          intensity={blurIntensity}
          tint="light"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}
      <View style={[styles.edge, { borderColor: colors.glassHighlight }]} pointerEvents="none" />

      {/* Interactive content on top — no overlay above this */}
      <View style={[{ backgroundColor: fill }, padded && styles.padded]}>{children}</View>
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
    backgroundColor: colors.white,
  },
  padded: { padding: spacing.lg },
  edge: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.4,
  },
});
