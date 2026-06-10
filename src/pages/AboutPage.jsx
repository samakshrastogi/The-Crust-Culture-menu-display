import { useEffect, useRef } from 'react'
import { FiClock, FiMapPin, FiPhone } from 'react-icons/fi'
import { revealOnScroll } from '../animations/gsapAnimations'
import FoodImage from '../components/FoodImage'

const restaurantImages = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80',
]

export default function AboutPage() {
  const scopeRef = useRef(null)

  useEffect(() => {
    const context = revealOnScroll(scopeRef)
    return () => context.revert()
  }, [])

  return (
    <div ref={scopeRef} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section data-reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">Our story</p>
          <h1 className="font-display mt-3 text-5xl font-semibold leading-tight text-[var(--text)]">
            Fire, fermentation, and a table built for sharing.
          </h1>
        </div>
        <p className="text-lg leading-8 text-[var(--muted)]">
          The Crust Culture began as a small sourdough pizza counter and grew into a modern
          neighborhood kitchen. Our dough is cold-fermented, our sauces are cooked in small batches,
          and each table gets quick QR access to the menu so the food remains the focus.
        </p>
      </section>

      <section data-reveal className="grid gap-4 py-10 sm:grid-cols-3">
        {restaurantImages.map((image, index) => (
          <FoodImage
            key={image}
            src={image}
            alt={`The Crust Culture restaurant ${index + 1}`}
            category="Restaurant"
            className="aspect-[4/5] w-full rounded-[1.5rem] border border-[var(--line)] object-cover sm:aspect-[4/3]"
          />
        ))}
      </section>

      <section data-reveal className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6">
          <FiClock className="mb-4 text-3xl text-[var(--orange)]" />
          <h2 className="text-2xl font-black text-[var(--text)]">Opening hours</h2>
          <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <p>Monday - Friday: 11:00 AM - 11:30 PM</p>
            <p>Saturday - Sunday: 10:00 AM - 12:00 AM</p>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6">
          <FiPhone className="mb-4 text-3xl text-[var(--orange)]" />
          <h2 className="text-2xl font-black text-[var(--text)]">Contact</h2>
          <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <p>+91 98765 43210</p>
            <p>hello@thecrustculture.com</p>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6">
          <FiMapPin className="mb-4 text-3xl text-[var(--orange)]" />
          <h2 className="text-2xl font-black text-[var(--text)]">Location</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            18 Artisan Lane, Jubilee Hills, Hyderabad
          </p>
        </div>
      </section>

      <section data-reveal className="mt-10 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="grid min-h-[280px] place-items-center rounded-[1.5rem] border border-dashed border-[var(--line)] bg-[var(--bg-soft)] text-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">Map</p>
            <p className="mt-3 text-lg font-bold text-[var(--muted)]">Location map placeholder</p>
          </div>
        </div>
      </section>
    </div>
  )
}
