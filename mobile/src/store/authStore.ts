import { create } from 'zustand';

import { configureApi } from '@/services/api';
import type { AuthSession, User } from '@/types';
import { secureStorage } from './secureStorage';

const TOKEN_KEY = 'mck_token';
const USER_KEY = 'mck_user';

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (session: AuthSession) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    const [token, userJson] = await Promise.all([secureStorage.get(TOKEN_KEY), secureStorage.get(USER_KEY)]);
    let user: User | null = null;
    if (userJson) {
      try {
        user = JSON.parse(userJson) as User;
      } catch {
        user = null;
      }
    }
    set(token && user ? { token, user, hydrated: true } : { token: null, user: null, hydrated: true });
  },

  setSession: async ({ token, user }) => {
    set({ token, user, hydrated: true });
    await Promise.all([secureStorage.set(TOKEN_KEY, token), secureStorage.set(USER_KEY, JSON.stringify(user))]);
  },

  updateUser: async (user) => {
    set({ user });
    await secureStorage.set(USER_KEY, JSON.stringify(user));
  },

  logout: async () => {
    set({ token: null, user: null });
    await Promise.all([secureStorage.remove(TOKEN_KEY), secureStorage.remove(USER_KEY)]);
  },
}));

// Wire the API client to the auth store (token injection + 401 handling).
configureApi({
  getToken: () => useAuthStore.getState().token,
  onUnauthorized: () => {
    void useAuthStore.getState().logout();
  },
});
