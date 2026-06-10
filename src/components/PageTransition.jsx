import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { animatePageIn } from '../animations/gsapAnimations'

export default function PageTransition({ children }) {
  const pageRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const tween = animatePageIn(pageRef.current)
    return () => tween.kill()
  }, [location.pathname])

  return <main ref={pageRef}>{children}</main>
}
