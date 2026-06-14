import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiClock, FiStar } from 'react-icons/fi'
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

const heroImage =
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=85'

const getMinPrice = (item) => {
  if (!item || !item.prices || item.prices.length === 0) return 0
  const parsedPrices = item.prices
    .map((p) => {
      const digits = p.value.replace(/[^0-9]/g, '')
      return digits ? parseInt(digits, 10) : 0
    })
    .filter((v) => v > 0)
  return parsedPrices.length ? Math.min(...parsedPrices) : 0
}

export default function HomePage() {
  const scopeRef = useRef(null)
  const featuredSections = initialSections.slice(1, 5) // Compact: show 4 sections instead of 6

  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('crust-favorites', [])

  const [specialItem] = useState(() => {
    const itemsAbove200 = initialAllMenuItems.filter((item) => {
      return item.prices.some((p) => {
        const digits = p.value.replace(/[^0-9]/g, '')
        const val = digits ? parseInt(digits, 10) : 0
        return val >= 200
      })
    })
    if (itemsAbove200.length === 0) return null
    const randomIndex = Math.floor(Math.random() * itemsAbove200.length)
    return itemsAbove200[randomIndex]
  })

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

  const minPrice = getMinPrice(specialItem)
  const priceDisplay = minPrice ? `₹${minPrice}+` : ''

  return (
    <div ref={scopeRef} className="space-y-4">
      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl gap-3 px-3 pb-4 pt-2 sm:gap-6 sm:px-6 sm:pb-6 sm:pt-4 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-8">
        <div className="flex flex-col justify-center">
          <h1
            data-hero-title
            className="font-display text-3xl font-semibold leading-[1.05] text-[var(--text)] sm:text-5xl lg:text-6xl"
          >
            Fresh crusts, slow fire, fast table ordering.
          </h1>
          <div data-hero-actions className="mt-4 flex flex-col gap-2 sm:mt-6 sm:gap-3 sm:flex-row">
            <Link
              to="/menu"
              className="touch-target inline-flex items-center justify-center gap-2 rounded-full bg-[var(--orange)] px-6 font-black text-white shadow-xl transition hover:bg-[#ea580c]"
            >
              Open menu <FiArrowRight />
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}
              className="touch-target inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 font-bold text-[var(--text)] transition hover:border-[var(--gold)]"
            >
              Our story
            </button>
          </div>
        </div>
        
        {specialItem && (
          <button
            type="button"
            onClick={() => setSelectedItem(specialItem)}
            data-hero-media
            className="relative min-h-[280px] w-full overflow-hidden rounded-3xl border border-[var(--line)] sm:min-h-[360px] sm:rounded-[2rem] text-left block transition-[border-color] duration-200 hover:border-[var(--gold)] cursor-pointer"
          >
            <FoodImage
              src={specialItem.image || specialItem.sectionImage || heroImage}
              alt={specialItem.name}
              category={specialItem.sectionTitle?.includes('Pizza') ? 'Pizza' : 'Restaurant'}
              className="h-full min-h-[280px] w-full sm:min-h-[360px] transition duration-500 hover:scale-102"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/15 bg-black/45 p-3 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:rounded-3xl sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] sm:text-xs">
                    Today's Special
                  </p>
                  <h2 className="mt-0.5 text-base font-black text-white sm:mt-1.5 sm:text-xl">{specialItem.name}</h2>
                </div>
                <p className="rounded-full bg-[var(--gold)] px-3 py-1.5 text-sm font-black text-[#21140b] sm:px-4 sm:text-base">
                  {priceDisplay}
                </p>
              </div>
            </div>
          </button>
        )}
      </section>

      {/* Badges Section */}
      <section data-reveal className="mx-auto max-w-7xl px-3 py-2 sm:px-6 sm:py-4 lg:px-8">
        <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4">
          {[
            { icon: FiStar, label: 'Menu', value: `${initialAllMenuItems.length} priced items` },
            { icon: FiClock, label: 'Open daily', value: '2:00 PM - 1:00 AM' },
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
      <section data-reveal className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
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
      <section data-reveal className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
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
        className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 border-t border-[var(--line)]"
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
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80"
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
