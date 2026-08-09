<script setup lang="ts">
import { ref } from 'vue'
import { useLandingMotion } from '../composables/useLandingMotion'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const copy = Array.from(section.value.querySelectorAll('[data-hero-copy] > *'))
  const visual = section.value.querySelector('[data-hero-visual]')
  const route = section.value.querySelector('[data-hero-route]')
  const telemetry = Array.from(section.value.querySelectorAll('[data-telemetry-point]'))

  if (reduceMotion) {
    gsap.from([...copy, visual], {
      opacity: 0,
      duration: 0.3,
      stagger: 0.04,
      ease: 'power2.out'
    })
    gsap.set(route, { strokeDashoffset: 0 })
    return
  }

  const timeline = gsap.timeline()

  timeline
    .from(copy, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    })
    .from(visual, {
      y: 36,
      scale: 0.97,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, 0.2)
    .fromTo(route, {
      strokeDashoffset: 1
    }, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: 'power3.inOut'
    }, 0.65)
    .from(telemetry, {
      scale: 0.72,
      opacity: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power2.out'
    }, 0.75)
})
</script>

<template>
  <section
    ref="section"
    class="hero-surface relative flex min-h-screen items-center overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-24 lg:pt-32"
  >
    <div class="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:gap-12 lg:px-8">
      <div
        data-hero-copy
        class="max-w-3xl"
      >
        <h1 class="max-w-[14ch] text-[clamp(2.375rem,6vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.045em] text-blue-950">
          Kelola pengangkutan sesuai kebutuhan kawasan.
        </h1>

        <p class="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-8">
          SAMPARA membantu kota dan kawasan memantau kondisi tempat sampah, memprediksi kebutuhan pengangkutan, menentukan prioritas, dan merencanakan rute armada dalam satu platform operasional.
        </p>

        <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/register-area"
            class="inline-flex min-h-13 items-center justify-center rounded-lg bg-blue-500 px-6 text-base font-semibold text-white shadow-[0_6px_16px_rgba(15,76,129,0.14)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Daftarkan Area
          </a>
          <NuxtLink
            to="/#cara-kerja"
            class="group inline-flex min-h-13 items-center justify-center gap-2 px-4 text-base font-semibold text-blue-950 transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Lihat Cara Kerja
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
      </div>

      <div
        data-hero-visual
        class="relative mx-auto w-full max-w-[640px]"
      >
        <div
          class="operational-map relative aspect-[1.08/1] overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_12px_28px_rgba(0,53,95,0.08)]"
          role="img"
          aria-label="Pratinjau area operasional dengan empat titik bin, telemetry kepenuhan, kendaraan, dan rute aktif"
        >
          <div class="absolute inset-x-6 top-5 z-20 flex items-center justify-between border-b border-slate-200/80 pb-4 sm:inset-x-8 sm:top-7">
            <div>
              <p class="text-sm font-semibold text-blue-950 sm:text-base">
                Area Operasional Utama
              </p>
              <p class="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                Diperbarui 32 detik lalu
              </p>
            </div>
            <div class="flex items-center gap-2 text-xs font-medium text-green-700">
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-50 motion-reduce:animate-none" />
                <span class="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
              Data aktif
            </div>
          </div>

          <svg
            class="absolute inset-0 size-full"
            viewBox="0 0 640 590"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M-24 182C92 146 180 161 254 126C360 75 423 107 683 33"
              stroke="#E3EBFE"
              stroke-width="18"
            />
            <path
              d="M-38 453C81 421 139 333 234 356C346 383 411 528 685 460"
              stroke="#E3EBFE"
              stroke-width="22"
            />
            <path
              d="M97 -20C135 102 113 174 148 238C201 334 314 342 328 621"
              stroke="#F0F3FF"
              stroke-width="14"
            />
            <path
              d="M517 -20C498 107 468 189 491 278C514 367 570 421 548 619"
              stroke="#F0F3FF"
              stroke-width="12"
            />
            <path
              d="M-24 182C92 146 180 161 254 126C360 75 423 107 683 33"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-dasharray="8 10"
            />
            <path
              d="M-38 453C81 421 139 333 234 356C346 383 411 528 685 460"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-dasharray="8 10"
            />
            <path
              d="M104 370C162 337 198 288 264 270C347 248 396 187 424 145C450 104 476 185 474 269C471 351 404 398 345 451"
              stroke="#0F4C81"
              stroke-width="7"
              stroke-linecap="round"
              opacity="0.14"
            />
            <path
              data-hero-route
              pathLength="1"
              d="M104 370C162 337 198 288 264 270C347 248 396 187 424 145C450 104 476 185 474 269C471 351 404 398 345 451"
              stroke="#004992"
              stroke-width="4"
              stroke-linecap="round"
              stroke-dasharray="1"
            />
            <path
              d="M307 198L319 187L326 202"
              stroke="#004992"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <div class="absolute left-[9%] top-[31%] text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
            Gedung A
          </div>
          <div class="absolute right-[9%] top-[41%] text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
            Gudang
          </div>
          <div class="absolute bottom-[18%] left-[15%] text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
            Gerbang selatan
          </div>

          <div
            data-telemetry-point
            class="absolute left-[10%] top-[57%] z-10"
          >
            <div class="map-point map-point-warning">
              <span />
            </div>
            <div class="map-label -translate-x-1/4">
              <span>BIN 01</span>
              <strong class="text-yellow-700">78%</strong>
            </div>
          </div>

          <div
            data-telemetry-point
            class="absolute left-[49%] top-[23%] z-10"
          >
            <div class="map-point map-point-normal">
              <span />
            </div>
            <div class="map-label -translate-x-1/3">
              <span>BIN 04</span>
              <strong class="text-green-700">56%</strong>
            </div>
          </div>

          <div
            data-telemetry-point
            class="absolute right-[16%] top-[46%] z-10"
          >
            <div class="map-point map-point-normal">
              <span />
            </div>
            <div class="map-label -translate-x-1/3">
              <span>BIN 03</span>
              <strong class="text-green-700">41%</strong>
            </div>
          </div>

          <div
            data-telemetry-point
            class="absolute bottom-[18%] left-[52%] z-10"
          >
            <div class="map-point map-point-critical">
              <span />
            </div>
            <div class="map-label -translate-x-1/3">
              <span>BIN 02</span>
              <strong class="text-red-600">91%</strong>
            </div>
          </div>

          <div class="absolute bottom-[31%] left-[41%] z-10 flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-2.5 py-2 shadow-[0_4px_12px_rgba(0,73,146,0.12)] sm:px-3">
            <span class="flex size-7 items-center justify-center rounded-md bg-blue-500 text-white">
              <UIcon
                name="i-lucide-truck"
                class="size-4"
                aria-hidden="true"
              />
            </span>
            <span class="hidden text-[11px] font-semibold text-blue-950 sm:block">ARM-07</span>
          </div>

          <div class="absolute inset-x-5 bottom-4 z-20 flex items-center justify-between gap-3 rounded-xl border border-white/90 bg-white/82 px-3 py-2.5 backdrop-blur-md sm:inset-x-8 sm:bottom-6 sm:px-4">
            <div class="flex items-center gap-2 text-[10px] text-slate-600 sm:text-xs">
              <span class="size-2 rounded-full bg-green-500" />
              Normal
            </div>
            <div class="flex items-center gap-2 text-[10px] text-slate-600 sm:text-xs">
              <span class="size-2 rounded-full bg-yellow-500" />
              Pantau
            </div>
            <div class="flex items-center gap-2 text-[10px] text-slate-600 sm:text-xs">
              <span class="size-2 rounded-full bg-red-500" />
              Prioritas
            </div>
            <div class="flex items-center gap-2 text-[10px] text-slate-600 sm:text-xs">
              <span class="h-0.5 w-4 bg-blue-600" />
              Rute
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-surface {
  background-color: var(--color-blue-50);
}

.operational-map {
  background-color: white;
}

.map-point {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border: 4px solid white;
  border-radius: 9999px;
  box-shadow: 0 3px 10px rgba(16, 28, 47, 0.14);
}

.map-point span {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: white;
}

.map-point-normal {
  background: var(--color-green-500);
}

.map-point-warning {
  background: var(--color-yellow-500);
}

.map-point-critical {
  background: var(--color-red-500);
}

.map-label {
  position: absolute;
  top: 24px;
  left: 50%;
  display: flex;
  min-width: 74px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid rgba(194, 199, 209, 0.72);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  padding: 5px 7px;
  color: var(--color-slate-600);
  font-size: 9px;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(16, 28, 47, 0.06);
}

.map-label strong {
  font-size: 10px;
}

@media (min-width: 640px) {
  .map-label {
    min-width: 92px;
    padding: 7px 8px;
    font-size: 10px;
  }

  .map-label strong {
    font-size: 11px;
  }
}
</style>
