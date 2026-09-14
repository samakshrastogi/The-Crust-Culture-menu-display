import { useEffect, useRef, useState } from 'react'
import { FiExternalLink, FiHeart, FiMaximize2, FiPhone, FiX } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import { SiZomato } from 'react-icons/si'
import { gsap } from '../animations/gsapAnimations'
import FoodImage from './FoodImage'
import ImageLightbox from './ImageLightbox'
import { getFlavorBadge } from '../utils/flavorBadge'
import VegIndicator from './VegIndicator'

const ZOMATO_URL = 'https://www.zomato.com'

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
  const portionSuffix = selectedPriceObj
    ? ` (${selectedPriceObj.label ? `${selectedPriceObj.label} - ` : ''}₹${selectedPriceObj.value})`
    : ''

  const whatsappUrl = `https://wa.me/919625261591?text=${encodeURIComponent(
    `Hello The Crust Culture, I would like to order: ${item.name}${portionSuffix}`
  )}`

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
        className="modal-scroll relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl sm:max-w-lg sm:rounded-[2rem]"
      >
        {/* Mobile drag handle */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/40 z-20 pointer-events-none sm:hidden" />

        {/* Hero Food Media with Tap-to-Zoom Lightbox Trigger */}
        <div
          className="group/hero relative aspect-[16/10] overflow-hidden bg-stone-900 cursor-zoom-in"
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
          {/* Subtle top and bottom dark gradient vignettes for maximum contrast and zero milky wash-out */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              closeWithAnimation()
            }}
            className="touch-target absolute right-3 top-3 z-20 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/25 transition-all hover:bg-black/80 hover:scale-105 active:scale-95 shadow-md"
            aria-label="Close details"
          >
            <FiX className="text-base" />
          </button>

          {/* Floating Tap to Zoom Cue Pill */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsLightboxOpen(true)
            }}
            className="touch-target absolute right-3 bottom-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/25 shadow-lg transition-all hover:bg-amber-500 hover:text-black hover:scale-105 active:scale-95"
            aria-label="Zoom photo"
          >
            <FiMaximize2 className="text-xs text-amber-300" />
            <span>Tap to Zoom</span>
          </button>

          {/* Tag Pill (Top Left - Exactly One Badge) */}
          <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 pointer-events-none">
            {item.tag ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--orange)] to-amber-500 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md border border-white/25">
                <span>★</span>
                <span>{item.tag}</span>
              </span>
            ) : showFlavorBadgeOnImage ? (
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wider backdrop-blur-md border ${flavorBadge.badgeClass}`}>
                <span>{flavorBadge.emoji}</span>
                <span>{flavorBadge.label}</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Card Content Body */}
        <div className="space-y-4 p-4.5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-5.5">
          {/* Header Row: Category + Dietary + Title + Favorite */}
          <div data-sheet-item className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <VegIndicator veg={item.veg} />
                <span className="inline-flex items-center rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[var(--gold)]">
                  {item.sectionTitle}
                </span>
                {showFlavorBadgeInBody && (
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${flavorBadge.badgeClass}`}>
                    <span>{flavorBadge.emoji}</span>
                    <span>{flavorBadge.label}</span>
                  </span>
                )}
              </div>

              {/* Heart Toggle */}
              <button
                type="button"
                onClick={(event) => onToggleFavorite(item.id, event.currentTarget)}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-200 active:scale-90 ${
                  isFavorite
                    ? 'border-orange-500 bg-gradient-to-tr from-[var(--orange)] to-amber-500 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-400/20'
                    : 'border-[var(--line)] bg-[var(--surface-strong)]/60 text-[var(--muted)] hover:border-red-400 hover:text-red-500 hover:bg-[var(--surface)]'
                }`}
                aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
              >
                <FiHeart className={`text-sm ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[var(--text)]">
              {item.name}
            </h2>
          </div>

          {/* Description */}
          {item.description && (
            <p data-sheet-item className="text-xs sm:text-sm leading-relaxed text-[var(--muted)] font-medium">
              {item.description}
            </p>
          )}

          {/* Toppings / Ingredients */}
          {cleanToppings && (
            <div data-sheet-item className="rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface-strong)]/60 to-[var(--surface-strong)]/20 p-3.5 sm:p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[var(--gold)]">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
                  🌿
                </span>
                <span>Fresh Ingredients & Toppings</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-[var(--text)]">
                {cleanToppings}
              </p>
            </div>
          )}

          {/* Pricing & Size Selection */}
          {item.prices && item.prices.length > 1 ? (
            <div data-sheet-item className="space-y-2.5 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)]/25 p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--gold)]">
                  Select Size & Portion
                </span>
                {selectedPriceObj && (
                  <span className="text-xs font-black text-[var(--orange)]">
                    {selectedPriceObj.label ? `${selectedPriceObj.label} • ` : ''}{formatPrice(selectedPriceObj.value)}
                  </span>
                )}
              </div>
              <div className={`grid gap-2 ${item.prices.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {item.prices.map((price, idx) => {
                  const isSelected = selectedSizeIndex === idx
                  const label = price.label || (idx === 0 ? 'S' : idx === 1 ? 'M' : 'L')
                  const subLabel = getSizeSubLabel(label, isPizza)
                  return (
                    <button
                      key={`${price.label}-${price.value}-${idx}`}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`flex flex-col items-center justify-center rounded-xl p-2.5 sm:p-3 border text-center transition-all duration-200 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'border-[var(--orange)] bg-gradient-to-b from-orange-500/15 via-[var(--surface)] to-orange-500/5 ring-2 ring-[var(--orange)]/40 shadow-xs'
                          : 'border-[var(--line)] bg-[var(--surface)] hover:border-amber-500/35'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span
                          className={`grid h-4.5 w-4.5 place-items-center rounded-full text-[9px] font-black ${
                            isSelected
                              ? 'bg-[var(--orange)] text-white'
                              : 'bg-[var(--line)] text-[var(--muted)]'
                          }`}
                        >
                          {label}
                        </span>
                        {subLabel && (
                          <span className="text-[10px] font-bold text-[var(--muted)] truncate max-w-[65px]">
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
                className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[var(--surface)] to-orange-500/10 p-3.5 sm:p-4 shadow-xs flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--gold)]">
                      Fresh Portion
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[var(--muted)]">
                    {item.prices[0].label || 'Standard Fresh Portion'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--orange)] drop-shadow-xs">
                    {formatPrice(item.prices[0].value)}
                  </span>
                  <span className="block text-[9px] font-bold text-[var(--muted)]">Taxes Included</span>
                </div>
              </div>
            )
          )}

          {/* Action Dock: Zomato Delivery + Direct Contact */}
          <div data-sheet-item className="space-y-2.5 pt-1">
            {/* Primary Action: Order on Zomato */}
            <a
              href={ZOMATO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#cb202d] via-[#E23744] to-[#f04856] px-4 py-3 sm:py-3.5 text-white shadow-md shadow-red-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/40 hover:scale-[1.01] active:scale-[0.99] border border-white/20"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur-xs text-2xl shadow-xs">
                  <SiZomato />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black tracking-wide">
                      Order on Zomato
                    </span>
                    <span className="rounded-full bg-white/25 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                      Delivery
                    </span>
                  </div>
                  <p className="text-[11px] text-red-100 font-medium truncate">
                    Fast doorstep delivery • Live tracking
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-xs bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-xl transition">
                <span>Order</span>
                <FiExternalLink className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>

            {/* Direct Orders: Call & WhatsApp */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <a
                href="tel:+919625261591"
                className="touch-target inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]/60 px-3 py-3 text-xs sm:text-sm font-bold text-[var(--text)] transition-all duration-200 hover:border-[var(--orange)] hover:text-[var(--orange)] hover:bg-[var(--surface)] active:scale-95 shadow-xs"
              >
                <FiPhone className="text-sm sm:text-base text-[var(--orange)] shrink-0" />
                <span className="truncate">Call Cafe</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#075E54] to-[#25D366] px-3 py-3 text-xs sm:text-sm font-black text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:brightness-105 active:scale-95"
              >
                <FaWhatsapp className="text-base shrink-0" />
                <span className="truncate">WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Cafe Quality Footer Accents */}
          <div data-sheet-item className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[var(--line)]/50 text-[10px] sm:text-[11px] font-bold text-[var(--muted)] text-center">
            <div className="rounded-lg bg-[var(--surface-strong)]/40 py-1.5 px-1 truncate">
              🌱 100% Pure Veg
            </div>
            <div className="rounded-lg bg-[var(--surface-strong)]/40 py-1.5 px-1 truncate">
              🪵 Wood-Fired
            </div>
            <div className="rounded-lg bg-[var(--surface-strong)]/40 py-1.5 px-1 truncate">
              ⏱️ Baked Fresh
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
