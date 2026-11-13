import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/theme';
import { Text } from './Text';

interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: 'plain' | 'filled' | 'outline' | 'dark';
  size?: number;
  iconSize?: number;
  badge?: number;
  disabled?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon: Icon,
  onPress,
  accessibilityLabel,
  variant = 'plain',
  size = 42,
  iconSize = 21,
  badge,
  disabled,
  color,
  style,
}: IconButtonProps) {
  const dark = variant === 'dark';
  const iconColor = color ?? (dark ? colors.white : colors.deepBlue);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size },
        variant === 'filled' && {
          backgroundColor: colors.glassStrong,
          borderWidth: 1,
          borderColor: colors.glassBorderMuted,
        },
        variant === 'outline' && { borderWidth: 1, borderColor: colors.silver },
        dark && { backgroundColor: colors.deepBlue },
        { opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Icon size={iconSize} color={iconColor} strokeWidth={1.8} />
      {badge ? (
        <View style={styles.badge}>
          <Text variant="caption" color="white" style={styles.badgeText}>
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.deepBlue,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: 'DMSans_700Bold', fontSize: 10, lineHeight: 12 },
});
