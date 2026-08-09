export const env = {
  apiBase: process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8090/api',
} as const;
