export default function LiveStatusBadge({ className = '' }) {
  return (
    <div
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--text)] shadow-xs h-10 sm:h-11 sm:px-3 sm:gap-2 ${className}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
      </span>
      <span className="hidden sm:inline text-xs">Open daily 1:30 PM – 1:30 AM</span>
      <span className="sm:hidden text-[11px] font-black text-emerald-600 dark:text-emerald-400">Open</span>
    </div>
  )
}
