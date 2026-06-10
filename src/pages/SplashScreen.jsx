import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../animations/gsapAnimations'

export default function SplashScreen() {
  const splashRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-logo-mark]', { opacity: 0, scale: 0.65, rotate: -8, duration: 0.7 })
        .from('[data-splash-title]', { opacity: 0, y: 24, duration: 0.55 }, '-=0.25')
        .from('[data-splash-copy]', { opacity: 0, y: 16, duration: 0.45 }, '-=0.2')
        .to('[data-logo-mark]', {
          scale: 1.05,
          repeat: 1,
          yoyo: true,
          duration: 0.5,
          ease: 'sine.inOut',
        })
    }, splashRef)

    const timer = window.setTimeout(() => navigate('/menu', { replace: true }), 2000)

    return () => {
      context.revert()
      window.clearTimeout(timer)
    }
  }, [navigate])

  return (
    <main
      ref={splashRef}
      className="grid min-h-svh place-items-center overflow-hidden bg-[var(--bg)] px-5 text-center"
    >
      <div className="space-y-7">
        <div
          data-logo-mark
          className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-4xl font-black text-[var(--gold)] shadow-2xl"
        >
          CC
        </div>
        <div className="space-y-3">
          <p data-splash-copy className="text-sm font-bold uppercase tracking-[0.26em] text-[var(--orange)]">
            Welcome to
          </p>
          <h1 data-splash-title className="font-display text-5xl font-semibold leading-tight text-[var(--text)]">
            The Crust Culture
          </h1>
          <p data-splash-copy className="mx-auto max-w-xs text-sm leading-6 text-[var(--muted)]">
            Your table menu is warming up.
          </p>
        </div>
      </div>
    </main>
  )
}
