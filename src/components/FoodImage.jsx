import { useRef, useState } from 'react'
import { gsap } from '../animations/gsapAnimations'

const categoryStyles = {
  Pizza: {
    gradient: 'from-[#5b2414] via-[#b84b20] to-[#f6c453]',
    accent: 'Pizza',
  },
  Burgers: {
    gradient: 'from-[#3a2014] via-[#8a4a24] to-[#f6c453]',
    accent: 'Burger',
  },
  Pasta: {
    gradient: 'from-[#4b2816] via-[#a64024] to-[#ffd166]',
    accent: 'Pasta',
  },
  Sandwiches: {
    gradient: 'from-[#352014] via-[#8b5a2b] to-[#f4d58d]',
    accent: 'Toast',
  },
  Starters: {
    gradient: 'from-[#3a1f12] via-[#a53f12] to-[#f97316]',
    accent: 'Starter',
  },
  Desserts: {
    gradient: 'from-[#311820] via-[#8c3d4d] to-[#f3b7a3]',
    accent: 'Dessert',
  },
  Beverages: {
    gradient: 'from-[#143536] via-[#0f766e] to-[#9debd7]',
    accent: 'Drink',
  },
  Restaurant: {
    gradient: 'from-[#2f1d12] via-[#8a3d18] to-[#f6c453]',
    accent: 'Artisan Cafe',
  },
}

export default function FoodImage({
  src,
  alt,
  category = 'Restaurant',
  className = '',
  loading = 'lazy',
  fetchPriority,
  ...props
}) {
  const imageRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const style = categoryStyles[category] || categoryStyles.Restaurant

  const webpSrc =
    src && typeof src === 'string' && src.startsWith('/images/') && !src.endsWith('.svg')
      ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      : null

  const handleRef = (node) => {
    imageRef.current = node
    if (node && node.complete && node.naturalWidth > 0 && !loaded) {
      setLoaded(true)
    }
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${style.gradient} ${className}`} {...props}>
      {/* Background skeleton glow & geometric art */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -left-10 -top-12 h-40 w-40 rounded-full border border-white/30" />
        <div className="absolute bottom-6 right-6 h-28 w-28 rounded-full border-[18px] border-white/15" />
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/20 shadow-2xl" />
      </div>

      {/* Shimmer sweep animation while loading */}
      {!loaded && !failed && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}

      {/* Fallback category caption if image fails or before load */}
      {(!loaded || failed) && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white sm:p-3 pointer-events-none z-2">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-200/80">
            {style.accent}
          </p>
        </div>
      )}

      {/* Progressive blur-up food image with WebP source */}
      {!failed && (
        <picture className="contents">
          {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            ref={handleRef}
            onLoad={() => {
              setLoaded(true)
              if (imageRef.current) {
                gsap.fromTo(
                  imageRef.current,
                  { scale: 1.04 },
                  { scale: 1, duration: 0.5, ease: 'power2.out', clearProps: 'transform' },
                )
              }
            }}
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out will-change-[transform,opacity,filter] ${
              loaded
                ? 'opacity-100 blur-0 scale-100'
                : 'opacity-0 blur-sm scale-105'
            }`}
          />
        </picture>
      )}

      {/* Warm internal photographic depth vignette & rim highlight */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 z-3" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15 z-3 rounded-inherit" />
    </div>
  )
}
