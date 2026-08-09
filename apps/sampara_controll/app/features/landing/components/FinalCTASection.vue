<script setup lang="ts">
import { ref } from 'vue'
import { useLandingMotion } from '../composables/useLandingMotion'
import { finalCtaFlow } from '../constants/landingContent'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const content = section.value.querySelector<HTMLElement>(
    '[data-final-content]'
  )

  const heading = section.value.querySelector<HTMLElement>(
    '[data-final-heading]'
  )

  const description = section.value.querySelector<HTMLElement>(
    '[data-final-description]'
  )

  const actions = section.value.querySelector<HTMLElement>(
    '[data-final-actions]'
  )

  const visual = section.value.querySelector<HTMLElement>(
    '[data-final-visual]'
  )

  const background = section.value.querySelector<HTMLElement>(
    '[data-final-background]'
  )

  const panel = section.value.querySelector<HTMLElement>(
    '[data-final-panel]'
  )

  const route = section.value.querySelector<SVGPathElement>(
    '[data-final-route]'
  )

  const flowNodes = Array.from(
    section.value.querySelectorAll<HTMLElement>(
      '[data-final-flow-node]'
    )
  )

  if (!content) {
    return
  }

  if (reduceMotion) {
    gsap.set(
      [
        heading,
        description,
        actions,
        visual,
        background,
        panel,
        ...flowNodes
      ],
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1
      }
    )

    if (route) {
      gsap.set(route, {
        strokeDashoffset: 0
      })
    }

    return
  }

  if (route) {
    gsap.set(route, {
      strokeDashoffset: 1
    })
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section.value,
      start: 'top 72%',
      once: true,
      invalidateOnRefresh: true
    }
  })

  if (heading) {
    timeline.from(
      heading,
      {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      },
      0
    )
  }

  if (description) {
    timeline.from(
      description,
      {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      },
      0.12
    )
  }

  if (actions) {
    timeline.from(
      actions,
      {
        y: 16,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out'
      },
      0.22
    )
  }

  if (background) {
    timeline.from(
      background,
      {
        opacity: 0,
        scale: 1.02,
        duration: 0.9,
        ease: 'power3.out'
      },
      0.12
    )
  }

  if (visual) {
    timeline.from(
      visual,
      {
        x: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      },
      0.18
    )
  }

  timeline.from(
    flowNodes,
    {
      y: 14,
      opacity: 0,
      scale: 0.97,
      duration: 0.5,
      stagger: 0.09,
      ease: 'power3.out'
    },
    0.42
  )

  if (route) {
    timeline.to(
      route,
      {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: 'power3.inOut'
      },
      0.52
    )
  }

  if (panel) {
    timeline.from(
      panel,
      {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      },
      0.66
    )
  }
})
</script>

