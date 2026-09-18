import { Link } from 'react-router-dom'
import { useSeoMeta } from '../hooks/useSeoMeta'

export default function NotFoundPage() {
  useSeoMeta({
    title: '404 - Page Not Found | The Crust Culture',
    description:
      'The requested page could not be found on The Crust Culture. Return to our menu to browse fresh wood-fired pizzas, garlic breads, and beverages.',
    robots: 'noindex, nofollow',
  })

  return (
    <div className="grid min-h-[70svh] place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">404</p>
        <h1 className="font-display mt-2 text-3xl sm:text-5xl font-extrabold text-[var(--text)]">
          Page not found
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] max-w-sm mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/menu"
            className="touch-target inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-6 py-3 font-black text-white shadow-md transition hover:shadow-lg active:scale-95 text-sm"
          >
            Browse Menu
          </Link>
          <Link
            to="/home"
            className="touch-target inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 font-bold text-[var(--text)] transition hover:border-[var(--gold)] active:scale-95 text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
