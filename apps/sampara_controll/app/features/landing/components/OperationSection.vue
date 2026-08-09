<script setup lang="ts">
import { ref, computed } from 'vue'
import { revealOnScroll, useLandingMotion } from '../composables/useLandingMotion'
import { currentOperationBins, prioritizedOperationBins } from '../constants/landingContent'

interface Bin {
  name: string
  value: number
  color?: string
  tone?: string
  state?: string
  line?: string
}

const section = ref<HTMLElement | null>(null)

const getValueColor = (value: number): string => {
  if (value >= 85) return 'text-red-600'
  if (value >= 60) return 'text-yellow-700'
  return 'text-green-700'
}

const getBarColor = (value: number): string => {
  if (value >= 85) return 'bg-red-600'
  if (value >= 60) return 'bg-yellow-500'
  return 'bg-green-600'
}

const currentBins = computed(() =>
  currentOperationBins.map((bin: Bin) => ({
    ...bin,
    textColor: getValueColor(bin.value),
    barColor: getBarColor(bin.value)
  }))
)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) return

  const heading = section.value.querySelector<HTMLElement>('[data-operation-heading]')
  const visual = section.value.querySelector<HTMLElement>('[data-operation-visual]')
  const illustration = section.value.querySelector<HTMLElement>('[data-operation-illustration]')
  const bars = Array.from(section.value.querySelectorAll<HTMLElement>('[data-operation-bar]'))
  const route = section.value.querySelector<SVGPathElement>('[data-operation-route]')
  const priorityRows = Array.from(section.value.querySelectorAll<HTMLElement>('[data-priority-row]'))

  if (heading) {
    revealOnScroll(gsap, Array.from(heading.children), heading, reduceMotion, 0.08)
  }

  if (!visual) return

  if (reduceMotion) {
    gsap.set(bars, { scaleX: 1, opacity: 1 })
    gsap.set(priorityRows, { opacity: 1, y: 0 })
    if (route) gsap.set(route, { strokeDashoffset: 0 })
    if (illustration) gsap.set(illustration, { opacity: 1, y: 0 })
    return
  }

  gsap.set(bars, { scaleX: 0, transformOrigin: 'left center' })
  if (route) gsap.set(route, { strokeDashoffset: 1 })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: visual, start: 'top 72%', once: true }
  })

  tl.from(illustration, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0)
    .to(bars, { scaleX: 1, duration: 0.8, stagger: 0.14, ease: 'power3.out' }, 0.08)

  if (route) {
    tl.to(route, { strokeDashoffset: 0, duration: 1, ease: 'power3.inOut' }, 0.42)
  }

  tl.from(priorityRows, { y: 18, opacity: 0, duration: 0.55, stagger: 0.12, ease: 'power3.out' }, 0.58)
})
</script>

