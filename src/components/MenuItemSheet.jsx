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

        {/* Card Content Body - Highly Compact Layout */}
        <div className="space-y-2.5 p-3.5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4">
          {/* Header Row: Category + Dietary + Title + Favorite */}
          <div data-sheet-item className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <VegIndicator veg={item.veg} />
                <span className="inline-flex items-center rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--gold)]">
                  {item.sectionTitle}
                </span>
                {showFlavorBadgeInBody && (
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${flavorBadge.badgeClass}`}>
                    <span>{flavorBadge.emoji}</span>
                    <span>{flavorBadge.label}</span>
                  </span>
                )}
              </div>

              {/* Heart Toggle */}
              <button
                type="button"
                onClick={(event) => onToggleFavorite(item.id, event.currentTarget)}
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-200 active:scale-90 ${
                  isFavorite
                    ? 'border-orange-500 bg-gradient-to-tr from-[var(--orange)] to-amber-500 text-white shadow-xs shadow-orange-500/25 ring-2 ring-orange-400/20'
                    : 'border-[var(--line)] bg-[var(--surface-strong)]/60 text-[var(--muted)] hover:border-red-400 hover:text-red-500 hover:bg-[var(--surface)]'
                }`}
                aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
              >
                <FiHeart className={`text-xs ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h2 className="font-display text-lg sm:text-xl font-black leading-tight tracking-tight text-[var(--text)]">
              {item.name}
            </h2>
          </div>

          {/* Description (if any) */}
          {item.description && (
            <p data-sheet-item className="text-xs leading-relaxed text-[var(--muted)] font-medium">
              {item.description}
            </p>
          )}

          {/* Toppings / Ingredients - Compact Card */}
          {cleanToppings && (
            <div data-sheet-item className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)]/30 px-3 py-2 shadow-xs">
              <div className="flex items-center gap-1.5 mb-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--gold)]">
                <span className="text-xs">🌿</span>
                <span>Fresh Ingredients & Toppings</span>
              </div>
              <p className="text-xs font-semibold leading-snug text-[var(--text)]">
                {cleanToppings}
              </p>
            </div>
          )}

          {/* Pricing & Size Selection - Compact */}
          {item.prices && item.prices.length > 1 ? (
            <div data-sheet-item className="space-y-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)]/25 p-2.5 sm:p-3">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-[var(--gold)]">
                  Select Size & Portion
                </span>
                {selectedPriceObj && (
                  <span className="text-[11px] font-black text-[var(--orange)]">
                    {selectedPriceObj.label ? `${selectedPriceObj.label} • ` : ''}{formatPrice(selectedPriceObj.value)}
                  </span>
                )}
              </div>
              <div className={`grid gap-1.5 ${item.prices.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {item.prices.map((price, idx) => {
                  const isSelected = selectedSizeIndex === idx
                  const label = price.label || (idx === 0 ? 'S' : idx === 1 ? 'M' : 'L')
                  const subLabel = getSizeSubLabel(label, isPizza)
                  return (
                    <button
                      key={`${price.label}-${price.value}-${idx}`}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`flex flex-col items-center justify-center rounded-lg py-1.5 px-1 border text-center transition-all duration-200 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'border-[var(--orange)] bg-gradient-to-b from-orange-500/15 via-[var(--surface)] to-orange-500/5 ring-1.5 ring-[var(--orange)]/50 shadow-xs'
                          : 'border-[var(--line)] bg-[var(--surface)] hover:border-amber-500/35'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span
                          className={`grid h-4 w-4 place-items-center rounded-full text-[8px] font-black ${
                            isSelected
                              ? 'bg-[var(--orange)] text-white'
                              : 'bg-[var(--line)] text-[var(--muted)]'
                          }`}
                        >
                          {label}
                        </span>
                        {subLabel && (
                          <span className="text-[9px] font-bold text-[var(--muted)] truncate max-w-[65px]">
                            {subLabel}
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-black text-[var(--text)]">
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
                className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[var(--surface)] to-orange-500/10 px-3 py-2 shadow-xs flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-[var(--gold)]">
                      Fresh Portion
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-[var(--muted)]">
                    {item.prices[0].label || 'Standard Fresh Portion'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[var(--orange)]">
                    {formatPrice(item.prices[0].value)}
                  </span>
                  <span className="block text-[8px] font-bold text-[var(--muted)]">Taxes Included</span>
                </div>
              </div>
            )
          )}

          {/* Primary Action: Add to Cart / Quantity Controller */}
          <div data-sheet-item className="space-y-2 pt-0.5">
            {currentQuantity > 0 ? (
              <div className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[var(--orange)] via-[#ea580c] to-[#d9480f] p-2 text-white shadow-lg shadow-orange-500/25 border border-white/20 transition-all duration-200">
                {/* Decrement Button */}
                <button
                  type="button"
                  onClick={() => updateQuantity(currentCartItemId, -1)}
                  className="touch-target grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl bg-white text-[var(--orange)] shadow-md hover:bg-amber-50 active:scale-90 transition-all cursor-pointer font-black"
                  aria-label="Decrease quantity"
                  title="Decrease quantity"
                >
                  <FiMinus className="text-base sm:text-lg stroke-[3]" />
                </button>

                {/* Current Quantity & Item Total Info */}
                <div className="flex flex-col items-center justify-center px-2 select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight text-white">
                      {currentQuantity} in Cart
                    </span>
                    <span className="rounded-lg bg-black/20 px-2.5 py-0.5 text-xs sm:text-sm font-black text-amber-200 border border-white/15 shadow-inner">
                      ₹{(currentCartItem?.price || selectedPriceObj?.value || 0) * currentQuantity}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-white/80">
                    {formatPrice(selectedPriceObj?.value || 0)} each • Tap - or +
                  </span>
                </div>

                {/* Increment Button */}
                <button
                  type="button"
                  onClick={() => updateQuantity(currentCartItemId, 1)}
                  className="touch-target grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl bg-white text-[var(--orange)] shadow-md hover:bg-amber-50 active:scale-90 transition-all cursor-pointer font-black"
                  aria-label="Increase quantity"
                  title="Increase quantity"
                >
                  <FiPlus className="text-base sm:text-lg stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addToCart(item, selectedSizeIndex, 1)
                }}
                className="touch-target group flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[var(--orange)] via-[#ea580c] to-[#d9480f] p-2 text-white shadow-lg shadow-orange-500/25 border border-white/20 transition-all duration-200 hover:brightness-105 active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2.5 pl-2">
                  <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                    <FiShoppingBag className="text-base sm:text-lg" />
                  </span>
                  <span className="text-sm sm:text-base font-black tracking-wide">
                    Add to Cart
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-white text-[var(--orange)] px-3 py-2 sm:py-2.5 shadow-md">
                  <span className="text-xs sm:text-sm font-black">
                    {formatPrice(selectedPriceObj?.value || 0)}
                  </span>
                  <span className="text-xs font-black leading-none">+</span>
                </div>
              </button>
            )}

            {/* Quick View Cart Action when item is added */}
            {currentQuantity > 0 && (
              <Link
                to="/cart"
                onClick={onClose}
                className="touch-target flex items-center justify-center gap-1.5 pt-0.5 text-xs font-black text-[var(--orange)] hover:text-[#c2410c] transition group/viewcart"
              >
                <span>View Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <FiArrowRight className="text-xs transition-transform group-hover/viewcart:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Cafe Quality Footer Accents - Compact Single Line */}
          <div data-sheet-item className="flex items-center justify-center gap-2 pt-1 border-t border-[var(--line)]/40 text-[9px] font-bold text-[var(--muted)] text-center">
            <span>🌱 100% Pure Veg</span>
            <span className="text-[var(--line)]">•</span>
            <span>🪵 Wood-Fired</span>
            <span className="text-[var(--line)]">•</span>
            <span>⏱️ Baked Fresh</span>
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
