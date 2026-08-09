<script setup lang="ts">
import { ref } from 'vue'
import { revealOnScroll, useLandingMotion } from '../composables/useLandingMotion'

const section = ref<HTMLElement | null>(null)

const steps = [
  {
    number: '01',
    label: 'Condition',
    title: 'Pahami kondisi setiap titik.',
    description: 'Berat dan tingkat kepenuhan dipantau secara berkala dari perangkat lapangan.',
    metric: 'Berat · Kepenuhan',
    color: 'text-data'
  },
  {
    number: '02',
    label: 'Prediction',
    title: 'Lihat apa yang akan terjadi berikutnya.',
    description: 'Sistem memperkirakan bagaimana kondisi bin berkembang, termasuk estimasi ketika kendaraan tiba.',
    metric: 'Prediksi · ETA',
    color: 'text-blue-200'
  },
  {
    number: '03',
    label: 'Priority',
    title: 'Tentukan titik yang benar-benar perlu dilayani.',
    description: 'Prediksi diterjemahkan menjadi kebutuhan pelayanan, estimasi muatan, prioritas, dan tenggat.',
    metric: 'Prioritas · Tenggat',
    color: 'text-yellow-300'
  },
  {
    number: '04',
    label: 'Route',
    title: 'Susun perjalanan berdasarkan kondisi operasional.',
    description: 'Armada dan urutan kunjungan disusun dengan mempertimbangkan kapasitas dan kondisi lalu lintas.',
    metric: 'Armada · Urutan',
    color: 'text-green-300'
  }
]

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const heading = section.value.querySelector('[data-workflow-heading]')
  const track = section.value.querySelector('[data-workflow-track]')
  const stepElements = Array.from(section.value.querySelectorAll('[data-workflow-step]'))
  const desktopProgress = section.value.querySelector('[data-progress-desktop]')
  const mobileProgress = section.value.querySelector('[data-progress-mobile]')

  if (heading) {
    revealOnScroll(gsap, Array.from(heading.children), heading, reduceMotion, 0.08)
  }

  if (!track) {
    return
  }

  if (reduceMotion) {
    gsap.set(stepElements, { opacity: 1, y: 0 })
    gsap.set([desktopProgress, mobileProgress], { scaleX: 1, scaleY: 1 })
    return
  }

  gsap.set(stepElements, { opacity: 0.35 })
  const media = gsap.matchMedia()

  media.add('(min-width: 1024px)', () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: 'top 72%',
        end: 'bottom 72%',
        scrub: 0.8
      }
    })

    timeline.to(desktopProgress, {
      scaleX: 1,
      transformOrigin: 'left',
      duration: 4,
      ease: 'none'
    }, 0)

    stepElements.forEach((step, index) => {
      timeline.to(step, {
        opacity: 1,
        y: -4,
        duration: 0.65,
        ease: 'power2.out'
      }, index * 0.9)
    })
  })

  media.add('(max-width: 1023px)', () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: 'top 72%',
        end: 'bottom 72%',
        scrub: 0.8
      }
    })

    timeline.to(mobileProgress, {
      scaleY: 1,
      transformOrigin: 'top',
      duration: 4,
      ease: 'none'
    }, 0)

    stepElements.forEach((step, index) => {
      timeline.to(step, {
        opacity: 1,
        x: 4,
        duration: 0.65,
        ease: 'power2.out'
      }, index * 0.9)
    })
  })

  return () => media.revert()
})
</script>

<template>
  <section
    id="cara-kerja"
    ref="section"
    class="workflow-surface relative overflow-hidden py-32 text-white lg:py-40"
  >
    <div
      class="pointer-events-none absolute left-[46%] top-[18%] size-[34rem] rounded-full bg-blue-600/20 blur-[110px]"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div
        data-workflow-heading
        class="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end"
      >
        <h2 class="max-w-[17ch] text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-white">
          Dari kondisi bin menjadi keputusan pengangkutan.
        </h2>
        <p class="max-w-xl text-lg leading-8 text-blue-100/72 lg:justify-self-end">
          Data lapangan tidak berhenti sebagai grafik. SAMPARA mengubah kondisi aktual menjadi prediksi kebutuhan, prioritas pelayanan, dan rute armada.
        </p>
      </div>

      <div
        data-workflow-track
        class="relative mt-20 lg:mt-28"
      >
        <div
          class="absolute bottom-3 left-[13px] top-[13px] w-px bg-white/15 lg:hidden"
          aria-hidden="true"
        >
          <div
            data-progress-mobile
            class="h-full w-full origin-top scale-y-0 bg-data"
          />
        </div>

        <div
          class="absolute left-[14px] right-[14px] top-[13px] hidden h-px bg-white/15 lg:block"
          aria-hidden="true"
        >
          <div
            data-progress-desktop
            class="h-full w-full origin-left scale-x-0 bg-data"
          />
        </div>

        <div class="grid gap-14 lg:grid-cols-4 lg:gap-8">
          <article
            v-for="(step, index) in steps"
            :key="step.number"
            data-workflow-step
            class="relative min-w-0 pl-14 lg:pl-0"
          >
            <span
              class="absolute left-0 top-0 grid size-7 place-items-center rounded-full border border-data/60 bg-blue-950 shadow-[0_0_0_8px_rgba(0,35,63,0.96)] lg:left-0"
              aria-hidden="true"
            >
              <span class="size-2 rounded-full bg-data" />
            </span>

            <div
              class="step-content lg:mt-12"
              :class="index % 2 === 1 ? 'lg:mt-20' : ''"
            >
              <div class="flex items-end justify-between gap-4 border-b border-white/15 pb-5">
                <span
                  class="text-5xl font-bold leading-none tracking-[-0.05em]"
                  :class="step.color"
                >
                  {{ step.number }}
                </span>
                <span class="pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/55">
                  {{ step.label }}
                </span>
              </div>

              <h3 class="mt-6 text-xl font-semibold leading-7 text-white">
                {{ step.title }}
              </h3>
              <p class="mt-4 text-sm leading-6 text-blue-100/68">
                {{ step.description }}
              </p>
              <p
                class="mt-7 text-xs font-semibold uppercase tracking-[0.16em]"
                :class="step.color"
              >
                {{ step.metric }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.workflow-surface {
  background:
    radial-gradient(circle at 60% 40%, rgba(15, 76, 129, 0.65), transparent 45%),
    linear-gradient(145deg, var(--color-blue-950), var(--color-slate-950));
}
</style>
