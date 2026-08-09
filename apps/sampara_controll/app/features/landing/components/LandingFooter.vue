<script setup lang="ts">
import {
  footerPlatformLinks,
  footerProductLinks
} from '~/features/landing/constants/landingContent'

const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="relative overflow-hidden bg-linear-to-b from-white via-blue-200 to-blue-400"
  >
    <div
      class="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        class="grid gap-12 border-b border-blue-900/15 pb-14 lg:grid-cols-[1.2fr_1.8fr] lg:gap-24 lg:pb-16"
      >
        <div class="max-w-md">
          <NuxtLink
            to="/"
            aria-label="SAMPARA, halaman utama"
            class="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-4 focus-visible:ring-offset-blue-100"
          >
            <AppLogo
              class="h-10 w-auto sm:h-11"
            />
          </NuxtLink>

          <p
            class="mt-5 max-w-sm text-sm leading-6 text-blue-950/70 sm:text-base sm:leading-7"
          >
            Smart waste collection untuk operasi kawasan yang lebih adaptif.
          </p>
        </div>

        <div
          class="grid gap-10 sm:grid-cols-3 sm:gap-8"
        >
          <div>
            <p
              class="text-sm font-semibold text-blue-950"
            >
              Product
            </p>

            <ul class="mt-5 space-y-3">
              <li
                v-for="link in footerProductLinks"
                :key="link.label"
              >
                <NuxtLink
                  :to="link.to"
                  class="inline-flex text-sm text-blue-950/65 transition-colors duration-300 hover:text-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <p
              class="text-sm font-semibold text-blue-950"
            >
              Platform
            </p>

            <ul class="mt-5 space-y-3">
              <li
                v-for="link in footerPlatformLinks"
                :key="link.label"
              >
                <NuxtLink
                  :to="link.to"
                  class="inline-flex text-sm text-blue-950/65 transition-colors duration-300 hover:text-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <p
              class="text-sm font-semibold text-blue-950"
            >
              Contact
            </p>

            <a
              href="mailto:hello@samapara.id"
              class="mt-5 inline-flex text-sm text-blue-950/65 transition-colors duration-300 hover:text-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              hello@samapara.id
            </a>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col gap-3 pt-7 text-xs leading-5 text-blue-50 font-bold sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          © {{ year }} SAMPARA
        </p>

        <p
          class="max-w-md sm:text-right"
        >
          Geospatial operational intelligence for adaptive waste collection.
        </p>
      </div>
    </div>
  </footer>
</template>