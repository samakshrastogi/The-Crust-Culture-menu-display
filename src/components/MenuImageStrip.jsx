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
      className="mb-2 sm:mb-3 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1.5 sm:p-2 shadow-xs"
    >
      <div className="no-scrollbar relative flex gap-2 overflow-x-auto py-0.5">
        {/* 'All Dishes' Tile */}
        <button
          ref={(element) => {
            tileRefs.current['All'] = element
          }}
          data-menu-tile
          type="button"
          onClick={() => onSelect('All')}
          className={`relative h-15 w-24 sm:h-18 sm:w-32 shrink-0 overflow-hidden rounded-lg sm:rounded-xl border text-left transition-all duration-200 ${
            activeCategory === 'All'
              ? 'border-[var(--orange)] ring-2 ring-[var(--orange)]/35 shadow-md shadow-orange-500/20'
              : 'border-[var(--line)] hover:border-[var(--gold)] opacity-85 hover:opacity-100'
          }`}
        >
          <FoodImage
            src="/images/pizza-margherita.jpg"
            alt="All dishes"
            category="Pizza"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2 text-white">
            <h3 className="text-[11px] font-black leading-tight sm:text-xs truncate">All Dishes</h3>
            <p className="text-[9px] font-bold text-amber-300">
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
              className={`relative h-15 w-28 sm:h-18 sm:w-36 shrink-0 overflow-hidden rounded-lg sm:rounded-xl border text-left transition-all duration-200 ${
                isActive
                  ? 'border-[var(--orange)] ring-2 ring-[var(--orange)]/35 shadow-md shadow-orange-500/20'
                  : 'border-[var(--line)] hover:border-[var(--gold)] opacity-90 hover:opacity-100'
              }`}
            >
              <FoodImage
                src={section.image}
                alt={section.title}
                category={section.title.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2 text-white">
                <h3 className="line-clamp-1 text-[11px] font-black leading-tight sm:text-xs">{section.title}</h3>
                <p className="text-[9px] font-bold text-amber-300 truncate">
                  {section.items.length} items{lowestPrice ? ` · ₹${lowestPrice}+` : ''}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
