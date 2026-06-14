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

      const rows = gsap.utils.toArray('[data-menu-row]')
      const chips = gsap.utils.toArray('[data-price-chip]')

      gsap.fromTo(sectionElement, {
        y: 18,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.34,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top 92%',
          once: true,
        },
      })

      gsap.fromTo(rows, {
        x: -8,
        opacity: 0,
      }, {
        x: 0,
        opacity: 1,
        duration: 0.24,
        stagger: 0.026,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top 86%',
          once: true,
        },
      })

      gsap.fromTo(chips, {
        y: 5,
        scale: 0.96,
        opacity: 0,
      }, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.18,
        stagger: 0.018,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
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
      className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm sm:rounded-[1.5rem] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(246,196,83,0.35)] hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="min-w-0">
          <h2 className="truncate text-base font-black text-[var(--text)] sm:text-xl">{section.title}</h2>
          <p className="text-[10px] font-semibold text-[var(--muted)] sm:text-xs">
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
          <article
            key={item.id}
            data-menu-row
            className="px-3 py-1 cursor-pointer transition-colors hover:bg-[var(--bg-soft)] active:bg-[var(--bg-soft)] sm:px-4 sm:py-1.5"
            onClick={(event) => {
              if (!event.target.closest('[data-fav-btn]')) {
                onSelectItem({
                  ...item,
                  sectionTitle: section.title,
                  sectionImage: section.image,
                })
              }
            }}
            onPointerDown={(event) => {
              if (!event.target.closest('[data-fav-btn]')) {
                gsap.to(event.currentTarget, { scale: 0.992, duration: 0.08, ease: 'power2.out' })
              }
            }}
            onPointerUp={(event) => {
              gsap.to(event.currentTarget, { scale: 1, duration: 0.16, ease: 'back.out(2)' })
            }}
            onPointerLeave={(event) => {
              gsap.to(event.currentTarget, { scale: 1, duration: 0.16, ease: 'power2.out' })
            }}
          >
            <div className="flex min-w-0 gap-2">
              <FoodImage
                src={item.image || section.image}
                alt={item.name}
                category={section.title.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                className="h-11 w-11 shrink-0 rounded-lg border border-[var(--line)] sm:h-12 sm:w-12 sm:rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <VegIndicator veg={item.veg} />
                      <h3 className="min-w-0 flex-1 truncate text-[13px] font-black leading-tight text-[var(--text)] sm:text-sm">
                        <Highlight text={item.name} query={query} />
                      </h3>
                      {item.tag && (
                        <span className="rounded-full bg-[var(--orange)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    {item.toppings && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] leading-4 text-[var(--muted)] sm:text-xs sm:leading-4">
                        <Highlight text={item.toppings} query={query} />
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    data-fav-btn
                    onClick={(event) => {
                      event.stopPropagation()
                      onToggleFavorite(item.id, event.currentTarget)
                    }}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs transition ${
                      favorites.includes(item.id)
                        ? 'border-[var(--orange)] bg-[var(--orange)] text-white'
                        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]'
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

                <div className="mt-1 flex max-w-full flex-wrap justify-start gap-1">
                  {item.prices.map((price) => (
                    <span
                      key={`${item.id}-${price.label}-${price.value}`}
                      data-price-chip
                      className="rounded-md bg-[var(--surface-strong)] px-1.5 py-0.5 text-[10px] font-black leading-4 text-[var(--text)] ring-1 ring-[var(--line)] sm:px-2 sm:text-xs"
                    >
                      {price.label && <span className="mr-0.5 text-[var(--muted)] sm:mr-1">{price.label}</span>}
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
