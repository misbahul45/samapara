<script setup lang="ts">
import { ref } from 'vue'
import {
  revealOnScroll,
  useLandingMotion
} from '../composables/useLandingMotion'
import {
  controlMetrics,
  driveStops
} from '../constants/landingContent'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const heading = section.value.querySelector<HTMLElement>(
    '[data-platform-heading]'
  )

  const stage = section.value.querySelector<HTMLElement>(
    '[data-platform-stage]'
  )

  const background = section.value.querySelector<HTMLElement>(
    '[data-platform-background]'
  )

  const control = section.value.querySelector<HTMLElement>(
    '[data-platform-control]'
  )

  const drive = section.value.querySelector<HTMLElement>(
    '[data-platform-drive]'
  )

  const connector = section.value.querySelector<SVGPathElement>(
    '[data-platform-connector]'
  )

  const route = section.value.querySelector<SVGPathElement>(
    '[data-control-route]'
  )

  if (heading) {
    revealOnScroll(
      gsap,
      Array.from(heading.children),
      heading,
      reduceMotion,
      0.08
    )
  }

  if (!stage) {
    return
  }

  if (reduceMotion) {
    gsap.set([background, control, drive], {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      clipPath: 'inset(0 0% 0 0)'
    })

    if (connector) {
      gsap.set(connector, {
        strokeDashoffset: 0
      })
    }

    if (route) {
      gsap.set(route, {
        strokeDashoffset: 0
      })
    }

    return
  }

  if (connector) {
    gsap.set(connector, {
      strokeDashoffset: 1
    })
  }

  if (route) {
    gsap.set(route, {
      strokeDashoffset: 1
    })
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top 76%',
      once: true
    }
  })

  if (background) {
    timeline.from(
      background,
      {
        opacity: 0,
        scale: 1.025,
        duration: 0.9,
        ease: 'power3.out'
      },
      0
    )
  }

  if (control) {
    timeline.from(
      control,
      {
        y: 32,
        opacity: 0,
        clipPath: 'inset(0 0 10% 0)',
        duration: 0.9,
        ease: 'power3.out'
      },
      0.1
    )
  }

  if (route) {
    timeline.to(
      route,
      {
        strokeDashoffset: 0,
        duration: 1,
        ease: 'power3.inOut'
      },
      0.55
    )
  }

  if (drive) {
    timeline.from(
      drive,
      {
        x: 28,
        y: 18,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out'
      },
      0.55
    )
  }

  if (connector) {
    timeline.to(
      connector,
      {
        strokeDashoffset: 0,
        duration: 0.75,
        ease: 'power3.inOut'
      },
      0.7
    )
  }
})
</script>

