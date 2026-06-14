import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export { gsap, ScrollToPlugin, ScrollTrigger }

export function revealHero(scope) {
  return gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

    timeline
      .fromTo('[data-hero-kicker]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, clearProps: 'opacity,transform' })
      .fromTo('[data-hero-title]', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.75, clearProps: 'opacity,transform' }, '-=0.25')
      .fromTo('[data-hero-copy]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65, clearProps: 'opacity,transform' }, '-=0.35')
      .fromTo('[data-hero-actions]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, clearProps: 'opacity,transform' }, '-=0.3')
      .fromTo('[data-hero-media]', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.9, clearProps: 'opacity,transform' }, '-=0.55')
  }, scope)
}

export function revealOnScroll(scope, selector = '[data-reveal]') {
  return gsap.context(() => {
    gsap.utils.toArray(selector).forEach((element) => {
      gsap.fromTo(element, 
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
          },
        }
      )
    })
  }, scope)
}

export function staggerCards(scope, selector = '[data-card]') {
  return gsap.context(() => {
    gsap.fromTo(selector,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.58,
        stagger: 0.055,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      }
    )
  }, scope)
}

export function animateFloating(element) {
  return gsap
    .timeline({ repeat: -1, repeatDelay: 1.4 })
    .to(element, { y: -7, scale: 1.05, duration: 0.8, ease: 'sine.inOut' })
    .to(element, { y: 0, scale: 1, duration: 0.8, ease: 'sine.inOut' })
    .to(element, { boxShadow: '0 0 0 12px rgba(249, 115, 22, 0)', duration: 0.55 }, 0)
}

export function animatePageIn(element) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 12, scale: 0.985 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' },
  )
}

export function animateFavoritePop(element) {
  if (!element) {
    return null
  }

  return gsap.fromTo(
    element,
    { scale: 0.86 },
    { scale: 1, duration: 0.34, ease: 'elastic.out(1, 0.45)' },
  )
}

export function scrollToTop() {
  return gsap.to(window, {
    scrollTo: { y: 0 },
    duration: 0.45,
    ease: 'power2.out',
  })
}

export function scrollToElement(target, offsetY = 148) {
  if (!target) {
    return null
  }

  return gsap.to(window, {
    scrollTo: { y: target, offsetY },
    duration: 0.55,
    ease: 'power2.inOut',
  })
}
