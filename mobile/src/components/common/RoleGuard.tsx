import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';

import { LoadingState } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/types';

export function homeRouteFor(role: Role) {
  return role === 'ADMIN' ? ('/(admin)/dashboard' as const) : ('/(customer)/home' as const);
}

type RoleGuardProps = {
  role: Role;
  children: ReactNode;
  /** When true, unauthenticated guests may browse this area (customer catalog). */
  allowGuest?: boolean;
};

/** Redirects users of the other role to their own area. Optionally allows guests. */
export function RoleGuard({ role, children, allowGuest = false }: RoleGuardProps) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  if (!hydrated) return <LoadingState />;
  if (!user) {
    if (allowGuest && role === 'CUSTOMER') return <>{children}</>;
    return <Redirect href="/(auth)/login" />;
  }
  if (user.role !== role) return <Redirect href={homeRouteFor(user.role)} />;
  return <>{children}</>;
}

/** Requires a signed-in user matching `role` (used for checkout, orders, profile). */
export function AuthRequired({ role, children }: { role: Role; children: ReactNode }) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  if (!hydrated) return <LoadingState />;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role !== role) return <Redirect href={homeRouteFor(user.role)} />;
  return <>{children}</>;
}
