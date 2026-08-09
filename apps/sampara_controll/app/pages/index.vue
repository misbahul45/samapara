<script setup lang="ts">
import {
  FinalCTASection,
  HeroSection,
  OperationSection,
  PlatformSection,
  RegisterAreaSection,
  WorkflowSection
} from '~/features/landing'

const title =
  'SAMPARA | Pengangkutan Sampah Adaptif Berbasis Kebutuhan'

const description =
  'Pantau kondisi bin, prediksi kebutuhan pengangkutan, tentukan prioritas, dan rencanakan rute armada adaptif dalam satu platform operasional kawasan.'

const requestUrl = useRequestURL()

const canonicalUrl = new URL(
  '/',
  requestUrl.origin
).toString()

const ogImageUrl = new URL(
  '/home/hero-environment.png',
  requestUrl.origin
).toString()

useSeoMeta({
  title,
  description,
  robots: 'index, follow, max-image-preview:large',
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogLocale: 'id_ID',
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  ogImageAlt:
    'Kawasan operasional SAMPARA untuk pengangkutan sampah berbasis kebutuhan',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImageUrl
})

useHead({
  htmlAttrs: {
    lang: 'id'
  },
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl
    }
  ],
  meta: [
    {
      name: 'theme-color',
      content: '#ffffff'
    }
  ]
})
</script>

<template>
  <main
    id="main-content"
    class="overflow-x-clip "
  >
    <HeroSection />
    <OperationSection />
    <WorkflowSection />
    <PlatformSection />
    <RegisterAreaSection />
    <FinalCTASection />
  </main>
</template>