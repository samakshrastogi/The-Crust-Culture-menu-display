import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export function revealHero(scope) {
  return gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

    timeline
      .from('[data-hero-kicker]', { opacity: 0, y: 18, duration: 0.55 })
      .from('[data-hero-title]', { opacity: 0, y: 34, duration: 0.75 }, '-=0.25')
      .from('[data-hero-copy]', { opacity: 0, y: 24, duration: 0.65 }, '-=0.35')
      .from('[data-hero-actions]', { opacity: 0, y: 18, duration: 0.55 }, '-=0.3')
      .from('[data-hero-media]', { opacity: 0, scale: 0.94, duration: 0.9 }, '-=0.55')
  }, scope)
}

export function revealOnScroll(scope, selector = '[data-reveal]') {
  return gsap.context(() => {
    gsap.utils.toArray(selector).forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 28,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
        },
      })
    })
  }, scope)
}

export function staggerCards(scope, selector = '[data-card]') {
  return gsap.context(() => {
    gsap.from(selector, {
      opacity: 0,
      y: 26,
      duration: 0.58,
      stagger: 0.055,
      ease: 'power3.out',
    })
  }, scope)
}

export function animateFloating(element) {
  return gsap.to(element, {
    y: -8,
    duration: 1.45,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  })
}

export function animatePageIn(element) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.48, ease: 'power3.out' },
  )
}
