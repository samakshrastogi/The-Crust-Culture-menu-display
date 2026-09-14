import { useEffect, useRef } from 'react'
import { FiHeart } from 'react-icons/fi'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'
import VegIndicator from './VegIndicator'

function formatPrice(value) {
  if (!value) return ''
  const str = String(value).trim()
  if (/^(\d+)\s*\((.*?)\)$/i.test(str)) {
    const match = str.match(/^(\d+)\s*\((.*?)\)$/i)
    return `₹${match[1]} (${match[2]})`
  }
  if (/rs/i.test(str)) {
    return str
  }

  return `₹${str}`
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
      className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-amber-500/30 hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-2.5 border-b border-[var(--line)] bg-gradient-to-r from-[var(--surface-strong)]/60 via-[var(--surface)] to-[var(--surface-strong)]/60 px-3 py-2 sm:px-3.5 sm:py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          {section.image && (
            <img
              src={section.image}
              alt=""
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg object-cover border border-amber-500/25 shadow-2xs shrink-0"
            />
          )}
          <div className="min-w-0">
            <h2 className="truncate text-xs sm:text-sm font-extrabold text-[var(--text)]">
              <Highlight text={section.title} query={query} />
            </h2>
            <p className="text-[10px] font-semibold text-[var(--muted)]">
              {section.items.length} items
            </p>
          </div>
        </div>
        {section.labels?.some(Boolean) && (
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">Sizes:</span>
            {section.labels.filter(Boolean).map((label) => (
              <span
                key={label}
                className="grid h-5 min-w-5 place-items-center rounded bg-[var(--cream)] px-1 text-[9px] font-black text-[#24150b] border border-[var(--line)] shadow-2xs"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="divide-y divide-[var(--line)]/40">
        {section.items.map((item) => {
          const toppingsText = item.toppings ? item.toppings.replace(/^\((.*)\)$/, '$1') : null

          return (
            <article
              key={item.id}
              data-menu-row
              className="group px-3 py-2.5 sm:px-3.5 sm:py-2.5 cursor-pointer transition-colors hover:bg-[var(--bg-soft)]/60 active:bg-[var(--bg-soft)]"
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
                  gsap.to(event.currentTarget, { scale: 0.996, duration: 0.08, ease: 'power2.out' })
                }
              }}
              onPointerUp={(event) => {
                gsap.to(event.currentTarget, { scale: 1, duration: 0.16, ease: 'back.out(2)' })
              }}
              onPointerLeave={(event) => {
                gsap.to(event.currentTarget, { scale: 1, duration: 0.16, ease: 'power2.out' })
              }}
            >
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                {/* Left: Dish Details & Pricing */}
                <div className="min-w-0 flex-1 flex flex-col justify-center space-y-1">
                  {/* Name & Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <VegIndicator veg={item.veg} />
                    <h3 className="text-sm sm:text-base font-extrabold leading-snug text-[var(--text)] group-hover:text-[var(--orange)] transition-colors">
                      <Highlight text={item.name} query={query} />
                    </h3>
                    {item.tag && (
                      <span className="shrink-0 rounded-full bg-gradient-to-r from-[var(--orange)] to-amber-500 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider text-white shadow-2xs">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Toppings / Description */}
                  {toppingsText && (
                    <p className="line-clamp-1 sm:line-clamp-2 text-[11px] sm:text-xs leading-relaxed text-[var(--muted)]">
                      <Highlight text={toppingsText} query={query} />
                    </p>
                  )}

                  {/* Pricing */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {item.prices.length === 1 ? (
                      <span className="text-sm sm:text-base font-black text-[var(--orange)] tracking-tight">
                        {formatPrice(item.prices[0].value)}
                      </span>
                    ) : (
                      item.prices.map((price) => (
                        <span
                          key={`${item.id}-${price.label}-${price.value}`}
                          data-price-chip
                          className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-strong)] px-1.5 py-0.5 text-[10px] sm:text-[11px] font-black text-[var(--text)] border border-[var(--line)] shadow-2xs group-hover:border-[var(--gold)]/40 transition-colors"
                        >
                          {price.label && (
                            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--muted)] uppercase">
                              {price.label}:
                            </span>
                          )}
                          <span className="text-[var(--orange)] font-black">{formatPrice(price.value)}</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Right: Compact Food Photo + Action Button */}
                <div className="relative shrink-0 flex flex-col items-center pt-0.5 pb-1">
                  <div className="relative h-16 w-16 min-[360px]:h-17 min-[360px]:w-17 sm:h-20 sm:w-20 overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--line)] shadow-2xs bg-[var(--surface-strong)]">
                    <FoodImage
                      src={item.image || section.image}
                      alt={item.name}
                      category={section.title.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-108"
                    />
                    {/* Floating Favorite Heart */}
                    <button
                      type="button"
                      data-fav-btn
                      onClick={(event) => {
                        event.stopPropagation()
                        onToggleFavorite(item.id, event.currentTarget)
                      }}
                      className={`absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full backdrop-blur-md text-[11px] transition active:scale-90 ${
                        favorites.includes(item.id)
                          ? 'bg-[var(--orange)] text-white shadow-xs'
                          : 'bg-black/55 text-white hover:bg-black/75 border border-white/20'
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

                  {/* Docked Compact Customize Button */}
                  <button
                    type="button"
                    className="touch-target -mt-2.5 z-10 inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-xs transition-transform duration-200 group-hover:scale-105 active:scale-95 border border-white/30 whitespace-nowrap"
                  >
                    <span>Customize</span>
                    <span className="text-[11px] font-black leading-none">+</span>
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
