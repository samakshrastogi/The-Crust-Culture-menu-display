import { FiSearch, FiX } from 'react-icons/fi'

export default function SearchBar({ value, onChange }) {
  return (
    <label className="flex min-h-14 items-center gap-3 rounded-3xl border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--muted)] shadow-lg">
      <FiSearch className="shrink-0 text-[var(--gold)]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search pizza, pasta, coffee..."
        className="w-full bg-transparent text-base text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
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
