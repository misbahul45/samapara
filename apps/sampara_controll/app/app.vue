<script setup lang="ts">
import { LandingFooter, LandingNavbar } from '~/features/landing'

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

const route = useRoute()
const showPublicChrome = computed(() => !route.path.startsWith('/dashboard'))
const offsetPublicPage = computed(() => showPublicChrome.value && route.path !== '/')

useSeoMeta({
  title: 'SAMPARA Control',
  description: 'Platform operasional SAMPARA untuk pemantauan kondisi, prioritas, dan perencanaan pengangkutan sampah.',
  ogTitle: 'SAMPARA Control',
  ogDescription: 'Platform operasional SAMPARA untuk pemantauan kondisi, prioritas, dan perencanaan pengangkutan sampah.'
})
</script>

<template>
  <UApp>
    <div class="min-h-screen">
      <LandingNavbar v-if="showPublicChrome" />

      <main :class="{ 'pt-[72px]': offsetPublicPage }">
        <NuxtPage />
      </main>

      <LandingFooter v-if="showPublicChrome" />
    </div>
  </UApp>
</template>
