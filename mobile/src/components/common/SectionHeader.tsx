import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, eyebrow, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Text variant="label" color="blue">
            {eyebrow}
          </Text>
        ) : null}
        <Text variant="h2">{title}</Text>
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text variant="bodyMedium" color="blue">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.md, gap: spacing.md },
});
