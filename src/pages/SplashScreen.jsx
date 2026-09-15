import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { gsap } from '../animations/gsapAnimations'

const LOADING_STAGES = [
  { text: 'Firing up the stone oven...', progress: '25%' },
  { text: 'Kneading artisan sourdough...', progress: '65%' },
  { text: 'Your table menu is ready!', progress: '100%' },
]

export default function SplashScreen() {
  const splashRef = useRef(null)
  const progressFillRef = useRef(null)
  const hasExitedRef = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [stageIndex, setStageIndex] = useState(0)

  const handleEnter = useCallback(() => {
    if (hasExitedRef.current) return
    hasExitedRef.current = true

    const target = {
      pathname: '/menu',
      search: location.search,
    }

    if (splashRef.current) {
      gsap.to(splashRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => navigate(target, { replace: true }),
      })
    } else {
      navigate(target, { replace: true })
    }
  }, [navigate, location.search])

  useEffect(() => {
    // Stage transition timers
    const stageTimer1 = window.setTimeout(() => setStageIndex(1), 750)
    const stageTimer2 = window.setTimeout(() => setStageIndex(2), 1550)
    const autoExitTimer = window.setTimeout(() => handleEnter(), 2400)

    const context = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hearth-glow]', {
        opacity: 0,
        scale: 0.5,
        duration: 1,
      })
        .from(
          '[data-logo-mark]',
          {
            opacity: 0,
            scale: 0.6,
            rotate: -6,
            duration: 0.75,
            ease: 'back.out(1.6)',
          },
          '-=0.7',
        )
        .from('[data-splash-header]', { opacity: 0, y: -12, duration: 0.4 }, '-=0.4')
        .from('[data-splash-title]', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
        .from('[data-splash-badges]', { opacity: 0, y: 12, duration: 0.4 }, '-=0.25')
        .from('[data-splash-loader]', { opacity: 0, y: 16, duration: 0.4 }, '-=0.2')
        .from('[data-skip-hint]', { opacity: 0, y: 12, duration: 0.4 }, '-=0.15')

      // Continuous subtle breathing on logo aura
      gsap.to('[data-hearth-ring]', {
        scale: 1.12,
        opacity: 0.7,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: 'sine.inOut',
      })

      // Animate progress bar fill smoothly
      if (progressFillRef.current) {
        gsap.to(progressFillRef.current, {
          width: '100%',
          duration: 2.3,
          ease: 'power1.inOut',
        })
      }
    }, splashRef)

    return () => {
      context.revert()
      window.clearTimeout(stageTimer1)
      window.clearTimeout(stageTimer2)
      window.clearTimeout(autoExitTimer)
    }
  }, [handleEnter])

  return (
    <main
      ref={splashRef}
      onClick={handleEnter}
      className="relative flex min-h-svh flex-col items-center justify-between overflow-hidden bg-[var(--bg)] px-5 py-8 text-center select-none cursor-pointer transition-colors"
      aria-label="Welcome screen - tap anywhere to enter menu"
    >
      {/* Ambient Wood-Fired Hearth Radial Glows */}
      <div
        data-hearth-glow
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-amber-600/15 blur-3xl"
      />

      {/* Top Bar: Table QR Context */}
      <header data-splash-header className="relative z-10 space-y-1">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-strong)]/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] shadow-xs backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--orange)] animate-ping" />
          Table Digital Menu
        </span>
        <p className="text-[11px] font-medium text-[var(--muted)]">Noble Enclave, Gurgaon</p>
      </header>

      {/* Center Stage: Logo, Title & Hearth Badges */}
      <div className="relative z-10 my-auto flex flex-col items-center space-y-6">
        {/* Glowing Logo Container */}
        <div className="relative">
          {/* Animated Hearth Pulse Ring */}
          <div
            data-hearth-ring
            className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/25 to-transparent blur-md"
          />

          <div
            data-logo-mark
            className="relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full border-2 border-amber-500/50 bg-[#1a0c06] p-1.5 shadow-2xl shadow-orange-500/35 ring-4 ring-orange-500/20 overflow-hidden"
          >
            <img
              src="/logo.png"
              alt="The Crust Culture Logo"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.28em] text-[var(--orange)]">
            Welcome To
          </p>
          <h1
            data-splash-title
            className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)]"
          >
            The Crust Culture
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[var(--gold)] tracking-wide">
            Wood Fired Cafe & Artisan Pizzeria
          </p>
        </div>

        {/* Dietary & Craft Badges */}
        <div data-splash-badges className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            100% Pure Veg
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 backdrop-blur-xs">
            🪵 Stone-Oven Baked
          </span>
        </div>

        {/* Hearth Progress Bar & Appetizing Micro-Copy */}
        <div data-splash-loader className="w-64 sm:w-72 space-y-2.5 pt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-strong)] border border-[var(--line)] shadow-inner">
            <div
              ref={progressFillRef}
              className="h-full w-0 rounded-full bg-gradient-to-r from-amber-500 via-[var(--orange)] to-[#ea580c] shadow-[0_0_12px_rgba(249,115,22,0.8)]"
            />
          </div>

          <p className="text-xs font-medium text-[var(--muted)] animate-fade-in transition-all duration-300">
            {LOADING_STAGES[stageIndex].text}
          </p>
        </div>
      </div>

      {/* Bottom Action: Minimalist Skip Indicator */}
      <footer data-skip-hint className="relative z-10 flex flex-col items-center">
        <p className="text-[11px] font-medium tracking-wide text-[var(--muted)] opacity-80 hover:opacity-100 transition-opacity">
          Tap anywhere to skip
        </p>
      </footer>
    </main>
  )
}

