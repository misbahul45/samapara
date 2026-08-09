<script setup lang="ts">
import { ref } from 'vue'
import { useLandingMotion } from '../composables/useLandingMotion'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const copy = Array.from(
    section.value.querySelectorAll<HTMLElement>('[data-hero-copy] > *')
  )

  const visual = section.value.querySelector<HTMLElement>(
    '[data-hero-background]'
  )

  if (reduceMotion) {
    gsap.set(copy, {
      opacity: 1,
      y: 0
    })

    if (visual) {
      gsap.set(visual, {
        opacity: 1,
        scale: 1
      })
    }

    return
  }

  const timeline = gsap.timeline()

  if (visual) {
    timeline.fromTo(
      visual,
      {
        opacity: 0,
        scale: 1.025
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.35,
        ease: 'power3.out'
      },
      0
    )
  }

  timeline.from(
    copy,
    {
      y: 28,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    },
    0.15
  )
})
</script>

<template>
  <section
    ref="section"
    class="relative flex min-h-screen items-center overflow-hidden bg-blue-50 pb-20 pt-32 sm:pt-36 lg:pb-24 lg:pt-32"
  >
    <div
      data-hero-background
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <NuxtImg
        src="/home/bg-hero.png"
        alt=""
        width="1536"
        height="1024"
        loading="eager"
        fetchpriority="high"
        draggable="false"
        class="absolute inset-0 h-full w-full object-cover object-right"
      />
    </div>

    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-blue-50 via-blue-50/95 to-transparent sm:w-[90%] lg:w-[68%]"
    />

    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-[48%] bg-blue-50/70 blur-3xl sm:w-[42%] lg:w-[36%]"
    />

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-blue-50/80 to-transparent"
    />

    <div
      class="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8"
    >
      <div
        data-hero-copy
        class="max-w-3xl lg:max-w-[52%]"
      >
        <h1
          class="max-w-[14ch] text-[clamp(2.375rem,6vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.045em] text-blue-950"
        >
          Kelola pengangkutan sesuai kebutuhan kawasan.
        </h1>

        <p
          class="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-8"
        >
          SAMPARA membantu kota dan kawasan memantau kondisi tempat sampah,
          memprediksi kebutuhan pengangkutan, menentukan prioritas, dan
          merencanakan rute armada dalam satu platform operasional.
        </p>

        <div
          class="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <NuxtLink
            to="/register-area"
            class="inline-flex min-h-13 items-center justify-center rounded-lg bg-blue-500 px-6 text-base font-semibold text-white shadow-[0_6px_16px_rgba(15,76,129,0.14)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-[0_10px_24px_rgba(15,76,129,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Daftarkan Area
          </NuxtLink>

          <NuxtLink
            to="/#cara-kerja"
            class="group inline-flex min-h-13 items-center justify-center gap-2 px-4 text-base font-semibold text-blue-950 transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Lihat Cara Kerja

            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>