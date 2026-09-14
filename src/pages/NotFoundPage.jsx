import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[70svh] place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">404</p>
        <h1 className="font-display mt-2 text-3xl sm:text-5xl font-extrabold text-[var(--text)]">Page not found</h1>
        <Link
          to="/menu"
          className="touch-target mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-6 py-3 font-black text-white shadow-md transition hover:shadow-lg active:scale-95 text-sm"
        >
          Back to menu
        </Link>
      </div>
    </div>
  )
}
