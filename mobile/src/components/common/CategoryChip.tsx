import { StyleSheet } from 'react-native';

import { AnimatedPressable, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

interface CategoryChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ label, selected = false, onPress }: CategoryChipProps) {
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      scaleTo={0.94}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text variant="bodyMedium" color={selected ? 'white' : 'primary'} style={styles.text}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    height: 38,
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassBorderMuted,
    backgroundColor: colors.glassStrong,
  },
  selected: { backgroundColor: colors.deepBlue, borderColor: colors.deepBlue },
  text: { fontSize: 14 },
});
