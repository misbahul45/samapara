import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';
import { SAMPARA_COLORS } from './colors';

export const THEME_CSS_VARIABLES = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  popover: 'hsl(var(--popover))',
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  muted: 'hsl(var(--muted))',
  accent: 'hsl(var(--accent))',
  destructive: 'hsl(var(--destructive))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  radius: 'var(--radius)',
} as const;

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: SAMPARA_COLORS.background,
      card: SAMPARA_COLORS.surface,
      text: SAMPARA_COLORS.text,
      border: SAMPARA_COLORS.border,
      primary: SAMPARA_COLORS.primary,
      notification: SAMPARA_COLORS.error,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: SAMPARA_COLORS.background,
      card: SAMPARA_COLORS.surface,
      text: SAMPARA_COLORS.text,
      border: SAMPARA_COLORS.border,
      primary: SAMPARA_COLORS.primary,
      notification: SAMPARA_COLORS.error,
    },
  },
};
