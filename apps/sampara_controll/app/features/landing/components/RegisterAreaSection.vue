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

  const heading = section.value.querySelector<HTMLElement>(
    '[data-area-heading]'
  )

  const stage = section.value.querySelector<HTMLElement>(
    '[data-area-stage]'
  )

  const map = section.value.querySelector<HTMLElement>(
    '[data-area-map]'
  )

  const steps = Array.from(
    section.value.querySelectorAll<HTMLElement>('[data-area-step]')
  )

  const types = Array.from(
    section.value.querySelectorAll<HTMLElement>('[data-area-type]')
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

  if (map) {
    timeline.from(
      map,
      {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
        duration: 0.9,
        ease: 'power3.inOut'
      },
      0
    )
  }

  timeline.from(
    steps,
    {
      x: 18,
      opacity: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: 'power3.out'
    },
    0.35
  )

  timeline.from(
    types,
    {
      y: 18,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out'
    },
    0.58
  )
})
</script>

<template>
  <section
    id="area"
    ref="section"
    class="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32"
  >
    <div
      class="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8"
    >
      <div
        data-area-heading
        class="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20"
      >
        <h2
          class="max-w-[15ch] text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.04em] text-blue-950"
        >
          Daftarkan kawasan Anda dan mulai dari area pertama.
        </h2>

        <p
          class="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:justify-self-end"
        >
          Tentukan lokasi, titik pengumpulan, dan kebutuhan operasional.
          SAMPARA menggunakan struktur tersebut untuk membangun ruang kerja
          kawasan Anda.
        </p>
      </div>

      <div
        data-area-stage
        class="mt-14 grid grid-cols-1 gap-5 sm:mt-16 lg:mt-20 lg:grid-cols-12"
      >
        <div
          data-area-map
          class="relative min-h-[430px] overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50 shadow-[0_14px_40px_rgba(0,53,95,0.06)] sm:min-h-[540px] lg:col-span-7 lg:min-h-[620px]"
          role="img"
          aria-label="Peta kawasan operasional dengan batas wilayah dan titik pengumpulan"
        >
          <NuxtImg
            src="/home/area-registration-map.png"
            alt=""
            width="1400"
            height="1000"
            loading="lazy"
            draggable="false"
            class="absolute inset-0 h-full w-full object-cover object-center"
            aria-hidden="true"
          />

          <div
            class="absolute inset-x-0 top-0 z-20 border-b border-slate-200 bg-white px-5 py-5 sm:px-7 sm:py-6"
          >
            <div
              class="flex items-start justify-between gap-6"
            >
              <div>
                <p
                  class="text-sm font-semibold text-blue-950 sm:text-base"
                >
                  Tentukan wilayah layanan
                </p>

                <p
                  class="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs"
                >
                  Sesuaikan batas area dengan wilayah operasional yang akan
                  dikelola.
                </p>
              </div>
            </div>
          </div>

          <svg
            class="absolute inset-0 size-full"
            viewBox="0 0 660 540"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path
              d="M167 183L431 133L516 343L328 442L137 352Z"
              fill="#E3EBFE"
              fill-opacity="0.46"
              stroke="#005A9C"
              stroke-width="3"
              stroke-dasharray="9 7"
            />

            <path
              d="M214 326C280 302 315 214 382 222C432 228 444 298 482 318"
              stroke="#1F8A4C"
              stroke-width="4"
              stroke-linecap="round"
            />

            <g
              fill="#FFFFFF"
              stroke="#005A9C"
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
              class="block size-4 rounded-full border-[4px] border-white bg-yellow-500 shadow-[0_4px_10px_rgba(15,23,42,0.12)]"
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
              class="block size-4 rounded-full border-[4px] border-white bg-green-500 shadow-[0_4px_10px_rgba(15,23,42,0.12)]"
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
              class="block size-4 rounded-full border-[4px] border-white bg-red-500 shadow-[0_4px_10px_rgba(15,23,42,0.12)]"
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
              class="block size-4 rounded-full border-[4px] border-white bg-green-500 shadow-[0_4px_10px_rgba(15,23,42,0.12)]"
            />

            <span
              class="mt-1 block text-[9px] font-semibold text-slate-700"
            >
              BIN 04
            </span>
          </div>

          <div
            class="absolute bottom-5 left-5 z-20 border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-600 shadow-sm sm:bottom-7 sm:left-7 sm:text-xs"
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
              class="grid size-9 place-items-center border-b border-slate-200 text-lg text-blue-950 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
            >
              +
            </button>

            <button
              type="button"
              aria-label="Perkecil peta"
              class="grid size-9 place-items-center text-lg text-blue-950 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
            >
              −
            </button>
          </div>
        </div>

        <div
          class="flex flex-col overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white lg:col-span-5"
        >
          <div class="flex flex-1 flex-col">
            <div
              v-for="step in areaOnboardingSteps"
              :key="step.number"
              data-area-step
              class="group grid flex-1 grid-cols-[50px_minmax(0,1fr)] gap-4 border-b border-slate-200 px-5 py-6 transition-colors duration-300 last:border-b-0 hover:bg-slate-50 sm:grid-cols-[58px_minmax(0,1fr)] sm:px-7 sm:py-7"
            >
              <span
                class="text-2xl font-bold leading-none tracking-[-0.045em] text-blue-200 transition-colors duration-300 group-hover:text-blue-500 sm:text-3xl"
              >
                {{ step.number }}
              </span>

              <div class="min-w-0">
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
              class="group inline-flex min-h-12 w-full items-center justify-between rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(0,90,156,0.14)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_10px_22px_rgba(0,90,156,0.17)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:px-6 sm:text-base"
            >
              Daftarkan Area

              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </NuxtLink>
          </div>
        </div>

        <article
          v-for="area in areaTypes"
          :key="area.title"
          data-area-type
          class="group min-h-[190px] border-t border-slate-200 bg-white py-6 transition-transform duration-300 hover:-translate-y-0.5 sm:min-h-[210px] sm:py-7 lg:col-span-4"
        >
          <div
            class="flex h-full flex-col"
          >
            <div
              class="flex items-start justify-between gap-6"
            >
              <h3
                class="max-w-[18ch] text-lg font-semibold tracking-[-0.025em] text-blue-950 sm:text-xl"
              >
                {{ area.title }}
              </h3>

              <UIcon
                name="i-lucide-arrow-up-right"
                class="mt-1 size-4 shrink-0 text-slate-300 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600"
                aria-hidden="true"
              />
            </div>

            <p
              class="mt-4 max-w-sm text-sm leading-6 text-slate-600"
            >
              {{ area.description }}
            </p>

            <div
              class="mt-auto pt-8"
              aria-hidden="true"
            >
              <div
                class="h-px w-full bg-slate-200"
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>