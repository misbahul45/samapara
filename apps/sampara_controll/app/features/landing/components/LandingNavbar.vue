<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isScrolled = ref(false)

function updateScrollState() {
  isScrolled.value = window.scrollY > 16
}

onMounted(() => {
  updateScrollState()

  window.addEventListener(
    'scroll',
    updateScrollState,
    { passive: true }
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'scroll',
    updateScrollState
  )
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 h-[72px] border-b transition-[background-color,border-color,box-shadow] duration-300"
    :class="
      isScrolled
        ? 'border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,53,95,0.05)]'
        : 'border-transparent bg-transparent'
    "
  >
    <nav
      class="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8"
      aria-label="Navigasi utama"
    >
      <NuxtLink
        to="/"
        aria-label="SAMPARA, halaman utama"
        class="inline-flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
      >
        <AppLogo
          class="h-8 w-auto sm:h-9"
        />
      </NuxtLink>

      <NuxtLink
        to="/auth/login"
        class="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(0,90,156,0.14)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_8px_18px_rgba(0,90,156,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        Masuk

        <UIcon
          name="i-lucide-arrow-right"
          class="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </NuxtLink>
    </nav>
  </header>
</template>