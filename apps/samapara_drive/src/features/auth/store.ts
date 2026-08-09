import { create } from 'zustand';
import type { User } from './types';

type AuthState = {
  user: User | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,

  setUser: (user) => {
    set({ user });
  },

  setInitialized: (initialized) => {
    set({ initialized });
  },

  reset: () => {
    set({ user: null, initialized: true });
  },
}));
