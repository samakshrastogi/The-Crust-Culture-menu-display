import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 620)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })

    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  if (!visible) {
    return null
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 left-3.5 z-40 grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-md text-[var(--text)] shadow-xl transition-all duration-200 hover:border-[var(--orange)] hover:text-[var(--orange)] active:scale-95 sm:bottom-6 sm:left-6 sm:h-12 sm:w-12 cursor-pointer"
      aria-label="Back to top"
    >
      <FiArrowUp className="text-base sm:text-lg" aria-hidden="true" />
    </button>
  )
}
