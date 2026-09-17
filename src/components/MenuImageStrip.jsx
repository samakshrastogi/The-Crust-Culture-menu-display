import { useEffect, useMemo, useRef } from 'react'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'

function getLowestPrice(section) {
  const prices = section.items
    .flatMap((item) => item.prices)
    .map((price) => Number.parseInt(price.value, 10))
    .filter((price) => Number.isFinite(price))

  return prices.length ? Math.min(...prices) : null
}

export default function MenuImageStrip({ sections, activeCategory, onSelect }) {
  const stripRef = useRef(null)
  const tileRefs = useRef({})

  const { lowestPrices, totalItems } = useMemo(() => {
    const prices = {}
    let itemsCount = 0
    for (const section of sections) {
      prices[section.id] = getLowestPrice(section)
      itemsCount += section.items.length
    }
    return { lowestPrices: prices, totalItems: itemsCount }
  }, [sections])

  useEffect(() => {
    const tiles = Object.values(tileRefs.current).filter(Boolean)
    const activeTile = tileRefs.current[activeCategory]

    gsap.to(tiles, {
      scale: 1,
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      duration: 0.18,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    if (activeTile) {
      gsap.to(activeTile, {
        scale: 1.02,
        boxShadow: '0 6px 18px rgba(249, 115, 22, 0.25)',
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      const container = activeTile.parentElement
      if (container) {
        const containerWidth = container.clientWidth
        const tileLeft = activeTile.offsetLeft
        const tileWidth = activeTile.clientWidth
        container.scrollTo({
          left: tileLeft - (containerWidth / 2) + (tileWidth / 2),
          behavior: 'smooth',
        })
      }
    }
  }, [activeCategory])

  return (
    <nav
      ref={stripRef}
      aria-label="Menu categories photo navigation"
      className="mb-2 sm:mb-2.5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-1.5 sm:p-2 shadow-xs"
    >
      <div className="no-scrollbar relative flex gap-2 sm:gap-2.5 overflow-x-auto py-0.5 px-0.5">
        {/* 'All Dishes' Tile */}
        <button
          ref={(element) => {
            tileRefs.current['All'] = element
          }}
          data-menu-tile
          type="button"
          aria-pressed={activeCategory === 'All'}
          onClick={() => onSelect('All')}
          className={`group flex flex-col shrink-0 w-25 sm:w-28 overflow-hidden rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            activeCategory === 'All'
              ? 'border-[var(--orange)] ring-2 ring-[var(--orange)]/40 shadow-sm bg-gradient-to-b from-[var(--surface)] to-[var(--orange)]/10'
              : 'border-[var(--line)] bg-[var(--surface)] hover:border-amber-500/40 hover:shadow-xs'
          }`}
        >
          {/* Unobstructed Food Photo Window */}
          <div className="relative h-15 sm:h-17 w-full overflow-hidden bg-[var(--surface-strong)]">
            <FoodImage
              src="/images/pizza-margherita.jpg"
              alt="All dishes"
              category="Pizza"
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-108"
            />
            <span className="absolute top-1 right-1 rounded-full bg-black/65 backdrop-blur-xs px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black text-white border border-white/20">
              {totalItems}
            </span>
          </div>

          {/* Clean Label Surface Below Photo */}
          <div className="p-1.5 sm:p-2">
            <h3 className="truncate text-[11px] sm:text-xs font-black leading-tight text-[var(--text)] group-hover:text-[var(--orange)] transition-colors">
              All Dishes
            </h3>
            <p className="mt-0.5 text-[10px] font-bold text-[var(--muted)] truncate">
              {totalItems} items
            </p>
          </div>
        </button>

        {sections.map((section, index) => {
          const lowestPrice = lowestPrices[section.id]
          const isActive = activeCategory === section.title

          return (
            <button
              key={section.id}
              ref={(element) => {
                tileRefs.current[section.title] = element
              }}
              data-menu-tile
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(section.title)}
              className={`group flex flex-col shrink-0 w-25 sm:w-28 overflow-hidden rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border-[var(--orange)] ring-2 ring-[var(--orange)]/40 shadow-sm bg-gradient-to-b from-[var(--surface)] to-[var(--orange)]/10'
                  : 'border-[var(--line)] bg-[var(--surface)] hover:border-amber-500/40 hover:shadow-xs'
              }`}
            >
              {/* Unobstructed Food Photo Window */}
              <div className="relative h-15 sm:h-17 w-full overflow-hidden bg-[var(--surface-strong)]">
                <FoodImage
                  src={section.image}
                  alt={section.title}
                  category={section.title.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                  loading={index < 8 ? 'eager' : 'lazy'}
                  fetchPriority={index < 4 ? 'high' : 'auto'}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-108"
                />
                <span className="absolute top-1 right-1 rounded-full bg-black/65 backdrop-blur-xs px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black text-white border border-white/20">
                  {section.items.length}
                </span>
              </div>

              {/* Clean Label Surface Below Photo */}
              <div className="p-1.5 sm:p-2">
                <h3 className="truncate text-[11px] sm:text-xs font-black leading-tight text-[var(--text)] group-hover:text-[var(--orange)] transition-colors">
                  {section.title}
                </h3>
                <p className="mt-0.5 text-[10px] font-black text-[var(--orange)] truncate">
                  {lowestPrice ? `₹${lowestPrice}` : `${section.items.length} items`}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
