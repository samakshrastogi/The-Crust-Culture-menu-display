import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiHeart, FiMaximize2, FiMinus, FiPlus, FiShoppingBag, FiX } from 'react-icons/fi'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'
import ImageLightbox from './ImageLightbox'
import { useCart } from '../hooks/useCart'
import { getFlavorBadge } from '../utils/flavorBadge'
import VegIndicator from './VegIndicator'

function formatPrice(value) {
  if (/rs/i.test(value)) {
    return value
  }

  return `₹${value}`
}

function getSizeSubLabel(label, isPizza) {
  const clean = String(label).toUpperCase().trim()
  if (clean === 'S') return isPizza ? '7" Regular' : 'Small'
  if (clean === 'M') return isPizza ? '10" Medium' : 'Medium'
  if (clean === 'L') return isPizza ? '12" Large' : 'Large'
  return clean || null
}

export default function MenuItemSheet({ item, favorites, onClose, onToggleFavorite }) {
  const overlayRef = useRef(null)
  const sheetRef = useRef(null)
  const { cart, addToCart, updateQuantity, cartCount } = useCart()
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [prevItemId, setPrevItemId] = useState(item?.id)

  if (item?.id !== prevItemId) {
    setPrevItemId(item?.id)
    setSelectedSizeIndex(0)
    setIsLightboxOpen(false)
  }

  useEffect(() => {
    if (!item) {
      return undefined
    }

    document.body.style.overflow = 'hidden'
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' })
    gsap.fromTo(
      sheetRef.current,
      { y: 80, scale: 0.95, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.3)', clearProps: 'transform,opacity' },
    )
    gsap.fromTo(
      '[data-sheet-img] img',
      { scale: 1.28 },
      { scale: 1, duration: 0.85, ease: 'power2.out', clearProps: 'transform' }
    )
    gsap.fromTo(
      '[data-sheet-item]',
      { y: 12, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.35,
        stagger: 0.04,
        ease: 'back.out(1.2)',
        delay: 0.1,
        clearProps: 'opacity,transform',
      },
    )

    return () => {
      document.body.style.overflow = ''
    }
  }, [item])

  if (!item) {
    return null
  }

  const isFavorite = favorites?.includes(item.id)
  const isPizza = item.sectionTitle?.toLowerCase().includes('pizza') || item.name?.toLowerCase().includes('pizza')
  const cleanToppings = item.toppings?.replace(/^\((.*)\)$/, '$1') || item.toppings
  const flavorBadge = getFlavorBadge(item, item.sectionTitle)
  const showFlavorBadgeOnImage = !item.tag && Boolean(flavorBadge)
  const showFlavorBadgeInBody = !showFlavorBadgeOnImage && Boolean(flavorBadge)

  const selectedPriceObj = item.prices?.[selectedSizeIndex] || item.prices?.[0]
  const currentCartItemId = `${item.id}-${selectedPriceObj?.label || selectedSizeIndex || 'standard'}`
  const currentCartItem = cart?.find((ci) => ci.cartItemId === currentCartItemId)
  const currentQuantity = currentCartItem ? currentCartItem.quantity : 0

  const closeWithAnimation = () => {
    gsap.to(sheetRef.current, {
      y: 36,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] grid place-items-end bg-black/65 p-0 backdrop-blur-sm sm:place-items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} details`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeWithAnimation()
        }
      }}
    >
      <div
        ref={sheetRef}
        className="modal-scroll relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        {/* Mobile drag handle */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/40 z-20 pointer-events-none sm:hidden" />

        {/* Hero Food Media with Tap-to-Zoom Lightbox Trigger */}
        <div
          className="group/hero relative h-36 sm:h-44 w-full overflow-hidden bg-stone-900 cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
          title="Click to view full photo & zoom"
        >
          <FoodImage
            src={item.image || item.sectionImage}
            alt={item.name}
            category={isPizza ? 'Pizza' : 'Restaurant'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover/hero:scale-104"
            loading="eager"
            data-sheet-img
          />
          {/* Subtle top and bottom dark gradient vignettes for maximum contrast */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              closeWithAnimation()
            }}
            className="touch-target absolute right-2.5 top-2.5 z-20 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-black/55 text-white backdrop-blur-md border border-white/25 transition-all hover:bg-black/80 hover:scale-105 active:scale-95 shadow-md"
            aria-label="Close details"
          >
            <FiX className="text-sm" />
          </button>

          {/* Floating Tap to Zoom Cue Pill */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsLightboxOpen(true)
            }}
            className="touch-target absolute right-2.5 bottom-2.5 z-20 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md border border-white/25 shadow-md transition-all hover:bg-amber-500 hover:text-black active:scale-95"
            aria-label="Zoom photo"
          >
            <FiMaximize2 className="text-[10px] text-amber-300" />
            <span>Tap to Zoom</span>
          </button>

          {/* Tag Pill (Top Left - Exactly One Badge) */}
          <div className="absolute left-2.5 top-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
            {item.tag ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--orange)] to-amber-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md border border-white/25">
                <span>★</span>
                <span>{item.tag}</span>
              </span>
            ) : showFlavorBadgeOnImage ? (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${flavorBadge.badgeClass}`}>
                <span>{flavorBadge.emoji}</span>
                <span>{flavorBadge.label}</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Card Content Body - Pixel-perfect match to target Image 2 */}
        <div className="space-y-3.5 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-5 bg-white dark:bg-stone-900">
          {/* Header Row: Category + Dietary + Title + Favorite */}
          <div data-sheet-item className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <VegIndicator veg={item.veg} />
                <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-700/50 px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {item.sectionTitle}
                </span>
                {showFlavorBadgeInBody && (
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider ${flavorBadge.badgeClass}`}>
                    <span>{flavorBadge.emoji}</span>
                    <span>{flavorBadge.label}</span>
                  </span>
                )}
              </div>

              {/* Heart Toggle */}
              <button
                type="button"
                onClick={(event) => onToggleFavorite(item.id, event.currentTarget)}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-200 active:scale-90 ${
                  isFavorite
                    ? 'border-orange-500 bg-orange-500 text-white shadow-xs shadow-orange-500/30'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:border-red-400 hover:text-red-500'
                }`}
                aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
              >
                <FiHeart className={`text-xs ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Sans-serif bold title matching Image 2 */}
            <h2 className="font-sans text-2xl sm:text-[26px] font-extrabold leading-tight tracking-tight text-stone-900 dark:text-stone-50 pt-0.5">
              {item.name}
            </h2>

            {/* Description Subtitle */}
            <p className="text-xs sm:text-[13px] leading-relaxed text-stone-500 dark:text-stone-400 font-normal">
              {item.description || (isPizza ? 'A perfect blend of fresh veggies and melted cheese.' : 'Crafted fresh with authentic ingredients and rich flavors.')}
            </p>
          </div>

          {/* Fresh Ingredients & Toppings - Exact Image 2 Card */}
          {cleanToppings && (
            <div data-sheet-item className="rounded-xl border border-stone-200/80 dark:border-stone-800 bg-[#fdfbf7] dark:bg-stone-800/40 p-3 shadow-2xs flex items-center gap-3">
              <div className="shrink-0 text-emerald-600">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-emerald-600" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.45 17.55 9.4 12.5 17 11V8z" />
                  <path d="M3.5 13c1.5 0 4.5-1 6.5-3.5 3-3.7 4-8.5 4-8.5s-4.8 1-8.5 4C3 7.5 2 10.5 2 12c0 .5.5 1 1.5 1z" />
                  <path d="M12.5 17c1.5 0 4-1 5.5-3 2.5-3 3-7 3-7s-4 1-7 3.5c-2 1.8-2.5 4.5-2.5 5.5 0 .5.3 1 1 1z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10.5px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Fresh Ingredients & Toppings
                </div>
                <p className="text-xs sm:text-[13px] font-medium text-stone-800 dark:text-stone-200 leading-snug mt-0.5">
                  {cleanToppings}
                </p>
              </div>
            </div>
          )}

          {/* Pricing & Size Selection - Frameless Direct Grid matching Image 2 */}
          {item.prices && item.prices.length > 1 ? (
            <div data-sheet-item className="space-y-2">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Select Size & Portion
                </span>
                {selectedPriceObj && (
                  <span className="text-xs font-black text-[#ea580c]">
                    {selectedPriceObj.label ? `${selectedPriceObj.label} • ` : ''}{formatPrice(selectedPriceObj.value)}
                  </span>
                )}
              </div>
              <div className={`grid gap-2 sm:gap-2.5 ${item.prices.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {item.prices.map((price, idx) => {
                  const isSelected = selectedSizeIndex === idx
                  const label = price.label || (idx === 0 ? 'S' : idx === 1 ? 'M' : 'L')
                  const subLabel = getSizeSubLabel(label, isPizza)
                  return (
                    <button
                      key={`${price.label}-${price.value}-${idx}`}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`relative rounded-xl sm:rounded-2xl py-2 px-1.5 sm:py-2.5 sm:px-2 flex flex-col items-center justify-between transition-all duration-150 cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'border-2 border-[#ea580c] bg-orange-50/50 dark:bg-orange-950/25'
                          : 'border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-stone-800/60 hover:border-orange-200'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-[9px] font-black shadow-xs">
                          ✓
                        </div>
                      )}
                      <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                        <span
                          className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-black ${
                            isSelected
                              ? 'bg-[#ea580c] text-white shadow-xs'
                              : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                          }`}
                        >
                          {label}
                        </span>
                        {subLabel && (
                          <span className={`text-[11px] sm:text-xs font-semibold truncate ${isSelected ? 'text-stone-800 dark:text-stone-200' : 'text-stone-600 dark:text-stone-400'}`}>
                            {subLabel}
                          </span>
                        )}
                      </div>
                      <span className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                        {formatPrice(price.value)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            item.prices && item.prices.length === 1 && (
              <div
                data-sheet-item
                className="relative overflow-hidden rounded-xl border border-stone-200/90 dark:border-stone-800 bg-[#fdfbf7] dark:bg-stone-800/40 px-3.5 py-2.5 shadow-2xs flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Standard Fresh Portion
                  </span>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {item.prices[0].label || 'Regular Portion'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#ea580c]">
                    {formatPrice(item.prices[0].value)}
                  </span>
                  <span className="block text-[9px] font-medium text-stone-400">Taxes Included</span>
                </div>
              </div>
            )
          )}

          {/* Primary Action: Add to Cart / Quantity Controller */}
          <div data-sheet-item className="space-y-2.5 pt-0.5">
            {currentQuantity > 0 ? (
              <div className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#ea580c] to-[#e65100] p-2 text-white shadow-lg shadow-orange-500/25">
                {/* Decrement Button */}
                <button
                  type="button"
                  onClick={() => updateQuantity(currentCartItemId, -1)}
                  className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#ea580c] shadow-sm hover:bg-orange-50 active:scale-95 transition-all cursor-pointer font-black"
                  aria-label="Decrease quantity"
                  title="Decrease quantity"
                >
                  <FiMinus className="text-lg stroke-[3]" />
                </button>

                {/* Current Quantity & Item Total Info */}
                <div className="flex flex-col items-center justify-center px-2 select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-[17px] font-black tracking-tight text-white">
                      {currentQuantity} in Cart
                    </span>
                    <span className="h-4 w-px bg-white/30" />
                    <span className="rounded-lg bg-[#b43403] px-2.5 py-0.5 text-sm font-black text-white shadow-xs">
                      ₹{(currentCartItem?.price || selectedPriceObj?.value || 0) * currentQuantity}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-white/90 mt-0.5">
                    {formatPrice(selectedPriceObj?.value || 0)} each • Tap - or +
                  </span>
                </div>

                {/* Increment Button */}
                <button
                  type="button"
                  onClick={() => updateQuantity(currentCartItemId, 1)}
                  className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#ea580c] shadow-sm hover:bg-orange-50 active:scale-95 transition-all cursor-pointer font-black"
                  aria-label="Increase quantity"
                  title="Increase quantity"
                >
                  <FiPlus className="text-lg stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addToCart(item, selectedSizeIndex, 1)
                }}
                className="group flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#ea580c] to-[#e65100] p-2.5 text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:brightness-105 active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2.5 pl-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                    <FiShoppingBag className="text-lg" />
                  </span>
                  <span className="text-base font-black tracking-wide">
                    Add to Cart
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-white text-[#ea580c] px-3.5 py-2 shadow-sm font-black text-sm">
                  <span>
                    {formatPrice(selectedPriceObj?.value || 0)}
                  </span>
                  <span className="text-base leading-none">+</span>
                </div>
              </button>
            )}

            {/* Full-width Outlined View Cart Button matching Image 2 */}
            {cartCount > 0 && (
              <Link
                to="/cart"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-[#ea580c]/40 bg-[#fffaf5] dark:bg-orange-950/20 text-[#ea580c] font-extrabold text-sm shadow-2xs hover:bg-orange-100/60 active:scale-[0.99] transition-all group/viewcart"
              >
                <span>View Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <FiArrowRight className="text-sm stroke-[2.5] transition-transform group-hover/viewcart:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Cafe Quality Footer Accents - 3-column with vertical dividers matching Image 2 */}
          <div data-sheet-item className="flex items-center justify-center gap-3 sm:gap-5 py-2 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🍃</span>
              <span>100% Pure Veg</span>
            </div>
            <span className="h-3.5 w-px bg-stone-200 dark:bg-stone-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-base">🔥</span>
              <span>Wood-Fired</span>
            </div>
            <span className="h-3.5 w-px bg-stone-200 dark:bg-stone-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-base">👨‍🍳</span>
              <span>Baked Fresh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tap-to-Zoom Full-Screen Lightbox */}
      {isLightboxOpen && (
        <ImageLightbox
          src={item.image || item.sectionImage}
          alt={item.name}
          title={item.name}
          category={item.sectionTitle}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  )
}
