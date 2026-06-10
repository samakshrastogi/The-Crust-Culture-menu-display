import { useEffect, useRef } from 'react'
import { FiHeart } from 'react-icons/fi'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'
import VegIndicator from './VegIndicator'

function formatPrice(value) {
  if (/rs/i.test(value)) {
    return value
  }

  return `₹${value}`
}

function Highlight({ text, query }) {
  if (!query?.trim()) {
    return text
  }

  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = String(text).split(new RegExp(`(${escapedQuery})`, 'ig'))

  return parts.map((part, index) =>
    part.toLowerCase() === query.trim().toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded bg-[var(--gold)]/35 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default function MenuSectionCard({ section, favorites, onToggleFavorite, onSelectItem, query }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) {
      return undefined
    }

    const context = gsap.context(() => {
      const sectionElement = sectionRef.current
      if (!sectionElement) {
        return
      }

      const chips = gsap.utils.toArray('[data-price-chip]')

      gsap.from(sectionElement, {
        y: 18,
        duration: 0.34,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top 92%',
          once: true,
        },
      })

      gsap.from(chips, {
        y: 5,
        scale: 0.96,
        duration: 0.18,
        stagger: 0.018,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top 88%',
          once: true,
        },
      })
    }, sectionRef)

    return () => {
      context.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      data-card
      id={section.id}
      className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm sm:rounded-[1.5rem]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2.5 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-black text-[var(--text)] sm:text-2xl">{section.title}</h2>
          <p className="mt-0.5 text-[11px] font-semibold text-[var(--muted)] sm:text-sm">
            {section.items.length} items
          </p>
        </div>
        {section.labels.some(Boolean) && (
          <div className="hidden shrink-0 gap-1.5 sm:flex">
            {section.labels.filter(Boolean).map((label) => (
              <span
                key={label}
                className="grid h-8 min-w-8 place-items-center rounded-full bg-[var(--cream)] px-2 text-xs font-black text-[#24150b]"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="divide-y divide-[var(--line)]">
        {section.items.map((item) => (
          <article key={item.id} className="px-3 py-2.5 sm:px-5 sm:py-3.5">
            <div className="flex min-w-0 gap-2.5 sm:gap-3">
              <FoodImage
                src={item.image || section.image}
                alt={item.name}
                category={section.title.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                className="h-14 w-14 shrink-0 rounded-xl border border-[var(--line)] sm:h-16 sm:w-16 sm:rounded-2xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectItem({
                        ...item,
                        sectionTitle: section.title,
                        sectionImage: section.image,
                      })
                    }
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="mb-1 flex items-center gap-1.5">
                      <VegIndicator veg={item.veg} />
                      {item.tag && (
                        <span className="rounded-full bg-[var(--orange)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-black leading-snug text-[var(--text)] sm:text-base">
                      <Highlight text={item.name} query={query} />
                    </h3>
                    {item.toppings && (
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[var(--muted)] sm:text-sm sm:leading-5">
                        <Highlight text={item.toppings} query={query} />
                      </p>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => onToggleFavorite(item.id, event.currentTarget)}
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs transition sm:h-8 sm:w-8 ${
                      favorites.includes(item.id)
                        ? 'border-[var(--orange)] bg-[var(--orange)] text-white'
                        : 'border-[var(--line)] text-[var(--muted)]'
                    }`}
                    aria-label={
                      favorites.includes(item.id)
                        ? `Remove ${item.name} from favorites`
                        : `Add ${item.name} to favorites`
                    }
                  >
                    <FiHeart className={favorites.includes(item.id) ? 'fill-current' : ''} />
                  </button>
                </div>

                <div className="mt-1.5 flex max-w-full flex-wrap justify-start gap-1 sm:gap-1.5">
                  {item.prices.map((price) => (
                    <span
                      key={`${item.id}-${price.label}-${price.value}`}
                      data-price-chip
                      className="rounded-full border border-[var(--line)] bg-[var(--cream)] px-1.5 py-1 text-[10px] font-black text-[#24150b] sm:px-3 sm:text-sm"
                    >
                      {price.label && <span className="mr-0.5 text-[#8a5a15] sm:mr-1">{price.label}</span>}
                      {formatPrice(price.value)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
