import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiClock, FiStar } from 'react-icons/fi'
import { revealHero, revealOnScroll } from '../animations/gsapAnimations'
import FeaturedCarousel from '../components/FeaturedCarousel'
import FoodImage from '../components/FoodImage'
import ItemModal from '../components/ItemModal'
import menuData from '../data/menu.json'

const heroImage =
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=85'

export default function HomePage() {
  const scopeRef = useRef(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const popularItems = menuData.items.filter((item) => item.popular).slice(0, 8)

  useEffect(() => {
    const heroContext = revealHero(scopeRef)
    const scrollContext = revealOnScroll(scopeRef)

    return () => {
      heroContext.revert()
      scrollContext.revert()
    }
  }, [])

  return (
    <div ref={scopeRef}>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <p data-hero-kicker className="mb-4 text-sm font-black uppercase tracking-[0.26em] text-[var(--gold)]">
            QR table menu
          </p>
          <h1
            data-hero-title
            className="font-display text-5xl font-semibold leading-[1.03] text-[var(--text)] sm:text-6xl lg:text-7xl"
          >
            Fresh crusts, slow fire, fast table ordering.
          </h1>
          <p data-hero-copy className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Browse the complete menu from your phone, save favorites, and choose your next
            wood-fired plate without waiting for a printed menu.
          </p>
          <div data-hero-actions className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/menu"
              className="touch-target inline-flex items-center justify-center gap-2 rounded-full bg-[var(--orange)] px-6 font-black text-white shadow-xl transition hover:bg-[#ea580c]"
            >
              Open menu <FiArrowRight />
            </Link>
            <Link
              to="/about"
              className="touch-target inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 font-bold text-[var(--text)] transition hover:border-[var(--gold)]"
            >
              Our story
            </Link>
          </div>
        </div>
        <div data-hero-media className="relative min-h-[440px] overflow-hidden rounded-[2rem] border border-[var(--line)]">
          <FoodImage
            src={heroImage}
            alt="Wood fired pizza"
            category="Pizza"
            className="h-full min-h-[440px] w-full"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">
                  Today's Special
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">Paneer Tikka Pizza Combo</h2>
              </div>
              <p className="rounded-full bg-[var(--gold)] px-4 py-2 text-lg font-black text-[#21140b]">
                ₹599
              </p>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: FiStar, label: 'Chef picked', value: '8 featured plates' },
            { icon: FiClock, label: 'Open today', value: '11:00 AM - 11:30 PM' },
            { icon: FiArrowRight, label: 'QR ready', value: 'Land directly on menu' },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5">
              <item.icon className="mb-4 text-2xl text-[var(--orange)]" />
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gold)]">{item.label}</p>
              <p className="mt-2 text-xl font-black text-[var(--text)]">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">Popular</p>
            <h2 className="font-display mt-2 text-4xl font-semibold text-[var(--text)]">Featured dishes</h2>
          </div>
          <Link to="/menu" className="hidden font-bold text-[var(--gold)] sm:block">
            See all
          </Link>
        </div>
        <FeaturedCarousel items={popularItems} onSelect={setSelectedItem} />
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {menuData.categories.slice(0, 4).map((category) => (
            <Link
              key={category}
              to={`/menu?category=${encodeURIComponent(category)}`}
              className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:border-[var(--gold)]"
            >
              <span className="text-sm font-black uppercase tracking-[0.2em] text-[var(--orange)]">Category</span>
              <h3 className="mt-3 text-2xl font-black text-[var(--text)]">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
