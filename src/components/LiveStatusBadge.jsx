import { useEffect, useRef } from 'react'
import { gsap } from '../animations/gsapAnimations'

export default function LiveStatusBadge({ className = '' }) {
  const badgeRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      )
      gsap.to(dotRef.current, {
        scale: 1.65,
        opacity: 0.28,
        duration: 0.9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, badgeRef)

    return () => context.revert()
  }, [])

  return (
    <div
      ref={badgeRef}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--text)] shadow-xs h-10 sm:h-11 sm:px-3 sm:gap-2 ${className}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span ref={dotRef} className="absolute h-2 w-2 rounded-full bg-[var(--green)]" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
      </span>
      <span className="hidden sm:inline text-xs">Open daily 1:30 PM – 1:30 AM</span>
      <span className="sm:hidden text-[11px] font-black text-emerald-600 dark:text-emerald-400">Open</span>
    </div>
  )
}
