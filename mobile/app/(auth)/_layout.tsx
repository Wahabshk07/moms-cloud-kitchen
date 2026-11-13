import { Redirect, Stack } from 'expo-router';

import { homeRouteFor } from '@/components/common';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Redirect href={homeRouteFor(user.role)} />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
