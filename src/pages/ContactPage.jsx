import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="font-display mt-3 text-5xl font-semibold leading-tight text-[var(--text)]">
            Contact The Crust Culture
          </h1>
        </div>

        <div className="grid gap-4">
          {[
            { icon: FiPhone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
            {
              icon: FiMail,
              label: 'Email',
              value: 'hello@thecrustculture.com',
              href: 'mailto:hello@thecrustculture.com',
            },
            { icon: FiMapPin, label: 'Address', value: '18 Artisan Lane, Jubilee Hills, Hyderabad' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--gold)]"
            >
              <item.icon className="mb-4 text-3xl text-[var(--orange)]" />
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-bold text-[var(--text)]">{item.value}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: FiInstagram, label: 'Instagram', value: '@thecrustculture' },
          { icon: FiFacebook, label: 'Facebook', value: 'The Crust Culture' },
          { icon: FiMail, label: 'Newsletter', value: 'Weekly chef specials' },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6">
            <item.icon className="mb-4 text-3xl text-[var(--orange)]" />
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">{item.label}</p>
            <p className="mt-2 text-lg font-bold text-[var(--text)]">{item.value}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
