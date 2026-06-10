export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="sticky top-[69px] z-30 -mx-4 border-y border-[var(--line)] bg-[var(--bg)]/92 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-3xl sm:border">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {['All', ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`touch-target shrink-0 rounded-full border px-4 text-sm font-bold transition ${
              activeCategory === category
                ? 'border-[var(--gold)] bg-[var(--gold)] text-[#24150b]'
                : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
