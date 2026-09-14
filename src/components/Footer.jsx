import { Link } from 'react-router-dom'
import {
  FiClock,
  FiHeart,
  FiHome,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiShield,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import { SiZomato } from 'react-icons/si'
import BrandLogo from './BrandLogo'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition-colors">
      <div className="relative mx-auto max-w-6xl px-4 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Brand & Essence */}
          <div className="space-y-3 lg:col-span-5">
            <BrandLogo />
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)] max-w-sm">
              Artisan sourdough pizzas baked at scorching stone-oven temperatures, gourmet stuffed garlic breads, and chilled beverages crafted with culinary passion in Gurgaon.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                100% Pure Veg
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-0.5 font-semibold text-[var(--muted)]">
                <FiClock className="text-[var(--orange)]" />
                1:30 PM – 1:30 AM Daily
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 lg:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--gold)]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold text-[var(--muted)]">
              <li>
                <Link to="/home" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--orange)]">
                  <FiHome className="text-xs text-[var(--orange)]" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/menu" className="transition-colors hover:text-[var(--orange)]">
                  Digital Menu (16 Categories)
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--orange)]">
                  <FiHeart className="text-xs text-[var(--orange)]" />
                  <span>Saved Favorites</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/ernTdfzkPqRhYynR6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-[var(--orange)]"
                >
                  <FiMapPin className="text-xs text-[var(--orange)]" />
                  <span>Locate Cafe</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Visit & Connect */}
          <div className="space-y-3 lg:col-span-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--gold)]">
              Visit & Connect
            </h3>
            <div className="text-xs sm:text-sm leading-relaxed text-[var(--muted)] space-y-0.5">
              <p className="font-bold text-[var(--text)]">Noble Enclave, Palam Vihar Ext.</p>
              <p className="text-[11px] text-[var(--muted)]">
                Opposite Royal PG, Gali No. 6, Gurgaon, Haryana 122015
              </p>
            </div>

            {/* Quick Actions & Social Dock */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="https://maps.app.goo.gl/ernTdfzkPqRhYynR6"
                target="_blank"
                rel="noopener noreferrer"
                title="Get Directions"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-strong)] hover:bg-[var(--orange)] hover:text-white px-2.5 py-1.5 text-xs font-bold text-[var(--text)] border border-[var(--line)] transition-all duration-200"
              >
                <FiNavigation className="text-[var(--orange)]" />
                <span>Directions</span>
              </a>

              <a
                href="tel:+919625261591"
                title="Call Cafe Hotline"
                className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--surface-strong)] hover:bg-orange-500 hover:text-white text-[var(--orange)] border border-[var(--line)] transition-all duration-200"
              >
                <FiPhone className="text-xs" />
              </a>

              <a
                href="https://wa.me/919625261591?text=Hello%20The%20Crust%20Culture,%20I%20would%20like%20to%20place%20an%20order"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Us"
                className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--surface-strong)] hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 border border-[var(--line)] transition-all duration-200"
              >
                <FaWhatsapp className="text-xs" />
              </a>

              <a
                href="https://www.zomato.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Order on Zomato"
                className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--surface-strong)] hover:bg-red-500 hover:text-white text-red-500 border border-[var(--line)] transition-all duration-200"
              >
                <SiZomato className="text-xs" />
              </a>
            </div>
          </div>
        </div>

        {/* Compact Sub-footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[var(--line)]/60 pt-4 text-[11px] text-[var(--muted)] sm:flex-row">
          <p>
            © {new Date().getFullYear()} <span className="font-bold text-[var(--text)]">The Crust Culture</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <FiShield className="text-xs" /> 100% Pure Vegetarian Kitchen
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

