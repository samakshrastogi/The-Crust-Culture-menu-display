import { useEffect, useRef } from 'react'
import { FiHeart, FiPhone, FiX } from 'react-icons/fi'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'
import VegIndicator from './VegIndicator'

function formatPrice(value) {
  if (/rs/i.test(value)) {
    return value
  }

  return `₹${value}`
}

export default function MenuItemSheet({ item, favorites, onClose, onToggleFavorite }) {
  const overlayRef = useRef(null)
  const sheetRef = useRef(null)

  useEffect(() => {
    if (!item) {
      return undefined
    }

    document.body.style.overflow = 'hidden'
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: 'power2.out' })
    gsap.fromTo(
      sheetRef.current,
      { y: 44, scale: 0.98 },
      { y: 0, scale: 1, duration: 0.3, ease: 'power3.out', clearProps: 'transform' },
    )

    return () => {
      document.body.style.overflow = ''
    }
  }, [item])

  if (!item) {
    return null
  }

  const isFavorite = favorites.includes(item.id)

  const closeWithAnimation = () => {
    gsap.to(sheetRef.current, {
      y: 36,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 grid place-items-end bg-black/55 p-0 backdrop-blur-sm sm:place-items-center sm:p-4"
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
        ref={sheetRef}
        className="modal-scroll max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl sm:max-w-xl sm:rounded-[2rem]"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <FoodImage
            src={item.image || item.sectionImage}
            alt={item.name}
            category={item.sectionTitle?.includes('Pizza') ? 'Pizza' : 'Restaurant'}
            className="h-full w-full"
            loading="eager"
          />
          <button
            type="button"
            onClick={closeWithAnimation}
            className="touch-target absolute right-3 top-3 grid place-items-center rounded-full bg-black/60 text-white"
            aria-label="Close details"
          >
            <FiX />
          </button>
          {item.tag && (
            <span className="absolute left-3 top-3 rounded-full bg-[var(--orange)] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
              {item.tag}
            </span>
          )}
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <VegIndicator veg={item.veg} />
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--gold)]">
                  {item.sectionTitle}
                </span>
              </div>
              <h2 className="font-display text-2xl font-semibold leading-tight text-[var(--text)]">{item.name}</h2>
            </div>
            <button
              type="button"
              onClick={(event) => onToggleFavorite(item.id, event.currentTarget)}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border ${
                isFavorite
                  ? 'border-[var(--orange)] bg-[var(--orange)] text-white'
                  : 'border-[var(--line)] text-[var(--muted)]'
              }`}
              aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
            >
              <FiHeart className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>

          {item.toppings && <p className="text-sm leading-6 text-[var(--muted)]">{item.toppings}</p>}

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] p-3">
            <h3 className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--gold)]">Prices</h3>
            <div className="flex flex-wrap gap-2">
              {item.prices.map((price) => (
                <span
                  key={`${price.label}-${price.value}`}
                  className="rounded-full bg-[var(--cream)] px-3 py-2 text-sm font-black text-[#24150b]"
                >
                  {price.label && <span className="mr-1 text-[#8a5a15]">{price.label}</span>}
                  {formatPrice(price.value)}
                </span>
              ))}
            </div>
          </div>

          <a
            href="tel:+919876543210"
            className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--orange)] px-5 font-black text-white"
          >
            <FiPhone /> Ask staff
          </a>
        </div>
      </div>
    </div>
  )
}
