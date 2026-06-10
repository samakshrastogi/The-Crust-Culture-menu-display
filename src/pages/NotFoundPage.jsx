import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[70svh] place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">404</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-[var(--text)]">Page not found</h1>
        <Link
          to="/menu"
          className="touch-target mt-7 inline-flex items-center justify-center rounded-full bg-[var(--orange)] px-6 font-black text-white"
        >
          Back to menu
        </Link>
      </div>
    </div>
  )
}
