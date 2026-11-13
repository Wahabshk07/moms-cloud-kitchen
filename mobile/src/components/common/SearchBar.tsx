import { Search, X } from 'lucide-react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, fontFamily, radius, spacing } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search dishes', onSubmit }: SearchBarProps) {
  return (
    <View style={styles.wrap}>
      <Search size={18} color={colors.textSecondary} strokeWidth={1.8} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.blue}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCorrect={false}
        style={styles.input}
        accessibilityLabel={placeholder}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityLabel="Clear search">
          <X size={16} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  input: { flex: 1, fontFamily: fontFamily.regular, fontSize: 15, color: colors.black, paddingVertical: 0 },
});
