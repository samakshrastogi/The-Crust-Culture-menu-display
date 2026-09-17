export default function VegIndicator({ veg }) {
  const label = veg ? 'Vegetarian' : 'Non-vegetarian'

  return (
    <span
      role="img"
      aria-label={label}
      className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[4px] border sm:h-4 sm:w-4 ${
        veg ? 'border-[var(--green)]' : 'border-[var(--red)]'
      }`}
      title={label}
    >
      <span className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${veg ? 'bg-[var(--green)]' : 'bg-[var(--red)]'}`} />
      <span className="sr-only">{label}</span>
    </span>
  )
}
