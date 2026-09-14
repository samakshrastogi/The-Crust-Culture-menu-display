import { Link } from 'react-router-dom'

export default function BrandLogo({ compact = false }) {
  return (
    <Link
      to="/home"
      className="group flex min-w-0 max-w-[calc(100vw-140px)] items-center gap-2.5 sm:max-w-none sm:gap-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
      aria-label="The Crust Culture home"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[var(--orange)] to-amber-600 text-sm font-black text-white shadow-md shadow-orange-500/20 sm:h-10 sm:w-10 sm:text-base transition-transform duration-200 group-hover:rotate-3">
        CC
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className="font-display block truncate text-[15px] font-extrabold tracking-tight text-[var(--text)] group-hover:text-[var(--orange)] transition-colors sm:text-lg">
            The Crust Culture
          </span>
          <span className="block truncate text-[9px] font-black uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400 max-[390px]:hidden sm:text-[10px]">
            Wood Fired Kitchen
          </span>
        </span>
      )}
    </Link>
  )
}
