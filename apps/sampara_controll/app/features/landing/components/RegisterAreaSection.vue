<script setup lang="ts">
import { ref } from 'vue'
import {
  revealOnScroll,
  useLandingMotion
} from '../composables/useLandingMotion'
import {
  areaOnboardingSteps,
  areaTypes
} from '../constants/landingContent'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const heading = section.value.querySelector('[data-area-heading]')
  const stage = section.value.querySelector('[data-area-stage]')
  const map = section.value.querySelector('[data-area-map]')
  const steps = Array.from(
    section.value.querySelectorAll('[data-area-step]')
  )
  const types = Array.from(
    section.value.querySelectorAll('[data-area-type]')
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
    gsap.set([map, steps, types], {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      clipPath: 'inset(0 0% 0 0)'
    })

    return
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top 74%',
      once: true
    }
  })

  timeline
    .from(map, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1,
      ease: 'power3.inOut'
    })
    .from(
      steps,
      {
        x: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
      },
      '-=0.55'
    )
    .from(
      types,
      {
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power3.out'
      },
      '-=0.35'
    )
})
</script>

<template>
  <section
    id="area"
    ref="section"
    class="relative overflow-hidden bg-transparent py-24 lg:py-32"
  >
    <div
      class="mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-10"
    >
      <div
        data-area-heading
        class="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end"
      >
        <h2
          class="max-w-[17ch] text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-blue-950"
        >
          Daftarkan kawasan Anda dan mulai dari area pertama.
        </h2>

        <p
          class="max-w-xl text-lg leading-8 text-slate-600 lg:justify-self-end"
        >
          Tentukan lokasi, titik pengumpulan, dan kebutuhan operasional.
          SAMPARA menggunakan struktur tersebut untuk membangun ruang kerja
          kawasan Anda.
        </p>
      </div>

      <div
        data-area-stage
        class="mt-12 grid grid-cols-1 gap-4 lg:mt-16 lg:grid-cols-12"
      >
        <div
          data-area-map
          class="relative min-h-[460px] overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(0,53,95,0.06)] sm:min-h-[560px] lg:col-span-7 lg:min-h-[620px]"
          role="img"
          aria-label="Peta pendaftaran kawasan dengan batas area, empat titik bin, dan titik operasional"
        >
          <div
            class="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-white via-white/95 to-white/0 px-5 pb-16 pt-5 sm:px-7 sm:pt-7"
          >
            <div
              class="flex items-start justify-between gap-6"
            >
              <div>
                <p
                  class="text-sm font-semibold text-blue-950"
                >
                  Tentukan wilayah layanan
                </p>

                <p
                  class="mt-1 text-[10px] text-slate-500 sm:text-xs"
                >
                  Tarik titik untuk menyesuaikan batas area
                </p>
              </div>

              <span
                class="shrink-0 text-[10px] font-medium text-blue-700 sm:text-xs"
              >
                4 titik bin
              </span>
            </div>
          </div>

          <svg
            class="absolute inset-0 size-full"
            viewBox="0 0 660 540"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <rect
              width="660"
              height="540"
              fill="#FFFFFF"
            />

            <path
              d="M-35 139C105 121 158 182 271 111C371 48 481 122 702 55"
              stroke="#E3EBFE"
              stroke-width="20"
            />

            <path
              d="M-22 433C113 397 188 327 294 369C431 423 492 487 701 410"
              stroke="#E3EBFE"
              stroke-width="24"
            />

            <path
              d="M132 -29C177 95 149 176 213 239C279 304 345 296 363 579"
              stroke="#F0F3FF"
              stroke-width="14"
            />

            <path
              d="M559 -25C516 112 505 178 552 258C596 333 581 440 548 574"
              stroke="#F0F3FF"
              stroke-width="14"
            />

            <path
              d="M-20 245C100 218 191 263 295 218C402 172 500 198 692 162"
              stroke="#F7F9FC"
              stroke-width="10"
            />

            <path
              d="M60 -10C92 99 93 176 61 263C30 348 53 450 94 579"
              stroke="#F7F9FC"
              stroke-width="9"
            />

            <path
              d="M445 -27C427 82 422 177 446 246C472 321 467 423 452 573"
              stroke="#F7F9FC"
              stroke-width="9"
            />

            <path
              d="M167 183L431 133L516 343L328 442L137 352Z"
              fill="rgba(144,218,238,0.20)"
              stroke="#004992"
              stroke-width="3"
              stroke-dasharray="9 7"
            />

            <path
              d="M167 183L431 133L516 343L328 442L137 352Z"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              stroke-width="9"
              opacity="0.5"
            />

            <path
              d="M167 183L431 133L516 343L328 442L137 352Z"
              fill="rgba(144,218,238,0.18)"
              stroke="#004992"
              stroke-width="3"
              stroke-dasharray="9 7"
            />

            <path
              d="M214 326C280 302 315 214 382 222C432 228 444 298 482 318"
              stroke="#1F7A3E"
              stroke-width="4"
              stroke-linecap="round"
            />

            <g
              fill="#FFFFFF"
              stroke="#004992"
              stroke-width="3"
            >
              <circle
                cx="167"
                cy="183"
                r="7"
              />

              <circle
                cx="431"
                cy="133"
                r="7"
              />

              <circle
                cx="516"
                cy="343"
                r="7"
              />

              <circle
                cx="328"
                cy="442"
                r="7"
              />

              <circle
                cx="137"
                cy="352"
                r="7"
              />
            </g>
          </svg>

          <div
            class="absolute left-[29%] top-[49%] z-10"
          >
            <span
              class="block size-4 rounded-full border-[4px] border-white bg-yellow-500 shadow"
            />

            <span
              class="mt-1 block text-[9px] font-semibold text-slate-700"
            >
              BIN 01
            </span>
          </div>

          <div
            class="absolute right-[28%] top-[35%] z-10"
          >
            <span
              class="block size-4 rounded-full border-[4px] border-white bg-green-500 shadow"
            />

            <span
              class="mt-1 block text-[9px] font-semibold text-slate-700"
            >
              BIN 02
            </span>
          </div>

          <div
            class="absolute bottom-[29%] right-[20%] z-10"
          >
            <span
              class="block size-4 rounded-full border-[4px] border-white bg-red-500 shadow"
            />

            <span
              class="mt-1 block text-[9px] font-semibold text-slate-700"
            >
              BIN 03
            </span>
          </div>

          <div
            class="absolute bottom-[20%] left-[43%] z-10"
          >
            <span
              class="block size-4 rounded-full border-[4px] border-white bg-green-500 shadow"
            />

            <span
              class="mt-1 block text-[9px] font-semibold text-slate-700"
            >
              BIN 04
            </span>
          </div>

          <div
            class="absolute bottom-5 left-5 z-20 bg-white/90 px-3 py-2 text-[10px] text-slate-600 shadow-sm backdrop-blur sm:bottom-7 sm:left-7 sm:text-xs"
          >
            <span
              class="font-semibold text-blue-950"
            >
              Area Utama
            </span>

            <span
              class="mx-2 text-slate-300"
            >
              /
            </span>

            2.4 km²
          </div>

          <div
            class="absolute bottom-5 right-5 z-20 flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm sm:bottom-7 sm:right-7"
          >
            <button
              type="button"
              aria-label="Perbesar peta"
              class="grid size-9 place-items-center border-b border-slate-200 text-lg text-blue-950 transition hover:bg-slate-50"
            >
              +
            </button>

            <button
              type="button"
              aria-label="Perkecil peta"
              class="grid size-9 place-items-center text-lg text-blue-950 transition hover:bg-slate-50"
            >
              −
            </button>
          </div>
        </div>

        <div
          class="flex flex-col overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white lg:col-span-5"
        >
          <div
            class="border-b border-slate-200 px-6 py-6 sm:px-8 sm:py-7"
          >
            <p
              class="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700"
            >
              Ruang kerja kawasan
            </p>
          </div>

          <div
            class="flex flex-1 flex-col"
          >
            <div
              v-for="step in areaOnboardingSteps"
              :key="step.number"
              data-area-step
              class="group grid flex-1 grid-cols-[54px_1fr] gap-4 border-b border-slate-200 px-6 py-6 transition-colors duration-300 last:border-b-0 hover:bg-blue-50/40 sm:grid-cols-[64px_1fr] sm:px-8"
            >
              <span
                class="text-3xl font-bold leading-none tracking-[-0.045em] text-blue-200 transition-colors duration-300 group-hover:text-blue-300"
              >
                {{ step.number }}
              </span>

              <div>
                <h3
                  class="text-base font-semibold text-blue-950 sm:text-lg"
                >
                  {{ step.title }}
                </h3>

                <p
                  class="mt-2 max-w-md text-sm leading-6 text-slate-600"
                >
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="border-t border-slate-200 p-5 sm:p-6"
          >
            <NuxtLink
              to="/register-area"
              class="group inline-flex min-h-13 w-full items-center justify-between rounded-lg bg-blue-500 px-6 text-base font-semibold text-white shadow-[0_6px_16px_rgba(15,76,129,0.14)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Daftarkan Area

              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </NuxtLink>
          </div>
        </div>

        <article
          v-for="area in areaTypes"
          :key="area.title"
          data-area-type
          class="group relative min-h-[220px] overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_30px_rgba(0,53,95,0.07)] sm:p-7 lg:col-span-4"
        >
          <div
            class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <div
              class="absolute -right-16 -top-20 size-52 rounded-full bg-blue-50"
            />

            <div
              class="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-green-50/60 to-transparent"
            />
          </div>

          <div
            class="relative flex h-full flex-col"
          >
            <h3
              class="max-w-[18ch] text-xl font-semibold tracking-[-0.025em] text-blue-950"
            >
              {{ area.title }}
            </h3>

            <div
              class="mt-5 h-px w-full bg-blue-900/10"
            />

            <p
              class="mt-5 max-w-sm text-sm leading-6 text-slate-600"
            >
              {{ area.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>