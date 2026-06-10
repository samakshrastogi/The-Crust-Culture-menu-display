export default function VegIndicator({ veg }) {
  return (
    <span
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border sm:h-5 sm:w-5 sm:rounded-[5px] ${
        veg ? 'border-[var(--green)]' : 'border-[var(--red)]'
      }`}
      title={veg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <span className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${veg ? 'bg-[var(--green)]' : 'bg-[var(--red)]'}`} />
    </span>
  )
}
