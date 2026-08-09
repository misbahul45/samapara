export type OnboardingVisual = 'assignment' | 'route' | 'execution';

export type OnboardingSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  visual: OnboardingVisual;
};
