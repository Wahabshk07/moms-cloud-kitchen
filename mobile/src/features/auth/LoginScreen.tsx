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
import { loginSchema, type LoginForm } from '@/utils/validation';
import { AuthShell } from './AuthShell';

export function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const id = values.identifier.trim();
      const session = await api.auth.login(
        id.includes('@')
          ? { email: id, password: values.password }
          : { phone: id, password: values.password },
      );
      await setSession(session);
      // Auth layout / index redirect by role.
      router.replace('/');
    } catch (e) {
      setServerError(getErrorMessage(e, 'Could not sign in. Check your details and try again.'));
    }
  });

  return (
    <AuthShell eyebrow="Welcome back" title="Sign in" subtitle="Home-style cooking, delivered to your door.">
      <View style={styles.form}>
        <FormError message={serverError} />
        <View style={styles.hint}>
          <Text variant="label" color="blue">
            Kitchen admin
          </Text>
          <Text variant="caption" color="secondary">
            Use your admin email or phone to manage the kitchen.
          </Text>
        </View>
        <ControlledInput
          control={control}
          name="identifier"
          label="Email or phone"
          placeholder="admin@momscloudkitchen.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="username"
          autoComplete="username"
        />
        <ControlledInput
          control={control}
          name="password"
          label="Password"
          placeholder="Your password"
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          autoComplete="password"
          returnKeyType="go"
          onSubmitEditing={() => void onSubmit()}
        />
        <Button label="Sign in" size="lg" loading={isSubmitting} onPress={onSubmit} style={{ marginTop: spacing.sm }} />
        <Button
          label="Continue as guest"
          variant="secondary"
          size="lg"
          onPress={() => router.replace('/(customer)/home')}
        />
        <View style={styles.footer}>
          <Text color="secondary">New here?</Text>
          <Pressable onPress={() => router.push('/(auth)/register')} hitSlop={8}>
            <Text variant="bodyMedium" color="blue">
              Create an account
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  hint: { gap: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.sm },
});
