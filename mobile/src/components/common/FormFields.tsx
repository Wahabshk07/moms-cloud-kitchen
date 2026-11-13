import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { StyleSheet, Switch, View } from 'react-native';

import { Input, Text, type InputProps } from '@/components/ui';
import { colors, spacing } from '@/theme';

type ControlledInputProps<T extends FieldValues> = Omit<InputProps, 'value' | 'onChangeText' | 'error'> & {
  control: Control<T>;
  name: FieldPath<T>;
};

/** react-hook-form bound text input. */
export function ControlledInput<T extends FieldValues>({ control, name, ...rest }: ControlledInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <Input
          {...rest}
          value={(value as string | undefined) ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
}

interface ControlledSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
}

export function ControlledSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: ControlledSwitchProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium">{label}</Text>
            {description ? (
              <Text variant="caption" color="secondary">
                {description}
              </Text>
            ) : null}
          </View>
          <Switch
            value={!!value}
            onValueChange={onChange}
            trackColor={{ false: colors.silver, true: colors.blue }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.silver}
            accessibilityLabel={label}
          />
        </View>
      )}
    />
  );
}

/** Inline form-level error banner. */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.error} accessibilityRole="alert">
      <Text variant="caption" color="danger">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xs },
  error: {
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.dangerTint,
  },
});
