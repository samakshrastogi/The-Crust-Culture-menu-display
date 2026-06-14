import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, NavLink, useLocation } from 'react-router-dom'
import { FiHome, FiMenu, FiHeart } from 'react-icons/fi'
import BackToTop from './components/BackToTop'
import FloatingContactButton from './components/FloatingContactButton'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import ScrollProgress from './components/ScrollProgress'
import { useLocalStorage } from './hooks/useLocalStorage'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import FavoritesPage from './pages/FavoritesPage'
import NotFoundPage from './pages/NotFoundPage'
import SplashScreen from './pages/SplashScreen'

function AppShell({ theme, onToggleTheme }) {
  const location = useLocation()
  return (
    <div className="min-h-svh bg-[var(--bg)] text-[var(--text)] pb-16 md:pb-0">
      <ScrollProgress />
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <PageTransition>
        <Outlet />
      </PageTransition>
      {location.pathname === '/home' && <Footer />}
      <FloatingContactButton />
      <BackToTop />

      {/* Bottom Navbar for Mobile Screen */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--line)] bg-[var(--surface)]/94 py-2 shadow-2xl backdrop-blur-xl md:hidden">
        <div className="flex justify-around items-center">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-black uppercase transition-colors ${
                isActive ? 'text-[var(--orange)]' : 'text-[var(--muted)]'
              }`
            }
          >
            <FiHome className="text-lg" />
            <span>Home</span>
          </NavLink>
          
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-black uppercase transition-colors ${
                isActive ? 'text-[var(--orange)]' : 'text-[var(--muted)]'
              }`
            }
          >
            <FiMenu className="text-lg" />
            <span>Menu</span>
          </NavLink>
          
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-black uppercase transition-colors ${
                isActive ? 'text-[var(--orange)]' : 'text-[var(--muted)]'
              }`
            }
          >
            <FiHeart className="text-lg" />
            <span>Favorites</span>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useLocalStorage('crust-theme', 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route
          element={
            <AppShell
              theme={theme}
              onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            />
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/about" element={<Navigate to="/home" replace />} />
          <Route path="/contact" element={<Navigate to="/home" replace />} />
          <Route path="/qr" element={<Navigate to="/menu" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
