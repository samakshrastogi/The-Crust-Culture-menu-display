import { Link } from 'react-router-dom'
import {
  FiClock,
  FiHome,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiShield,
  FiShoppingBag,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import { SiZomato } from 'react-icons/si'
import BrandLogo from './BrandLogo'
import { CAFE_INFO } from '../data/cafeInfo'

export default function Footer() {
  return (
    <footer className="relative mt-8 sm:mt-12 lg:mt-16 overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition-colors">
      <div className="relative mx-auto  px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6 items-start">
          {/* Brand & Essence */}
          <div className="space-y-2 lg:col-span-5">
            <BrandLogo />
            <p className="text-xs leading-relaxed text-[var(--muted)] max-w-sm">
              Stone-oven sourdough pizzas, gourmet stuffed garlic breads & beverages crafted with passion at The Crust Culture Cafe in Gurgaon.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.2 font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                100% Pure Veg
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-0.2 font-semibold text-[var(--muted)]">
                <FiClock className="text-[var(--orange)]" />
                1:30 PM – 1:30 AM Daily
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-1.5 lg:col-span-3">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[var(--gold)]">
              Quick Links
            </h3>
            <ul className="space-y-1 text-xs font-semibold text-[var(--muted)]">
              <li>
                <Link to="/home" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--orange)]">
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
                <Link to="/cart" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--orange)]">
                  <FiShoppingBag className="text-xs text-[var(--orange)]" />
                  <span>Cart</span>
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
          <div className="space-y-1.5 lg:col-span-4">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[var(--gold)]">
              Visit & Connect
            </h3>
            <div className="text-xs leading-snug text-[var(--muted)] space-y-0.5">
              <p className="font-bold text-[var(--text)]">Noble Enclave, Palam Vihar Ext.</p>
              <p className="text-[11px] text-[var(--muted)]">
                Opposite Royal PG, Gali No. 6, Gurgaon, 122015
              </p>
            </div>

            {/* Quick Actions & Social Dock */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <a
                href="https://maps.app.goo.gl/ernTdfzkPqRhYynR6"
                target="_blank"
                rel="noopener noreferrer"
                title="Get Directions"
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--surface-strong)] hover:bg-[var(--orange)] hover:text-white px-2 py-1 text-[11px] font-bold text-[var(--text)] border border-[var(--line)] transition-all duration-200"
              >
                <FiNavigation className="text-[var(--orange)]" />
                <span>Directions</span>
              </a>

              <a
                href={CAFE_INFO.phone.tel}
                title={`Call Cafe Hotline (${CAFE_INFO.phone.display})`}
                className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--surface-strong)] hover:bg-orange-500 hover:text-white text-[var(--orange)] border border-[var(--line)] transition-all duration-200"
              >
                <FiPhone className="text-xs" />
              </a>

              <a
                href={`${CAFE_INFO.phone.waLink}?text=Hello%20The%20Crust%20Culture,%20I%20would%20like%20to%20place%20an%20order`}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Us"
                className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--surface-strong)] hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 border border-[var(--line)] transition-all duration-200"
              >
                <FaWhatsapp className="text-xs" />
              </a>

              <a
                href="https://www.zomato.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Order on Zomato"
                className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--surface-strong)] hover:bg-red-500 hover:text-white text-red-500 border border-[var(--line)] transition-all duration-200"
              >
                <SiZomato className="text-xs" />
              </a>
            </div>
          </div>
        </div>

        {/* Ultra-Compact Sub-footer */}
        <div className="mt-3.5 flex flex-col items-center justify-between gap-1.5 border-t border-[var(--line)]/60 pt-2.5 text-[10px] text-[var(--muted)] sm:flex-row">
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

