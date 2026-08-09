<script setup lang="ts">
import { useAuthSession } from '~/features/auth'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'id'
  }
})

const title = 'SAMAPARA Control'
const description = 'Dashboard operasional SAMAPARA — monitoring container pintar dan prediksi pengangkutan sampah.'
const { user, logout } = useAuthSession()

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <template #right>
        <UButton
          to="/"
          icon="i-lucide-box"
          label="Devices"
          color="neutral"
          variant="ghost"
        />
        <span
          v-if="user"
          class="hidden text-sm text-muted sm:inline"
        >
          {{ user.email }}
        </span>
        <UButton
          v-if="user"
          icon="i-lucide-log-out"
          label="Keluar"
          color="neutral"
          variant="ghost"
          @click="logout"
        />
        <UButton
          v-else
          to="/auth/login"
          icon="i-lucide-log-in"
          label="Masuk"
          color="primary"
          variant="soft"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          SAMAPARA • © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
