import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, motion, radius, shadows, spacing } from '@/theme';
import { AnimatedPressable } from './AnimatedPressable';
import { Text, type TextColor } from './Text';

export type GlassButtonVariant = 'primary' | 'glass' | 'secondary' | 'ghost' | 'danger';
export type GlassButtonSize = 'sm' | 'md' | 'lg';

interface GlassButtonProps {
  label: string;
  onPress?: () => void;
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const heights: Record<GlassButtonSize, number> = { sm: 38, md: 50, lg: 56 };

const variantMeta: Record<
  GlassButtonVariant,
  { bg: string; border: string; text: TextColor; spinner: string; blur?: boolean }
> = {
  primary: { bg: colors.deepBlue, border: colors.deepBlue, text: 'white', spinner: colors.white },
  glass: {
    bg: colors.glassStrong,
    border: colors.glassBorder,
    text: 'primary',
    spinner: colors.deepBlue,
    blur: true,
  },
  secondary: { bg: colors.white, border: colors.silver, text: 'primary', spinner: colors.deepBlue },
  ghost: { bg: 'transparent', border: 'transparent', text: 'blue', spinner: colors.blue },
  danger: { bg: colors.white, border: colors.danger, text: 'danger', spinner: colors.danger },
};

export function GlassButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  style,
  testID,
}: GlassButtonProps) {
  const v = variantMeta[variant];
  const inactive = disabled || loading;

  const content = loading ? (
    <ActivityIndicator color={v.spinner} size="small" />
  ) : (
    <View style={styles.row}>
      {icon}
      <Text variant="button" color={v.text}>
        {label}
      </Text>
    </View>
  );

  const shellStyle = [
    styles.base,
    {
      height: heights[size],
      backgroundColor: v.bg,
      borderColor: v.border,
      opacity: disabled && !loading ? 0.4 : 1,
      alignSelf: fullWidth ? ('stretch' as const) : ('flex-start' as const),
      paddingHorizontal: size === 'sm' ? spacing.lg : spacing.xl,
    },
    variant === 'primary' || variant === 'glass' ? shadows.sm : null,
    style,
  ];

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      disabled={inactive}
      onPress={onPress}
      scaleTo={motion.pressScaleStrong}
      style={fullWidth ? { alignSelf: 'stretch' } : undefined}
    >
      <View testID={testID} style={shellStyle}>
        {v.blur && Platform.OS !== 'web' ? (
          <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
        ) : null}
        {content}
      </View>
    </AnimatedPressable>
  );
}

/** Drop-in alias — existing Button API continues to work via Button.tsx re-export path. */
export type { GlassButtonProps as ButtonProps };

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
