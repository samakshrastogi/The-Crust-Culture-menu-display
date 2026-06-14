import { useEffect, useRef } from 'react'
import { gsap } from '../animations/gsapAnimations'

export default function LiveStatusBadge() {
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
      className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-2.5 py-1 text-[11px] font-black text-[var(--text)] sm:mt-3 sm:px-3 sm:py-1.5 sm:text-sm"
    >
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span ref={dotRef} className="absolute h-2.5 w-2.5 rounded-full bg-[var(--green)]" />
        <span className="relative h-2 w-2 rounded-full bg-[var(--green)]" />
      </span>
      Open daily 2:00 PM - 11:00 PM
    </div>
  )
}
