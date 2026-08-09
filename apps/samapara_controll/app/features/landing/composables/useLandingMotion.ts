import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted } from 'vue'

type Gsap = typeof import('gsap')['gsap']
type ScrollTrigger = typeof import('gsap/ScrollTrigger')['ScrollTrigger']
type MotionTarget = Element | Element[] | NodeListOf<Element>

interface LandingMotionContext {
  gsap: Gsap
  ScrollTrigger: ScrollTrigger
  reduceMotion: boolean
}

type MotionSetup = (context: LandingMotionContext) => void | (() => void)

export function useLandingMotion(root: Ref<HTMLElement | null>, setup: MotionSetup) {
  let cleanup: void | (() => void)
  let context: { revert: () => void } | undefined
  let disposed = false

  onMounted(async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ])

    if (disposed || !root.value) {
      return
    }

    gsap.registerPlugin(ScrollTrigger)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    context = gsap.context(() => {
      cleanup = setup({ gsap, ScrollTrigger, reduceMotion })
    }, root.value)

    ScrollTrigger.refresh()
  })

  onBeforeUnmount(() => {
    disposed = true
    cleanup?.()
    context?.revert()
  })
}

export function revealOnScroll(
  gsap: Gsap,
  target: MotionTarget,
  trigger: Element,
  reduceMotion: boolean,
  stagger = 0
) {
  return gsap.from(target, {
    y: reduceMotion ? 0 : 28,
    opacity: 0,
    duration: reduceMotion ? 0.25 : 0.75,
    stagger: reduceMotion ? 0 : stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger,
      start: 'top 78%',
      once: true
    }
  })
}
