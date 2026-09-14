import { FiSearch, FiX } from 'react-icons/fi'

export default function SearchBar({ value, onChange }) {
  return (
    <label className="flex h-10 w-full min-w-0 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[var(--muted)] shadow-xs transition-colors focus-within:border-[var(--orange)] sm:h-11 sm:gap-2.5 sm:px-3.5">
      <FiSearch className="shrink-0 text-sm sm:text-base text-[var(--gold)]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search pizza, burger, momo, maggie..."
        className="w-full bg-transparent text-xs text-[var(--text)] outline-none placeholder:text-[var(--muted)] sm:text-sm"
        type="search"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="touch-target grid place-items-center rounded-full text-[var(--muted)]"
          aria-label="Clear search"
        >
          <FiX />
        </button>
      )}
    </label>
  )
}
