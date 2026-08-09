<script setup lang="ts">
import { ref } from 'vue'
import { revealOnScroll, useLandingMotion } from '../composables/useLandingMotion'
import { finalCtaFlow } from '../constants/landingContent'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const content = section.value.querySelector('[data-final-content]')

  if (content) {
    revealOnScroll(gsap, Array.from(content.children), content, reduceMotion, 0.09)
  }

  const routePath = section.value.querySelector('[data-final-route]')
  const flowNodes = section.value.querySelectorAll('[data-final-flow-node]')

  if (!routePath) {
    return
  }

  if (reduceMotion) {
    gsap.set(routePath, { strokeDashoffset: 0 })
    gsap.set(flowNodes, { opacity: 1 })
    return
  }

  gsap.fromTo(routePath, {
    strokeDashoffset: 1
  }, {
    strokeDashoffset: 0,
    duration: 1.1,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: section.value,
      start: 'top 76%',
      once: true
    }
  })

  gsap.from(flowNodes, {
    opacity: 0,
    duration: 0.45,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section.value,
      start: 'top 72%',
      once: true
    }
  })
})
</script>

<template>
  <section
    ref="section"
    class="final-surface relative overflow-hidden py-28 text-white lg:py-36"
  >
    <div
      class="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] lg:block"
      role="img"
      aria-label="Alur operasional dari kondisi, prediksi, prioritas, hingga rute"
    >
      <svg
        class="size-full"
        viewBox="0 0 720 480"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M92 358C168 358 194 314 270 300C348 286 373 224 452 202C535 180 566 119 642 112"
          stroke="rgba(255,255,255,0.10)"
          stroke-width="10"
          stroke-linecap="round"
        />
        <path
          data-final-route
          pathLength="1"
          d="M92 358C168 358 194 314 270 300C348 286 373 224 452 202C535 180 566 119 642 112"
          stroke="#90DAEE"
          stroke-width="3"
          stroke-dasharray="1"
          stroke-linecap="round"
        />
        <g
          v-for="step in finalCtaFlow"
          :key="step.number"
          data-final-flow-node
          :transform="`translate(${step.x} ${step.y})`"
        >
          <circle
            r="23"
            fill="#00345C"
            stroke="rgba(144,218,238,0.55)"
            stroke-width="2"
          />
          <text
            y="4"
            text-anchor="middle"
            fill="#90DAEE"
            font-size="10"
            font-weight="700"
          >
            {{ step.number }}
          </text>
          <text
            y="52"
            text-anchor="middle"
            fill="white"
            font-size="13"
            font-weight="600"
          >
            {{ step.label }}
          </text>
        </g>
      </svg>
    </div>

    <div class="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div
        data-final-content
        class="max-w-4xl lg:max-w-[58%]"
      >
        <h2 class="max-w-[17ch] text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.04em] text-white">
          Mulai dari satu area. Bangun operasi pengangkutan yang lebih adaptif.
        </h2>
        <p class="mt-7 max-w-2xl text-lg leading-8 text-blue-100/75 sm:text-xl">
          Daftarkan kawasan Anda dan siapkan dasar pemantauan, prioritas, dan perencanaan armada bersama SAMPARA.
        </p>
        <div
          class="relative mt-10 lg:hidden"
          role="img"
          aria-label="Alur operasional dari kondisi, prediksi, prioritas, hingga rute"
        >
          <div
            class="absolute left-5 right-5 top-5 h-px bg-data/40"
            aria-hidden="true"
          />
          <div class="relative grid grid-cols-4 gap-2">
            <div
              v-for="step in finalCtaFlow"
              :key="step.number"
              data-final-flow-node
              class="flex flex-col items-center gap-2 text-center"
            >
              <span class="grid size-10 place-items-center rounded-full border border-data/50 bg-blue-950 text-[10px] font-bold text-data">
                {{ step.number }}
              </span>
              <span class="text-[10px] font-semibold text-blue-100">
                {{ step.label }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/register-area"
            class="inline-flex min-h-13 items-center justify-center rounded-lg bg-white px-6 text-base font-semibold text-blue-950 shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
          >
            Daftarkan Area
          </a>
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
  background-color: var(--color-blue-900);
}
</style>
