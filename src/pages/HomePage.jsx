import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiHeart,
  FiShield,
  FiSmartphone,
  FiZap,
} from 'react-icons/fi'
import { FaFire } from 'react-icons/fa6'
import { revealHero, revealOnScroll } from '../animations/gsapAnimations'
import FoodImage from '../components/FoodImage'
import MenuItemSheet from '../components/MenuItemSheet'
import VegIndicator from '../components/VegIndicator'
import { menuSections } from '../data/menuSections'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getFlavorBadge } from '../utils/flavorBadge'

export const ZOMATO_URL = 'https://www.zomato.com'

const isRestrictedTime = () => {
  const hours = new Date().getHours()
  return hours >= 23 || hours < 6
}

const initialSections = isRestrictedTime()
  ? menuSections.filter((s) => s.title !== 'Everyday Classics' && s.title !== 'Classic Veg Combos')
  : menuSections

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

const getCategoryBadge = (sectionId) => {
  if (sectionId === 'veggie-cheese-loaded-pizzas') return '🔥 Bestseller'
  if (sectionId === 'royal-paneer-pizza') return '★ Chef Choice'
  if (sectionId === 'garlic-breads-sides') return 'Must Try'
  if (sectionId === 'drinks-corner') return 'Chilled'
  if (sectionId === 'burgers-street-bites') return 'Popular'
  return null
}

