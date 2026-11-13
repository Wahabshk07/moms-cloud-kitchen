import { Stack } from 'expo-router';

import { RoleGuard } from '@/components/common';
import { colors } from '@/theme';

export default function AdminLayout() {
  return (
    <RoleGuard role="ADMIN">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.white },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="categories" />
      </Stack>
    </RoleGuard>
  );
}
