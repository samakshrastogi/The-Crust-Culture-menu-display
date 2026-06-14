import { useEffect, useRef } from 'react'
import { FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import { useLocation } from 'react-router-dom'
import { animateFloating } from '../animations/gsapAnimations'

export default function FloatingContactButton() {
  const callBtnRef = useRef(null)
  const waBtnRef = useRef(null)
  const { pathname } = useLocation()
  const hideOnMobileMenu = pathname === '/menu'

  useEffect(() => {
    const tweenCall = animateFloating(callBtnRef.current)
    const tweenWa = animateFloating(waBtnRef.current)
    return () => {
      tweenCall.kill()
      tweenWa.kill()
    }
  }, [])

  return (
    <>
      {/* Call Button */}
      <a
        ref={callBtnRef}
        href="tel:+918368151650"
        className={`fixed bottom-20 right-4 z-40 h-11 w-11 place-items-center rounded-full bg-[var(--orange)] text-base text-white shadow-2xl ring-4 ring-[var(--bg)] sm:bottom-28 sm:right-7 sm:h-14 sm:w-14 sm:text-xl transition hover:opacity-90 ${
          hideOnMobileMenu ? 'hidden sm:grid' : 'grid'
        }`}
        aria-label="Call The Crust Culture"
      >
        <FiPhone />
      </a>

      {/* WhatsApp Button */}
      <a
        ref={waBtnRef}
        href="https://wa.me/918368151650"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-5 right-4 z-40 h-11 w-11 place-items-center rounded-full bg-[#25D366] text-base text-white shadow-2xl ring-4 ring-[var(--bg)] sm:bottom-7 sm:right-7 sm:h-14 sm:w-14 sm:text-xl transition hover:opacity-90 ${
          hideOnMobileMenu ? 'hidden sm:grid' : 'grid'
        }`}
        aria-label="WhatsApp The Crust Culture"
      >
        <FaWhatsapp className="text-lg sm:text-2xl" />
      </a>
    </>
  )
}
