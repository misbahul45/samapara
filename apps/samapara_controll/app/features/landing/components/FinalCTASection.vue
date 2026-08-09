<script setup lang="ts">
import { ref } from 'vue'
import { revealOnScroll, useLandingMotion } from '../composables/useLandingMotion'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const content = section.value.querySelector('[data-final-content]')

  if (content) {
    revealOnScroll(gsap, Array.from(content.children), content, reduceMotion, 0.09)
  }
})
</script>

<template>
  <section
    ref="section"
    class="final-surface relative overflow-hidden py-28 text-white lg:py-36"
  >
    <svg
      class="pointer-events-none absolute -right-20 bottom-0 h-full w-[58rem] opacity-30"
      viewBox="0 0 920 480"
      fill="none"
      aria-hidden="true"
    >
      <path d="M-30 412C119 386 189 299 313 328C449 359 499 160 626 180C744 199 745 70 958 48" stroke="rgba(144,218,238,0.32)" stroke-width="2" />
      <path d="M-20 442C120 419 202 332 322 363C459 398 542 205 653 224C767 244 806 114 963 91" stroke="rgba(255,255,255,0.09)" stroke-width="1" stroke-dasharray="8 10" />
      <circle cx="313" cy="328" r="8" fill="#90DAEE" stroke="white" stroke-width="4" />
      <circle cx="626" cy="180" r="8" fill="#FFB01F" stroke="white" stroke-width="4" />
      <circle cx="807" cy="114" r="8" fill="#1F7A3E" stroke="white" stroke-width="4" />
    </svg>

    <div class="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div
        data-final-content
        class="max-w-4xl"
      >
        <h2 class="max-w-[17ch] text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.04em] text-white">
          Mulai dari satu area. Bangun operasi pengangkutan yang lebih adaptif.
        </h2>
        <p class="mt-7 max-w-2xl text-lg leading-8 text-blue-100/75 sm:text-xl">
          Daftarkan kawasan Anda dan siapkan dasar pemantauan, prioritas, dan perencanaan armada bersama SAMPARA.
        </p>
        <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <NuxtLink
            to="/register-area"
            class="inline-flex min-h-13 items-center justify-center rounded-lg bg-white px-6 text-base font-semibold text-blue-950 shadow-[0_16px_36px_rgba(0,0,0,0.14)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
          >
            Daftarkan Area
          </NuxtLink>
          <NuxtLink
            to="/auth/login"
            class="group inline-flex min-h-13 items-center justify-center gap-2 px-4 text-base font-semibold text-white transition-colors hover:text-data focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data"
          >
            Masuk ke SAMPARA Control
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final-surface {
  background:
    radial-gradient(circle at 70% 20%, rgba(144, 218, 238, 0.22), transparent 30%),
    linear-gradient(135deg, var(--color-blue-950) 0%, var(--color-blue-800) 55%, var(--color-green-800) 100%);
}
</style>
