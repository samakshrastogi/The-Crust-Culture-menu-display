import { useCallback, useEffect, useRef, useState } from 'react'
import { FiHeart, FiMinus, FiPlus, FiShoppingBag, FiX } from 'react-icons/fi'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'
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
  const closeBtnRef = useRef(null)
  const lastActiveElementRef = useRef(null)
  const { cart, addToCart, updateQuantity } = useCart()
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0)
  const [prevItemId, setPrevItemId] = useState(item?.id)

  if (item?.id !== prevItemId) {
    setPrevItemId(item?.id)
    setSelectedSizeIndex(0)
  }

  const closeWithAnimation = useCallback(() => {
    gsap.to(sheetRef.current, {
      y: 36,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
  }, [onClose])

  useEffect(() => {
    if (!item) {
      return undefined
    }

    lastActiveElementRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 50)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeWithAnimation()
        return
      }

      if (e.key === 'Tab' && sheetRef.current) {
        const focusableElements = sheetRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements.length) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

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
      clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
        lastActiveElementRef.current.focus()
      }
    }
  }, [item, closeWithAnimation])

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

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] grid place-items-end bg-black/65 p-0 backdrop-blur-sm sm:place-items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-item-sheet-title"
      aria-describedby="menu-item-sheet-desc"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeWithAnimation()
        }
      }}
    >
      <div
        ref={sheetRef}
        className="no-scrollbar relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        {/* Mobile drag handle */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/40 z-20 pointer-events-none sm:hidden" />

        {/* Hero Food Media - Compact height to fit on screen */}
        <div className="group/hero relative h-28 sm:h-36 w-full overflow-hidden bg-stone-900">
          <FoodImage
            src={item.image || item.sectionImage}
            alt={item.name}
            category={isPizza ? 'Pizza' : 'Restaurant'}
            className="h-full w-full object-cover"
            loading="eager"
            data-sheet-img
          />
          {/* Subtle top and bottom dark gradient vignettes for maximum contrast */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Close button */}
          <button
            ref={closeBtnRef}
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

        {/* Card Content Body - Compact & Fully Theme Responsive */}
        <div className="space-y-2.5 p-3.5 pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:p-4 bg-[var(--surface)] text-[var(--text)]">
          {/* Header Row: Category + Dietary + Title + Favorite */}
          <div data-sheet-item className="space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <VegIndicator veg={item.veg} />
                <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {item.sectionTitle}
                </span>
                {showFlavorBadgeInBody && (
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${flavorBadge.badgeClass}`}>
                    <span>{flavorBadge.emoji}</span>
                    <span>{flavorBadge.label}</span>
                  </span>
                )}
              </div>

              {/* Heart Toggle */}
              <button
                type="button"
                onClick={(event) => onToggleFavorite(item.id, event.currentTarget)}
                className={`grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full border transition-all duration-200 active:scale-90 ${
                  isFavorite
                    ? 'border-orange-500 bg-orange-500 text-white shadow-xs shadow-orange-500/30'
                    : 'border-[var(--line)] bg-[var(--surface-strong)]/50 text-[var(--muted)] hover:border-red-400 hover:text-red-500'
                }`}
                aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
              >
                <FiHeart className={`text-xs ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Sans-serif bold title */}
            <h2 id="menu-item-sheet-title" className="font-sans text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-[var(--text)] pt-0.5">
              {item.name}
            </h2>

            {/* Description Subtitle */}
            <p id="menu-item-sheet-desc" className="text-[11.5px] sm:text-xs leading-tight text-[var(--muted)] font-normal line-clamp-2">
              {item.description || (isPizza ? 'A perfect blend of fresh veggies and melted cheese.' : 'Crafted fresh with authentic ingredients and rich flavors.')}
            </p>
          </div>

          {/* Fresh Ingredients & Toppings - Compact Card */}
          {cleanToppings && (
            <div data-sheet-item className="rounded-xl border border-[var(--line)] bg-[#fdfbf7] dark:bg-[#261b15] px-3 py-1.5 sm:py-2 shadow-2xs flex items-center gap-2.5">
              <div className="shrink-0 text-emerald-600 dark:text-emerald-400">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" fill="currentColor" aria-hidden="true">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.45 17.55 9.4 12.5 17 11V8z" />
                  <path d="M3.5 13c1.5 0 4.5-1 6.5-3.5 3-3.7 4-8.5 4-8.5s-4.8 1-8.5 4C3 7.5 2 10.5 2 12c0 .5.5 1 1.5 1z" />
                  <path d="M12.5 17c1.5 0 4-1 5.5-3 2.5-3 3-7 3-7s-4 1-7 3.5c-2 1.8-2.5 4.5-2.5 5.5 0 .5.3 1 1 1z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Fresh Ingredients & Toppings
                </div>
                <p className="text-[11.5px] sm:text-xs font-medium text-[var(--text)] leading-snug mt-0.5">
                  {cleanToppings}
                </p>
              </div>
            </div>
          )}

          {/* Pricing & Size Selection - Compact Grid */}
          {item.prices && item.prices.length > 1 ? (
            <div data-sheet-item className="space-y-1.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--muted)]">
                  Select Size & Portion
                </span>
                {selectedPriceObj && (
                  <span className="text-xs font-black text-[#ea580c]">
                    {selectedPriceObj.label ? `${selectedPriceObj.label} • ` : ''}{formatPrice(selectedPriceObj.value)}
                  </span>
                )}
              </div>
              <div
                role="radiogroup"
                aria-label="Select size and portion"
                className={`grid gap-1.5 sm:gap-2 ${item.prices.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
              >
                {item.prices.map((price, idx) => {
                  const isSelected = selectedSizeIndex === idx
                  const label = price.label || (idx === 0 ? 'S' : idx === 1 ? 'M' : 'L')
                  const subLabel = getSizeSubLabel(label, isPizza)
                  return (
                    <button
                      key={`${price.label}-${price.value}-${idx}`}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${label} ${subLabel || ''} ${formatPrice(price.value)}`}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`relative rounded-xl py-1.5 px-1 sm:py-2 sm:px-1.5 flex flex-col items-center justify-between transition-all duration-150 cursor-pointer shadow-2xs min-h-[58px] ${
                        isSelected
                          ? 'border-2 border-[#ea580c] bg-orange-50/70 dark:bg-orange-950/30'
                          : 'border border-[var(--line)] bg-[var(--surface)] hover:border-orange-300 dark:hover:border-orange-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-[8px] font-black shadow-xs" aria-hidden="true">
                          ✓
                        </div>
                      )}
                      <div className="flex items-center gap-1 mb-0.5">
                        <span
                          className={`grid h-4.5 w-4.5 place-items-center rounded-full text-[9px] font-black ${
                            isSelected
                              ? 'bg-[#ea580c] text-white shadow-xs'
                              : 'bg-[var(--surface-strong)] text-[var(--muted)]'
                          }`}
                        >
                          {label}
                        </span>
                        {subLabel && (
                          <span className={`text-[10.5px] sm:text-[11px] font-semibold truncate ${isSelected ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>
                            {subLabel}
                          </span>
                        )}
                      </div>
                      <span className="text-sm sm:text-base font-black text-[var(--text)]">
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
                className="relative overflow-hidden rounded-xl border border-[var(--line)] bg-[#fdfbf7] dark:bg-[#261b15] px-3 py-2 shadow-2xs flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
                    Standard Fresh Portion
                  </span>
                  <p className="text-xs font-semibold text-[var(--text)]">
                    {item.prices[0].label || 'Regular Portion'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-[#ea580c]">
                    {formatPrice(item.prices[0].value)}
                  </span>
                </div>
              </div>
            )
          )}

          {/* Primary Action: Add to Cart / Quantity Controller + Inline View Cart */}
          <div data-sheet-item className="pt-0.5">
            {currentQuantity > 0 ? (
              <div className="flex w-full items-center justify-between rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#ea580c] to-[#e65100] p-1.5 sm:p-2 text-white shadow-md shadow-orange-500/20">
                {/* Decrement Button */}
                <button
                  type="button"
                  onClick={() => updateQuantity(currentCartItemId, -1)}
                  className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg sm:rounded-xl bg-white text-[#ea580c] shadow-xs hover:bg-orange-50 active:scale-95 transition-all cursor-pointer font-black shrink-0"
                  aria-label={`Decrease ${item.name} quantity`}
                  title="Decrease quantity"
                >
                  <FiMinus className="text-base stroke-[3]" />
                </button>

                {/* Current Quantity & Item Total Info */}
                <div className="flex flex-col items-center justify-center px-1 select-none min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black tracking-tight text-white whitespace-nowrap">
                      {currentQuantity} in Cart
                    </span>
                    <span className="rounded bg-[#b43403] px-2 py-0.5 text-[10px] sm:text-xs font-black text-white shadow-2xs">
                      ₹{(currentCartItem?.price || selectedPriceObj?.value || 0) * currentQuantity}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-white/85">
                    {formatPrice(selectedPriceObj?.value || 0)} each
                  </span>
                </div>

                {/* Increment Button */}
                <button
                  type="button"
                  onClick={() => updateQuantity(currentCartItemId, 1)}
                  className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg sm:rounded-xl bg-white text-[#ea580c] shadow-xs hover:bg-orange-50 active:scale-95 transition-all cursor-pointer font-black shrink-0"
                  aria-label={`Increase ${item.name} quantity`}
                  title="Increase quantity"
                >
                  <FiPlus className="text-base stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addToCart(item, selectedSizeIndex, 1)
                }}
                aria-label={`Add ${item.name} to cart`}
                className="group flex w-full items-center justify-between rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#ea580c] to-[#e65100] p-2 sm:p-2.5 text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:brightness-105 active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2 pl-1.5">
                  <span className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg bg-white/20 text-white backdrop-blur-xs">
                    <FiShoppingBag className="text-base" />
                  </span>
                  <span className="text-sm sm:text-base font-black tracking-wide">
                    Add to Cart
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-white text-[#ea580c] px-3 py-1.5 shadow-sm font-black text-xs sm:text-sm">
                  <span>
                    {formatPrice(selectedPriceObj?.value || 0)}
                  </span>
                  <span className="text-sm leading-none">+</span>
                </div>
              </button>
            )}
          </div>

          {/* Cafe Quality Footer Accents - Compact */}
          <div data-sheet-item className="flex items-center justify-center gap-2.5 sm:gap-4 py-1.5 pt-2 border-t border-[var(--line)] text-[10.5px] sm:text-xs font-semibold text-[var(--muted)]">
            <div className="flex items-center gap-1">
              <span className="text-sm">🍃</span>
              <span>100% Pure Veg</span>
            </div>
            <span className="h-3 w-px bg-[var(--line)]" />
            <div className="flex items-center gap-1">
              <span className="text-sm">🔥</span>
              <span>Wood-Fired</span>
            </div>
            <span className="h-3 w-px bg-[var(--line)]" />
            <div className="flex items-center gap-1">
              <span className="text-sm">👨‍🍳</span>
              <span>Baked Fresh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
