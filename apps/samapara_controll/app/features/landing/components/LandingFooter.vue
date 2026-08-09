<script setup lang="ts">
const year = new Date().getFullYear()

const productLinks = [
  { label: 'Control', to: '/#platform' },
  { label: 'Drive', to: '/#platform' }
]

const platformLinks = [
  { label: 'Cara Kerja', to: '/#cara-kerja' },
  { label: 'Daftarkan Area', to: '/register-area' }
]
</script>

<template>
  <footer class="border-t border-white/10 bg-blue-950 text-white">
    <div class="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-14">
      <div class="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div class="max-w-sm">
          <NuxtLink
            to="/"
            aria-label="SAMPARA, halaman utama"
            class="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data"
          >
            <AppLogo class="[&_span]:text-white" />
          </NuxtLink>
          <p class="mt-4 text-sm leading-6 text-blue-100/75">
            Smart waste collection untuk operasi kawasan yang lebih adaptif.
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold text-white">
            Product
          </p>
          <ul class="mt-4 space-y-3">
            <li
              v-for="link in productLinks"
              :key="link.label"
            >
              <NuxtLink
                :to="link.to"
                class="text-sm text-blue-100/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold text-white">
            Platform
          </p>
          <ul class="mt-4 space-y-3">
            <li
              v-for="link in platformLinks"
              :key="link.label"
            >
              <NuxtLink
                :to="link.to"
                class="text-sm text-blue-100/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold text-white">
            Contact
          </p>
          <a
            href="mailto:hello@samapara.id"
            class="mt-4 inline-block text-sm text-blue-100/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data"
          >
            hello@samapara.id
          </a>
        </div>
      </div>

      <div class="flex flex-col gap-2 pt-6 text-xs text-blue-100/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ year }} SAMPARA</p>
        <p>Geospatial operational intelligence for adaptive waste collection.</p>
      </div>
    </div>
  </footer>
</template>
