import { useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'
import VegIndicator from './VegIndicator'

export default function ItemModal({ item, onClose }) {
  const overlayRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!item) {
      return undefined
    }

    document.body.style.overflow = 'hidden'
    const overlay = overlayRef.current
    const panel = panelRef.current

    if (overlay && panel) {
      gsap.killTweensOf([overlay, panel])
      gsap.set(overlay, { opacity: 1 })
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: 'power2.out' })
      gsap.fromTo(
        panel,
        { y: 28, scale: 0.98 },
        { y: 0, scale: 1, duration: 0.28, ease: 'power3.out', clearProps: 'transform' },
      )
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [item])

  if (!item) {
    return null
  }

  const closeWithAnimation = () => {
    const overlay = overlayRef.current
    const panel = panelRef.current

    if (!overlay || !panel) {
      onClose()
      return
    }

    gsap.killTweensOf([overlay, panel])
    gsap.to(panel, {
      opacity: 0,
      y: 30,
      scale: 0.96,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: onClose,
    })
    gsap.to(overlay, { opacity: 0, duration: 0.22 })
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 grid place-items-end bg-black/70 p-0 backdrop-blur-sm sm:place-items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} details`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeWithAnimation()
        }
      }}
    >
      <div
        ref={panelRef}
        className="modal-scroll relative z-[51] max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-[var(--line)] bg-[var(--surface)] opacity-100 shadow-2xl sm:max-w-3xl sm:rounded-[2rem]"
      >
        <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[16/8]">
          <FoodImage
            src={item.image}
            alt={item.name}
            category={item.category}
            className="h-full w-full"
            loading="eager"
          />
          <button
            type="button"
            onClick={closeWithAnimation}
            className="touch-target absolute right-4 top-4 grid place-items-center rounded-full bg-black/60 text-white backdrop-blur"
            aria-label="Close item details"
          >
            <FiX />
          </button>
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {item.bestSeller && (
              <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#21140b]">
                Best Seller
              </span>
            )}
            {item.popular && (
              <span className="rounded-full bg-[var(--orange)] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                Popular
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4 p-4 sm:space-y-6 sm:p-7">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <VegIndicator veg={item.veg} />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--gold)] sm:text-sm sm:tracking-[0.18em]">
                  {item.category}
                </span>
              </div>
              <h2 className="font-display text-2xl font-semibold leading-tight text-[var(--text)] sm:text-3xl">
                {item.name}
              </h2>
            </div>
            <p className="rounded-2xl bg-[var(--cream)] px-3 py-2 text-base font-black text-[#24150b] sm:px-4 sm:text-xl">
              ₹{item.price}
            </p>
          </div>

          <p className="text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">{item.description}</p>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] p-3 sm:rounded-3xl sm:p-4">
              <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--gold)] sm:mb-3 sm:text-sm sm:tracking-[0.18em]">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {item.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--muted)] sm:px-3 sm:py-2 sm:text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] p-3 sm:rounded-3xl sm:p-4">
              <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--gold)] sm:mb-3 sm:text-sm sm:tracking-[0.18em]">
                Spice Level
              </h3>
              <div className="flex items-center gap-2">
                {['None', 'Mild', 'Medium', 'Hot'].map((level) => (
                  <span
                    key={level}
                    className={`h-3 flex-1 rounded-full ${
                      ['None', 'Mild', 'Medium', 'Hot'].indexOf(level) <=
                      ['None', 'Mild', 'Medium', 'Hot'].indexOf(item.spiceLevel)
                        ? 'bg-[var(--orange)]'
                        : 'bg-[var(--surface)]'
                    }`}
                    title={level}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--muted)]">{item.spiceLevel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
