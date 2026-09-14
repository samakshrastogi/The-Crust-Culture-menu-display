import { useEffect, useRef } from 'react'
import { FiHeart } from 'react-icons/fi'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'
import VegIndicator from './VegIndicator'
import { getFlavorBadge } from '../utils/flavorBadge'

function parsePriceParts(value) {
  if (!value) return { price: '', note: '' }
  const str = String(value).trim()
  const match = str.match(/^(\d+)\s*\((.*?)\)$/i)
  if (match) {
    return { price: `₹${match[1]}`, note: match[2] }
  }
  if (/rs/i.test(str)) {
    return { price: str, note: '' }
  }

  return { price: `₹${str}`, note: '' }
}

function formatPrice(value) {
  const { price, note } = parsePriceParts(value)
  return note ? `${price} (${note})` : price
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
      className="scroll-mt-28 sm:scroll-mt-32 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-amber-500/30 hover:shadow-sm"
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
          const flavorBadge = getFlavorBadge(item, section.title)
          const priceParts = item.prices.length === 1 ? parsePriceParts(item.prices[0].value) : null

          return (
            <article
              key={item.id}
              data-menu-row
              className="group px-2.5 py-2 sm:px-3 sm:py-2.5 cursor-pointer transition-colors hover:bg-[var(--bg-soft)]/60 active:bg-[var(--bg-soft)]"
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
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                {/* 1. Item Pic (Left - Clean & Unobstructed) */}
                <div className="relative shrink-0 flex flex-col items-center">
                  {/* Subtle Ambient Warm Glow */}
                  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-transparent blur-xs opacity-25 transition-all duration-300 group-hover:opacity-85 pointer-events-none" />

                  <div className="relative h-14 w-14 min-[360px]:h-16 min-[360px]:w-16 sm:h-18 sm:w-18 overflow-hidden rounded-xl border border-[var(--line)] shadow-2xs bg-[var(--surface-strong)] transition-all duration-300 group-hover:border-[var(--gold)]/50">
                    <FoodImage
                      src={item.image || section.image}
                      alt={item.name}
                      category={section.title.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-108"
                    />

                    {/* Floating Favorite Heart (Top Right) */}
                    <button
                      type="button"
                      data-fav-btn
                      onClick={(event) => {
                        event.stopPropagation()
                        onToggleFavorite(item.id, event.currentTarget)
                      }}
                      className={`absolute top-1 right-1 z-10 grid h-5 w-5 place-items-center rounded-full backdrop-blur-md text-[10px] transition active:scale-90 ${
                        favorites.includes(item.id)
                          ? 'bg-[var(--orange)] text-white shadow-xs'
                          : 'bg-black/50 text-white hover:bg-black/70 border border-white/20'
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
                </div>

                {/* 2. Name of Item & Details Below Name (Middle / Fill) */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  {/* Name & Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <VegIndicator veg={item.veg} />
                    <h3 className="text-xs sm:text-sm font-extrabold leading-snug text-[var(--text)] group-hover:text-[var(--orange)] transition-colors">
                      <Highlight text={item.name} query={query} />
                    </h3>
                    {flavorBadge && (
                      <span
                        title={flavorBadge.label}
                        className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black border ${flavorBadge.badgeClass}`}
                      >
                        <span className="leading-none text-[8px]">{flavorBadge.emoji}</span>
                        <span className="tracking-wider uppercase font-black">{flavorBadge.label}</span>
                      </span>
                    )}
                    {item.tag && (
                      <span className="shrink-0 rounded-full bg-gradient-to-r from-[var(--orange)] to-amber-500 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-white shadow-2xs">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Toppings / Description Below Name */}
                  {toppingsText && (
                    <p className="line-clamp-1 text-[11px] leading-relaxed text-[var(--muted)]">
                      <Highlight text={toppingsText} query={query} />
                    </p>
                  )}

                  {/* Multi-Size Chips Below Name if multi-sized */}
                  {item.prices.length > 1 && (
                    <div className="flex flex-wrap items-center gap-1 pt-0.5">
                      {item.prices.map((price) => (
                        <span
                          key={`${item.id}-${price.label}-${price.value}`}
                          data-price-chip
                          className="inline-flex items-center gap-1 rounded bg-[var(--surface-strong)] px-1.5 py-0.2 text-[10px] font-black text-[var(--text)] border border-[var(--line)] shadow-2xs group-hover:border-[var(--gold)]/40 transition-colors"
                        >
                          {price.label && (
                            <span className="text-[9px] font-bold text-[var(--gold)] uppercase">
                              {price.label}:
                            </span>
                          )}
                          <span className="text-[var(--orange)] font-black">₹{price.value}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Packaging Fee Note Below Name if single item with note */}
                  {priceParts?.note && (
                    <span className="inline-block text-[10px] font-medium text-[var(--muted)]">
                      ({priceParts.note})
                    </span>
                  )}
                </div>

                {/* 3. Price of Item & Action (Right - Clean & No 'Starts at') */}
                <div className="shrink-0 flex flex-col items-end justify-center text-right space-y-1 pl-1">
                  <span className="text-sm sm:text-base font-black text-[var(--orange)] tracking-tight leading-none">
                    {item.prices.length === 1
                      ? (priceParts?.price || formatPrice(item.prices[0].value))
                      : `₹${item.prices[0].value}`}
                  </span>

                  {/* Compact Customize Button */}
                  <button
                    type="button"
                    className="touch-target inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-2xs transition-all duration-200 group-hover:scale-105 active:scale-95 border border-white/25 whitespace-nowrap cursor-pointer"
                  >
                    <span>Customize</span>
                    <span className="text-[10px] font-black leading-none">+</span>
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