<template>
  <section
    ref="section"
    class="relative overflow-hidden bg-linear-to-b from-blue-100 via-blue-50 to-white py-24 sm:py-28 lg:py-32"
  >
    <div
      class="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8"
    >
      <div
        data-final-content
        class="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white/90 shadow-[0_22px_60px_rgba(0,53,95,0.08)]"
      >
        <div class="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div
            class="flex flex-col justify-center px-6 py-10 sm:px-9 sm:py-12 lg:px-12 lg:py-16 xl:px-14"
          >
            <h2
              data-final-heading
              class="max-w-[14ch] text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.04em] text-blue-950"
            >
              Bangun operasi pengangkutan yang lebih adaptif.
            </h2>

            <p
              data-final-description
              class="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
            >
              Daftarkan kawasan Anda untuk mulai memantau kondisi, menentukan
              prioritas, dan merencanakan armada bersama SAMPARA.
            </p>

            <div
              data-final-actions
              class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <NuxtLink
                to="/register-area"
                class="group inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(0,90,156,0.14)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_10px_22px_rgba(0,90,156,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:text-base"
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
                class="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-5 text-sm font-semibold text-blue-950 transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:text-base"
              >
                Masuk ke Control

                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-4 text-slate-400 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-blue-600"
                  aria-hidden="true"
                />
              </NuxtLink>
            </div>
          </div>

          <div
            data-final-visual
            class="relative min-h-[390px] overflow-hidden border-t border-blue-100 bg-blue-50 sm:min-h-[450px] lg:min-h-[540px] lg:border-l lg:border-t-0"
          >
            <div
              data-final-background
              class="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <NuxtImg
                src="/home/cta-map-background.png"
                alt=""
                width="1200"
                height="900"
                loading="lazy"
                draggable="false"
                class="h-full w-full object-cover object-center opacity-90"
              />
            </div>

            <div
              class="pointer-events-none absolute inset-0 bg-white/22"
              aria-hidden="true"
            />

            <div
              class="relative z-10 flex h-full min-h-[390px] flex-col justify-center px-5 py-10 sm:min-h-[450px] sm:px-8 sm:py-12 lg:min-h-[540px] lg:px-10 xl:px-12"
            >
              <div
                class="relative mx-auto w-full max-w-[540px]"
                role="img"
                aria-label="Alur operasional SAMPARA dari kondisi, prediksi, prioritas, hingga rute"
              >
                <div
                  class="relative grid grid-cols-4 gap-2 sm:gap-4"
                >
                  <svg
                    class="pointer-events-none absolute left-[11%] top-5 h-8 w-[78%] overflow-visible sm:top-6"
                    viewBox="0 0 520 32"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      data-final-route
                      pathLength="1"
                      d="M0 16H520"
                      stroke="#005A9C"
                      stroke-width="1.5"
                      stroke-dasharray="1"
                      stroke-linecap="round"
                    />
                  </svg>

                  <div
                    v-for="step in finalCtaFlow"
                    :key="step.number"
                    data-final-flow-node
                    class="relative flex min-w-0 flex-col items-center text-center"
                  >
                    <span
                      class="relative z-10 grid size-10 place-items-center rounded-full border border-blue-200 bg-white text-[11px] font-bold tabular-nums text-blue-950 shadow-[0_4px_12px_rgba(0,53,95,0.08)] sm:size-12 sm:text-xs"
                    >
                      {{ step.number }}
                    </span>

                    <span
                      class="mt-3 text-[10px] font-semibold leading-4 text-slate-700 sm:text-xs"
                    >
                      {{ step.label }}
                    </span>
                  </div>
                </div>

                <div
                  data-final-panel
                  class="relative mx-auto mt-10 max-w-[92%] overflow-hidden rounded-xl border border-blue-100 bg-white shadow-[0_14px_36px_rgba(0,53,95,0.08)] sm:mt-12 sm:max-w-[88%]"
                >
                  <div
                    class="flex items-center gap-4 border-b border-slate-200 px-4 py-4 sm:px-5"
                  >
                    <div
                      class="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700"
                    >
                      <UIcon
                        name="i-lucide-route"
                        class="size-5"
                        aria-hidden="true"
                      />
                    </div>

                    <div class="min-w-0 flex-1">
                      <p
                        class="text-xs font-semibold text-blue-950 sm:text-sm"
                      >
                        Rencana operasional siap
                      </p>

                      <p
                        class="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs"
                      >
                        Prioritas dan rute telah disusun berdasarkan kebutuhan
                        kawasan.
                      </p>
                    </div>

                    <UIcon
                      name="i-lucide-arrow-right"
                      class="size-4 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    class="grid grid-cols-3 divide-x divide-slate-200"
                  >
                    <div class="px-3 py-4 sm:px-4">
                      <p
                        class="text-[9px] text-slate-500 sm:text-[10px]"
                      >
                        Prioritas
                      </p>

                      <p
                        class="mt-1 text-base font-bold tabular-nums text-red-600 sm:text-lg"
                      >
                        3
                      </p>
                    </div>

                    <div class="px-3 py-4 sm:px-4">
                      <p
                        class="text-[9px] text-slate-500 sm:text-[10px]"
                      >
                        Armada
                      </p>

                      <p
                        class="mt-1 text-base font-bold tabular-nums text-blue-950 sm:text-lg"
                      >
                        2
                      </p>
                    </div>

                    <div class="px-3 py-4 sm:px-4">
                      <p
                        class="text-[9px] text-slate-500 sm:text-[10px]"
                      >
                        Rute
                      </p>

                      <p
                        class="mt-1 text-base font-bold tabular-nums text-green-700 sm:text-lg"
                      >
                        2
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="mx-auto mt-5 flex max-w-[88%] items-center justify-between gap-4 text-[10px] text-slate-500 sm:text-xs"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="size-2 rounded-full bg-green-500"
                      aria-hidden="true"
                    />

                    <span>
                      Siap dieksekusi
                    </span>
                  </div>

                  <span>
                    Area Utama
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>