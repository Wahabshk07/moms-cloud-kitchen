import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, motion, radius, shadows, spacing } from '@/theme';
import { AnimatedPressable } from './AnimatedPressable';
import { Text, type TextColor } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const heights: Record<ButtonSize, number> = { sm: 38, md: 50, lg: 56 };

const variantStyles: Record<
  ButtonVariant,
  { bg: string; border: string; text: TextColor; spinner: string; elevate?: boolean }
> = {
  primary: {
    bg: colors.deepBlue,
    border: colors.deepBlue,
    text: 'white',
    spinner: colors.white,
    elevate: true,
  },
  secondary: { bg: colors.white, border: colors.silver, text: 'primary', spinner: colors.deepBlue },
  ghost: { bg: 'transparent', border: 'transparent', text: 'blue', spinner: colors.blue },
  danger: { bg: colors.white, border: colors.danger, text: 'danger', spinner: colors.danger },
  glass: {
    bg: colors.glassStrong,
    border: colors.glassBorder,
    text: 'primary',
    spinner: colors.deepBlue,
    elevate: true,
  },
};

export function Button({
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
}: ButtonProps) {
  const v = variantStyles[variant];
  const inactive = disabled || loading;

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      disabled={inactive}
      onPress={onPress}
      scaleTo={motion.pressScaleStrong}
      style={fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' }}
    >
      <View
        testID={testID}
        accessibilityState={{ disabled: inactive, busy: loading }}
        style={[
          styles.base,
          {
            height: heights[size],
            backgroundColor: v.bg,
            borderColor: v.border,
            opacity: disabled && !loading ? 0.4 : 1,
            paddingHorizontal: size === 'sm' ? spacing.lg : spacing.xl,
          },
          v.elevate ? shadows.sm : null,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={v.spinner} size="small" />
        ) : (
          <View style={styles.row}>
            {icon}
            <Text variant="button" color={v.text}>
              {label}
            </Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

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
