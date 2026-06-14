import { FiMapPin, FiPhone } from 'react-icons/fi'

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
            { icon: FiPhone, label: 'Phone', value: '+91 83681 51650', href: 'tel:+918368151650' },
            { icon: FiMapPin, label: 'Address', value: 'The Crust Culture infront of royal pg and sheetal pg and adjacent of panchayat cafe gali no. 6 noble enclave palam vihar extension gurgaon haryana pincode 122015' },
          ].map((item) => {
            const Tag = item.href ? 'a' : 'div'
            return (
              <Tag
                key={item.label}
                href={item.href}
                className={`rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5 transition ${
                  item.href ? 'hover:border-[var(--gold)] cursor-pointer' : ''
                }`}
              >
                <item.icon className="mb-4 text-3xl text-[var(--orange)]" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--text)] leading-relaxed">{item.value}</p>
              </Tag>
            )
          })}
        </div>
      </section>
    </div>
  )
}
