import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiMenu, FiMoon, FiShare2, FiSun, FiX } from 'react-icons/fi'
import BrandLogo from './BrandLogo'

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Menu', path: '/menu' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)

  const shareMenu = async () => {
    const shareData = {
      title: 'The Crust Culture Menu',
      text: 'Explore the digital menu at The Crust Culture.',
      url: `${window.location.origin}/menu`,
    }

    if (navigator.share) {
      await navigator.share(shareData)
      return
    }

    await navigator.clipboard.writeText(shareData.url)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
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
            onClick={shareMenu}
            className="touch-target hidden place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--gold)] sm:grid"
            aria-label="Share menu"
          >
            <FiShare2 />
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="touch-target grid place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--gold)]"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="touch-target grid place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] md:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[var(--line)] bg-[var(--bg)] px-4 py-3 md:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-base font-semibold ${
                    isActive
                      ? 'bg-[var(--cream)] text-[#23140c]'
                      : 'bg-[var(--surface)] text-[var(--muted)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
