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

  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (terms.length === 0) {
    return text
  }

  const regex = new RegExp(`(${terms.join('|')})`, 'gi')
  const parts = String(text).split(regex)

  return parts.map((part, index) =>
    terms.some((term) => new RegExp(`^${term}$`, 'i').test(part)) ? (
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

    gsap.set(sectionRef.current, { opacity: 1, y: 0, clearProps: 'opacity,transform' })
  }, [query])

  return (
    <section
      ref={sectionRef}
      data-card
      id={section.id}
      className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs sm:rounded-2xl transition-[border-color,box-shadow] duration-300 hover:border-[rgba(246,196,83,0.35)] hover:shadow-xs"
    >
      <div className="flex items-center justify-between gap-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1.5 sm:px-3.5 sm:py-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {section.image && (
            <img
              src={section.image}
              alt=""
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg object-cover border border-[var(--line)] shadow-2xs"
            />
          )}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-extrabold text-[var(--text)] sm:text-base">
              <Highlight text={section.title} query={query} />
            </h2>
            <p className="text-[10px] font-semibold text-[var(--muted)] sm:text-[11px]">
              {section.items.length} items
            </p>
          </div>
        </div>
        {section.labels?.some(Boolean) && (
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <span className="text-[10px] font-semibold text-[var(--muted)]">Sizes:</span>
            {section.labels.filter(Boolean).map((label) => (
              <span
                key={label}
                className="grid h-5 min-w-5 place-items-center rounded bg-[var(--cream)] px-1 text-[10px] font-black text-[#24150b] border border-[var(--line)]"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="divide-y divide-[var(--line)]/50">
        {section.items.map((item) => (
          <article
            key={item.id}
            data-menu-row
            className="group px-2.5 py-2 cursor-pointer transition-colors hover:bg-[var(--bg-soft)]/70 active:bg-[var(--bg-soft)] sm:px-3.5 sm:py-2.5"
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
                gsap.to(event.currentTarget, { scale: 0.994, duration: 0.08, ease: 'power2.out' })
              }
            }}
            onPointerUp={(event) => {
              gsap.to(event.currentTarget, { scale: 1, duration: 0.16, ease: 'back.out(2)' })
            }}
            onPointerLeave={(event) => {
              gsap.to(event.currentTarget, { scale: 1, duration: 0.16, ease: 'power2.out' })
            }}
          >
            <div className="flex min-w-0 gap-2.5 sm:gap-3 items-center">
              <div className="relative h-11 w-11 min-[360px]:h-12 min-[360px]:w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-[var(--line)]">
                <FoodImage
                  src={item.image || section.image}
                  alt={item.name}
                  category={section.title.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <VegIndicator veg={item.veg} />
                      <h3 className="min-w-0 flex-1 truncate text-xs font-extrabold leading-tight text-[var(--text)] group-hover:text-[var(--orange)] transition-colors sm:text-sm">
                        <Highlight text={item.name} query={query} />
                      </h3>
                      {item.tag && (
                        <span className="shrink-0 rounded-full bg-gradient-to-r from-[var(--orange)] to-amber-500 px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-white shadow-2xs">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    {item.toppings && (
                      <p className="mt-0.5 line-clamp-1 text-[10.5px] leading-tight text-[var(--muted)] sm:text-[11.5px]">
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
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs transition ${
                      favorites.includes(item.id)
                        ? 'border-[var(--orange)] bg-[var(--orange)] text-white shadow-xs'
                        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--orange)] hover:text-[var(--orange)]'
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

                <div className="mt-1 flex max-w-full flex-wrap items-center gap-1 min-[360px]:gap-1.5">
                  {item.prices.map((price) => (
                    <span
                      key={`${item.id}-${price.label}-${price.value}`}
                      data-price-chip
                      className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-strong)] px-1.5 py-0.5 text-[10px] min-[360px]:text-[11px] font-black text-[var(--text)] border border-[var(--line)] shadow-2xs group-hover:border-[var(--gold)]/40 transition-colors"
                    >
                      {price.label && (
                        <span className="text-[9px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                          {price.label}:
                        </span>
                      )}
                      <span className="text-[var(--orange)] font-black">{formatPrice(price.value)}</span>
                    </span>
                  ))}
                  <span className="ml-auto hidden text-[10px] font-semibold text-[var(--muted)] group-hover:text-[var(--orange)] group-hover:inline-block transition-colors sm:inline-block">
                    Customize &rarr;
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
