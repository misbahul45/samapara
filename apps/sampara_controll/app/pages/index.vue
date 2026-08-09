<script setup lang="ts">
import {
  FinalCTASection,
  HeroSection,
  OperationSection,
  PlatformSection,
  RegisterAreaSection,
  WorkflowSection
} from '~/features/landing'

useSeoMeta({
  title: 'SAMPARA | Operasi Pengangkutan Berbasis Kebutuhan',
  description: 'Pantau kondisi bin, pahami prioritas, dan rencanakan rute armada dalam satu platform operasional kawasan.',
  ogTitle: 'SAMPARA | Operasi Pengangkutan Berbasis Kebutuhan',
  ogDescription: 'Pantau kondisi bin, pahami prioritas, dan rencanakan rute armada dalam satu platform operasional kawasan.'
})
</script>

<template>
  <div class="overflow-x-clip bg-white">
    <HeroSection />
    <OperationSection />
    <WorkflowSection />
    <PlatformSection />
    <RegisterAreaSection />
    <FinalCTASection />
  </div>
</template>
