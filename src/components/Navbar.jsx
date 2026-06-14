import { NavLink } from 'react-router-dom'
import { FiMoon, FiSun } from 'react-icons/fi'
import BrandLogo from './BrandLogo'

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Menu', path: '/menu' },
  { label: 'Favorites', path: '/favorites' },
]

export default function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-1 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
        <BrandLogo />

        <div className="hidden items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)]/70 p-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[var(--cream)] text-[#23140c]'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="touch-target grid place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--gold)]"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </nav>
    </header>
  )
}
