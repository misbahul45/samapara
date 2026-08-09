<script setup lang="ts">
import { ref } from 'vue'
import { useLandingMotion } from '../composables/useLandingMotion'

const section = ref<HTMLElement | null>(null)

useLandingMotion(section, ({ gsap, reduceMotion }) => {
  if (!section.value) {
    return
  }

  const copy = Array.from(
    section.value.querySelectorAll<HTMLElement>(
      '[data-hero-copy] > *'
    )
  )

  const truck = section.value.querySelector<HTMLElement>(
    '[data-hero-truck]'
  )

  if (reduceMotion) {
    gsap.set(copy, {
      opacity: 1,
      y: 0
    })

    if (truck) {
      gsap.set(truck, {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0
      })
    }

    return
  }

  gsap.from(copy, {
    y: 22,
    opacity: 0,
    duration: 0.72,
    stagger: 0.08,
    ease: 'power3.out'
  })

  if (!truck) {
    return
  }

  gsap.from(truck, {
    opacity: 0,
    scale: 0.85,
    duration: 0.8,
    delay: 0.4,
    ease: 'power3.out'
  })

  const truckTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: section.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.1,
      invalidateOnRefresh: true
    }
  })

  truckTimeline
    .to(truck, {
      x: -80,
      y: -36,
      rotation: -5,
      duration: 1,
      ease: 'none'
    })
    .to(truck, {
      x: -165,
      y: -92,
      rotation: -16,
      duration: 1,
      ease: 'none'
    })
    .to(truck, {
      x: -245,
      y: -138,
      rotation: -5,
      duration: 1,
      ease: 'none'
    })
    .to(truck, {
      x: -320,
      y: -205,
      rotation: -18,
      duration: 1,
      ease: 'none'
    })
})
</script>

<template>
  <section
    ref="section"
    class="relative flex min-h-screen items-center overflow-hidden bg-blue-50 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-32"
  >
    <div
      class="pointer-events-none absolute inset-0 hidden lg:block"
      aria-hidden="true"
    >
      <div
        class="absolute inset-y-0 right-0 w-[62%] overflow-hidden bg-[#f5f9fc]"
      >
        <img
          src="/home/hero-environment.png"
          alt=""
          width="2048"
          height="1152"
          fetchpriority="high"
          decoding="async"
          draggable="false"
          class="absolute inset-0 h-full w-full object-cover object-[72%_center] opacity-[0.94] brightness-[1.06] saturate-[0.82]"
        >

        <div
          class="absolute inset-0 bg-white/6"
        />

        <div
          data-hero-truck
          class="absolute bottom-[15%] right-[9%] z-20  w-[115px] origin-center xl:w-[135px] 2xl:w-[150px]"
        >
          <img
            src="/home/truck.png"
            alt=""
            width="1024"
            height="768"
            fetchpriority="high"
            decoding="async"
            draggable="false"
            class="h-auto w-full object-contain drop-shadow-[0_10px_12px_rgba(0,53,95,0.16)]"
          >
        </div>
      </div>

      <div
        class="absolute inset-y-0 left-0 w-[43%] bg-blue-50"
      />

      <div
        class="absolute inset-y-0 left-[43%] w-[12%] bg-blue-50/50"
      />
    </div>

    <div
      class="pointer-events-none absolute inset-0 lg:hidden"
      aria-hidden="true"
    >
      <img
        src="/home/hero-environment.png"
        alt=""
        width="2048"
        height="1152"
        fetchpriority="high"
        decoding="async"
        draggable="false"
        class="absolute inset-0 h-full w-full object-cover object-[72%_center] opacity-[0.2] brightness-110 saturate-75"
      >

      <div
        class="absolute inset-0 bg-blue-50/70"
      />
    </div>

    <div
      class="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8"
    >
      <div
        data-hero-copy
        class="max-w-[580px] lg:max-w-[43%]"
      >
        <h1
          class="max-w-[13ch] text-[clamp(2.15rem,4.6vw,3.5rem)] font-bold leading-[1.03] tracking-[-0.04em] text-blue-950"
        >
          Kelola pengangkutan sesuai kebutuhan kawasan.
        </h1>

        <p
          class="mt-6 max-w-[560px] text-base leading-7 text-slate-600 sm:text-[1.0625rem] sm:leading-8"
        >
          SAMPARA membantu kota dan kawasan memantau kondisi tempat sampah,
          memprediksi kebutuhan pengangkutan, menentukan prioritas, dan
          merencanakan rute armada dalam satu platform operasional.
        </p>

        <div
          class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <NuxtLink
            to="/register-area"
            class="inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(0,90,156,0.12)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_10px_22px_rgba(0,90,156,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:text-base"
          >
            Daftarkan Area
          </NuxtLink>

          <NuxtLink
            to="/#cara-kerja"
            class="group inline-flex min-h-12 items-center justify-center gap-2 px-4 text-sm font-semibold text-blue-950 transition-colors duration-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:text-base"
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