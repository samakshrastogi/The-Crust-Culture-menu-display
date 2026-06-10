export default function VegIndicator({ veg }) {
  return (
    <span
      className={`grid h-5 w-5 place-items-center rounded-[5px] border ${
        veg ? 'border-[var(--green)]' : 'border-[var(--red)]'
      }`}
      title={veg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${veg ? 'bg-[var(--green)]' : 'bg-[var(--red)]'}`} />
    </span>
  )
}
