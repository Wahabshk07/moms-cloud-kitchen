import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { ControlledInput, FormError } from '@/components/common';
import { Button, Text } from '@/components/ui';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { spacing } from '@/theme';
import { getErrorMessage } from '@/utils/errors';
import { registerSchema, type RegisterForm } from '@/utils/validation';
import { AuthShell } from './AuthShell';

export function RegisterScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', phone: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const email = values.email?.trim();
      const session = await api.auth.register({
        name: values.name.trim(),
        phone: values.phone.trim().replace(/[\s-]/g, ''),
        ...(email ? { email } : {}),
        password: values.password,
      });
      await setSession(session);
      router.replace('/');
    } catch (e) {
      setServerError(getErrorMessage(e, 'Could not create your account. Please try again.'));
    }
  });

  return (
    <AuthShell eyebrow="Join us" title="Create account" subtitle="Order fresh, homemade meals in a few taps.">
      <View style={styles.form}>
        <FormError message={serverError} />
        <ControlledInput control={control} name="name" label="Full name" placeholder="Your name" autoComplete="name" />
        <ControlledInput
          control={control}
          name="phone"
          label="Phone"
          placeholder="03001234567"
          keyboardType="phone-pad"
          autoComplete="tel"
        />
        <ControlledInput
          control={control}
          name="email"
          label="Email (optional)"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
        <ControlledInput
          control={control}
          name="password"
          label="Password"
          placeholder="At least 6 characters"
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={() => void onSubmit()}
        />
        <Button label="Create account" size="lg" loading={isSubmitting} onPress={onSubmit} style={{ marginTop: spacing.sm }} />
        <View style={styles.footer}>
          <Text color="secondary">Already have an account?</Text>
          <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={8}>
            <Text variant="bodyMedium" color="blue">
              Sign in
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.sm },
});
