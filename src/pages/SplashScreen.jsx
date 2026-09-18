import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom'
import { gsap } from '../animations/gsapAnimations'

const LOADING_STAGES = [
  { text: 'Firing up the stone oven...', progress: '25%' },
  { text: 'Kneading fresh sourdough...', progress: '65%' },
  { text: 'Your table menu is ready!', progress: '100%' },
]

export default function SplashScreen() {
  const splashRef = useRef(null)
  const progressFillRef = useRef(null)
  const hasExitedRef = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const tableNumber = searchParams.get('table')
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    if (tableNumber && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('tcc_table_number', tableNumber.trim())
      } catch {
        // Ignore storage access error
      }
    }
  }, [tableNumber])

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
    // Fast & snappy stage transition timers (1.7s total)
    const stageTimer1 = window.setTimeout(() => setStageIndex(1), 550)
    const stageTimer2 = window.setTimeout(() => setStageIndex(2), 1150)
    const autoExitTimer = window.setTimeout(() => handleEnter(), 1700)

    const context = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hearth-glow]', {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
      })
        .from(
          '[data-logo-mark]',
          {
            opacity: 0,
            scale: 0.6,
            rotate: -6,
            duration: 0.6,
            ease: 'back.out(1.6)',
          },
          '-=0.5',
        )
        .from('[data-splash-header]', { opacity: 0, y: -12, duration: 0.35 }, '-=0.3')
        .from('[data-splash-title]', { opacity: 0, y: 16, duration: 0.4 }, '-=0.25')
        .from('[data-splash-badges]', { opacity: 0, y: 12, duration: 0.35 }, '-=0.2')
        .from('[data-splash-highlights]', { opacity: 0, y: 10, duration: 0.35 }, '-=0.2')
        .from('[data-splash-loader]', { opacity: 0, y: 14, duration: 0.35 }, '-=0.15')
        .from('[data-skip-hint]', { opacity: 0, y: 10, duration: 0.35 }, '-=0.15')

      // Continuous subtle breathing on logo aura
      gsap.to('[data-hearth-ring]', {
        scale: 1.12,
        opacity: 0.7,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: 'sine.inOut',
      })

      // Animate progress bar fill smoothly across 1.6s
      if (progressFillRef.current) {
        gsap.to(progressFillRef.current, {
          width: '100%',
          duration: 1.6,
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
      role="button"
      tabIndex={0}
      onClick={handleEnter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleEnter()
        }
      }}
      className="relative flex min-h-svh flex-col items-center justify-between overflow-hidden bg-[var(--bg)] px-5 py-8 text-center select-none cursor-pointer transition-colors"
      aria-label="Welcome screen - press Enter, Space, or tap anywhere to enter menu"
    >
      {/* Full-Screen Ambient Wood-Fired Hearth Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(249,115,22,0.13),rgba(245,158,11,0.05)_45%,transparent_75%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(249,115,22,0.22),rgba(245,158,11,0.08)_45%,transparent_80%)]" />

      {/* Pulsing Hearth Core Glow */}
      <div
        data-hearth-glow
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 sm:h-[30rem] sm:w-[30rem] rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/18 to-amber-600/10 blur-3xl"
      />

      {/* Top Bar: Dynamic Table Context or Location */}
      <header data-splash-header className="relative z-10 space-y-1">
        {tableNumber ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 shadow-xs backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" aria-hidden="true" />
            Table {tableNumber} • Dine-In Menu
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-strong)]/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--text)] shadow-xs backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[var(--orange)] animate-ping" aria-hidden="true" />
            Table Digital Menu
          </span>
        )}
        <p className="text-[11px] font-medium text-[var(--muted)]">Noble Enclave, Gurgaon</p>
      </header>

      {/* Center Stage: Logo, Title, Craft Badges & Highlights */}
      <div className="relative z-10 my-auto flex flex-col items-center space-y-5 sm:space-y-6">
        {/* Glowing Logo Container */}
        <div className="relative">
          {/* Animated Hearth Pulse Ring */}
          <div
            data-hearth-ring
            className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/25 to-transparent blur-md"
          />

          <div
            data-logo-mark
            className="relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full border-2 border-amber-500/60 bg-[#1a0c06] p-1.5 shadow-2xl shadow-orange-500/35 ring-4 ring-orange-500/20 overflow-hidden"
          >
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Headlines with Crisp Contrast */}
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
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 tracking-wide">
            Wood Fired Cafe
          </p>
        </div>

        {/* Dietary & Craft Badges */}
        <div data-splash-badges className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            100% Pure Veg
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 backdrop-blur-xs">
            🪵 Stone-Oven Baked
          </span>
        </div>

        {/* Menu Highlights Strip */}
        <div
          data-splash-highlights
          className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[var(--muted)] pt-0.5"
        >
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-strong)]/80 px-2 py-0.5 border border-[var(--line)]">
            🍕 Wood-Fired Pizzas
          </span>
          <span className="opacity-40" aria-hidden="true">•</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-strong)]/80 px-2 py-0.5 border border-[var(--line)]">
            🧄 Garlic Breads
          </span>
          <span className="opacity-40" aria-hidden="true">•</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-strong)]/80 px-2 py-0.5 border border-[var(--line)]">
            🍔 Gourmet Burgers
          </span>
          <span className="opacity-40" aria-hidden="true">•</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-strong)]/80 px-2 py-0.5 border border-[var(--line)]">
            🥤 Shakes
          </span>
        </div>

        {/* Hearth Progress Bar & Appetizing Micro-Copy */}
        <div data-splash-loader role="status" aria-live="polite" className="w-64 sm:w-72 space-y-2.5 pt-1">
          <div
            role="progressbar"
            aria-valuenow={stageIndex === 0 ? 25 : stageIndex === 1 ? 65 : 100}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Menu preparation progress"
            className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-strong)] border border-[var(--line)] shadow-inner"
          >
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

      {/* Search Crawler Discoverability Navigation (Screen-reader & Bot fallback) */}
      <nav aria-label="Quick entrance" className="sr-only">
        <Link to="/home">Explore The Crust Culture Home</Link>
        <Link to="/menu">Browse Complete Digital Menu (16 Categories)</Link>
      </nav>

      {/* Bottom Action: Minimalist Skip Indicator */}
      <footer data-skip-hint className="relative z-10 flex flex-col items-center">
        <Link
          to="/menu"
          onClick={(e) => {
            e.preventDefault()
            handleEnter()
          }}
          className="inline-flex items-center gap-1 text-[11px] font-medium tracking-wide text-[var(--muted)] opacity-80 hover:opacity-100 transition-opacity"
        >
          <span>Tap anywhere or press Enter to open menu</span>
          <span className="text-[10px] opacity-60" aria-hidden="true">→</span>
        </Link>
      </footer>
    </main>
  )
}

