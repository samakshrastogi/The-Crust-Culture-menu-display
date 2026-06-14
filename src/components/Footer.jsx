import { FiMapPin, FiPhone } from 'react-icons/fi'
import BrandLogo from './BrandLogo'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-soft)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 sm:gap-8 md:grid-cols-[1.5fr_1.2fr]">
        <div className="space-y-4">
          <BrandLogo />
          <p className="max-w-sm text-xs leading-5 text-[var(--muted)] sm:text-sm sm:leading-6">
            Premium sourdough pizzas, grills, sandwiches, desserts, and craft beverages served
            fresh from our open kitchen.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)] sm:mb-4 sm:text-sm sm:tracking-[0.22em]">
            Visit & Contact
          </h2>
          <div className="space-y-2 text-xs text-[var(--muted)] sm:space-y-3 sm:text-sm">
            <p className="flex gap-3">
              <FiMapPin className="mt-1 shrink-0 text-[var(--orange)]" />
              The Crust Culture infront of royal pg and sheetal pg and adjacent of panchayat cafe gali no. 6 noble enclave palam vihar extension gurgaon haryana pincode 122015
            </p>
            <p className="flex gap-3">
              <FiPhone className="mt-1 shrink-0 text-[var(--orange)]" />
              <a href="tel:+918368151650" className="hover:text-[var(--orange)] transition">+91 83681 51650</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
