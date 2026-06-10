import { FiSearch, FiX } from 'react-icons/fi'

export default function SearchBar({ value, onChange }) {
  return (
    <label className="flex min-h-12 w-full min-w-0 items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[var(--muted)] shadow-lg sm:min-h-14 sm:gap-3 sm:rounded-3xl sm:px-4">
      <FiSearch className="shrink-0 text-[var(--gold)]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search pizza, pasta, coffee..."
        className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] sm:text-base"
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
