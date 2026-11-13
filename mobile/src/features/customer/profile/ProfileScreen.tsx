import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { CartBadge, ControlledInput, FormError } from '@/components/common';
import { Button, GlassCard, Header, Screen, Text } from '@/components/ui';
import { useLogout, useUpdateProfile } from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { spacing } from '@/theme';
import { getErrorMessage } from '@/utils/errors';
import { profileSchema, type ProfileForm } from '@/utils/validation';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const updateProfile = useUpdateProfile();
  const logout = useLogout();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { control, handleSubmit } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setSaved(false);
    try {
      const next = await updateProfile.mutateAsync({
        name: values.name.trim(),
        phone: values.phone.trim(),
        address: values.address?.trim() || undefined,
      });
      await updateUser(next);
      setSaved(true);
    } catch (e) {
      setServerError(getErrorMessage(e, 'Could not update profile.'));
    }
  });

  return (
    <Screen safeArea="tabs" scroll keyboard header={<Header title="Profile" right={<CartBadge />} />}>
      <Text color="secondary" style={{ marginBottom: spacing.lg }}>
        Keep your delivery details up to date.
      </Text>
      <FormError message={serverError} />
      {saved ? (
        <Text color="blue" style={{ marginBottom: spacing.md }}>
          Profile saved.
        </Text>
      ) : null}
      <GlassCard intensity="strong" elevated style={styles.form}>
        <ControlledInput control={control} name="name" label="Name" autoCapitalize="words" />
        <ControlledInput control={control} name="phone" label="Phone" keyboardType="phone-pad" />
        <ControlledInput control={control} name="address" label="Saved address" multiline />
        <Button label="Save changes" loading={updateProfile.isPending} onPress={onSubmit} />
        <Button label="Log out" variant="secondary" onPress={() => void logout()} />
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg, marginBottom: spacing.xxl },
});
