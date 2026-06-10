import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiClock, FiStar } from 'react-icons/fi'
import { revealHero, revealOnScroll } from '../animations/gsapAnimations'
import FoodImage from '../components/FoodImage'
import { allMenuItems, menuCategories, menuSections } from '../data/menuSections'

const heroImage =
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=85'

export default function HomePage() {
  const scopeRef = useRef(null)
  const featuredSections = menuSections.slice(1, 7)

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
      <section className="mx-auto grid max-w-7xl gap-5 px-3 pb-8 pt-4 sm:gap-8 sm:px-6 sm:pb-12 sm:pt-8 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <h1
            data-hero-title
            className="font-display text-4xl font-semibold leading-[1.03] text-[var(--text)] sm:text-6xl lg:text-7xl"
          >
            Fresh crusts, slow fire, fast table ordering.
          </h1>
          <div data-hero-actions className="mt-5 flex flex-col gap-2 sm:mt-7 sm:gap-3 sm:flex-row">
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
        <div data-hero-media className="relative min-h-[300px] overflow-hidden rounded-3xl border border-[var(--line)] sm:min-h-[440px] sm:rounded-[2rem]">
          <FoodImage
            src={heroImage}
            alt="Wood fired pizza"
            category="Pizza"
            className="h-full min-h-[300px] w-full sm:min-h-[440px]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/15 bg-black/45 p-3 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:rounded-3xl sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">
                  Today's Special
                </p>
                <h2 className="mt-1 text-lg font-black text-white sm:mt-2 sm:text-2xl">Double Paneer Premium</h2>
              </div>
              <p className="rounded-full bg-[var(--gold)] px-4 py-2 text-lg font-black text-[#21140b]">
                ₹229+
              </p>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4">
          {[
            { icon: FiStar, label: 'Menu', value: `${allMenuItems.length} priced items` },
            { icon: FiClock, label: 'Open daily', value: '2:00 PM - 11:00 PM' },
            { icon: FiArrowRight, label: 'QR ready', value: 'Land directly on menu' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:rounded-[1.5rem] sm:p-5">
              <item.icon className="mb-2 text-xl text-[var(--orange)] sm:mb-4 sm:text-2xl" />
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold)] sm:text-sm sm:tracking-[0.2em]">{item.label}</p>
              <p className="mt-1 text-base font-black text-[var(--text)] sm:mt-2 sm:text-xl">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--text)] sm:text-4xl">Menu sections</h2>
          </div>
          <Link to="/menu" className="hidden font-bold text-[var(--gold)] sm:block">
            See all
          </Link>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {featuredSections.map((section) => (
            <Link
              key={section.id}
              to={`/menu?category=${encodeURIComponent(section.title)}`}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--gold)] sm:rounded-[1.5rem] sm:p-5"
            >
              <h3 className="text-lg font-black text-[var(--text)]">{section.title}</h3>
              <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{section.items.length} priced items</p>
            </Link>
          ))}
        </div>
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {menuCategories.slice(0, 4).map((category) => (
            <Link
              key={category}
              to={`/menu?category=${encodeURIComponent(category)}`}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--gold)] sm:rounded-[1.5rem] sm:p-6"
            >
              <h3 className="text-lg font-black text-[var(--text)] sm:mt-3 sm:text-2xl">{category}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
