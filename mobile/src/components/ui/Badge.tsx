import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { Text, type TextColor } from './Text';

export type BadgeTone = 'neutral' | 'blue' | 'solidBlue' | 'dark' | 'outline';

const tones: Record<BadgeTone, { bg: string; border: string; text: TextColor }> = {
  neutral: { bg: colors.bgMuted, border: colors.silver, text: 'primary' },
  blue: { bg: colors.blueTint, border: colors.blueTint, text: 'blue' },
  solidBlue: { bg: colors.blue, border: colors.blue, text: 'white' },
  dark: { bg: colors.black, border: colors.black, text: 'white' },
  outline: { bg: colors.white, border: colors.silver, text: 'secondary' },
};

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ label, tone = 'neutral', style }: BadgeProps) {
  const t = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg, borderColor: t.border }, style]}>
      <Text variant="caption" color={t.text} style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  text: { fontFamily: 'DMSans_500Medium', fontSize: 12, lineHeight: 16 },
});
