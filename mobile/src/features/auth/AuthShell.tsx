import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard, GradientBackground, Screen, Text } from '@/components/ui';
import { BRAND_NAME } from '@/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, spacing } from '@/theme';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  const reduced = useReducedMotion();

  return (
    <GradientBackground variant="auth" orbs style={styles.root}>
      <Screen safeArea="stack" scroll keyboard ambient={false} contentStyle={styles.content}>
        <Animated.View entering={reduced ? undefined : FadeInDown.duration(480).springify()}>
          <View style={styles.brandRow}>
            <View style={styles.mark} />
            <Text variant="label" color="white">
              {BRAND_NAME}
            </Text>
          </View>
          <View style={styles.titles}>
            <Text variant="label" color="white" style={styles.eyebrow}>
              {eyebrow}
            </Text>
            <Text variant="display" color="white">
              {title}
            </Text>
            <Text color="white" style={styles.subtitle}>
              {subtitle}
            </Text>
          </View>
        </Animated.View>
        <GlassCard intensity="strong" elevated style={styles.panel}>
          {children}
        </GlassCard>
      </Screen>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingTop: spacing.xxl, gap: spacing.xl, paddingBottom: spacing.xxxl },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.lightBlue,
  },
  titles: { gap: spacing.sm, marginTop: spacing.xl },
  eyebrow: { opacity: 0.85, letterSpacing: 1.6 },
  subtitle: { opacity: 0.88, maxWidth: 320 },
  panel: { marginTop: spacing.md },
});
