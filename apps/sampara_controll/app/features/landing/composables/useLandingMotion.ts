import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted } from 'vue'

type Gsap = typeof import('gsap')['gsap']
type ScrollTriggerPlugin =
  typeof import('gsap/ScrollTrigger')['ScrollTrigger']
type MotionPathPluginType =
  typeof import('gsap/MotionPathPlugin')['MotionPathPlugin']

type MotionTarget =
  | Element
  | Element[]
  | NodeListOf<Element>

interface LandingMotionContext {
  gsap: Gsap
  ScrollTrigger: ScrollTriggerPlugin
  MotionPathPlugin: MotionPathPluginType
  reduceMotion: boolean
}

type MotionSetup = (
  context: LandingMotionContext
) => void | (() => void)

export function useLandingMotion(
  root: Ref<HTMLElement | null>,
  setup: MotionSetup
) {
  let cleanup: (() => void) | undefined
  let context: ReturnType<Gsap['context']> | undefined
  let refreshFrame: number | undefined
  let disposed = false

  onMounted(async () => {
    const [
      { gsap },
      { ScrollTrigger },
      { MotionPathPlugin }
    ] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/MotionPathPlugin')
    ])

    if (disposed || !root.value) {
      return
    }

    gsap.registerPlugin(
      ScrollTrigger,
      MotionPathPlugin
    )

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    context = gsap.context(() => {
      const result = setup({
        gsap,
        ScrollTrigger,
        MotionPathPlugin,
        reduceMotion
      })

      if (typeof result === 'function') {
        cleanup = result
      }
    }, root.value)

    refreshFrame = window.requestAnimationFrame(() => {
      if (!disposed) {
        ScrollTrigger.refresh()
      }
    })
  })

  onBeforeUnmount(() => {
    disposed = true

    if (refreshFrame !== undefined) {
      window.cancelAnimationFrame(refreshFrame)
    }

    cleanup?.()
    context?.revert()

    cleanup = undefined
    context = undefined
  })
}

export function revealOnScroll(
  gsap: Gsap,
  target: MotionTarget,
  trigger: Element,
  reduceMotion: boolean,
  stagger = 0
) {
  const targets = gsap.utils.toArray<Element>(target)

  if (!targets.length) {
    return
  }

  if (reduceMotion) {
    return gsap.set(targets, {
      opacity: 1,
      y: 0
    })
  }

  return gsap.from(targets, {
    y: 24,
    opacity: 0,
    duration: 0.7,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger,
      start: 'top 80%',
      once: true,
      invalidateOnRefresh: true
    }
  })
}