<template>
  <section
    id="platform"
    ref="section"
    class="relative overflow-hidden bg-slate-50 py-24 sm:py-28 lg:py-32"
  >
    <div
      data-platform-background
      class="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[68%] opacity-[0.07] lg:block"
      aria-hidden="true"
    >
      <NuxtImg
        src="/home/platform-environment.png"
        alt=""
        width="1600"
        height="1000"
        loading="lazy"
        draggable="false"
        class="h-full w-full object-cover object-center"
      />
    </div>

    <div
      class="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8"
    >
      <div
        data-platform-heading
        class="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20"
      >
        <h2
          class="max-w-[14ch] text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.04em] text-blue-950"
        >
          Satu sistem untuk operator dan tim lapangan.
        </h2>

        <p
          class="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:justify-self-end"
        >
          Operator mengelola kawasan dan keputusan pengangkutan melalui
          SAMPARA Control, sementara pengemudi menerima tugas dan urutan
          kunjungan melalui SAMPARA Drive.
        </p>
      </div>

      <div
        data-platform-stage
        class="relative mt-14 sm:mt-16 lg:mt-20 lg:min-h-[700px] lg:pb-24"
      >
        <svg
          class="pointer-events-none absolute bottom-[88px] right-[8%] z-10 hidden h-44 w-80 lg:block"
          viewBox="0 0 320 176"
          fill="none"
          aria-hidden="true"
        >
          <path
            data-platform-connector
            pathLength="1"
            d="M8 26C88 26 96 148 184 148H308"
            stroke="#005A9C"
            stroke-width="2"
            stroke-dasharray="1"
            stroke-linecap="round"
          />

          <circle
            cx="8"
            cy="26"
            r="5"
            fill="#8BCDF2"
            stroke="#FFFFFF"
            stroke-width="3"
          />

          <circle
            cx="308"
            cy="148"
            r="5"
            fill="#1F8A4C"
            stroke="#FFFFFF"
            stroke-width="3"
          />
        </svg>

        <div
          data-platform-control
          class="relative z-0 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(0,53,95,0.08)] lg:w-[87%]"
          aria-label="Pratinjau SAMPARA Control dengan peta area, kondisi bin, dan rute aktif"
        >
          <div
            class="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4 sm:h-14 sm:px-5"
          >
            <div class="flex items-center gap-2.5">
              <span
                class="grid size-7 place-items-center rounded-md bg-blue-600 text-white sm:size-8"
              >
                <UIcon
                  name="i-lucide-chart-no-axes-combined"
                  class="size-4"
                  aria-hidden="true"
                />
              </span>

              <span
                class="text-xs font-bold tracking-[-0.02em] text-blue-950 sm:text-sm"
              >
                SAMPARA Control
              </span>
            </div>

            <span
              class="text-[10px] font-medium text-slate-500 sm:text-xs"
            >
              Area Utama
            </span>
          </div>

          <div
            class="grid min-h-[390px] grid-cols-[48px_1fr] sm:min-h-[500px] sm:grid-cols-[150px_1fr]"
          >
            <aside
              class="border-r border-slate-200 bg-slate-50 p-2.5 sm:p-4"
              aria-label="Menu pratinjau SAMPARA Control"
            >
              <p
                class="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:block"
              >
                Operations
              </p>

              <div class="mt-2 space-y-1.5 sm:mt-4">
                <div
                  class="flex items-center gap-2 rounded-md bg-blue-600 px-2.5 py-2 text-white"
                >
                  <UIcon
                    name="i-lucide-map"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />

                  <span
                    class="hidden text-[10px] font-semibold sm:block"
                  >
                    Overview
                  </span>
                </div>

                <div
                  class="flex items-center gap-2 px-2.5 py-2 text-slate-500"
                >
                  <UIcon
                    name="i-lucide-route"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />

                  <span
                    class="hidden text-[10px] font-medium sm:block"
                  >
                    Planning
                  </span>
                </div>

                <div
                  class="flex items-center gap-2 px-2.5 py-2 text-slate-500"
                >
                  <UIcon
                    name="i-lucide-truck"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />

                  <span
                    class="hidden text-[10px] font-medium sm:block"
                  >
                    Execution
                  </span>
                </div>

                <div
                  class="flex items-center gap-2 px-2.5 py-2 text-slate-500"
                >
                  <UIcon
                    name="i-lucide-chart-column"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />

                  <span
                    class="hidden text-[10px] font-medium sm:block"
                  >
                    Analysis
                  </span>
                </div>
              </div>
            </aside>

            <div class="min-w-0 bg-white p-3 sm:p-5">
              <div
                class="flex items-start justify-between gap-4"
              >
                <div>
                  <p
                    class="text-sm font-semibold text-blue-950 sm:text-base"
                  >
                    Area Overview
                  </p>

                  <p
                    class="mt-0.5 hidden text-[10px] leading-5 text-slate-500 sm:block"
                  >
                    Kondisi operasional kawasan secara langsung
                  </p>
                </div>

                <span
                  class="shrink-0 text-[9px] tabular-nums text-slate-400 sm:text-[10px]"
                >
                  08:40 WIB
                </span>
              </div>

              <div
                class="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-4"
              >
                <div
                  v-for="metric in controlMetrics"
                  :key="metric.label"
                  class="border-t border-slate-200 pt-2.5 sm:pt-3"
                >
                  <p
                    class="truncate text-[8px] text-slate-500 sm:text-[10px]"
                  >
                    {{ metric.label }}
                  </p>

                  <p
                    class="mt-1 text-lg font-bold tabular-nums tracking-[-0.04em] sm:text-2xl"
                    :class="metric.tone"
                  >
                    {{ metric.value }}
                  </p>
                </div>
              </div>

              <div
                class="relative mt-4 min-h-[250px] overflow-hidden border border-slate-200 bg-slate-50 sm:mt-5 sm:min-h-[340px]"
                role="img"
                aria-label="Peta SAMPARA Control dengan tiga titik bin dan satu rute armada"
              >
                <NuxtImg
                  src="/home/platform-environment.png"
                  alt=""
                  width="1600"
                  height="1000"
                  loading="lazy"
                  draggable="false"
                  class="absolute inset-0 h-full w-full object-cover object-center opacity-40"
                  aria-hidden="true"
                />

                <svg
                  class="absolute inset-0 size-full"
                  viewBox="0 0 760 390"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                >
                  <path
                    d="M-30 82C94 107 154 77 232 42C339 -5 447 61 792 23"
                    stroke="#E3EBFE"
                    stroke-width="22"
                  />

                  <path
                    d="M-15 316C110 284 150 204 260 238C388 278 493 357 782 302"
                    stroke="#E3EBFE"
                    stroke-width="26"
                  />

                  <path
                    d="M160 -30C180 93 141 147 200 214C262 283 331 304 344 430"
                    stroke="#F0F3FF"
                    stroke-width="16"
                  />

                  <path
                    d="M621 -20C568 109 585 189 643 253C682 298 689 342 667 423"
                    stroke="#F0F3FF"
                    stroke-width="14"
                  />

                  <path
                    data-control-route
                    pathLength="1"
                    d="M82 287C170 262 177 175 277 180C363 184 424 78 507 103C572 122 565 225 646 248"
                    stroke="#005A9C"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-dasharray="1"
                  />

                  <path
                    d="M354 157L366 146L374 162"
                    stroke="#005A9C"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <div
                  class="absolute left-[10%] top-[65%]"
                >
                  <span
                    class="block size-3 rounded-full border-[3px] border-white bg-yellow-500 shadow"
                  />

                  <span
                    class="mt-1 block text-[8px] font-semibold text-slate-700 sm:text-[9px]"
                  >
                    BIN-07 · 78%
                  </span>
                </div>

                <div
                  class="absolute left-[35%] top-[36%]"
                >
                  <span
                    class="block size-3 rounded-full border-[3px] border-white bg-red-500 shadow"
                  />

                  <span
                    class="mt-1 block text-[8px] font-semibold text-red-700 sm:text-[9px]"
                  >
                    BIN-12 · 92%
                  </span>
                </div>

                <div
                  class="absolute right-[16%] top-[52%]"
                >
                  <span
                    class="block size-3 rounded-full border-[3px] border-white bg-green-500 shadow"
                  />

                  <span
                    class="mt-1 block text-[8px] font-semibold text-green-700 sm:text-[9px]"
                  >
                    BIN-18 · 41%
                  </span>
                </div>

                <div
                  class="absolute bottom-[19%] left-[51%]"
                  aria-hidden="true"
                >
                  <NuxtImg

                    src="/home/truck.png"
                    alt=""
                    width="320"
                    height="220"
                    loading="lazy"
                    draggable="false"
                    class="h-auto w-12 object-contain sm:w-16"
                  />
                </div>

                <div
                  class="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 border border-slate-200 bg-white px-3 py-2 text-[8px] text-slate-500 sm:inset-x-4 sm:text-[9px]"
                >
                  <span
                    class="font-semibold text-blue-950"
                  >
                    Rute ARM-07
                  </span>

                  <span>
                    3 dari 8 titik
                  </span>

                  <span
                    class="font-medium text-green-700"
                  >
                    Tepat waktu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          data-platform-drive
          class="relative z-20 mx-auto mt-8 w-full max-w-[300px] rounded-[2rem] border-[7px] border-slate-950 bg-white p-1.5 shadow-[0_18px_42px_rgba(0,35,63,0.14)] lg:absolute lg:bottom-0 lg:right-[1.5%] lg:mt-0 lg:w-[270px]"
          aria-label="Pratinjau SAMPARA Drive dengan tugas berikutnya dan antrean pengemudi"
        >
          <div
            class="overflow-hidden rounded-[1.45rem] bg-slate-50"
          >
            <div
              class="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4"
            >
              <UIcon
                name="i-lucide-menu"
                class="size-4 text-slate-600"
                aria-hidden="true"
              />

              <span
                class="text-sm font-bold tracking-[-0.02em] text-blue-950"
              >
                SAMPARA Drive
              </span>

              <span
                class="size-4"
                aria-hidden="true"
              />
            </div>

            <div class="px-4 pb-5 pt-4">
              <div
                class="flex items-center justify-between text-[10px] text-slate-500"
              >
                <span>
                  Rute Hari Ini
                </span>

                <span
                  class="font-semibold text-blue-950"
                >
                  2 / 12 selesai
                </span>
              </div>

              <div
                class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"
              >
                <div
                  class="h-full w-[18%] rounded-full bg-blue-600"
                />
              </div>

              <p
                class="mt-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500"
              >
                Tugas berikutnya
              </p>

              <div
                class="mt-2 border-2 border-blue-600 bg-white p-3"
              >
                <div
                  class="flex items-start justify-between gap-3"
                >
                  <div class="flex gap-2.5">
                    <span
                      class="grid size-7 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-semibold text-white"
                    >
                      01
                    </span>

                    <div>
                      <p
                        class="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500"
                      >
                        BIN-8492-AX
                      </p>

                      <p
                        class="mt-0.5 text-xs font-semibold leading-4 text-blue-950"
                      >
                        Building A
                      </p>
                    </div>
                  </div>

                  <span
                    class="text-[9px] font-semibold text-yellow-700"
                  >
                    AWAS
                  </span>
                </div>

                <div
                  class="mt-3 flex items-center gap-2 border-y border-slate-200 py-3 text-[10px] text-slate-600"
                >
                  <UIcon
                    name="i-lucide-map-pin"
                    class="size-3.5 shrink-0"
                    aria-hidden="true"
                  />

                  Area utama · Zona utara
                </div>

                <div
                  class="mt-3 flex items-end justify-between"
                >
                  <div>
                    <p
                      class="text-[8px] uppercase tracking-[0.12em] text-slate-400"
                    >
                      Next stop
                    </p>

                    <p
                      class="mt-0.5 text-base font-bold text-blue-950"
                    >
                      7 min
                    </p>
                  </div>

                  <span
                    class="text-[10px] font-semibold text-blue-700"
                  >
                    1.2 km
                  </span>
                </div>

                <button
                  type="button"
                  class="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-[11px] font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <UIcon
                    name="i-lucide-navigation"
                    class="size-3.5"
                    aria-hidden="true"
                  />

                  Mulai Navigasi
                </button>
              </div>

              <p
                class="mt-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500"
              >
                Antrean berikutnya
              </p>

              <div class="mt-2 space-y-2">
                <div
                  v-for="stop in driveStops"
                  :key="stop.number"
                  class="flex items-center justify-between gap-3 border border-slate-200 bg-white px-3 py-2"
                >
                  <div
                    class="flex min-w-0 items-center gap-2"
                  >
                    <span
                      class="grid size-6 shrink-0 place-items-center rounded-full border border-slate-300 text-[10px] text-slate-500"
                    >
                      {{ stop.number }}
                    </span>

                    <span
                      class="truncate text-[10px] font-semibold text-slate-700"
                    >
                      {{ stop.place }}
                    </span>
                  </div>

                  <span
                    class="shrink-0 text-[10px] font-semibold tabular-nums text-blue-950"
                  >
                    {{ stop.time }}
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