import { Link } from 'react-router-dom'

export default function BrandLogo({ compact = false }) {
  return (
    <Link
      to="/home"
      className="group flex min-w-0 max-w-[calc(100vw-140px)] items-center gap-2.5 sm:max-w-none sm:gap-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
      aria-label="The Crust Culture home"
    >
      <img
        src="/logo.svg"
        alt="The Crust Culture Logo"
        width="44"
        height="44"
        className="h-9 w-9 shrink-0 rounded-full object-contain shadow-md shadow-orange-500/25 ring-1.5 ring-amber-500/35 sm:h-10.5 sm:w-10.5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6"
      />
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className="font-display block truncate text-[15px] font-extrabold tracking-tight text-[var(--text)] group-hover:text-[var(--orange)] transition-colors sm:text-lg">
            The Crust Culture
          </span>
          <span className="block truncate text-[9px] font-black uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400 max-[390px]:hidden sm:text-[10px]">
            Wood Fired Cafe
          </span>
        </span>
      )}
    </Link>
  )
}
