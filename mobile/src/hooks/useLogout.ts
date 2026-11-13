import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

/** Clears session, cached server data and the cart (shared-device safety). */
export function useLogout() {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    await useAuthStore.getState().logout();
    useCartStore.getState().clear();
    queryClient.clear();
  }, [queryClient]);
}
