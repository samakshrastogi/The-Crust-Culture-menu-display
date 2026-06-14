import { useEffect, useRef } from 'react'
import { FiHeart } from 'react-icons/fi'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'
import VegIndicator from './VegIndicator'

export default function FoodCard({ item, onSelect, isFavorite, onToggleFavorite }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const onEnter = () => {
      gsap.to(el, {
        y: -6,
        boxShadow: '0 20px 35px rgba(246, 196, 83, 0.16)',
        borderColor: 'rgba(246, 196, 83, 0.4)',
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    const onLeave = () => {
      gsap.to(el, {
        y: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        borderColor: 'var(--line)',
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <article
      ref={cardRef}
      data-card
      className="flex overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:block sm:rounded-[1.5rem] shadow-sm transition-[border-color,box-shadow] duration-200"
    >
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="block w-[116px] shrink-0 text-left sm:w-full"
      >
        <div className="relative h-full min-h-[148px] overflow-hidden sm:aspect-[4/3] sm:min-h-0">
          <FoodImage
            src={item.image}
            alt={item.name}
            category={item.category}
            className="h-full w-full transition duration-500 hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:top-3 sm:gap-2">
            {item.popular && (
              <span className="rounded-full bg-[var(--orange)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white sm:px-3 sm:py-1 sm:text-xs">
                Popular
              </span>
            )}
            {item.bestSeller && (
              <span className="rounded-full bg-[var(--gold)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#21140b] sm:px-3 sm:py-1 sm:text-xs">
                Best Seller
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="min-w-0 flex-1 space-y-2 p-3 sm:space-y-4 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
              <VegIndicator veg={item.veg} />
              <span className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)] sm:text-xs sm:tracking-[0.18em]">
                {item.category}
              </span>
            </div>
            <h3 className="line-clamp-2 text-sm font-bold leading-tight text-[var(--text)] sm:text-lg">
              {item.name}
            </h3>
          </div>
          <p className="shrink-0 text-sm font-black text-[var(--gold)] sm:text-lg">₹{item.price}</p>
        </div>
        <p className="line-clamp-2 text-xs leading-5 text-[var(--muted)] sm:text-sm sm:leading-6">
          {item.description}
        </p>
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="touch-target rounded-full bg-[var(--cream)] px-3 text-xs font-black text-[#24150b] transition hover:bg-[var(--gold)] sm:px-5 sm:text-sm"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            className={`touch-target grid place-items-center rounded-full border transition ${
              isFavorite
                ? 'border-[var(--orange)] bg-[var(--orange)] text-white'
                : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
            aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
          >
            <FiHeart className={isFavorite ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </article>
  )
}
