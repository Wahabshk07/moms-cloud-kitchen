import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, gradients, motion, radius, shadows, spacing } from '@/theme';
import { Button } from './Button';
import { FloatingOrb } from './FloatingOrb';
import { GlassCard } from './GlassCard';
import { Text } from './Text';

interface MetallicHeroProps {
  greeting?: string;
}

/**
 * Premium metallic blue × silver home hero with depth, sheen, and floating light.
 */
export function MetallicHero({ greeting }: MetallicHeroProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const enter = useSharedValue(0);
  const sheen = useSharedValue(0);

  useEffect(() => {
    enter.value = withSpring(1, motion.springs.soft);
    if (reduced) return;
    sheen.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 4200, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [enter, reduced, sheen]);

  const contentAnim = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: interpolate(enter.value, [0, 1], [18, 0], Extrapolation.CLAMP) },
      { perspective: 900 },
      { rotateX: `${interpolate(enter.value, [0, 1], [6, 0], Extrapolation.CLAMP)}deg` },
    ],
  }));

  const sheenAnim = useAnimatedStyle(() => ({
    opacity: reduced ? 0.2 : interpolate(sheen.value, [0, 1], [0.12, 0.32]),
    transform: [{ translateX: interpolate(sheen.value, [0, 1], [-40, 60]) }],
  }));

  return (
    <View style={[styles.wrap, shadows.hero]}>
      <LinearGradient
        colors={[...gradients.hero]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {!reduced ? (
        <>
          <FloatingOrb color="rgba(244,246,249,0.18)" size={160} style={styles.orbA} duration={7800} />
          <FloatingOrb color="rgba(168,192,214,0.28)" size={110} style={styles.orbB} duration={9200} delay={500} />
        </>
      ) : null}
      <Animated.View style={[styles.sheen, sheenAnim]} pointerEvents="none">
        <LinearGradient
          colors={[...gradients.sheen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.85, y: 0.9 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.content, contentAnim]}>
        <Text variant="label" color="white" style={styles.brand}>
          {"Mom's Cloud Kitchen"}
        </Text>
        {greeting ? (
          <Text variant="caption" color="white" style={styles.eyebrow}>
            {greeting}
          </Text>
        ) : null}
        <Text variant="h1" color="white" style={styles.headline}>
          Homemade Goodness,{'\n'}Made with Love.
        </Text>
        <Text color="white" style={styles.support}>
          Freshly prepared meals, bringing comfort and flavor to your table.
        </Text>
        <Button
          label="Explore Our Menu"
          variant="secondary"
          size="md"
          fullWidth={false}
          onPress={() => router.push('/(customer)/menu')}
          style={styles.cta}
        />
        <GlassCard intensity="soft" style={styles.panel} padded>
          <Text variant="label" color="blue">
            Kitchen note
          </Text>
          <Text variant="bodyMedium" style={{ marginTop: 4 }}>
            Prepared fresh daily · Cash on delivery
          </Text>
        </GlassCard>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    minHeight: 300,
    marginBottom: spacing.lg,
  },
  sheen: {
    ...StyleSheet.absoluteFill,
    width: '140%',
  },
  orbA: { position: 'absolute', top: -30, right: -20 },
  orbB: { position: 'absolute', bottom: 20, left: -30 },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  brand: {
    opacity: 0.95,
    letterSpacing: 1.8,
    marginBottom: spacing.xs,
  },
  eyebrow: {
    opacity: 0.85,
  },
  headline: {
    letterSpacing: -0.6,
    marginTop: spacing.xs,
  },
  support: {
    opacity: 0.9,
    maxWidth: 300,
    marginBottom: spacing.sm,
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderColor: colors.white,
    marginBottom: spacing.md,
  },
  panel: {
    marginTop: spacing.xs,
  },
});
