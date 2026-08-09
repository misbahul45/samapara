<script setup lang="ts">
import { ref } from 'vue'
import { useLandingMotion } from '../composables/useLandingMotion'
import { finalCtaFlow } from '../constants/landingContent'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const content = section.value.querySelector('[data-final-content]')
  const flowNodes = Array.from(
    section.value.querySelectorAll<HTMLElement>('[data-final-flow-node]')
  )

  if (!content) {
    return
  }

  if (reduceMotion) {
    gsap.set([content, flowNodes], {
      opacity: 1,
      y: 0,
      scale: 1
    })

    return
  }

  const heading = content.querySelector('h2')
  const description = content.querySelector('p')
  const actions = content.querySelector('[data-final-actions]')
  const visual = content.querySelector('[data-final-visual]')
  const panel = content.querySelector('[data-final-panel]')

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section.value,
      start: 'top 72%',
      once: true
    }
  })

  timeline
    .from(heading, {
      y: 28,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.out'
    })
    .from(
      description,
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      },
      '-=0.48'
    )
    .from(
      actions,
      {
        y: 16,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out'
      },
      '-=0.38'
    )
    .from(
      visual,
      {
        x: 32,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      },
      '-=0.7'
    )
    .from(
      flowNodes,
      {
        y: 16,
        opacity: 0,
        scale: 0.96,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      },
      '-=0.5'
    )
    .from(
      panel,
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      },
      '-=0.35'
    )
})
</script>

<template>
  <section
    ref="section"
    class="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-slate-200"
    />

    <div class="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div
        data-final-content
        class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.07)]"
      >
        <div class="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div
            class="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 xl:px-16 xl:py-20"
          >
            <h2
              class="max-w-[15ch] text-[clamp(2.35rem,5vw,4rem)] font-bold leading-[1.01] tracking-[-0.045em] text-slate-950"
            >
              Bangun Operasi Pengangkutan yang Lebih Adaptif.
            </h2>

            <p
              class="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8"
            >
              Daftarkan kawasan Anda untuk mulai memantau kondisi,
              menentukan prioritas, dan merencanakan armada bersama SAMPARA.
            </p>

            <div
              data-final-actions
              class="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
            >
              <NuxtLink
                to="/register-area"
                class="group inline-flex min-h-13 items-center justify-center gap-3 rounded-xl bg-blue-500 px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(23,37,84,0.16)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-blue-900 hover:shadow-[0_12px_28px_rgba(23,37,84,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Daftarkan Area

                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </NuxtLink>

              <NuxtLink
                to="/auth/login"
                class="group inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-base font-semibold text-slate-900 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Masuk ke SAMPARA Control

                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-4 text-slate-400 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-slate-900"
                  aria-hidden="true"
                />
              </NuxtLink>
            </div>
          </div>

          <div
            data-final-visual
            class="relative flex min-h-[340px] items-center overflow-hidden border-t border-slate-200 bg-slate-50/70 px-5 py-10 sm:min-h-[400px] sm:px-10 lg:min-h-[500px] lg:border-l lg:border-t-0 lg:px-12"
          >
            <div
              class="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 620 520"
                class="size-full"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M-45 112C86 88 148 145 246 101C353 52 452 94 671 39"
                  stroke="#E2E8F0"
                  stroke-width="18"
                />

                <path
                  d="M-34 417C97 380 183 323 284 356C402 394 488 449 679 373"
                  stroke="#E2E8F0"
                  stroke-width="22"
                />

                <path
                  d="M116 -40C155 89 133 185 188 253C248 326 252 397 268 566"
                  stroke="#F1F5F9"
                  stroke-width="13"
                />

                <path
                  d="M505 -40C463 103 465 192 516 268C561 337 544 426 517 564"
                  stroke="#F1F5F9"
                  stroke-width="13"
                />

                <path
                  d="M129 172L408 123L500 325L321 416L96 322Z"
                  fill="rgba(219,234,254,0.45)"
                  stroke="#BFDBFE"
                  stroke-width="2"
                  stroke-dasharray="8 8"
                />

                <path
                  d="M173 296C229 267 272 210 328 220C377 229 400 277 449 288"
                  stroke="#86A8D7"
                  stroke-width="3"
                  stroke-linecap="round"
                />
              </svg>

              <div
                class="absolute -right-20 -top-20 size-72 rounded-full bg-blue-100/40 blur-3xl"
              />

              <div
                class="absolute -bottom-24 -left-24 size-72 rounded-full bg-green-100/35 blur-3xl"
              />
            </div>

            <div class="relative z-10 mx-auto w-full max-w-[520px]">
              <div
                class="relative grid grid-cols-4 gap-2 sm:gap-4"
                role="img"
                aria-label="Alur operasional dari kondisi, prediksi, prioritas, hingga rute"
              >
                <div
                  class="absolute left-[12.5%] right-[12.5%] top-6 h-px bg-blue-200 sm:top-7"
                  aria-hidden="true"
                />

                <div
                  v-for="step in finalCtaFlow"
                  :key="step.number"
                  data-final-flow-node
                  class="relative flex min-w-0 flex-col items-center text-center"
                >
                  <span
                    class="relative z-10 grid size-12 place-items-center rounded-full border border-blue-200 bg-white text-xs font-bold text-blue-950 shadow-[0_5px_18px_rgba(15,23,42,0.08)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_10px_22px_rgba(15,23,42,0.1)] sm:size-14 sm:text-sm"
                  >
                    {{ step.number }}
                  </span>

                  <span
                    class="mt-3 max-w-[90px] text-[10px] font-semibold leading-4 text-slate-700 sm:mt-4 sm:text-xs sm:leading-5"
                  >
                    {{ step.label }}
                  </span>
                </div>
              </div>

              <div
                data-final-panel
                class="relative mx-auto mt-10 max-w-[88%] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
              >
                <div
                  class="flex items-center gap-4 border-b border-slate-100 px-4 py-4 sm:px-5"
                >
                  <div
                    class="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-950"
                  >
                    <UIcon
                      name="i-lucide-route"
                      class="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <div
                      class="h-2 w-[68%] rounded-full bg-slate-200"
                    />

                    <div
                      class="mt-2 h-2 w-[42%] rounded-full bg-slate-100"
                    />
                  </div>

                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                </div>

                <div class="grid grid-cols-3 divide-x divide-slate-100">
                  <div class="px-3 py-4 sm:px-4">
                    <div
                      class="h-1.5 w-8 rounded-full bg-blue-200"
                    />

                    <div
                      class="mt-2 h-1.5 w-12 max-w-full rounded-full bg-slate-100"
                    />
                  </div>

                  <div class="px-3 py-4 sm:px-4">
                    <div
                      class="h-1.5 w-8 rounded-full bg-green-200"
                    />

                    <div
                      class="mt-2 h-1.5 w-12 max-w-full rounded-full bg-slate-100"
                    />
                  </div>

                  <div class="px-3 py-4 sm:px-4">
                    <div
                      class="h-1.5 w-8 rounded-full bg-blue-200"
                    />

                    <div
                      class="mt-2 h-1.5 w-12 max-w-full rounded-full bg-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>