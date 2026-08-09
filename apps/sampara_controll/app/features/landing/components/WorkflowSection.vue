<script setup lang="ts">
import { ref } from 'vue'
import {
  revealOnScroll,
  useLandingMotion
} from '../composables/useLandingMotion'
import { workflowSteps } from '../constants/landingContent'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const heading = section.value.querySelector<HTMLElement>(
    '[data-workflow-heading]'
  )

  const track = section.value.querySelector<HTMLElement>(
    '[data-workflow-track]'
  )

  const illustration = section.value.querySelector<HTMLElement>(
    '[data-workflow-illustration]'
  )

  const steps = Array.from(
    section.value.querySelectorAll<HTMLElement>('[data-workflow-step]')
  )

  const progressDesktop = section.value.querySelector<HTMLElement>(
    '[data-progress-desktop]'
  )

  const progressMobile = section.value.querySelector<HTMLElement>(
    '[data-progress-mobile]'
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

  if (!track) {
    return
  }

  if (reduceMotion) {
    gsap.set(steps, {
      opacity: 1,
      y: 0
    })

    if (illustration) {
      gsap.set(illustration, {
        opacity: 1,
        y: 0
      })
    }

    if (progressDesktop) {
      gsap.set(progressDesktop, {
        scaleX: 1
      })
    }

    if (progressMobile) {
      gsap.set(progressMobile, {
        scaleY: 1
      })
    }

    return
  }

  if (progressDesktop) {
    gsap.set(progressDesktop, {
      scaleX: 0,
      transformOrigin: 'left center'
    })
  }

  if (progressMobile) {
    gsap.set(progressMobile, {
      scaleY: 0,
      transformOrigin: 'center top'
    })
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: track,
      start: 'top 72%',
      once: true
    }
  })

  if (illustration) {
    timeline.from(
      illustration,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out'
      },
      0
    )
  }

  if (progressDesktop) {
    timeline.to(
      progressDesktop,
      {
        scaleX: 1,
        duration: 1.25,
        ease: 'power3.inOut'
      },
      0.12
    )
  }

  if (progressMobile) {
    timeline.to(
      progressMobile,
      {
        scaleY: 1,
        duration: 1.25,
        ease: 'power3.inOut'
      },
      0.12
    )
  }

  timeline.from(
    steps,
    {
      y: 24,
      opacity: 0,
      duration: 0.65,
      stagger: 0.14,
      ease: 'power3.out'
    },
    0.18
  )
})
</script>

<template>
  <section
    id="cara-kerja"
    ref="section"
    class="relative overflow-hidden bg-[#00345C] py-24 text-white sm:py-28 lg:py-32"
  >
    <div
      data-workflow-illustration
      class="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[68%] opacity-[0.08] lg:block"
      aria-hidden="true"
    >
      <NuxtImg
        src="/home/workflow-network.png"
        alt=""
        width="1800"
        height="650"
        loading="lazy"
        draggable="false"
        class="h-full w-full object-cover object-center"
      />
    </div>

    <div
      class="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8"
    >
      <div
        data-workflow-heading
        class="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20"
      >
        <h2
          class="max-w-[14ch] text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.04em] text-white"
        >
          Dari kondisi bin menjadi keputusan pengangkutan.
        </h2>

        <p
          class="max-w-xl text-base leading-7 text-blue-100/70 sm:text-lg sm:leading-8 lg:justify-self-end"
        >
          Data lapangan tidak berhenti sebagai grafik. SAMPARA mengubah kondisi
          aktual menjadi prediksi kebutuhan, prioritas pelayanan, dan rute
          armada.
        </p>
      </div>

      <div
        data-workflow-track
        class="relative mt-16 sm:mt-20 lg:mt-24"
      >
        <div
          class="absolute bottom-3 left-[13px] top-[13px] w-px bg-white/15 lg:hidden"
          aria-hidden="true"
        >
          <div
            data-progress-mobile
            class="h-full w-full origin-top scale-y-0 bg-[#8BCDF2]"
          />
        </div>

        <div
          class="absolute left-[14px] right-[14px] top-[13px] hidden h-px bg-white/15 lg:block"
          aria-hidden="true"
        >
          <div
            data-progress-desktop
            class="h-full w-full origin-left scale-x-0 bg-[#8BCDF2]"
          />
        </div>

        <div
          class="grid gap-12 lg:grid-cols-4 lg:gap-8 xl:gap-10"
        >
          <article
            v-for="(step, index) in workflowSteps"
            :key="step.number"
            data-workflow-step
            class="relative min-w-0 pl-14 lg:pl-0"
          >
            <span
              class="absolute left-0 top-0 grid size-7 place-items-center rounded-full border border-[#8BCDF2]/60 bg-[#00345C] shadow-[0_0_0_5px_#00345C] lg:left-0"
              aria-hidden="true"
            >
              <span
                class="size-2 rounded-full bg-[#8BCDF2]"
              />
            </span>

            <div
              class="lg:mt-12"
              :class="index % 2 === 1 ? 'lg:mt-18' : ''"
            >
              <div
                class="flex items-end justify-between gap-4 border-b border-white/15 pb-5"
              >
                <span
                  class="text-4xl font-bold leading-none tracking-[-0.05em] sm:text-5xl"
                  :class="step.color"
                >
                  {{ step.number }}
                </span>

                <span
                  class="pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/50 sm:text-xs"
                >
                  {{ step.label }}
                </span>
              </div>

              <h3
                class="mt-5 max-w-[18ch] text-lg font-semibold leading-7 text-white sm:mt-6 sm:text-xl"
              >
                {{ step.title }}
              </h3>

              <p
                class="mt-3 max-w-[30ch] text-sm leading-6 text-blue-100/65 sm:mt-4"
              >
                {{ step.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>