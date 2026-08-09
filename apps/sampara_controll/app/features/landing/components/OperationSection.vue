<script setup lang="ts">
import { ref } from 'vue'
import { revealOnScroll, useLandingMotion } from '../composables/useLandingMotion'
import { currentOperationBins, prioritizedOperationBins } from '../constants/landingContent'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const heading = section.value.querySelector('[data-operation-heading]')
  const visual = section.value.querySelector('[data-operation-visual]')
  const bars = Array.from(section.value.querySelectorAll('[data-operation-bar]'))
  const priorities = Array.from(section.value.querySelectorAll('[data-priority-row]'))
  const route = section.value.querySelector('[data-operation-route]')

  if (heading) {
    revealOnScroll(gsap, Array.from(heading.children), heading, reduceMotion, 0.08)
  }

  if (!visual) {
    return
  }

  if (reduceMotion) {
    gsap.set([bars, priorities], { opacity: 1, scaleX: 1, x: 0 })
    gsap.set(route, { strokeDashoffset: 0 })
    return
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: visual,
      start: 'top 70%',
      once: true
    }
  })

  timeline
    .from(bars, {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out'
    })
    .from(priorities, {
      x: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.35')
    .fromTo(route, {
      strokeDashoffset: 1
    }, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power3.inOut'
    }, '-=0.45')
})
</script>

<template>
  <section
    ref="section"
    class="operation-surface relative overflow-hidden py-28 lg:py-36"
  >
    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div
        data-operation-heading
        class="grid gap-6 lg:grid-cols-[0.92fr_0.72fr] lg:items-end lg:justify-between"
      >
        <h2 class="max-w-[18ch] text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-blue-950">
          Tidak semua titik perlu dilayani pada waktu yang sama.
        </h2>
        <p class="max-w-xl text-lg leading-8 text-slate-600 lg:justify-self-end">
          Kondisi setiap titik berkembang secara berbeda. SAMPARA membantu operator memahami mana yang aman, mana yang perlu dipantau, dan mana yang harus menjadi prioritas berikutnya.
        </p>
      </div>

      <div
        data-operation-visual
        class="relative mt-16 grid gap-12 border-y border-slate-200/90 py-10 lg:mt-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-14 lg:py-14"
      >
        <div>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Operasi saat ini
              </p>
              <p class="mt-2 text-sm text-slate-500">
                Urutan berdasarkan jadwal tetap
              </p>
            </div>
            <span class="text-xs text-slate-400">08:40 WIB</span>
          </div>

          <div class="mt-10 space-y-9">
            <div
              v-for="bin in currentOperationBins"
              :key="bin.name"
            >
              <div class="mb-3 flex items-baseline justify-between">
                <span class="text-sm font-semibold text-slate-800">{{ bin.name }}</span>
                <span
                  class="text-2xl font-bold tracking-[-0.03em]"
                  :class="bin.value >= 85 ? 'text-red-600' : 'text-slate-800'"
                >
                  {{ bin.value }}%
                </span>
              </div>
              <div class="h-2 overflow-hidden bg-slate-200/80">
                <div
                  data-operation-bar
                  class="h-full"
                  :class="bin.color"
                  :style="{ width: `${bin.value}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative hidden w-20 items-center justify-center lg:flex"
          aria-hidden="true"
        >
          <div class="h-full w-px bg-slate-200" />
          <span class="absolute grid size-11 place-items-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 shadow-sm">
            <UIcon
              name="i-lucide-arrow-right"
              class="size-5"
            />
          </span>
        </div>

        <div
          class="flex items-center gap-4 lg:hidden"
          aria-hidden="true"
        >
          <div class="h-px flex-1 bg-slate-200" />
          <UIcon
            name="i-lucide-arrow-down"
            class="size-5 text-blue-600"
          />
          <div class="h-px flex-1 bg-slate-200" />
        </div>

        <div class="relative">
          <div class="flex items-end justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Operasi SAMPARA
              </p>
              <p class="mt-2 text-sm text-slate-500">
                Urutan berdasarkan kebutuhan aktual
              </p>
            </div>
            <span class="text-xs font-medium text-green-700">Siap direncanakan</span>
          </div>

          <div class="relative mt-7">
            <svg
              class="pointer-events-none absolute -left-5 top-0 h-full w-12 overflow-visible"
              viewBox="0 0 48 260"
              fill="none"
              aria-hidden="true"
            >
              <path
                data-operation-route
                pathLength="1"
                d="M7 24C31 24 30 58 30 92V206C30 224 36 237 44 243"
                stroke="#004992"
                stroke-width="2"
                stroke-dasharray="1"
                stroke-linecap="round"
              />
            </svg>

            <div
              v-for="(bin, index) in prioritizedOperationBins"
              :key="bin.name"
              data-priority-row
              class="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-200 py-5 first:pt-3 last:border-b-0"
            >
              <span
                class="text-xs font-semibold tabular-nums text-slate-400"
                :class="index === 0 ? 'text-blue-600' : ''"
              >
                0{{ index + 1 }}
              </span>
              <div>
                <p class="text-base font-semibold text-blue-950">
                  {{ bin.name }}
                </p>
                <p
                  class="mt-1 text-sm"
                  :class="bin.tone"
                >
                  {{ bin.state }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="hidden h-px w-12 sm:block"
                  :class="bin.line"
                />
                <strong
                  class="text-2xl tracking-[-0.03em]"
                  :class="bin.tone"
                >
                  {{ bin.value }}
                </strong>
              </div>
            </div>
          </div>

          <p class="mt-5 max-w-md text-sm leading-6 text-slate-500">
            Titik kritis menjadi awal keputusan. Titik lain tetap terpantau tanpa memaksa armada melakukan kunjungan yang belum dibutuhkan.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.operation-surface {
  background-color: white;
}
</style>
