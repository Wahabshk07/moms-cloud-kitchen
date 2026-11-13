import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, gradients } from '@/theme';
import { FloatingOrb } from './FloatingOrb';

type Variant = 'ambient' | 'ambientDeep' | 'auth' | 'plain';

interface GradientBackgroundProps {
  children?: ReactNode;
  variant?: Variant;
  /** Soft floating brand orbs for depth (skip on dense scroll lists). */
  orbs?: boolean;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_COLORS: Record<Variant, readonly [string, string, ...string[]]> = {
  ambient: [...gradients.ambient],
  ambientDeep: [...gradients.ambientDeep],
  auth: [colors.deepBlue, colors.blue, colors.steelBlue],
  plain: [colors.softWhite, colors.softWhite],
};

/**
 * Soft ambient field — brand gradients + optional floating orbs.
 * Keep orbs sparse; never stack under heavy blur content.
 */
export function GradientBackground({
  children,
  variant = 'ambient',
  orbs = false,
  style,
}: GradientBackgroundProps) {
  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={VARIANT_COLORS[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {orbs ? (
        <>
          <FloatingOrb color={colors.orbBlue} size={180} style={styles.orbTL} duration={7200} />
          <FloatingOrb color={colors.orbSilver} size={140} style={styles.orbBR} duration={8600} delay={400} />
          <FloatingOrb color={colors.orbDeep} size={100} style={styles.orbTR} duration={9800} delay={900} />
        </>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  orbTL: { position: 'absolute', top: -40, left: -50 },
  orbBR: { position: 'absolute', bottom: 80, right: -40 },
  orbTR: { position: 'absolute', top: 120, right: -30 },
});
