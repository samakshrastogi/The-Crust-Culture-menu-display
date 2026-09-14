import { NavLink } from 'react-router-dom'
import { FiHeart, FiHome, FiMenu, FiMoon, FiPhone, FiSun } from 'react-icons/fi'
import BrandLogo from './BrandLogo'
import { useLocalStorage } from '../hooks/useLocalStorage'

const navItems = [
  { label: 'Home', path: '/home', icon: FiHome },
  { label: 'Menu', path: '/menu', icon: FiMenu },
  { label: 'Favorites', path: '/favorites', icon: FiHeart },
]

export default function Navbar({ theme, onToggleTheme }) {
  const [favorites] = useLocalStorage('crust-favorites', [])

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-xl transition-colors">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-2.5 lg:px-8">
        {/* Brand */}
        <BrandLogo />

        {/* Center Nav Pills (Desktop / Tablet) */}
        <div className="hidden items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)]/80 p-1 backdrop-blur-md shadow-sm md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isFav = item.path === '/favorites'
            const favCount = isFav ? favorites.length : 0

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-4 py-2 text-xs lg:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--orange)] to-[#ea580c] text-white shadow-md shadow-orange-500/25'
                      : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--line)]/40'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`text-sm ${isActive ? 'text-white' : ''}`} />
                    <span>{item.label}</span>
                    {favCount > 0 && (
                      <span
                        className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-[var(--orange)]/15 text-[var(--orange)]'
                        }`}
                      >
                        {favCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Live Kitchen Status */}
          <div className="hidden xl:inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Open till 1:30 AM</span>
          </div>

          {/* Quick Call Button (Desktop) */}
          <a
            href="tel:+919625261591"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--text)] transition hover:border-[var(--orange)] hover:text-[var(--orange)] hover:shadow-sm active:scale-95"
            aria-label="Call restaurant"
          >
            <FiPhone className="text-[var(--orange)] text-sm" />
            <span className="font-semibold">+91 96252 61591</span>
          </a>

          {/* Quick Call Button (Mobile) */}
          <a
            href="tel:+919625261591"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--orange)] shadow-sm transition hover:border-[var(--orange)] active:scale-90 sm:hidden"
            aria-label="Call restaurant"
          >
            <FiPhone className="text-sm" />
          </a>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-sm transition hover:border-[var(--orange)] hover:text-[var(--orange)] active:scale-90"
            aria-label="Toggle color theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <FiSun className="text-base sm:text-lg text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
              <FiMoon className="text-base sm:text-lg transition-transform duration-200 -rotate-12 hover:rotate-0" />
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
