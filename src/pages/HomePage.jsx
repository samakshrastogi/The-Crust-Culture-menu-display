import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiExternalLink,
  FiHeart,
  FiLayers,
  FiPhone,
  FiSmartphone,
  FiStar,
  FiZap,
} from 'react-icons/fi'
import { SiZomato } from 'react-icons/si'
import { revealHero, revealOnScroll } from '../animations/gsapAnimations'
import FoodImage from '../components/FoodImage'
import { menuSections } from '../data/menuSections'
import { useLocalStorage } from '../hooks/useLocalStorage'
import MenuItemSheet from '../components/MenuItemSheet'

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

  // Curated chef signature recommendations across different categories
  const signatureDishes = useMemo(() => {
    const targetNames = [
      'Farmhouse Pizza',
      'Loaded Indi Tandoori',
      'Paneer Tikka Stuffed',
      'Crispy Veg Burger',
    ]
    const found = initialAllMenuItems.filter((item) => targetNames.includes(item.name))
    // Fallback if any specific item name isn't matched
    return found.length >= 4 ? found.slice(0, 4) : premiumSpecialItems.slice(0, 4)
  }, [premiumSpecialItems])

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
    <div ref={scopeRef} className="space-y-7 sm:space-y-9">
      {/* 1. Compact Hero Section */}
      <section className="mx-auto grid gap-5 px-3 pt-1 sm:gap-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8">
        <div className="flex flex-col justify-center">
          {/* Tag / Kicker (Stated ONCE) */}
          <div
            data-hero-kicker
            className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 w-fit"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Pure Vegetarian Kitchen</span>
          </div>

          {/* Title */}
          <h1
            data-hero-title
            className="font-display text-2xl font-extrabold leading-[1.1] text-[var(--text)] sm:text-4xl lg:text-5xl tracking-tight"
          >
            Fresh crusts,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--orange)] to-amber-500">
              slow fire
            </span>
            , fast table ordering.
          </h1>

          {/* Subtitle */}
          <p
            data-hero-copy
            className="mt-2 text-xs leading-relaxed text-[var(--muted)] sm:mt-3 sm:text-sm max-w-xl"
          >
            Wood-fired artisan sourdough pizzas, gourmet stuffed garlic breads, and street bites
            baked fresh to order in Palam Vihar, Gurgaon.
          </p>

          {/* Hero Actions (Primary Menu + Zomato + Quick Call) */}
          <div data-hero-actions className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5">
            <Link
              to="/menu"
              className="touch-target group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-5 py-2.5 text-xs font-black text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 sm:text-sm"
            >
              <span>Explore Menu</span>
              <FiArrowRight className="text-sm transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <a
              href={ZOMATO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target group inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-[#E23744] px-4 py-2.5 text-xs font-bold text-[#E23744] hover:text-white transition-all duration-200 shadow-sm active:translate-y-0 sm:text-sm"
            >
              <SiZomato className="text-base transition-transform duration-200 group-hover:scale-110" />
              <span>Order on Zomato</span>
              <FiExternalLink className="text-[11px] opacity-70 group-hover:opacity-100" />
            </a>

            <a
              href="tel:+919625261591"
              className="touch-target inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-xs font-bold text-[var(--text)] transition hover:border-[var(--gold)] hover:bg-[var(--surface)]/80 sm:text-sm"
            >
              <FiPhone className="text-xs text-[var(--orange)]" />
              <span>Call Us</span>
            </a>
          </div>

          {/* Key Info Strip (Hours, Rating, Services - Stated ONCE) */}
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-5 border-t border-[var(--line)]/60 pt-3 text-xs font-semibold text-[var(--muted)]">
            <div className="flex items-center gap-1.5 text-[var(--text)]">
              <FiClock className="h-3.5 w-3.5 text-[var(--orange)]" />
              <span className="font-bold">Open 7 Days: 1:30 PM – 1:30 AM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>4.8 Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiZap className="h-3.5 w-3.5 text-amber-500" />
              <span>Dine-In • Takeaway • Delivery</span>
            </div>
          </div>
        </div>

        {/* Hero Media Card: Strictly items > 149 */}
        {specialItem && (
          <div data-hero-media className="relative group">
            <button
              type="button"
              onClick={() => setSelectedItem(specialItem)}
              className="relative block h-[280px] sm:h-[340px] lg:h-[370px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)]/80 text-left cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl hover:border-amber-500/40"
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
                <span className="inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300 backdrop-blur-md border border-white/15">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  Today's Special
                </span>

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
              <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-xl border border-white/20 bg-black/65 p-3 backdrop-blur-xl sm:bottom-3 sm:left-3 sm:right-3 sm:rounded-2xl sm:p-4 shadow-xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300/90">
                      {specialItem.sectionTitle || 'Chef Selection'}
                    </p>
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
                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-200/80">Starts at</p>
                    <p className="mt-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-0.5 text-xs font-black text-[#1c120c] sm:text-sm shadow">
                      {priceDisplay}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] sm:text-xs">
                  <span className="text-amber-300/90 font-semibold">
                    {specialIndex + 1} of {premiumSpecialItems.length}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-white group-hover:text-amber-300 transition-colors">
                    Customize <FiArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </button>
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
          {featuredCategories.map((section) => (
            <Link
              key={section.id}
              to={`/menu?category=${encodeURIComponent(section.title)}`}
              className="group relative h-36 sm:h-40 w-full overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--line)] transition-all duration-300 hover:border-[var(--gold)] hover:shadow-md"
            >
              <FoodImage
                src={section.image}
                alt={section.title}
                category="Pizza"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />

              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                  {section.items.length} items
                </span>
                <h3 className="mt-1 text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {section.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Chef's Signature Picks (4 Distinct Items) */}
      <section data-reveal className="mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Kitchen Highlights
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {signatureDishes.map((item) => {
            const itemMinPrice = getMinPrice(item)
            const isFav = favorites.includes(item.id)

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2.5 sm:p-3 transition-all duration-300 hover:border-[var(--gold)] hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:rounded-xl">
                    <FoodImage
                      src={item.image || item.sectionImage}
                      alt={item.name}
                      category="Pizza"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(item.id)
                      }}
                      className={`absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition ${
                        isFav
                          ? 'bg-[var(--orange)] text-white'
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FiHeart className={`text-xs ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-[var(--gold)]">
                    {item.sectionTitle}
                  </p>
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
                  <span className="font-black text-[var(--text)] text-xs sm:text-sm">
                    ₹{itemMinPrice}+
                  </span>
                  <span className="font-bold text-[var(--orange)] text-[10px] sm:text-[11px] group-hover:underline">
                    Customize &rarr;
                  </span>
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
        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          {/* Left Narrative */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Our Story & Heritage
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold leading-tight text-[var(--text)]">
              Fire, fermentation, and tables built for sharing.
            </h2>
            <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              At The Crust Culture, great pizza starts with patience. Every sourdough batch is
              fermented for maximum flavor before meeting high-temperature stone ovens. From freshly
              crafted paneer to gourmet toppings, we bring artisan culinary passion straight to your table.
            </p>

            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--line)] shadow-sm max-w-sm">
              <FoodImage
                src="/images/pizza-margherita.jpg"
                alt="The Crust Culture kitchen"
                category="Restaurant"
                className="aspect-[16/9] w-full object-cover transition duration-500 hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 rounded-lg bg-black/65 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-md border border-white/15">
                Handcrafted Daily in Gurgaon
              </div>
            </div>
          </div>

          {/* Right: 4 Craft Pillars (Distinct technical facts, stated once) */}
          <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
            {[
              {
                icon: FiLayers,
                title: '48h Fermentation',
                desc: 'Slow cold-proofed dough produces an airy, easily digestible artisan crust.',
                accent: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
              },
              {
                icon: FiZap,
                title: '450°C Stone Oven',
                desc: 'Scorching deck heat creates authentic leopard blisters and a crisp base.',
                accent: 'text-[var(--orange)] bg-orange-500/10 border-orange-500/20',
              },
              {
                icon: FiAward,
                title: 'Artisan Malai Paneer',
                desc: 'Fresh gourmet dairy, rich mozzarella, and garden-picked herbs.',
                accent: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
              },
              {
                icon: FiSmartphone,
                title: 'Smart Table Ordering',
                desc: 'Scan your table QR code to browse photos and send orders straight to our kitchen.',
                accent: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
              },
            ].map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="rounded-xl sm:rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 transition-all duration-200 hover:border-[var(--gold)] hover:shadow-sm"
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