<template>
  <section
    id="operasi"
    ref="section"
    class="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32"
  >
    <div class="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
      <div
        data-operation-heading
        class="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20"
      >
        <h2 class="max-w-[15ch] text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.04em] text-blue-950">
          Tidak semua titik perlu dilayani pada waktu yang sama.
        </h2>
        <p class="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:justify-self-end">
          Kondisi setiap titik berkembang secara berbeda. SAMPARA membantu operator memahami mana yang aman, mana yang perlu dipantau, dan mana yang harus menjadi prioritas berikutnya.
        </p>
      </div>

      <div
        data-operation-visual
        class="relative mt-14 overflow-hidden border-y border-slate-200 py-10 sm:mt-16 sm:py-12 lg:mt-20 lg:py-14"
      >
        <div
          data-operation-illustration
          class="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[75%] items-end justify-center opacity-[0.055] lg:flex"
          aria-hidden="true"
        >
          <NuxtImg
            src="/home/operation-points.png"
            alt=""
            width="1400"
            height="700"
            loading="lazy"
            draggable="false"
            class="h-full w-full object-contain object-bottom"
          />
        </div>

        <div class="relative z-10 grid gap-12 lg:grid-cols-[1fr_72px_1fr] lg:gap-10 xl:grid-cols-[1fr_88px_1fr] xl:gap-14">
          <div class="min-w-0">
            <div class="flex items-end justify-between gap-6">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.17em] text-slate-500 sm:text-xs">
                  Operasi saat ini
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-500">
                  Urutan berdasarkan jadwal tetap
                </p>
              </div>
              <span class="shrink-0 text-xs tabular-nums text-slate-400">
                08:40 WIB
              </span>
            </div>

            <div class="mt-9 space-y-8 sm:mt-10 sm:space-y-9">
              <div v-for="bin in currentBins" :key="bin.name">
                <div class="mb-3 flex items-baseline justify-between gap-5">
                  <span class="text-sm font-semibold text-blue-950">
                    {{ bin.name }}
                  </span>
                  <span
                    class="text-xl font-bold tabular-nums tracking-[-0.03em] sm:text-2xl"
                    :class="bin.textColor"
                  >
                    {{ bin.value }}%
                  </span>
                </div>
                <div
                  class="h-1.5 overflow-hidden rounded-full bg-slate-100 sm:h-2"
                  :aria-label="`${bin.name} ${bin.value}%`"
                  role="img"
                >
                  <div
                    data-operation-bar
                    class="h-full rounded-full"
                    :class="bin.barColor"
                    :style="{ width: `${bin.value}%` }"
                  />
                </div>
              </div>
            </div>

            <div class="mt-9 border-t border-slate-100 pt-5 sm:mt-10">
              <p class="max-w-md text-sm leading-6 text-slate-500">
                Jadwal tetap memperlakukan urutan pelayanan sebagai keputusan yang sudah ditentukan sebelum kebutuhan aktual setiap titik diketahui.
              </p>
            </div>
          </div>

          <div class="relative hidden items-center justify-center lg:flex" aria-hidden="true">
            <div class="h-full w-px bg-slate-200" />
            <span class="absolute grid size-10 place-items-center rounded-full border border-blue-200 bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,53,95,0.08)]">
              <UIcon name="i-lucide-arrow-right" class="size-4" />
            </span>
          </div>

          <div class="flex items-center gap-4 lg:hidden" aria-hidden="true">
            <div class="h-px flex-1 bg-slate-200" />
            <span class="grid size-9 place-items-center rounded-full border border-blue-200 bg-white text-blue-600">
              <UIcon name="i-lucide-arrow-down" class="size-4" />
            </span>
            <div class="h-px flex-1 bg-slate-200" />
          </div>

          <div class="relative min-w-0">
            <div class="flex items-end justify-between gap-5">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.17em] text-blue-700 sm:text-xs">
                  Operasi SAMPARA
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-500">
                  Urutan berdasarkan kebutuhan aktual
                </p>
              </div>
              <span class="shrink-0 text-xs font-medium text-green-700">
                Siap direncanakan
              </span>
            </div>

            <div class="relative mt-7 sm:mt-8">
              <svg
                class="pointer-events-none absolute -left-3 top-0 hidden h-full w-10 overflow-visible sm:block"
                viewBox="0 0 48 260"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  data-operation-route
                  pathLength="1"
                  d="M7 24C31 24 30 58 30 92V206C30 224 36 237 44 243"
                  stroke="#005A9C"
                  stroke-width="2"
                  stroke-dasharray="1"
                  stroke-linecap="round"
                />
              </svg>

              <div
                v-for="(bin, index) in prioritizedOperationBins"
                :key="bin.name"
                data-priority-row
                class="relative grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-200 py-5 first:pt-3 last:border-b-0 sm:grid-cols-[38px_minmax(0,1fr)_auto] sm:gap-4"
              >
                <span
                  class="text-xs font-semibold tabular-nums"
                  :class="index === 0 ? 'text-blue-600' : 'text-slate-400'"
                >
                  0{{ index + 1 }}
                </span>

                <div class="min-w-0">
                  <p class="text-sm font-semibold text-blue-950 sm:text-base">
                    {{ bin.name }}
                  </p>
                  <p
                    class="mt-1 text-xs font-medium sm:text-sm"
                    :class="bin.tone"
                  >
                    {{ bin.state }}
                  </p>
                </div>

                <div class="flex items-center gap-3">
                  <span
                    class="hidden h-px w-8 sm:block lg:w-10 xl:w-12"
                    :class="bin.line"
                  />
                  <strong
                    class="text-xl font-bold tabular-nums tracking-[-0.03em] sm:text-2xl"
                    :class="bin.tone"
                  >
                    {{ bin.value }}
                  </strong>
                </div>
              </div>
            </div>

            <p class="mt-5 max-w-lg text-sm leading-6 text-slate-500">
              Titik kritis menjadi awal keputusan. Titik lain tetap terpantau tanpa memaksa armada melakukan kunjungan yang belum dibutuhkan.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
