<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const route = useRoute()
const isScrolled = ref(false)
const menuOpen = ref(false)

const navigation = [
  { label: 'Cara Kerja', to: '/#cara-kerja' },
  { label: 'Platform', to: '/#platform' },
  { label: 'Area', to: '/#area' }
]

function updateScrollState() {
  isScrolled.value = window.scrollY > 12
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
})

watch(() => route.fullPath, () => {
  menuOpen.value = false
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 h-[72px] border-b transition-[background-color,border-color,box-shadow] duration-300"
    :class="isScrolled || menuOpen
      ? 'border-slate-200/70 bg-white/85 shadow-[0_1px_18px_rgba(16,28,47,0.04)] backdrop-blur-xl'
      : 'border-transparent bg-transparent'"
  >
    <nav
      class="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8"
      aria-label="Navigasi utama"
    >
      <NuxtLink
        to="/"
        aria-label="SAMPARA, halaman utama"
        class="relative z-10 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4"
      >
        <AppLogo class="h-7 w-auto" />
      </NuxtLink>

      <div class="hidden items-center gap-1 lg:flex">
        <NuxtLink
          v-for="item in navigation"
          :key="item.label"
          :to="item.to"
          class="px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="hidden items-center gap-3 lg:flex">
        <NuxtLink
          to="/auth/login"
          class="px-3 py-2 text-sm font-semibold text-blue-950 transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Masuk
        </NuxtLink>
        <NuxtLink
          to="/register-area"
          class="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-500 px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(15,76,129,0.18)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Daftarkan Area
        </NuxtLink>
      </div>

      <button
        type="button"
        class="relative z-10 inline-flex size-11 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-blue-950 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
        :aria-expanded="menuOpen"
        aria-controls="landing-mobile-menu"
        :aria-label="menuOpen ? 'Tutup menu' : 'Buka menu'"
        @click="menuOpen = !menuOpen"
      >
        <UIcon
          :name="menuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          class="size-5"
          aria-hidden="true"
        />
      </button>
    </nav>

    <div
      id="landing-mobile-menu"
      :class="menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'"
      class="absolute inset-x-0 top-[71px] border-b border-slate-200 bg-white/95 px-5 py-5 shadow-[0_18px_36px_rgba(16,28,47,0.08)] backdrop-blur-xl transition-[opacity,transform,visibility] duration-200 lg:hidden"
    >
      <div class="mx-auto flex max-w-7xl flex-col">
        <NuxtLink
          v-for="item in navigation"
          :key="item.label"
          :to="item.to"
          class="border-b border-slate-100 py-3 text-base font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          to="/auth/login"
          class="py-3 text-base font-semibold text-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Masuk ke SAMPARA Control
        </NuxtLink>
        <NuxtLink
          to="/register-area"
          class="mt-2 inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-500 px-5 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Daftarkan Area
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
