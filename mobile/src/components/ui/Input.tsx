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

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  left?: ReactNode;
  right?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef(function Input(
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
    editable = true,
    ...rest
  }: InputProps,
  ref: React.Ref<TextInput>,
) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]} collapsable={false}>
      {label ? (
        <Text variant="label" color="secondary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View
        collapsable={false}
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
          editable={editable}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.blue}
          underlineColorAndroid="transparent"
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          blurOnSubmit={!multiline}
          // Keep the keyboard up — avoid parent remounts stealing focus.
          showSoftInputOnFocus
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

export const TextArea = forwardRef<TextInput, InputProps>(function TextArea(props, ref) {
  return <Input ref={ref} multiline numberOfLines={4} {...props} />;
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs, width: '100%' },
  label: { marginBottom: 2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    width: '100%',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    // Stable elevation — do NOT toggle elevation on focus (Android drops focus).
    elevation: 0,
  },
  fieldMultiline: { alignItems: 'flex-start', paddingVertical: spacing.md },
  focused: {
    borderColor: colors.blue,
    backgroundColor: colors.white,
  },
  errored: { borderColor: colors.danger },
  input: {
    flex: 1,
    minWidth: 0,
    width: '100%',
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 0,
    margin: 0,
  },
  inputMultiline: { minHeight: 96, paddingVertical: 0 },
  helper: { marginTop: 2 },
});
