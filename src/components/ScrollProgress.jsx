import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    let ticking = false

    const updateProgress = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (barRef.current) {
            const scrollTop = window.scrollY
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            const progress = scrollHeight > 0 ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1) : 0
            barRef.current.style.transform = `scaleX(${progress})`
          }
          ticking = false
        })
        ticking = true
      }
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-transparent pointer-events-none" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full w-full bg-[var(--gold)] origin-left will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
