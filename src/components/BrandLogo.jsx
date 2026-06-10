import { Link } from 'react-router-dom'

export default function BrandLogo({ compact = false }) {
  return (
    <Link
      to="/menu"
      className="group flex min-w-0 max-w-[calc(100vw-150px)] items-center gap-2 sm:max-w-none sm:gap-3"
      aria-label="The Crust Culture menu"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface-strong)] text-sm font-black text-[var(--gold)] shadow-lg sm:h-11 sm:w-11 sm:text-lg">
        CC
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className="font-display block truncate text-[15px] font-semibold text-[var(--text)] sm:text-lg">
            The Crust Culture
          </span>
          <span className="block truncate text-[10px] uppercase tracking-[0.18em] text-[var(--gold)] max-[390px]:hidden sm:text-[11px] sm:tracking-[0.22em]">
            Wood fired kitchen
          </span>
        </span>
      )}
    </Link>
  )
}
