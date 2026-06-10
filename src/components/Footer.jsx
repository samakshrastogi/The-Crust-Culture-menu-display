import { FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import BrandLogo from './BrandLogo'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-soft)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 sm:gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandLogo />
          <p className="max-w-sm text-xs leading-5 text-[var(--muted)] sm:text-sm sm:leading-6">
            Premium sourdough pizzas, grills, sandwiches, desserts, and craft beverages served
            fresh from our open kitchen.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)] sm:mb-4 sm:text-sm sm:tracking-[0.22em]">
            Visit
          </h2>
          <div className="space-y-2 text-xs text-[var(--muted)] sm:space-y-3 sm:text-sm">
            <p className="flex gap-3">
              <FiMapPin className="mt-1 shrink-0 text-[var(--orange)]" />
              18 Artisan Lane, Jubilee Hills, Hyderabad
            </p>
            <p className="flex gap-3">
              <FiPhone className="mt-1 shrink-0 text-[var(--orange)]" />
              +91 98765 43210
            </p>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)] sm:mb-4 sm:text-sm sm:tracking-[0.22em]">
            Connect
          </h2>
          <div className="space-y-2 text-xs text-[var(--muted)] sm:space-y-3 sm:text-sm">
            <p className="flex gap-3">
              <FiMail className="mt-1 shrink-0 text-[var(--orange)]" />
              hello@thecrustculture.com
            </p>
            <p className="flex gap-3">
              <FiInstagram className="mt-1 shrink-0 text-[var(--orange)]" />
              @thecrustculture
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
