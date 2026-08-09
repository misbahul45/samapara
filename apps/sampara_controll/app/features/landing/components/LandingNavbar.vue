<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isScrolled = ref(false)

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
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 h-[72px] border-b transition-[background-color,border-color,box-shadow] duration-300"
    :class="isScrolled
      ? 'border-slate-200/70 bg-white/90 shadow-[0_1px_12px_rgba(16,28,47,0.04)] backdrop-blur-xl'
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

      <NuxtLink
        to="/auth/login"
        class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(15,76,129,0.12)] transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Masuk
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4"
          aria-hidden="true"
        />
      </NuxtLink>
    </nav>
  </header>
</template>
