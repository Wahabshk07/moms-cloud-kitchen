import { forwardRef, useState, type ReactNode } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, fontFamily, radius, spacing } from '@/theme';
import { Text } from './Text';

export interface GlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  left?: ReactNode;
  right?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Frosted field — translucent fill with metallic focus ring. */
export const GlassInput = forwardRef(function GlassInput(
  {
    label,
    error,
    hint,
    left,
    right,
    containerStyle,
    style,
    multiline,
    onFocus,
    onBlur,
    ...rest
  }: GlassInputProps,
  ref: React.Ref<TextInput>,
) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text variant="label" color="secondary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          multiline && styles.fieldMultiline,
          focused && styles.focused,
          !!error && styles.errored,
        ]}
      >
        {left}
        <TextInput
          ref={ref as never}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.blue}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, multiline && styles.inputMultiline, style]}
          {...rest}
        />
        {right}
      </View>
      {error ? (
        <Text variant="caption" color="danger" style={styles.helper}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="secondary" style={styles.helper}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { marginBottom: 2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.glassStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorderMuted,
  },
  fieldMultiline: { alignItems: 'flex-start', paddingVertical: spacing.md },
  focused: {
    borderColor: colors.blue,
    backgroundColor: colors.white,
    shadowColor: colors.deepBlue,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  errored: { borderColor: colors.danger },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.black,
    paddingVertical: 12,
  },
  inputMultiline: { minHeight: 96, paddingVertical: 0 },
  helper: { marginTop: 2 },
});
