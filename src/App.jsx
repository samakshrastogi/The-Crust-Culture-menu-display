import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, NavLink, useLocation } from 'react-router-dom'
import { FiHome, FiMenu, FiShoppingBag } from 'react-icons/fi'
import BackToTop from './components/BackToTop'
import ErrorBoundary from './components/ErrorBoundary'
import FloatingContactButton from './components/FloatingContactButton'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import ScrollProgress from './components/ScrollProgress'
import { CartProvider } from './context/CartContext'
import { useCart } from './hooks/useCart'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAutoUpdate } from './hooks/useAutoUpdate'
import SplashScreen from './pages/SplashScreen'

const HomePage = lazy(() => import('./pages/HomePage'))
const MenuPage = lazy(() => import('./pages/MenuPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const OrderReceiptPage = lazy(() => import('./pages/OrderReceiptPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--orange)] border-t-transparent" />
      <span className="sr-only">Loading page...</span>
    </div>
  )
}

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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--orange)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-xl focus:outline-hidden"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <PageTransition>
        <Suspense fallback={<PageFallback />}>
          <main id="main-content" tabIndex={-1} className="outline-hidden">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </Suspense>
      </PageTransition>
      {(location.pathname === '/home' || location.pathname === '/menu') && <Footer />}
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
              <FiHome className="text-lg" aria-hidden="true" />
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
              <FiMenu className="text-lg" aria-hidden="true" />
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
                <FiShoppingBag className="text-lg" aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--orange)] px-1 text-[8px] font-black text-white shadow-xs">
                    <span aria-hidden="true">{cartCount}</span>
                    <span className="sr-only">({cartCount} items in cart)</span>
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
  const { updateAvailable, reloadApp } = useAutoUpdate()
  const [theme, setTheme] = useLocalStorage('crust-theme', 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <BrowserRouter>
      {updateAvailable && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 rounded-full bg-[var(--surface-strong)]/95 border border-[var(--orange)]/60 px-3.5 py-1.5 text-xs font-bold text-[var(--text)] shadow-xl backdrop-blur-md"
        >
          <span>✨ Fresh menu update available</span>
          <button
            type="button"
            onClick={reloadApp}
            className="rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-2.5 py-0.5 text-[11px] font-black text-white hover:brightness-110 active:scale-95 transition cursor-pointer shadow-xs"
          >
            Update
          </button>
        </aside>
      )}
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
