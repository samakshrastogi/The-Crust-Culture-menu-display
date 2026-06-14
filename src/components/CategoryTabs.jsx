import { useEffect, useRef } from 'react'
import { gsap } from '../animations/gsapAnimations'

export default function CategoryTabs({ categories, activeCategory, onChange }) {
  const tabRefs = useRef({})
  const allCategories = ['All', ...categories]

  useEffect(() => {
    const buttons = Object.values(tabRefs.current).filter(Boolean)
    const activeButton = tabRefs.current[activeCategory]

    gsap.to(buttons, {
      scale: 1,
      duration: 0.16,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    if (activeButton) {
      gsap.fromTo(
        activeButton,
        { scale: 0.97 },
        { scale: 1.06, duration: 0.22, ease: 'back.out(2.2)', overwrite: 'auto' },
      )
    }
  }, [activeCategory])

  return (
    <div className="sticky top-[57px] z-30 -mx-3 overflow-hidden border-y border-[var(--line)] bg-[var(--bg)]/94 px-3 py-2 shadow-sm backdrop-blur-xl sm:top-[69px] sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
      <div className="no-scrollbar flex max-w-full gap-1.5 overflow-x-auto sm:gap-2">
        {allCategories.map((category) => (
          <button
            key={category}
            ref={(element) => {
              tabRefs.current[category] = element
            }}
            type="button"
            onClick={() => onChange(category)}
            className={`touch-target shrink-0 rounded-full border px-3 text-xs font-bold transition sm:px-4 sm:text-sm ${
              activeCategory === category
                ? 'border-[var(--gold)] bg-[var(--gold)] text-[#24150b]'
                : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--bg)] to-transparent sm:hidden" />
    </div>
  )
}
