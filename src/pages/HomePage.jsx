import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
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
    <div ref={scopeRef} className="space-y-10 sm:space-y-14">
      {/* 1. Hero Section */}
      <section className="mx-auto grid gap-6 px-3 pb-4 pt-2 sm:gap-8 sm:px-6 sm:pb-6 sm:pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-6">
        <div className="flex flex-col justify-center">
          {/* Tag / Kicker */}
          <div
            data-hero-kicker
            className="mb-3 inline-flex flex-wrap items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 w-fit"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Wood-Fired Kitchen</span>
            <span>•</span>
            <span>100% Pure Veg</span>
            <span>•</span>
            <span className="text-[var(--orange)] font-extrabold">Open 7 Days (1:30 PM – 1:30 AM)</span>
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
            48-hour slow-fermented artisan sourdough, 100% pure vegetarian gourmet recipes, and
            sizzling sides baked fresh to order in Palam Vihar, Gurgaon.
          </p>

          {/* Hero Actions */}
          <div data-hero-actions className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <Link
              to="/menu"
              className="touch-target group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 sm:text-base"
            >
              Explore Menu{' '}
              <FiArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <a
              href={ZOMATO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target group inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-[#E23744] px-5 py-3.5 text-sm font-bold text-[#E23744] hover:text-white transition-all duration-200 shadow-sm hover:shadow-red-500/25 hover:-translate-y-0.5 active:translate-y-0 sm:text-base"
            >
              <SiZomato className="text-xl transition-transform duration-200 group-hover:scale-110" />
              <span>Order on Zomato</span>
              <FiExternalLink className="text-xs opacity-70 group-hover:opacity-100" />
            </a>

            <button
              type="button"
              onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}
              className="touch-target inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3.5 text-sm font-bold text-[var(--text)] transition hover:border-[var(--gold)] hover:bg-[var(--surface)]/80 sm:text-base"
            >
              Our Story
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-[var(--line)]/60 pt-4 text-xs font-semibold text-[var(--muted)]">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <FiClock className="h-3 w-3" />
              </span>
              <span className="font-bold text-[var(--text)]">Open 7 Days: 1:30 PM – 1:30 AM</span>
            </div>
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
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/15 text-[#E23744]">
                <SiZomato className="h-3 w-3" />
              </span>
              <span>Live on Zomato</span>
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

      {/* 2. Culinary Craft Pillars (Distinct, non-repetitive craftsmanship highlights) */}
      <section data-reveal className="mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {[
            {
              icon: FiLayers,
              title: '48-Hour Fermentation',
              desc: 'Slow cold-proofed sourdough for an exceptionally light, airy, and easily digestible crust.',
              accent: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            },
            {
              icon: FiZap,
              title: '450°C Stone Oven',
              desc: 'High stone-deck heat produces authentic leopard crust blisters and crisp base.',
              accent: 'text-[var(--orange)] bg-orange-500/10 border-orange-500/20',
            },
            {
              icon: FiAward,
              title: '100% Pure Vegetarian',
              desc: 'Fresh artisan malai paneer, real dairy mozzarella, and farm-fresh vegetable toppings.',
              accent: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
            },
            {
              icon: FiSmartphone,
              title: 'Smart Table Ordering',
              desc: 'Scan your table QR code, browse photo-rich menus, and order directly to our kitchen.',
              accent: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
            },
          ].map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-all duration-300 hover:border-[var(--gold)] hover:shadow-md sm:rounded-3xl sm:p-5"
              >
                <div
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border ${card.accent} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="text-lg sm:text-xl" />
                </div>
                <h3 className="mt-3.5 text-sm font-extrabold text-[var(--text)] sm:text-base">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">
                  {card.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. Explore by Category (Single, unified photo gallery - NO DUPLICATION) */}
      <section data-reveal className="mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Our Menu
            </span>
            <h2 className="font-display text-2xl font-extrabold text-[var(--text)] sm:text-3xl">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--orange)] hover:underline sm:text-sm"
          >
            <span>View All 16 Categories</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {featuredCategories.map((section) => (
            <Link
              key={section.id}
              to={`/menu?category=${encodeURIComponent(section.title)}`}
              className="group relative h-48 sm:h-52 w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)] transition-all duration-300 hover:border-[var(--gold)] hover:shadow-lg"
            >
              <FoodImage
                src={section.image}
                alt={section.title}
                category="Pizza"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
                <div>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                    {section.items.length} items
                  </span>
                  <h3 className="mt-1.5 text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    {section.title}
                  </h3>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition group-hover:bg-[var(--orange)] group-hover:scale-105">
                  <FiArrowRight className="text-sm" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Chef's Signature Recommendations */}
      <section data-reveal className="mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Kitchen Highlights
            </span>
            <h2 className="font-display text-2xl font-extrabold text-[var(--text)] sm:text-3xl">
              Signature Chef Picks
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--orange)] hover:underline sm:text-sm"
          >
            <span>Full digital menu</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {signatureDishes.map((item) => {
            const itemMinPrice = getMinPrice(item)
            const isFav = favorites.includes(item.id)

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-3 transition-all duration-300 hover:border-[var(--gold)] hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl">
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
                      className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition ${
                        isFav
                          ? 'bg-[var(--orange)] text-white'
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FiHeart className={`text-sm ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                    {item.sectionTitle}
                  </p>
                  <h3 className="mt-0.5 text-sm font-extrabold text-[var(--text)] line-clamp-1 group-hover:text-[var(--orange)] transition-colors sm:text-base">
                    {item.name}
                  </h3>
                  {item.toppings && (
                    <p className="mt-1 line-clamp-1 text-xs text-[var(--muted)]">
                      {item.toppings}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[var(--line)]/60 pt-2 text-xs">
                  <span className="font-black text-[var(--text)] sm:text-sm">
                    ₹{itemMinPrice}+
                  </span>
                  <span className="font-bold text-[var(--orange)] text-[11px] group-hover:underline">
                    Customize &rarr;
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. Online Delivery & Operating Hours Callout */}
      <section data-reveal className="mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-red-500/25 bg-gradient-to-br from-red-500/10 via-[var(--surface)] to-amber-500/10 p-5 sm:p-8 lg:p-10 shadow-lg">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/15 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#E23744]">
                <SiZomato className="text-base" />
                <span>Doorstep Delivery & Takeaway</span>
              </div>
              <h2 className="font-display text-2xl font-black text-[var(--text)] sm:text-3xl lg:text-4xl">
                Craving hot, fresh sourdough pizza at home?
              </h2>
              <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm max-w-xl">
                Order your favorites directly through <strong className="text-[var(--text)]">Zomato</strong> for
                fast doorstep delivery across Palam Vihar and nearby Gurgaon sectors. We are open and
                delivering <strong className="text-[var(--text)]">7 days a week from 1:30 PM to 1:30 AM</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={ZOMATO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-2 rounded-full bg-[#E23744] hover:bg-[#c92c39] px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  <SiZomato className="text-xl" />
                  <span>Order on Zomato</span>
                  <FiExternalLink className="text-xs" />
                </a>
                <a
                  href="tel:+919625261591"
                  className="touch-target inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-bold text-[var(--text)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition"
                >
                  <FiPhone className="text-sm text-[var(--orange)]" />
                  <span>+91 96252 61591</span>
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/90 p-5 sm:p-6 backdrop-blur-md space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <FiClock className="text-2xl" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[var(--gold)]">
                    Operating Hours
                  </span>
                  <h3 className="text-lg font-black text-[var(--text)]">
                    Open 7 Days a Week
                  </h3>
                </div>
              </div>

              <div className="space-y-2 border-t border-[var(--line)]/60 pt-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-[var(--muted)]">Every Day (Mon – Sun):</span>
                  <span className="font-extrabold text-[var(--orange)]">1:30 PM – 1:30 AM</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-[var(--muted)]">Services:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Dine-In • Takeaway • Delivery</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-[var(--muted)]">Platform:</span>
                  <span className="font-bold text-[#E23744]">Available on Zomato</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Open 7 Days • Late Night Kitchen Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our Story Section */}
      <section
        id="our-story"
        data-reveal
        className="mx-auto px-3 sm:px-6 lg:px-8 border-t border-[var(--line)] pt-8 sm:pt-12"
      >
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Our Story & Heritage
            </span>
            <h2 className="font-display text-2xl font-extrabold leading-tight text-[var(--text)] sm:text-3xl">
              Fire, fermentation, and a table built for sharing.
            </h2>
            <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              At The Crust Culture, great pizza starts with patience. Our sourdough undergo a slow
              48-hour cold fermentation before meeting the scorching 450°C stone oven. Paired with
              artisanal paneer recipes and farm-fresh toppings, every bite is crafted to perfection.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-3 py-1 text-xs font-bold text-[var(--text)]">
                🌾 48h Cold Fermented
              </span>
              <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-3 py-1 text-xs font-bold text-[var(--text)]">
                🔥 450°C Stone Deck
              </span>
              <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-3 py-1 text-xs font-bold text-[var(--text)]">
                🌱 100% Pure Vegetarian
              </span>
              <span className="rounded-full bg-[var(--surface-strong)] border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                ⏰ Open 7 Days (1:30 PM – 1:30 AM)
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/menu"
                className="touch-target inline-flex items-center gap-2 rounded-full bg-[var(--orange)] px-6 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-[#ea580c] sm:text-sm"
              >
                <span>Browse Full Menu</span>
                <FiArrowRight className="text-sm" />
              </Link>
              <a
                href={ZOMATO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-bold text-[#E23744] hover:bg-[#E23744] hover:text-white transition sm:text-sm"
              >
                <SiZomato className="text-base" />
                <span>Zomato</span>
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)] max-w-md mx-auto w-full shadow-lg">
            <FoodImage
              src="/images/pizza-margherita.jpg"
              alt="The Crust Culture kitchen"
              category="Restaurant"
              className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
            />
            <div className="absolute bottom-3 left-3 rounded-xl bg-black/65 px-3 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md border border-white/15">
              Handcrafted Daily in Gurgaon
            </div>
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
