import { memo } from 'react'
import { FiHeart, FiMinus, FiPlus } from 'react-icons/fi'
import FoodImage from './FoodImage'
import VegIndicator from './VegIndicator'
import { useCart } from '../hooks/useCart'
import { getFlavorBadge } from '../utils/flavorBadge'

function parsePriceParts(value) {
  if (!value) return { price: '', note: '' }
  const str = String(value).trim()
  const match = str.match(/^(\d+)\s*\((.*?)\)$/i)
  if (match) {
    return { price: `₹${match[1]}`, note: match[2] }
  }
  if (/rs/i.test(str)) {
    return { price: str, note: '' }
  }
  return { price: `₹${str}`, note: '' }
}

function formatPrice(value) {
  const { price, note } = parsePriceParts(value)
  return note ? `${price} (${note})` : price
}

function Highlight({ text, query }) {
  if (!query?.trim()) return text

  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (terms.length === 0) return text

  const regex = new RegExp(`(${terms.join('|')})`, 'gi')
  const testRegex = new RegExp(`^(${terms.join('|')})$`, 'i')
  const parts = String(text).split(regex)

  return parts.map((part, index) =>
    testRegex.test(part) ? (
      <mark key={`${part}-${index}`} className="rounded bg-[var(--gold)]/35 px-0.5 text-inherit font-black">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

function SearchDishCard({ item, favorites, onToggleFavorite, onSelectItem, query }) {
  const { cart, addToCart, updateQuantity } = useCart()
  const toppingsText = item.toppings ? item.toppings.replace(/^\((.*)\)$/, '$1') : null
  const flavorBadge = getFlavorBadge(item, item.sectionTitle)
  const priceParts = item.prices.length === 1 ? parsePriceParts(item.prices[0].value) : null
  const isSingle = item.prices.length === 1
  const cartItem = isSingle ? cart.find((ci) => ci.id === item.id) : null
  const inCartQty = cartItem ? cartItem.quantity : 0
  const multiCartItems = !isSingle ? cart.filter((ci) => ci.id === item.id) : []
  const multiTotalQty = multiCartItems.reduce((sum, ci) => sum + ci.quantity, 0)

  return (
    <article
      data-card
      data-menu-row
      onClick={(event) => {
        if (!event.target.closest('[data-fav-btn]') && !event.target.closest('[data-action-btn]')) {
          onSelectItem({
            ...item,
            sectionTitle: item.sectionTitle,
            sectionImage: item.sectionImage,
          })
        }
      }}
      className="group relative flex items-center gap-2.5 sm:gap-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2.5 sm:p-3 shadow-xs transition-all duration-200 hover:border-amber-500/40 hover:shadow-sm cursor-pointer"
    >
      {/* 1. Food Thumbnail */}
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-strong)]">
        <FoodImage
          src={item.image || item.sectionImage}
          alt={item.name}
          category={item.sectionTitle?.includes('Pizza') ? 'Pizza' : 'Restaurant'}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Floating Favorite Heart */}
        <button
          type="button"
          data-fav-btn
          onClick={(event) => {
            event.stopPropagation()
            onToggleFavorite(item.id, event.currentTarget)
          }}
          className={`absolute top-1 right-1 z-10 grid h-5 w-5 place-items-center rounded-full backdrop-blur-md text-[10px] transition active:scale-90 ${
            favorites.includes(item.id)
              ? 'bg-[var(--orange)] text-white shadow-xs'
              : 'bg-black/50 text-white hover:bg-black/70 border border-white/20'
          }`}
          aria-label={`Favorite ${item.name}`}
        >
          <FiHeart className={favorites.includes(item.id) ? 'fill-current' : ''} />
        </button>
      </div>

      {/* 2. Details */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Badges & Category */}
        <div className="flex flex-wrap items-center gap-1.5">
          <VegIndicator veg={item.veg} />
          {item.sectionTitle && (
            <span className="truncate rounded-md bg-[var(--surface-strong)] px-1.5 py-0.2 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[var(--gold)] border border-[var(--line)]">
              {item.sectionTitle}
            </span>
          )}
          {flavorBadge && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black border ${flavorBadge.badgeClass}`}
            >
              <span className="leading-none text-[8px]">{flavorBadge.emoji}</span>
              <span className="tracking-wider uppercase">{flavorBadge.label}</span>
            </span>
          )}
          {item.tag && (
            <span className="rounded-full bg-gradient-to-r from-[var(--orange)] to-amber-500 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-white shadow-2xs">
              {item.tag}
            </span>
          )}
        </div>

        {/* Dish Title */}
        <h3 className="text-xs sm:text-sm font-extrabold text-[var(--text)] group-hover:text-[var(--orange)] transition-colors leading-snug truncate">
          <Highlight text={item.name} query={query} />
        </h3>

        {/* Toppings / Description */}
        {toppingsText && (
          <p className="line-clamp-1 text-[11px] leading-relaxed text-[var(--muted)]">
            <Highlight text={toppingsText} query={query} />
          </p>
        )}

        {/* Bottom Row: Prices + Action Button */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {/* Prices */}
          {item.prices.length > 1 ? (
            <div className="flex flex-wrap items-center gap-1">
              {item.prices.map((price) => (
                <span
                  key={`${item.id}-${price.label}-${price.value}`}
                  className="inline-flex items-center gap-0.5 rounded bg-[var(--surface-strong)] px-1.5 py-0.2 text-[9.5px] sm:text-[10px] font-black text-[var(--text)] border border-[var(--line)] shadow-2xs"
                >
                  {price.label && (
                    <span className="text-[8.5px] font-bold text-[var(--gold)] uppercase">
                      {price.label}:
                    </span>
                  )}
                  <span className="text-[var(--orange)] font-black">₹{price.value}</span>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center rounded bg-[var(--surface-strong)] px-1.5 py-0.2 text-[10.5px] sm:text-xs font-black text-[var(--orange)] border border-[var(--line)] shadow-2xs">
                {priceParts?.price || formatPrice(item.prices[0]?.value)}
              </span>
              {priceParts?.note && (
                <span className="text-[9.5px] font-medium text-[var(--muted)] truncate max-w-[120px]">
                  ({priceParts.note})
                </span>
              )}
            </div>
          )}

          {/* Action Button */}
          <div data-action-btn className="shrink-0">
            {item.prices.length > 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectItem({
                    ...item,
                    sectionTitle: item.sectionTitle,
                    sectionImage: item.sectionImage,
                  })
                }}
                className="touch-target inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-2xs transition-all duration-200 group-hover:scale-105 active:scale-95 border border-white/25 whitespace-nowrap cursor-pointer"
              >
                <span>Add</span>
                <span className="text-[10px] font-black leading-none">+</span>
                {multiTotalQty > 0 && (
                  <span className="ml-0.5 rounded-full bg-white/25 px-1 py-0.2 text-[8px] font-black">
                    {multiTotalQty}
                  </span>
                )}
              </button>
            ) : inCartQty > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center rounded-full border border-[var(--orange)] bg-[var(--surface-strong)] p-0.5 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateQuantity(cartItem.cartItemId, -1)
                  }}
                  className="grid h-6 w-6 place-items-center rounded-full text-xs font-black text-[var(--orange)] hover:bg-[var(--line)] active:scale-90 cursor-pointer"
                  aria-label={`Decrease ${item.name}`}
                >
                  <FiMinus className="text-[10px]" />
                </button>
                <span className="w-5 text-center text-xs font-black text-[var(--orange)]">
                  {inCartQty}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(item, 0, 1)
                  }}
                  className="grid h-6 w-6 place-items-center rounded-full text-xs font-black text-[var(--orange)] hover:bg-[var(--line)] active:scale-90 cursor-pointer"
                  aria-label={`Increase ${item.name}`}
                >
                  <FiPlus className="text-[10px]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  addToCart(item, 0, 1)
                }}
                className="touch-target inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-2xs transition-all duration-200 group-hover:scale-105 active:scale-95 border border-white/25 whitespace-nowrap cursor-pointer"
              >
                <span>Add</span>
                <span className="text-[10px] font-black leading-none">+</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default memo(SearchDishCard)
