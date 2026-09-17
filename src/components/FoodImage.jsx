import { useRef, useState } from 'react'

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
  const [prevSrc, setPrevSrc] = useState(src)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (src !== prevSrc) {
    setPrevSrc(src)
    setLoaded(false)
    setFailed(false)
  }

  const webpSrc =
    src && typeof src === 'string' && src.startsWith('/images/') && !src.endsWith('.svg')
      ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      : null

  const handleRef = (node) => {
    imageRef.current = node
    // Instant display if the browser has already downloaded or cached the image
    if (node && node.complete && node.naturalWidth > 0) {
      setLoaded(true)
    }
  }

  return (
    <div
      className={`relative overflow-hidden bg-[var(--surface-strong)] ${className}`}
      {...props}
    >
      {/* Smooth warm shimmer sweep while loading - never shows ugly brown box or placeholder text */}
      {!loaded && !failed && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-500/15 dark:via-white/10 to-transparent" />
        </div>
      )}

      {/* Clean, minimal fallback plate icon if image fails */}
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-[var(--surface-strong)] text-[var(--muted)] z-2 pointer-events-none">
          <span className="text-xl sm:text-2xl mb-1 opacity-60">🍕</span>
          <p className="text-[10px] font-bold truncate max-w-[90%] text-[var(--muted)]">
            {alt || category}
          </p>
        </div>
      )}

      {/* Progressive food image with WebP high-performance priority */}
      {!failed && src && (
        <picture className="contents">
          {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
          <img
            src={src}
            alt={alt || ''}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            ref={handleRef}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out will-change-opacity ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
      )}

      {/* Subtle warm depth vignette & rim highlight */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-50 z-3" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 z-3 rounded-inherit" />
    </div>
  )
}
