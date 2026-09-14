import { Link } from 'react-router-dom'
import {
  FiClock,
  FiExternalLink,
  FiHeart,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiShield,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import { SiGoogle, SiZomato } from 'react-icons/si'
import BrandLogo from './BrandLogo'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-gradient-to-b from-[var(--surface)] via-[var(--surface-strong)]/30 to-[var(--surface-strong)]/70 text-[var(--text)] transition-colors">
      {/* Subtle Warm Hearth Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-56 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-96 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Main 4-Column Grid */}
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Column 1: Brand, Mission & Dietary Identity */}
          <div className="space-y-4">
            <BrandLogo />
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)] font-medium">
              Artisan sourdough pizzas baked at scorching stone-oven temperatures, slow-fermented doughs, gourmet stuffed garlic breads, and chilled beverages crafted with culinary passion in Gurgaon.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                100% Pure Veg Cafe
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                🪵 Wood-Fired
              </span>
            </div>
          </div>

          {/* Column 2: Curated Menu Categories */}
          <div className="space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Explore Our Menu
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-[var(--muted)]">
              <li>
                <Link
                  to="/menu"
                  className="group inline-flex items-center gap-2 transition-all duration-200 hover:text-[var(--orange)] hover:translate-x-1"
                >
                  <span className="text-sm">🍕</span>
                  <span className="group-hover:underline">Full Digital Menu (16 Categories)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/menu?category=Veggie%20%26%20Cheese%20Loaded%20Pizzas"
                  className="group inline-flex items-center gap-2 transition-all duration-200 hover:text-[var(--orange)] hover:translate-x-1"
                >
                  <span className="text-sm">🧀</span>
                  <span className="group-hover:underline">Veggie & Cheese Loaded Pizzas</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/menu?category=Royal%20Paneer%20Pizza"
                  className="group inline-flex items-center gap-2 transition-all duration-200 hover:text-[var(--orange)] hover:translate-x-1"
                >
                  <span className="text-sm">👑</span>
                  <span className="group-hover:underline">Royal Paneer Collection</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/menu?category=Garlic%20Breads%20%26%20Sides"
                  className="group inline-flex items-center gap-2 transition-all duration-200 hover:text-[var(--orange)] hover:translate-x-1"
                >
                  <span className="text-sm">🥖</span>
                  <span className="group-hover:underline">Stuffed Garlic Breads & Sides</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/menu?category=Drinks%20Corner"
                  className="group inline-flex items-center gap-2 transition-all duration-200 hover:text-[var(--orange)] hover:translate-x-1"
                >
                  <span className="text-sm">☕</span>
                  <span className="group-hover:underline">Cold Coffee & Refreshing Drinks</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="group inline-flex items-center gap-2 text-[var(--orange)] transition-all duration-200 hover:translate-x-1"
                >
                  <FiHeart className="text-sm fill-current" />
                  <span className="font-bold group-hover:underline">Your Saved Favorites</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Cafe Hours & Direct Contact Directory */}
          <div className="space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Hours & Ordering
            </h3>

            {/* Operating Hours Glass Card */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/90 p-4 shadow-xs space-y-1.5 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--text)]">
                <FiClock className="shrink-0 text-[var(--orange)]" />
                <span>Open 7 Days a Week</span>
              </div>
              <p className="text-xs sm:text-sm font-black text-[var(--gold)] tracking-wide">
                1:30 PM – 1:30 AM (Daily)
              </p>
              <p className="text-[11px] leading-relaxed text-[var(--muted)]">
                Warm dine-in seating, curbside takeaways, & midnight doorstep delivery.
              </p>
            </div>

            {/* Contact Directory Links */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/50 p-3.5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-orange-500/10 text-[var(--orange)] border border-orange-500/20">
                  <FiPhone className="text-xs" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-wider text-[var(--gold)] block leading-tight">
                    Direct Phone Hotline
                  </span>
                  <a
                    href="tel:+919625261591"
                    className="font-bold text-[var(--text)] hover:text-[var(--orange)] transition"
                  >
                    +91 96252 61591
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <FaWhatsapp className="text-xs" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-wider text-[var(--gold)] block leading-tight">
                    WhatsApp Desk
                  </span>
                  <a
                    href="https://wa.me/919625261591?text=Hello%20The%20Crust%20Culture,%20I%20would%20like%20to%20place%20an%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--text)] hover:text-emerald-500 transition"
                  >
                    Direct Table & Parcel Booking
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-red-500/10 text-[#E23744] border border-red-500/20">
                  <SiZomato className="text-xs" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-wider text-[var(--gold)] block leading-tight">
                    Online Partner
                  </span>
                  <a
                    href="https://www.zomato.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--text)] hover:text-[#E23744] transition"
                  >
                    Delivery on Zomato
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Location & Directions */}
          <div className="space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              Visit Our Cafe
            </h3>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/90 p-4 space-y-3 shadow-xs backdrop-blur-xs">
              <div className="flex items-start gap-2.5">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-orange-500/10 text-[var(--orange)] border border-orange-500/20 mt-0.5">
                  <FiMapPin className="text-sm" />
                </div>
                <div className="text-xs sm:text-sm leading-relaxed text-[var(--text)]">
                  <p className="font-extrabold text-[var(--text)]">The Crust Culture</p>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    Opposite Royal PG & Sheetal PG, adjacent to Panchayat Cafe
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">
                    Gali No. 6, Noble Enclave, Palam Vihar Extension
                  </p>
                  <p className="font-bold text-[var(--gold)] text-xs mt-0.5">
                    Gurgaon, Haryana – 122015
                  </p>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/ernTdfzkPqRhYynR6"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-4 py-2.5 text-xs font-black text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/35 hover:brightness-105 active:scale-95"
              >
                <FiNavigation className="text-sm transition-transform duration-200 group-hover:rotate-12" />
                <span>Get Directions on Maps</span>
                <FiExternalLink className="text-xs opacity-75 group-hover:opacity-100" />
              </a>
            </div>

            {/* Quick Community / Google Reviews Cue */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)] px-1">
              <SiGoogle className="text-[#4285F4] text-xs" />
              <span>4.8 ★ Rated on Google & Zomato</span>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)]/70 pt-6 text-xs text-[var(--muted)] sm:flex-row sm:mt-14">
          <p className="font-medium">
            © {new Date().getFullYear()} <span className="font-bold text-[var(--text)]">The Crust Culture</span>. All rights reserved.
          </p>

          <p className="text-center font-medium">
            Handcrafted with passion in Noble Enclave, Palam Vihar, Gurgaon
          </p>

          <div className="flex items-center gap-3 font-semibold text-[var(--text)]">
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              <FiShield className="text-xs" /> 100% Pure Vegetarian Kitchen
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
