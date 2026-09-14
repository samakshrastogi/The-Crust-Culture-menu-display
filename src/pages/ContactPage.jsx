import { FiMapPin, FiPhone } from 'react-icons/fi'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 md:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="font-display mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
            Contact The Crust Culture
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[
            { icon: FiPhone, label: 'Phone', value: '+91 96252 61591', href: 'tel:+919625261591' },
            {
              icon: FiMapPin,
              label: 'Address',
              value: 'The Crust Culture infront of royal pg and sheetal pg and adjacent of panchayat cafe gali no. 6 noble enclave palam vihar extension gurgaon haryana pincode 122015',
              href: 'https://maps.app.goo.gl/ernTdfzkPqRhYynR6',
              external: true,
            },
          ].map((item) => {
            const Tag = item.href ? 'a' : 'div'
            return (
              <Tag
                key={item.label}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`rounded-2xl sm:rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 transition ${
                  item.href ? 'hover:border-[var(--gold)] cursor-pointer' : ''
                }`}
              >
                <item.icon className="mb-3 sm:mb-4 text-2xl sm:text-3xl text-[var(--orange)]" />
                <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
                  {item.label}
                </p>
                <p className="mt-1.5 text-base sm:text-lg font-bold text-[var(--text)] leading-relaxed break-words">
                  {item.value}
                </p>
                {item.external && (
                  <span className="mt-3 inline-flex items-center text-xs font-bold text-[var(--gold)]">
                    Open in Google Maps &rarr;
                  </span>
                )}
              </Tag>
            )
          })}
        </div>
      </section>
    </div>
  )
}
