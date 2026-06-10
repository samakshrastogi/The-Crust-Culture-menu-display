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
        scale: 1.035,
        boxShadow: '0 14px 34px rgba(249, 115, 22, 0.2)',
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
  }, [activeCategory])

  return (
    <section className="mb-3 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 sm:mb-5 sm:p-3">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {sections.map((section) => {
          const lowestPrice = getLowestPrice(section)
          const isActive = activeCategory === section.title

          return (
            <button
              key={section.id}
              ref={(element) => {
                tileRefs.current[section.title] = element
              }}
              type="button"
              onClick={() => onSelect(section.title)}
              className={`relative h-24 w-36 shrink-0 overflow-hidden rounded-2xl border text-left transition sm:h-32 sm:w-48 ${
                isActive ? 'border-[var(--orange)] ring-2 ring-[var(--orange)]/25' : 'border-[var(--line)]'
              }`}
            >
              <FoodImage
                src={section.image}
                alt={section.title}
                category={section.title.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                <h3 className="line-clamp-2 text-xs font-black leading-tight sm:text-sm">{section.title}</h3>
                <p className="mt-1 text-[10px] font-bold text-white/85 sm:text-xs">
                  {section.items.length} items{lowestPrice ? ` · From ₹${lowestPrice}` : ''}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
