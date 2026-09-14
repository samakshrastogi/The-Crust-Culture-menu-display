import { Link } from 'react-router-dom'
import {
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiNavigation,
  FiPhone,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import { SiZomato } from 'react-icons/si'
import BrandLogo from './BrandLogo'

export default function Footer() {

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition-colors">
      {/* Main Multi-Column Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <BrandLogo />
            <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              Artisan sourdough pizzas baked at 450°C, slow-fermented dough, gourmet stuffed garlic
              breads, crispy burgers, and craft beverages served fresh from our artisan cafe.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              100% Pure Veg Cafe
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)] sm:text-sm sm:tracking-[0.22em]">
              Explore Menu
            </h3>
            <ul className="space-y-2 text-xs font-medium text-[var(--muted)] sm:text-sm">
              <li>
                <Link
                  to="/menu"
                  className="transition hover:text-[var(--orange)] hover:translate-x-1 inline-block"
                >
                  Full Digital Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/menu?category=Veggie%20%26%20Cheese%20Loaded%20Pizzas"
                  className="transition hover:text-[var(--orange)] hover:translate-x-1 inline-block"
                >
                  Veggie & Cheese Loaded
                </Link>
              </li>
              <li>
                <Link
                  to="/menu?category=Royal%20Paneer%20Pizza"
                  className="transition hover:text-[var(--orange)] hover:translate-x-1 inline-block"
                >
                  Royal Paneer Pizzas
                </Link>
              </li>
              <li>
                <Link
                  to="/menu?category=Garlic%20Breads%20%26%20Sides"
                  className="transition hover:text-[var(--orange)] hover:translate-x-1 inline-block"
                >
                  Garlic Breads & Sides
                </Link>
              </li>
              <li>
                <Link
                  to="/menu?category=Drinks%20Corner"
                  className="transition hover:text-[var(--orange)] hover:translate-x-1 inline-block"
                >
                  Drinks Corner
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="transition hover:text-[var(--orange)] hover:translate-x-1 inline-block"
                >
                  Your Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Cafe Timings & Direct Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)] sm:text-sm sm:tracking-[0.22em]">
              Hours & Orders
            </h3>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)] sm:text-sm">
                <FiClock className="shrink-0 text-[var(--orange)]" />
                <span>Open 7 Days a Week</span>
              </div>
              <p className="text-xs font-semibold text-[var(--gold)] sm:text-sm">
                1:30 PM – 1:30 AM (Daily)
              </p>
              <p className="text-[11px] leading-tight text-[var(--muted)]">
                Dine-in, takeaway, & late-night table ordering.
              </p>
            </div>

            {/* Direct Contact Directory */}
            <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-[var(--muted)]">
              <div className="flex items-center gap-2.5">
                <FiPhone className="text-[var(--orange)] text-sm shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--gold)] block">Direct Hotline</span>
                  <a
                    href="tel:+919625261591"
                    className="font-bold text-[var(--text)] hover:text-[var(--orange)] transition"
                  >
                    +91 96252 61591
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <FaWhatsapp className="text-emerald-500 text-sm shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--gold)] block">WhatsApp Desk</span>
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
                <SiZomato className="text-[#E23744] text-base shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--gold)] block">Online Partner</span>
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
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)] sm:text-sm sm:tracking-[0.22em]">
              Visit Our Cafe
            </h3>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] p-3.5 sm:p-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <FiMapPin className="mt-1 shrink-0 text-[var(--orange)] text-base" />
                <div className="text-xs leading-relaxed text-[var(--text)] sm:text-sm">
                  <p className="font-bold text-[var(--text)]">The Crust Culture</p>
                  <p className="text-[var(--muted)]">
                    In front of Royal PG & Sheetal PG, adjacent to Panchayat Cafe
                  </p>
                  <p className="text-[var(--muted)]">
                    Gali No. 6, Noble Enclave, Palam Vihar Extension
                  </p>
                  <p className="font-semibold text-[var(--gold)]">
                    Gurgaon, Haryana – 122015
                  </p>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/ernTdfzkPqRhYynR6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:shadow-lg hover:brightness-105 active:scale-95 w-full"
              >
                <FiNavigation className="text-sm" />
                <span>Open in Google Maps</span>
                <FiExternalLink className="text-xs" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--line)]/60 pt-6 text-xs text-[var(--muted)] sm:flex-row sm:mt-12">
          <p>© {new Date().getFullYear()} The Crust Culture. All rights reserved.</p>
          <p className="text-center font-medium text-[var(--muted)]">
            Handcrafted with passion in Noble Enclave, Gurgaon
          </p>
        </div>
      </div>
    </footer>
  )
}
