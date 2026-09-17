import { FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import { SiZomato } from 'react-icons/si'
import { CAFE_INFO } from '../data/cafeInfo'

const floatingActions = [
  {
    id: 'zomato',
    label: 'Order on Zomato',
    href: 'https://www.zomato.com',
    icon: SiZomato,
    iconSize: 'text-xl sm:text-2xl',
    bgGradient: 'from-[#cb202d] via-[#E23744] to-[#f04856]',
    shadowColor: 'shadow-red-500/35 hover:shadow-red-500/50',
    external: true,
  },
  {
    id: 'phone',
    label: `Call Cafe (${CAFE_INFO.phone.display})`,
    href: CAFE_INFO.phone.tel,
    icon: FiPhone,
    iconSize: 'text-lg sm:text-xl',
    bgGradient: 'from-[#ea580c] via-[var(--orange)] to-[#fb923c]',
    shadowColor: 'shadow-orange-500/35 hover:shadow-orange-500/50',
    external: false,
  },
  {
    id: 'whatsapp',
    label: 'Chat on WhatsApp',
    href: `${CAFE_INFO.phone.waLink}?text=Hello%20The%20Crust%20Culture,%20I%20would%20like%20to%20place%20an%20order`,
    icon: FaWhatsapp,
    iconSize: 'text-xl sm:text-2xl',
    bgGradient: 'from-[#075E54] via-[#25D366] to-[#4ade80]',
    shadowColor: 'shadow-emerald-500/35 hover:shadow-emerald-500/50',
    external: true,
  },
]

export default function FloatingContactButton() {
  return (
    <aside
      className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 transition-all duration-300 print:hidden"
      aria-label="Quick contact and ordering"
    >
      {floatingActions.map((action) => {
        const Icon = action.icon
        return (
          <div key={action.id} className="group relative flex items-center">
            {/* Desktop Flyout Tooltip */}
            <div className="pointer-events-none absolute right-full mr-2.5 hidden sm:flex items-center opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
              <span className="rounded-full bg-[#1c120c]/90 px-3 py-1 text-xs font-bold text-white shadow-xl backdrop-blur-md border border-white/15 whitespace-nowrap">
                {action.label}
              </span>
            </div>

            {/* Floating Action Circle */}
            <a
              href={action.href}
              {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-tr ${action.bgGradient} text-white shadow-lg ${action.shadowColor} border border-white/35 backdrop-blur-xs transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-xl`}
              aria-label={action.label}
            >
              <Icon className={action.iconSize} />

              {/* Glass sheen highlight */}
              <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/20 pointer-events-none" />
            </a>
          </div>
        )
      })}
    </aside>
  )
}
