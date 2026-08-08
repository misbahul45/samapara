# Design: Mobile Design System (RNR + NativeWind) + Login — samapara_drive

Date: 2026-08-08
Scope: `apps/samapara_drive` (Expo SDK 57, RN 0.86, React 19.2, New Architecture)
Status: approved by user

## Goal

Bangun design system ala shadcn untuk mobile (React Native Reusables + NativeWind stable) di
project existing, hapus semua UI template/tabs existing, dan implementasikan **halaman login
lengkap** (UI + form + validasi + simulasi auth flow). Backend/API diabaikan untuk tahap ini;
config API existing dipertahankan.

## Stack

- NativeWind `4.2.6` (stable, peer tailwindcss >3.3.0) + Tailwind CSS `^3.4.17` + `tailwindcss-animate`
- React Native Reusables CLI `0.7.1` → komponen di `src/components/ui/` (`@rn-primitives` 1.5.2)
- `lucide-react-native`, `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`, `clsx`, `tailwind-merge`, `expo-secure-store`
- Sudah ada: TanStack Query 5, Reanimated 4.5.1, safe-area-context, expo-router, expo-image, expo-splash-screen

## Konfigurasi

- `babel.config.js`: `babel-preset-expo` + `nativewind/babel`
- `metro.config.js`: `withNativeWind(config, { input: './global.css', inlineRem: 16 })`
- `tailwind.config.ts`: darkMode `class`, content `./app|components|features/**/*.{ts,tsx}`,
  presets `nativewind/preset`, semantic colors via `hsl(var(--x))` (CSS variables Tailwind v3),
  radius, `hairline` borderWidth
- `global.css`: `@tailwind` directives + `:root` / `.dark` CSS vars (palet lengkap, dark = light)
- `components.json`: style new-york, aliases `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`
- `nativewind-env.d.ts`: `/// <reference types="nativewind/types" />`
- `app.json`: `experiments.reactCompiler` dimatikan (risiko konflik plugin babel NativeWind);
  typedRoutes tetap

## Design tokens (palet)

Navy #00355F · Primary #0F4C81 · Primary Active #004992 · Background #F9F9FF · Surface #FFFFFF ·
Info Surface #F0F3FF · Border #E3EBFE · Disabled #E0E3E8 · Text #101C2F · Secondary Text #42474F ·
Muted #727780 · Success #1F7A3E · Success Soft #DBF2E6 · Error #BA1A1A · Error Soft #FFDAD6 ·
Warning #FFB01F · Warning Soft #FFF8E6 · Data Accent #90DAEE

## Struktur (dalam `src/`, alias `@/* -> ./src/*`)

```
app/_layout.tsx           global.css, QueryClientProvider, ThemeProvider(NAV_THEME), PortalHost, Stack
app/index.tsx             auth guard: !user → Redirect /(auth)/login; user → home minimal + logout
app/(auth)/_layout.tsx    Stack tanpa header
app/(auth)/login.tsx      RHF + Zod + loading/error + simulasi submit → setUser → router.replace('/')
components/ui/*           RNR: text button card input label badge separator skeleton dialog alert-dialog progress avatar
components/common/screen.tsx  SafeAreaView + ScrollView wrapper
features/auth/schema.ts   loginSchema (email wajib+format, password min 8)
features/auth/types.ts    User, LoginResponse
features/auth/api.ts      login() via @/api/client — siap sambung, belum dipanggil
features/auth/hooks.ts    (kosong/placeholder siap isi useLogin)
lib/utils.ts              cn() = twMerge(clsx())
lib/theme.ts              NAV_THEME light/dark (expo-router/react-navigation)
lib/query-client.ts       QueryClient defaults (staleTime 30s, gcTime 5m, retry 2)
lib/storage.ts            SecureStore access/refresh token helpers
stores/auth-store.ts      Zustand: user, initialized, setUser, setInitialized, reset
```

## Penghapusan

`src/app/(tabs)/` (index, explore, _layout) · `src/app/devices/[id].tsx` · `src/components/` template
(themed-text, themed-view, app-tabs.*, ui/collapsible, external-link, web-badge, animated-icon.*,
hint-row) · `src/hooks/` (use-theme, use-color-scheme.*) · `src/constants/theme.ts` ·
`src/providers/query-provider.tsx`

## Dipertahankan (config API)

`src/api/client.ts` (apiGet/apiPost, ApiError, EXPO_PUBLIC_API_BASE ?? localhost:8090) ·
`src/queries/devices.ts` · `src/providers/query-client.ts` dipindah konsep → `src/lib/query-client.ts`

## Login flow (tanpa backend)

1. RHF `useForm<LoginInput>` + `zodResolver(loginSchema)`
2. Submit → `await sleep(600)` simulasi → `setUser(mockUser)` (Zustand) → `router.replace('/')`
3. Guard `app/index.tsx`: user null → `Redirect href="/(auth)/login"`; user → home minimal + tombol logout
4. `api.ts` login() siap disambung ke backend; token SecureStore helper dibuat tapi belum dipakai flow ini

## Verifikasi

`npx tsc --noEmit` · `npx expo-doctor` · Metro start/build tanpa error.

## Out of scope

Backend auth, API real, tabs baru, dashboard, map, chart, push notification, dark palette.
