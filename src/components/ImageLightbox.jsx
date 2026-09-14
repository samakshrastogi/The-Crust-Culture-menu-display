import { useCallback, useEffect, useRef, useState } from 'react'
import { FiMaximize2, FiX, FiZoomIn, FiZoomOut } from 'react-icons/fi'
import { gsap } from '../animations/gsapAnimations'

const MIN_SCALE = 1
const MAX_SCALE = 4

export default function ImageLightbox({ src, alt, title, category, onClose }) {
  const overlayRef = useRef(null)
  const containerRef = useRef(null)
  const imageRef = useRef(null)

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastTapRef = useRef(0)
  const touchStartDistRef = useRef(null)
  const initialPinchScaleRef = useRef(1)
  const touchStartYRef = useRef(0)

  // Clamp position so zoomed image cannot be dragged completely out of frame
  const clampPosition = useCallback((newX, newY, currentScale) => {
    if (currentScale <= 1) {
      return { x: 0, y: 0 }
    }
    if (!containerRef.current) {
      return { x: newX, y: newY }
    }

    const { clientWidth, clientHeight } = containerRef.current
    const maxBoundX = ((currentScale - 1) * clientWidth) / 2
    const maxBoundY = ((currentScale - 1) * clientHeight) / 2

    return {
      x: Math.max(-maxBoundX, Math.min(maxBoundX, newX)),
      y: Math.max(-maxBoundY, Math.min(maxBoundY, newY)),
    }
  }, [])

  // Smooth entrance & exit animations
  const handleClose = useCallback(() => {
    if (!overlayRef.current || !imageRef.current) {
      onClose()
      return
    }

    gsap.to(imageRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
    })
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.24,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }, [onClose])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    if (overlayRef.current && imageRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' },
      )
      gsap.fromTo(
        imageRef.current,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.2)' },
      )
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        setScale((prev) => Math.min(MAX_SCALE, Number((prev + 0.5).toFixed(1))))
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        setScale((prev) => {
          const next = Math.max(MIN_SCALE, Number((prev - 0.5).toFixed(1)))
          if (next <= 1) setPosition({ x: 0, y: 0 })
          return next
        })
      } else if (e.key === '0') {
        e.preventDefault()
        setScale(1)
        setPosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClose])

  // Zoom helpers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(MAX_SCALE, Number((prev + 0.5).toFixed(1))))
  }

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(MIN_SCALE, Number((prev - 0.5).toFixed(1)))
      if (next <= 1) setPosition({ x: 0, y: 0 })
      return next
    })
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const toggleDoubleTapZoom = (clientX, clientY) => {
    if (scale > 1.3) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    } else {
      const targetScale = 2.5
      let targetX = 0
      let targetY = 0

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const touchX = clientX - rect.left
        const touchY = clientY - rect.top
        targetX = (centerX - touchX) * 1.5
        targetY = (centerY - touchY) * 1.5
      }

      setScale(targetScale)
      setPosition(clampPosition(targetX, targetY, targetScale))
    }
  }

  // Touch handlers for Mobile (Pinch + Double-Tap + Pan + Swipe to dismiss)
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      touchStartDistRef.current = dist
      initialPinchScaleRef.current = scale
      setIsDragging(false)
    } else if (e.touches.length === 1) {
      const now = Date.now()
      const touch = e.touches[0]
      if (now - lastTapRef.current < 300) {
        toggleDoubleTapZoom(touch.clientX, touch.clientY)
        lastTapRef.current = 0
        return
      }
      lastTapRef.current = now

      touchStartYRef.current = touch.clientY
      dragStartRef.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      }
      if (scale > 1) {
        setIsDragging(true)
      }
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchStartDistRef.current) {
      e.preventDefault()
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      const factor = currentDist / touchStartDistRef.current
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, Number((initialPinchScaleRef.current * factor).toFixed(2))),
      )
      setScale(newScale)
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 })
      } else {
        setPosition((prev) => clampPosition(prev.x, prev.y, newScale))
      }
    } else if (e.touches.length === 1) {
      if (scale > 1 && isDragging) {
        e.preventDefault()
        const touch = e.touches[0]
        const nextX = touch.clientX - dragStartRef.current.x
        const nextY = touch.clientY - dragStartRef.current.y
        setPosition(clampPosition(nextX, nextY, scale))
      }
    }
  }

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      touchStartDistRef.current = null
    }
    if (e.touches.length === 0) {
      setIsDragging(false)
      // Check swipe-down at 1x scale to dismiss
      if (scale <= 1 && e.changedTouches.length === 1) {
        const deltaY = e.changedTouches[0].clientY - touchStartYRef.current
        if (deltaY > 110) {
          handleClose()
        }
      }
    }
  }

  // Desktop Mouse handlers (Wheel Zoom + Drag Pan)
  const handleWheel = (e) => {
    e.preventDefault()
    const delta = -e.deltaY * 0.002
    setScale((prev) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number((prev + delta).toFixed(2))))
      if (next <= 1) {
        setPosition({ x: 0, y: 0 })
      } else {
        setPosition((pos) => clampPosition(pos.x, pos.y, next))
      }
      return next
    })
  }

  const handleMouseDown = (e) => {
    if (scale > 1) {
      e.preventDefault()
      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      e.preventDefault()
      const nextX = e.clientX - dragStartRef.current.x
      const nextY = e.clientY - dragStartRef.current.y
      setPosition(clampPosition(nextX, nextY, scale))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-between bg-black/95 text-white backdrop-blur-md select-none touch-none"
      role="dialog"
      aria-modal="true"
      aria-label={`${title || 'Food Photo'} full screen preview`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Header Controls Bar */}
      <header className="z-20 flex w-full max-w-6xl items-center justify-between px-3.5 py-3 sm:px-6 sm:py-4">
        {/* Dish Title & Category */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[var(--gold)]">
            {category || 'Menu'}
          </span>
          <h3 className="truncate font-display text-sm sm:text-base font-bold text-white/95">
            {title || alt}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom Percentage Chip */}
          <span className="hidden min-[360px]:inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-mono font-black text-amber-200/90 border border-white/10">
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= MIN_SCALE}
            className="touch-target grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white/10 border border-white/15 text-sm transition hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Zoom out"
          >
            <FiZoomOut />
          </button>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= MAX_SCALE}
            className="touch-target grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white/10 border border-white/15 text-sm transition hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Zoom in"
          >
            <FiZoomIn />
          </button>

          {/* Reset Fit Button */}
          <button
            type="button"
            onClick={handleReset}
            className="touch-target grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white/10 border border-white/15 text-sm transition hover:bg-white/20 active:scale-95"
            aria-label="Reset zoom"
            title="Reset to 100%"
          >
            <FiMaximize2 />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="touch-target grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-[var(--orange)] text-white shadow-md transition hover:brightness-110 active:scale-95 ml-1"
            aria-label="Close full-screen image preview"
          >
            <FiX className="text-base font-bold" />
          </button>
        </div>
      </header>

      {/* Main Interactive Image Viewport */}
      <div
        ref={containerRef}
        className={`relative flex-1 w-full flex items-center justify-center overflow-hidden p-2 sm:p-6 ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={(e) => toggleDoubleTapZoom(e.clientX, e.clientY)}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.2, 0, 0, 1)',
            maxHeight: '84svh',
            maxWidth: '92vw',
          }}
          className="rounded-2xl object-contain shadow-2xl pointer-events-auto will-change-transform"
          draggable={false}
        />
      </div>

      {/* Bottom Hint Bar */}
      <footer className="z-20 w-full px-4 py-2.5 text-center text-[10px] sm:text-[11px] font-medium text-white/50 border-t border-white/10">
        <p className="flex items-center justify-center gap-2">
          <span>Pinch or double-tap to zoom</span>
          <span className="opacity-40">•</span>
          <span>Drag to pan</span>
          <span className="hidden sm:inline-flex opacity-40">•</span>
          <span className="hidden sm:inline">Scroll wheel to zoom in/out</span>
          <span className="opacity-40">•</span>
          <span>Swipe down or press Esc to close</span>
        </p>
      </footer>
    </div>
  )
}
