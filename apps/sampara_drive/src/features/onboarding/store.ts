import { create } from 'zustand';

type OnboardingState = {
  completed: boolean;
  initialized: boolean;
  setCompleted: (completed: boolean) => void;
  setInitialized: (initialized: boolean) => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  completed: false,
  initialized: false,
  setCompleted: (completed) => set({ completed }),
  setInitialized: (initialized) => set({ initialized }),
}));
