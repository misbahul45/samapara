import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';

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
      background: '#F9F9FF',
      card: '#FFFFFF',
      text: '#101C2F',
      border: '#E3EBFE',
      primary: '#0F4C81',
      notification: '#BA1A1A',
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#F9F9FF',
      card: '#FFFFFF',
      text: '#101C2F',
      border: '#E3EBFE',
      primary: '#0F4C81',
      notification: '#BA1A1A',
    },
  },
};
