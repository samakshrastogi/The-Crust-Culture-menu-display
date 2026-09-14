import { useEffect, useRef } from 'react'
import { FiClock, FiMapPin, FiPhone } from 'react-icons/fi'
import { revealOnScroll } from '../animations/gsapAnimations'
import FoodImage from '../components/FoodImage'

const restaurantImages = [
  '/images/pizza-margherita.jpg',
  '/images/pizza-veggie.jpg',
  '/images/pizza-paneer.jpg',
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
        <div className="flex items-center gap-3.5 sm:gap-4">
          <img
            src="/logo.png"
            alt="The Crust Culture"
            className="h-14 w-14 sm:h-18 sm:w-18 shrink-0 rounded-full object-cover shadow-lg shadow-orange-500/20 ring-2 ring-amber-500/35"
          />
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--gold)] sm:text-xs">
              Wood Fired Cafe
            </span>
            <h1 className="font-display mt-1 text-2xl font-extrabold leading-tight tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
              Fire, fermentation, and a table built for sharing.
            </h1>
          </div>
        </div>
      </section>

      <section data-reveal className="grid gap-3.5 py-6 sm:py-8 sm:grid-cols-3">
        {restaurantImages.map((image, index) => (
          <FoodImage
            key={image}
            src={image}
            alt={`The Crust Culture restaurant ${index + 1}`}
            category="Restaurant"
            className="aspect-[16/10] sm:aspect-[4/3] w-full rounded-2xl sm:rounded-[1.5rem] border border-[var(--line)] object-cover"
          />
        ))}
      </section>

      <section data-reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6">
          <FiClock className="mb-4 text-3xl text-[var(--orange)]" />
          <h2 className="text-2xl font-black text-[var(--text)]">Opening hours</h2>
          <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <p className="font-bold text-[var(--orange)]">Open 7 Days: 1:30 PM – 1:30 AM</p>
            <p className="text-xs">Monday through Sunday (Including Holidays)</p>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6">
          <FiPhone className="mb-4 text-3xl text-[var(--orange)]" />
          <h2 className="text-2xl font-black text-[var(--text)]">Contact</h2>
          <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <p>
              <a href="tel:+919625261591" className="hover:text-[var(--orange)] transition">+91 96252 61591</a>
            </p>
          </div>
        </div>
        <a
          href="https://maps.app.goo.gl/ernTdfzkPqRhYynR6"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:border-[var(--gold)] block"
        >
          <FiMapPin className="mb-4 text-3xl text-[var(--orange)]" />
          <h2 className="text-2xl font-black text-[var(--text)] group-hover:text-[var(--gold)] transition">Location</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            The Crust Culture infront of royal pg and sheetal pg and adjacent of panchayat cafe gali no. 6 noble enclave palam vihar extension gurgaon haryana pincode 122015
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)]">
            Open in Google Maps &rarr;
          </span>
        </a>
      </section>

      <section data-reveal className="mt-10 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-5">
        <a
          href="https://maps.app.goo.gl/ernTdfzkPqRhYynR6"
          target="_blank"
          rel="noopener noreferrer"
          className="group grid min-h-[220px] place-items-center rounded-[1.5rem] border border-dashed border-[var(--line)] bg-[var(--bg-soft)] p-6 text-center transition hover:border-[var(--gold)]"
        >
          <div className="flex flex-col items-center">
            <FiMapPin className="text-4xl text-[var(--orange)] transition group-hover:scale-110" />
            <p className="mt-3 text-lg font-bold text-[var(--text)]">The Crust Culture on Google Maps</p>
            <p className="mt-1 max-w-md text-sm text-[var(--muted)]">
              Gali no. 6, Noble Enclave, Palam Vihar Extension, Gurgaon, Haryana 122015
            </p>
            <span className="mt-4 inline-flex items-center rounded-full bg-[var(--gold)] px-5 py-2 text-xs font-black text-[#24150b] shadow-sm transition hover:brightness-105">
              Get Directions &rarr;
            </span>
          </div>
        </a>
      </section>
    </div>
  )
}
