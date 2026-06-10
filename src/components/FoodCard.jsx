import { FiHeart } from 'react-icons/fi'
import FoodImage from './FoodImage'
import VegIndicator from './VegIndicator'

export default function FoodCard({ item, onSelect, isFavorite, onToggleFavorite }) {
  return (
    <article
      data-card
      className="card-hover overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)]"
    >
      <button type="button" onClick={() => onSelect(item)} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden">
          <FoodImage
            src={item.image}
            alt={item.name}
            category={item.category}
            className="h-full w-full transition duration-500 hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {item.popular && (
              <span className="rounded-full bg-[var(--orange)] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                Popular
              </span>
            )}
            {item.bestSeller && (
              <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#21140b]">
                Best Seller
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <VegIndicator veg={item.veg} />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                {item.category}
              </span>
            </div>
            <h3 className="text-lg font-bold leading-tight text-[var(--text)]">{item.name}</h3>
          </div>
          <p className="shrink-0 text-lg font-black text-[var(--gold)]">₹{item.price}</p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="touch-target rounded-full bg-[var(--cream)] px-5 text-sm font-black text-[#24150b] transition hover:bg-[var(--gold)]"
          >
            View details
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            className={`touch-target grid place-items-center rounded-full border transition ${
              isFavorite
                ? 'border-[var(--orange)] bg-[var(--orange)] text-white'
                : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
            aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
          >
            <FiHeart className={isFavorite ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </article>
  )
}
