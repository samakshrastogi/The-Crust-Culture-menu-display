import { useEffect, useRef } from 'react'
import { FiPhone } from 'react-icons/fi'
import { animateFloating } from '../animations/gsapAnimations'

export default function FloatingContactButton() {
  const buttonRef = useRef(null)

  useEffect(() => {
    const tween = animateFloating(buttonRef.current)
    return () => tween.kill()
  }, [])

  return (
    <a
      ref={buttonRef}
      href="tel:+919876543210"
      className="fixed bottom-4 right-3 z-40 grid h-12 w-12 place-items-center rounded-full bg-[var(--orange)] text-lg text-white shadow-2xl sm:bottom-7 sm:right-7 sm:h-14 sm:w-14 sm:text-xl"
      aria-label="Call The Crust Culture"
    >
      <FiPhone />
    </a>
  )
}
