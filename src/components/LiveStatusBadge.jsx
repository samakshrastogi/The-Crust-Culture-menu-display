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
      className={`inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--text)] shadow-sm sm:h-12 sm:px-4 sm:text-sm ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span ref={dotRef} className="absolute h-2.5 w-2.5 rounded-full bg-[var(--green)]" />
        <span className="relative h-2 w-2 rounded-full bg-[var(--green)]" />
      </span>
      <span>Open daily 2:00 PM - 1:00 AM</span>
    </div>
  )
}
