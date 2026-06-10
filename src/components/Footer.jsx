import { FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import BrandLogo from './BrandLogo'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-soft)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandLogo />
          <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">
            Premium sourdough pizzas, grills, sandwiches, desserts, and craft beverages served
            fresh from our open kitchen.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
            Visit
          </h2>
          <div className="space-y-3 text-sm text-[var(--muted)]">
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
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
            Connect
          </h2>
          <div className="space-y-3 text-sm text-[var(--muted)]">
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
