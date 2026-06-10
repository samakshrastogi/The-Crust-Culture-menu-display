import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import BackToTop from './components/BackToTop'
import FloatingContactButton from './components/FloatingContactButton'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import ScrollProgress from './components/ScrollProgress'
import { useLocalStorage } from './hooks/useLocalStorage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import NotFoundPage from './pages/NotFoundPage'
import SplashScreen from './pages/SplashScreen'

function AppShell({ theme, onToggleTheme }) {
  return (
    <div className="min-h-svh bg-[var(--bg)] text-[var(--text)]">
      <ScrollProgress />
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <PageTransition>
        <Outlet />
      </PageTransition>
      <Footer />
      <FloatingContactButton />
      <BackToTop />
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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/qr" element={<Navigate to="/menu" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
