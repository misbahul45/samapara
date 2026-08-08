import { create } from 'zustand';

export type User = {
  id: string;
  name: string;
  email: string;
};

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
