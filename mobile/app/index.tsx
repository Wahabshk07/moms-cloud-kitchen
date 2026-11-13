import { Redirect } from 'expo-router';

import { LoadingState, Screen } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  if (!hydrated) {
    return (
      <Screen safeArea="stack">
        <LoadingState />
      </Screen>
    );
  }
  if (!user) return <Redirect href="/(customer)/home" />;
  return <Redirect href={user.role === 'ADMIN' ? '/(admin)/dashboard' : '/(customer)/home'} />;
}