export default function HomePage() {
  const scopeRef = useRef(null)

  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('crust-favorites', [])

  // Only items strictly priced > 149
  const premiumSpecialItems = useMemo(() => {
    return initialAllMenuItems.filter((item) => getMinPrice(item) > 149)
  }, [])

  // Curated 6 primary categories with cover photos (no duplication)
  const featuredCategories = useMemo(() => {
    const selectedIds = [
      'veggie-cheese-loaded-pizzas',
      'royal-paneer-pizza',
      'garlic-breads-sides',
      'burgers-street-bites',
      'grilled-sandwiches',
      'drinks-corner',
    ]
    return initialSections.filter((s) => selectedIds.includes(s.id))
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
  const specialFlavorBadge = specialItem ? getFlavorBadge(specialItem, specialItem.sectionTitle) : null

  // Curated 4 distinct signature recommendations across 4 distinct categories (strictly excluding Today's Special)
  const signatureDishes = useMemo(() => {
    // 1. Gourmet Pizza (Royal Paneer Pizza)
    const pizza =
      initialAllMenuItems.find((i) => i.name === 'Loaded Indi Tandoori' && i.id !== specialItem?.id) ||
      initialAllMenuItems.find((i) => i.name === 'Paneer Makhani' && i.id !== specialItem?.id) ||
      initialAllMenuItems.find((i) => i.sectionId === 'royal-paneer-pizza' && i.id !== specialItem?.id)

    // 2. Gourmet Stuffed Bread (Garlic Breads & Sides)
    const bread =
      initialAllMenuItems.find((i) => i.name === 'Paneer Tikka Stuffed' && i.id !== specialItem?.id) ||
      initialAllMenuItems.find((i) => i.name === 'Garlic Bread Stuffed' && i.id !== specialItem?.id)

    // 3. Crispy Street Bite (French Fries / Burgers)
    const bite =
      initialAllMenuItems.find((i) => i.name === 'Cheese Loaded Fries' && i.id !== specialItem?.id) ||
      initialAllMenuItems.find((i) => i.name === 'Veg Burger' && i.id !== specialItem?.id)

    // 4. Chilled Cafe Beverage (Drinks Corner)
    const drink =
      initialAllMenuItems.find((i) => i.name === 'Cold Coffee with Ice Cream' && i.id !== specialItem?.id) ||
      initialAllMenuItems.find((i) => i.name === 'Cold Coffee' && i.id !== specialItem?.id)

    return [pizza, bread, bite, drink].filter(Boolean)
  }, [specialItem?.id])

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

  const handlePrevSpecial = (e) => {
    e.stopPropagation()
    setSpecialIndex((prev) => (prev - 1 + premiumSpecialItems.length) % premiumSpecialItems.length)
  }

  const handleNextSpecial = (e) => {
    e.stopPropagation()
    setSpecialIndex((prev) => (prev + 1) % premiumSpecialItems.length)
  }

  return (
    <div ref={scopeRef} className="mx-auto  space-y-7 sm:space-y-9 pb-4 sm:pb-6">
      {/* 1. Compact Hero Section */}
      <section className="mx-auto grid gap-5 px-3 pt-1 sm:gap-6 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="flex flex-col justify-center">
          {/* Logo Emblem + Pure Veg Tag */}
          <div className="mb-2.5 flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="The Crust Culture emblem"
              className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover shadow-md shadow-orange-500/20 ring-2 ring-amber-500/40 shrink-0"
            />
            <div
              data-hero-kicker
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 w-fit"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Pure Vegetarian Cafe</span>
            </div>
          </div>

          {/* Title */}
          <h1
            data-hero-title
            className="font-display text-2xl font-extrabold leading-[1.1] text-[var(--text)] sm:text-4xl lg:text-5xl tracking-tight"
          >
            Hot, crispy pizzas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--orange)] to-amber-500">
              dripping with cheese
            </span>
            , baked fresh for you.
          </h1>

          {/* Subtitle */}
          <p
            data-hero-copy
            className="mt-2 text-xs leading-relaxed text-[var(--muted)] sm:mt-3 sm:text-sm max-w-xl"
          >
            Loaded with stretchy mozzarella, farm-fresh toppings, and bold herbs — baked piping hot in our stone oven, fresh to order.
          </p>

          {/* Hero Actions (Primary Menu CTA & Heritage Link) */}
          <div data-hero-actions className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5">
            <Link
              to="/menu"
              className="touch-target group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-6 py-2.5 text-xs font-black text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 sm:text-sm"
            >
              <span>Explore Hot Pizzas 🍕</span>
              <FiArrowRight className="text-sm transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <a
              href="#our-story"
              className="touch-target inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-xs font-bold text-[var(--text)] transition hover:border-[var(--gold)] hover:bg-[var(--surface-strong)] active:translate-y-0 sm:text-sm"
            >
              <span>Why It Hits Different ✨</span>
            </a>
          </div>

          {/* Key Info Strip (Freshness & Dining Services) */}
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-5 border-t border-[var(--line)]/60 pt-3 text-xs font-semibold text-[var(--muted)]">
            <div className="flex items-center gap-1.5 text-[var(--text)]">
              <FiClock className="h-3.5 w-3.5 text-[var(--orange)]" />
              <span className="font-bold">Baked Fresh to Order</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiZap className="h-3.5 w-3.5 text-amber-500" />
              <span>Dine-In • Takeaway • Midnight Kitchen</span>
            </div>
          </div>
        </div>

        {/* Hero Media Card: Today's Special */}
        {specialItem && (
          <div data-hero-media className="relative group">
            <div
              onClick={() => setSelectedItem(specialItem)}
              className="relative block h-[280px] sm:h-[340px] lg:h-[370px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)]/80 text-left cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl hover:border-amber-500/40 bg-[var(--surface)]"
            >
              <FoodImage
                src={specialItem.image || specialItem.sectionImage || heroImage}
                alt={specialItem.name}
                category={specialItem.sectionTitle?.includes('Pizza') ? 'Pizza' : 'Restaurant'}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              {/* Top Bar on Image: Tag, Flavor Badge, Lightbox Cue, & Arrows */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 sm:top-4 sm:left-4 sm:right-4 z-10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300 backdrop-blur-md border border-white/15">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    Today's Special
                  </span>

                  {specialFlavorBadge && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${specialFlavorBadge.badgeClass}`}
                    >
                      <span>{specialFlavorBadge.emoji}</span>
                      <span>{specialFlavorBadge.label}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevSpecial}
                    aria-label="Previous special item"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 transition hover:bg-amber-500 hover:text-black active:scale-95 text-xs"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSpecial}
                    aria-label="Next special item"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 transition hover:bg-amber-500 hover:text-black active:scale-95 text-xs"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>

              {/* Bottom Glass Card Overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-xl border border-white/20 bg-black/65 p-3 backdrop-blur-xl sm:bottom-3 sm:left-3 sm:right-3 sm:rounded-2xl sm:p-4 shadow-xl z-10">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <VegIndicator veg={specialItem.veg} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300/90">
                        {specialItem.sectionTitle || 'Chef Selection'}
                      </p>
                    </div>
                    <h2 className="mt-0.5 truncate text-base font-black text-white sm:text-xl drop-shadow-sm">
                      {specialItem.name}
                    </h2>
                    {specialItem.toppings && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-stone-300 font-medium sm:text-xs">
                        {specialItem.toppings}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#1c120c] shadow sm:text-[11px]">
                      Chef Special
                    </span>
                  </div>
                </div>

                {/* Progress Indicators & Customize CTA */}
                <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1">
                    {premiumSpecialItems.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSpecialIndex(dotIdx)
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          dotIdx === specialIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Go to special ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 font-bold text-white group-hover:text-amber-300 transition-colors">
                    Add <FiArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Compact Explore by Category (6 Curated Tiles) */}
      <section data-reveal className="mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Menu Sections
            </span>
            <h2 className="font-display text-lg sm:text-2xl font-extrabold text-[var(--text)]">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--orange)] hover:underline"
          >
            <span>All 16 Categories</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {featuredCategories.map((section) => {
            const badge = getCategoryBadge(section.id)

            return (
              <Link
                key={section.id}
                to={`/menu?category=${encodeURIComponent(section.title)}`}
                className="group relative h-36 sm:h-40 w-full overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--line)] transition-all duration-300 hover:border-[var(--gold)]/80 hover:shadow-md hover:-translate-y-0.5"
              >
                <FoodImage
                  src={section.image}
                  alt={section.title}
                  category="Pizza"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />

                {/* Category Status Badge */}
                {badge && (
                  <span className="absolute top-2 left-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-300 backdrop-blur-md border border-white/15">
                    {badge}
                  </span>
                )}

                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                    {section.items.length} items
                  </span>
                  <h3 className="mt-1 text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {section.title}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 3. Chef's Signature Picks (4 Distinct Items with Option B & C Parity) */}
      <section data-reveal className="mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Cafe Highlights
            </span>
            <h2 className="font-display text-lg sm:text-2xl font-extrabold text-[var(--text)]">
              Signature Chef Picks
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--orange)] hover:underline"
          >
            <span>Full Menu</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
          {signatureDishes.map((item) => {
            const isFav = favorites.includes(item.id)
            const sigFlavorBadge = getFlavorBadge(item, item.sectionTitle)

            return (
              <div key={item.id} className="relative group">
                {/* Ambient Warm Underglow Aura */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-amber-600/10 blur-sm opacity-30 transition-all duration-300 group-hover:opacity-90 group-hover:scale-[1.02] pointer-events-none" />

                <div
                  onClick={() => setSelectedItem(item)}
                  className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2.5 sm:p-3 transition-all duration-300 group-hover:border-[var(--gold)]/60 group-hover:shadow-md cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:rounded-xl">
                      <FoodImage
                        src={item.image || item.sectionImage}
                        alt={item.name}
                        category="Pizza"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-108"
                      />

                      {/* Docked Micro-Flavor Badge */}
                      {sigFlavorBadge && (
                        <span
                          title={sigFlavorBadge.label}
                          className={`absolute top-1.5 left-1.5 z-10 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black backdrop-blur-md border ${sigFlavorBadge.badgeClass}`}
                        >
                          <span className="leading-none text-[9px]">{sigFlavorBadge.emoji}</span>
                          <span className="tracking-wider uppercase font-black">{sigFlavorBadge.label}</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                        className={`absolute top-1.5 right-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition ${
                          isFav
                            ? 'bg-[var(--orange)] text-white'
                            : 'bg-black/55 text-white hover:bg-black/75 border border-white/20'
                        }`}
                        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <FiHeart className={`text-xs ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5">
                      <VegIndicator veg={item.veg} />
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--gold)] truncate">
                        {item.sectionTitle}
                      </p>
                    </div>

                    <h3 className="mt-0.5 text-xs sm:text-sm font-extrabold text-[var(--text)] line-clamp-1 group-hover:text-[var(--orange)] transition-colors">
                      {item.name}
                    </h3>
                    {item.toppings && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--muted)]">
                        {item.toppings}
                      </p>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-[var(--line)]/60 pt-1.5 text-xs">
                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      ★ Chef Choice
                    </span>
                    <span className="font-bold text-[var(--orange)] text-[10px] sm:text-[11px] group-hover:underline">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. Culinary Craft & Story (Unified, Compact, NO REPEATED DATA) */}
      <section
        id="our-story"
        data-reveal
        className="mx-auto px-3 sm:px-6 lg:px-8 border-t border-[var(--line)] pt-6 sm:pt-8"
      >
        <div className="grid gap-6 md:grid-cols-12 items-center">
          {/* Left: Authentic Cafe Portrait Showcase (Exact 3:4 Original Aspect Ratio) */}
          <div className="md:col-span-5 lg:col-span-5 flex justify-center">
            <div className="group relative w-full max-w-sm overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)] bg-stone-900 shadow-md transition-all duration-300 hover:border-[var(--gold)]/70 hover:shadow-xl">
              {/* Full Original 3:4 Portrait Window */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <FoodImage
                  src="/images/cafe-storefront.jpg"
                  alt="The Crust Culture Cafe storefront and dine-in interior"
                  category="Restaurant"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-104"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 backdrop-blur-md border border-white/20 shadow-md">
                  🏡 Visit Our Cafe
                </div>

                {/* Bottom Address */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                  <span className="truncate drop-shadow-md">📍 Noble Enclave, Gurgaon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Story Narrative + 4 Craft Pillars */}
          <div className="md:col-span-7 lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)]">
                Why Pizza Lovers Choose Us
              </span>
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight text-[var(--text)]">
                Real dough, bubbling mozzarella & unforgettable crunch.
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                At The Crust Culture, pizza is our pure passion. Every single pizza begins with our signature slow-fermented sourdough, stretched by hand to order to create that coveted airy, blistered crust with an irresistible crunch in every single bite.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                We smother our pies with house-simmered herb tomato sauce, 100% pure stretchy mozzarella, tender fresh malai paneer, and crisp garden veggies. Baked in our blazing stone oven at high heat, each pizza comes to your table piping hot, bubbling, and golden fresh.
              </p>
            </div>

            {/* 4 Craft Pillars */}
            <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              {[
                {
                  icon: FaFire,
                  title: 'Blazing Stone Oven',
                  desc: 'Scorching stone-oven heat blisters the crust to golden perfection, locking in rich wood-fired aroma and crunch.',
                  accent: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                },
                {
                  icon: FiAward,
                  title: '100% Real Mozzarella & Paneer',
                  desc: 'Zero synthetic cheese or processed oils. Only thick, stretchy mozzarella and fresh malai paneer that melts in your mouth.',
                  accent: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
                },
                {
                  icon: FiShield,
                  title: 'Fresh Fermented Sourdough',
                  desc: 'Naturally fermented dough prepared fresh every morning for light digestion and that signature crispy crust.',
                  accent: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
                },
                {
                  icon: FiSmartphone,
                  title: 'Quick Table Ordering',
                  desc: 'Scan your table QR code, browse mouth-watering photos, customize toppings, and get it served fresh to your table!',
                  accent: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                },
              ].map((card) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.title}
                    className="rounded-xl sm:rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-3.5 transition-all duration-200 hover:border-[var(--gold)] hover:shadow-sm"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl border ${card.accent}`}
                    >
                      <Icon className="text-sm" />
                    </div>
                    <h3 className="mt-2 text-xs sm:text-sm font-extrabold text-[var(--text)]">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
                      {card.desc}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Cafe Assurance & Location Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)]/60 px-3.5 py-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--text)] font-extrabold">
                <span className="text-sm">📍</span>
                <span>Palam Vihar Extension, Gurgaon</span>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] font-semibold text-[var(--muted)]">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Pure Veg</span>
                <span>•</span>
                <span>Stone-Oven Baked</span>
                <span>•</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">Open till 1:30 AM</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Item Customization Sheet */}
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
