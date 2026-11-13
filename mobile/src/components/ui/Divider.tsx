import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing } from '@/theme';

export function Divider({ style, spaced = false }: { style?: StyleProp<ViewStyle>; spaced?: boolean }) {
  return <View style={[styles.line, spaced && styles.spaced, style]} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth * 2, backgroundColor: colors.border, alignSelf: 'stretch' },
  spaced: { marginVertical: spacing.lg },
});
