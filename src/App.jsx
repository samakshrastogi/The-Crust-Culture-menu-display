import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, NavLink, useLocation } from 'react-router-dom'
import { FiHome, FiMenu, FiShoppingBag } from 'react-icons/fi'
import BackToTop from './components/BackToTop'
import FloatingContactButton from './components/FloatingContactButton'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import ScrollProgress from './components/ScrollProgress'
import { CartProvider } from './context/CartContext'
import { useCart } from './hooks/useCart'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAutoUpdate } from './hooks/useAutoUpdate'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import OrderReceiptPage from './pages/OrderReceiptPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import SplashScreen from './pages/SplashScreen'

function AppShell({ theme, onToggleTheme }) {
  const location = useLocation()
  const { cartCount } = useCart()

  const isReceiptPage = location.pathname.startsWith('/order')
  const isAdminPage =
    location.pathname.startsWith('/sam') || location.pathname.startsWith('/shivangi')
  const showFloatingButtons = !isReceiptPage && !isAdminPage

  return (
    <div
      className={`min-h-svh bg-[var(--bg)] text-[var(--text)] ${
        isReceiptPage ? 'pb-8' : 'pb-24 md:pb-0'
      }`}
    >
      <ScrollProgress />
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <PageTransition>
        <Outlet />
      </PageTransition>
      {location.pathname === '/home' && <Footer />}
      {showFloatingButtons && <FloatingContactButton />}
      <BackToTop />

      {/* Bottom Navbar for Mobile Screen with Safe-Area Inset Support */}
      {!isReceiptPage && (
        <nav
          aria-label="Mobile bottom navigation"
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--line)] bg-[var(--surface)]/95 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl md:hidden print:hidden"
        >
          <div className="flex justify-around items-center max-w-md mx-auto">
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
              to="/cart"
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-0.5 text-[10px] font-black uppercase transition-colors ${
                  isActive ? 'text-[var(--orange)]' : 'text-[var(--muted)]'
                }`
              }
            >
              <div className="relative">
                <FiShoppingBag className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--orange)] px-1 text-[8px] font-black text-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  )
}

export default function App() {
  useAutoUpdate()
  const [theme, setTheme] = useLocalStorage('crust-theme', 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <BrowserRouter>
      <CartProvider>
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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<OrderReceiptPage />} />
            <Route path="/sam" element={<AdminPage />} />
            <Route path="/shivangi" element={<Navigate to="/sam" replace />} />
            <Route path="/favorites" element={<Navigate to="/cart" replace />} />
            <Route path="/about" element={<Navigate to="/home" replace />} />
            <Route path="/contact" element={<Navigate to="/home" replace />} />
            <Route path="/qr" element={<Navigate to="/menu" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
