import { useEffect, useRef } from 'react'
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

  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0)

  return (
    <section
      ref={stripRef}
      className="mb-3 sm:mb-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 sm:p-2.5 shadow-xs"
    >
      <div className="no-scrollbar relative flex gap-2.5 sm:gap-3 overflow-x-auto py-1 px-0.5">
        {/* 'All Dishes' Tile */}
        <button
          ref={(element) => {
            tileRefs.current['All'] = element
          }}
          data-menu-tile
          type="button"
          onClick={() => onSelect('All')}
          className={`group flex flex-col shrink-0 w-28 sm:w-34 overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
            activeCategory === 'All'
              ? 'border-[var(--orange)] ring-2 ring-[var(--orange)]/40 shadow-md shadow-orange-500/20 bg-gradient-to-b from-[var(--surface)] to-[var(--orange)]/10'
              : 'border-[var(--line)] bg-[var(--surface)] hover:border-amber-500/40 hover:shadow-xs'
          }`}
        >
          {/* Unobstructed Food Photo Window */}
          <div className="relative h-20 sm:h-24 w-full overflow-hidden bg-[var(--surface-strong)]">
            <FoodImage
              src="/images/pizza-margherita.jpg"
              alt="All dishes"
              category="Pizza"
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-108"
            />
            <span className="absolute top-1.5 right-1.5 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-extrabold text-white border border-white/20">
              {totalItems}
            </span>
          </div>

          {/* Clean Label Surface Below Photo */}
          <div className="p-2 sm:p-2.5">
            <h3 className="truncate text-xs sm:text-[13px] font-black leading-tight text-[var(--text)] group-hover:text-[var(--orange)] transition-colors">
              All Dishes
            </h3>
            <p className="mt-0.5 text-[10px] sm:text-[11px] font-bold text-[var(--muted)] truncate">
              {totalItems} items
            </p>
          </div>
        </button>

        {sections.map((section) => {
          const lowestPrice = getLowestPrice(section)
          const isActive = activeCategory === section.title

          return (
            <button
              key={section.id}
              ref={(element) => {
                tileRefs.current[section.title] = element
              }}
              data-menu-tile
              type="button"
              onClick={() => onSelect(section.title)}
              className={`group flex flex-col shrink-0 w-28 sm:w-34 overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border-[var(--orange)] ring-2 ring-[var(--orange)]/40 shadow-md shadow-orange-500/20 bg-gradient-to-b from-[var(--surface)] to-[var(--orange)]/10'
                  : 'border-[var(--line)] bg-[var(--surface)] hover:border-amber-500/40 hover:shadow-xs'
              }`}
            >
              {/* Unobstructed Food Photo Window */}
              <div className="relative h-20 sm:h-24 w-full overflow-hidden bg-[var(--surface-strong)]">
                <FoodImage
                  src={section.image}
                  alt={section.title}
                  category={section.title.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                  loading="eager"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-108"
                />
                <span className="absolute top-1.5 right-1.5 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-extrabold text-white border border-white/20">
                  {section.items.length}
                </span>
              </div>

              {/* Clean Label Surface Below Photo */}
              <div className="p-2 sm:p-2.5">
                <h3 className="truncate text-xs sm:text-[13px] font-black leading-tight text-[var(--text)] group-hover:text-[var(--orange)] transition-colors">
                  {section.title}
                </h3>
                <p className="mt-0.5 text-[10px] sm:text-[11px] font-bold text-[var(--orange)] truncate">
                  {lowestPrice ? `From ₹${lowestPrice}` : `${section.items.length} items`}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
