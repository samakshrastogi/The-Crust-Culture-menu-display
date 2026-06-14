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
    accent: 'Open Kitchen',
  },
}

export default function FoodImage({ src, alt, category = 'Restaurant', className = '', loading = 'lazy' }) {
  const imageRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const style = categoryStyles[category] || categoryStyles.Restaurant

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${style.gradient} ${className}`}>
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -left-10 -top-12 h-40 w-40 rounded-full border border-white/30" />
        <div className="absolute bottom-6 right-6 h-28 w-28 rounded-full border-[18px] border-white/15" />
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/20 shadow-2xl" />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-2 text-white sm:p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/75 sm:text-xs sm:tracking-[0.22em]">
          {style.accent}
        </p>
        <p className="mt-1 hidden max-w-[14rem] text-lg font-black leading-tight sm:block">{alt}</p>
      </div>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => {
            setLoaded(true)
            gsap.fromTo(
              imageRef.current,
              { scale: 1.06 },
              { scale: 1, duration: 0.65, ease: 'power2.out', clearProps: 'transform' },
            )
          }}
          onError={() => setFailed(true)}
          ref={imageRef}
          className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
