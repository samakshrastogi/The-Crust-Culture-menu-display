import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiStar,
} from 'react-icons/fi'
import { revealHero, revealOnScroll } from '../animations/gsapAnimations'
import FoodImage from '../components/FoodImage'
import { menuSections } from '../data/menuSections'
import { useLocalStorage } from '../hooks/useLocalStorage'
import MenuItemSheet from '../components/MenuItemSheet'

const isRestrictedTime = () => {
  const hours = new Date().getHours()
  return hours >= 23 || hours < 6
}

const initialSections = isRestrictedTime()
  ? menuSections.filter((s) => s.title !== 'Everyday Classics' && s.title !== 'Classic Veg Combos')
  : menuSections

const initialCategories = initialSections.map((s) => s.title)

const initialAllMenuItems = initialSections.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionImage: section.image,
  })),
)

const heroImage = '/images/pizza-veggie.jpg'

const getMinPrice = (item) => {
  if (!item || !item.prices || item.prices.length === 0) return 0
  const parsedPrices = item.prices
    .map((p) => {
      const match = String(p.value || '').match(/(\d+)/)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter((v) => v > 0)
  return parsedPrices.length ? Math.min(...parsedPrices) : 0
}

export default function HomePage() {
  const scopeRef = useRef(null)
  const featuredSections = initialSections.slice(1, 5) // Compact: show 4 sections instead of 6

  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('crust-favorites', [])

  // Only items strictly priced > 149
  const premiumSpecialItems = useMemo(() => {
    return initialAllMenuItems.filter((item) => getMinPrice(item) > 149)
  }, [])

  const [specialIndex, setSpecialIndex] = useState(0)

  // Auto-cycle through specials every 6 seconds
  useEffect(() => {
    if (premiumSpecialItems.length <= 1) return
    const interval = setInterval(() => {
      setSpecialIndex((prev) => (prev + 1) % premiumSpecialItems.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [premiumSpecialItems.length])

  const specialItem = premiumSpecialItems[specialIndex] || premiumSpecialItems[0]

  useEffect(() => {
    const heroContext = revealHero(scopeRef)
    const scrollContext = revealOnScroll(scopeRef)

    return () => {
      heroContext.revert()
      scrollContext.revert()
    }
  }, [])

  const toggleFavorite = (itemId) => {
    setFavorites((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    )
  }

  const minPrice = specialItem ? getMinPrice(specialItem) : 0
  const priceDisplay = minPrice ? `₹${minPrice}+` : ''

  const handlePrevSpecial = (e) => {
    e.stopPropagation()
    setSpecialIndex((prev) => (prev - 1 + premiumSpecialItems.length) % premiumSpecialItems.length)
  }

  const handleNextSpecial = (e) => {
    e.stopPropagation()
    setSpecialIndex((prev) => (prev + 1) % premiumSpecialItems.length)
  }

  return (
    <div ref={scopeRef} className="space-y-6">
      {/* Hero Section */}
      <section className="mx-auto grid gap-6 px-3 pb-4 pt-2 sm:gap-8 sm:px-6 sm:pb-6 sm:pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-6">
        <div className="flex flex-col justify-center">
          {/* Tag / Kicker */}
          <div
            data-hero-kicker
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 w-fit"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Wood-Fired Kitchen • 100% Pure Veg
          </div>

          {/* Title */}
          <h1
            data-hero-title
            className="font-display text-3xl font-extrabold leading-[1.08] text-[var(--text)] sm:text-5xl lg:text-6xl tracking-tight"
          >
            Fresh crusts,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--orange)] to-amber-500">
              slow fire
            </span>
            , fast table ordering.
          </h1>

          {/* Subtitle / Copy */}
          <p
            data-hero-copy
            className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:mt-4 sm:text-base max-w-xl"
          >
            Slow-fermented artisan crusts, 100% pure vegetarian gourmet recipes, and sizzling sides
            baked fresh to order in Palam Vihar, Gurgaon.
          </p>

          {/* Hero Actions */}
          <div data-hero-actions className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <Link
              to="/menu"
              className="touch-target group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 sm:text-base"
            >
              Explore Menu{' '}
              <FiArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}
              className="touch-target inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3.5 text-sm font-bold text-[var(--text)] transition hover:border-[var(--gold)] hover:bg-[var(--surface)]/80 sm:text-base"
            >
              Our Story
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-[var(--line)]/60 pt-4 text-xs font-semibold text-[var(--muted)]">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <FiStar className="h-3 w-3 fill-current" />
              </span>
              <span>4.8 Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <FiCheckCircle className="h-3 w-3" />
              </span>
              <span>100% Pure Veg</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <FiClock className="h-3 w-3" />
              </span>
              <span>Open till 1:30 AM</span>
            </div>
          </div>
        </div>

        {/* Hero Media Card: Strictly items > 149 */}
        {specialItem && (
          <div data-hero-media className="relative group">
            <button
              type="button"
              onClick={() => setSelectedItem(specialItem)}
              className="relative block h-[320px] sm:h-[400px] lg:h-[440px] w-full overflow-hidden rounded-3xl border border-[var(--line)]/80 sm:rounded-[2.25rem] text-left cursor-pointer shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-amber-500/40"
            >
              <FoodImage
                src={specialItem.image || specialItem.sectionImage || heroImage}
                alt={specialItem.name}
                category={specialItem.sectionTitle?.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              {/* Top Bar on Image */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 sm:top-4 sm:left-4 sm:right-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-amber-300 backdrop-blur-md border border-white/15">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  Today's Special
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevSpecial}
                    aria-label="Previous special item"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 transition hover:bg-amber-500 hover:text-black hover:border-amber-400 active:scale-95"
                  >
                    <FiChevronLeft className="text-base" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSpecial}
                    aria-label="Next special item"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 transition hover:bg-amber-500 hover:text-black hover:border-amber-400 active:scale-95"
                  >
                    <FiChevronRight className="text-base" />
                  </button>
                </div>
              </div>

              {/* Bottom Glass Card Overlay */}
              <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/20 bg-black/65 p-4 backdrop-blur-xl sm:bottom-4 sm:left-4 sm:right-4 sm:rounded-3xl sm:p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300/90">
                      {specialItem.sectionTitle || 'Chef Selection'}
                    </p>
                    <h2 className="mt-0.5 truncate text-lg font-black text-white sm:mt-1 sm:text-2xl drop-shadow-sm">
                      {specialItem.name}
                    </h2>
                    {specialItem.toppings && (
                      <p className="mt-1 line-clamp-1 text-xs text-stone-300 font-medium sm:text-sm">
                        {specialItem.toppings}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200/80">Starts at</p>
                    <p className="mt-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1 text-sm font-black text-[#1c120c] sm:text-base shadow">
                      {priceDisplay}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px] sm:text-xs">
                  <span className="text-amber-300/90 font-semibold">
                    Special {specialIndex + 1} of {premiumSpecialItems.length}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-white group-hover:text-amber-300 transition-colors">
                    Tap to view & customize <FiArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </button>
          </div>
        )}
      </section>

      {/* Badges Section */}
      <section data-reveal className="mx-auto  px-3 py-2 sm:px-6 sm:py-4 lg:px-8">
        <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4">
          {[
            { icon: FiStar, label: 'Menu', value: `${initialAllMenuItems.length} priced items` },
            { icon: FiClock, label: 'Open daily', value: '1:30 PM - 1:30 AM' },
            { icon: FiArrowRight, label: 'QR ready', value: 'Land directly on menu' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:rounded-[1.25rem] sm:p-4">
              <item.icon className="mb-1.5 text-lg text-[var(--orange)] sm:mb-3 sm:text-xl" />
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--gold)] sm:text-xs sm:tracking-[0.2em]">{item.label}</p>
              <p className="mt-0.5 text-sm font-black text-[var(--text)] sm:mt-1 sm:text-lg">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Sections Grid */}
      <section data-reveal className="mx-auto  px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display mt-1 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Menu sections</h2>
          </div>
          <Link to="/menu" className="hidden font-bold text-[var(--gold)] sm:block">
            See all
          </Link>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {featuredSections.map((section) => (
            <Link
              key={section.id}
              to={`/menu?category=${encodeURIComponent(section.title)}`}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 transition hover:border-[var(--gold)] sm:rounded-[1.25rem] sm:p-4"
            >
              <h3 className="text-sm font-black text-[var(--text)] sm:text-base">{section.title}</h3>
              <p className="mt-1 text-xs font-semibold text-[var(--muted)]">{section.items.length} priced items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Horizontal / Grid */}
      <section data-reveal className="mx-auto  px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {initialCategories.slice(0, 4).map((category) => (
            <Link
              key={category}
              to={`/menu?category=${encodeURIComponent(category)}`}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 transition hover:border-[var(--gold)] sm:rounded-[1.25rem] sm:p-4"
            >
              <h3 className="text-sm font-black text-[var(--text)] sm:text-lg">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section
        id="our-story"
        data-reveal
        className="mx-auto  px-3 py-6 sm:px-6 sm:py-8 lg:px-8 border-t border-[var(--line)]"
      >
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Our Story
            </span>
            <h2 className="font-display text-2xl font-semibold leading-tight text-[var(--text)] sm:text-3xl">
              Fire, fermentation, and a table built for sharing.
            </h2>
            <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              At The Crust Culture, we believe great pizza starts with patience. Our signature sourdough crusts undergo a slow fermentation process before meeting the high heat of our ovens. Paired with fresh toppings, premium cheese, and a passion for culinary excellence, we bring you an unforgettable dining experience.
            </p>
            <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              Whether you are here for our signature classics, gourmet paneer collection, or delightful desserts, every item is crafted to perfection and served fresh to your table.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[1.25rem] border border-[var(--line)] max-w-md mx-auto w-full">
            <FoodImage
              src="/images/pizza-margherita.jpg"
              alt="The Crust Culture restaurant kitchen"
              category="Restaurant"
              className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-102"
            />
          </div>
        </div>
      </section>

      {selectedItem && (
        <MenuItemSheet
          item={selectedItem}
          favorites={favorites}
          onClose={() => setSelectedItem(null)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}
