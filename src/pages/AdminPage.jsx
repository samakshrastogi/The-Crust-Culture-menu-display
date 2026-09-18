import { useState, useMemo, useEffect } from 'react'
import {
  FiSearch,
  FiDownload,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiRefreshCw,
  FiCalendar,
  FiClock,
  FiX,
  FiLock,
  FiLogOut,
} from 'react-icons/fi'
import {
  exportOrdersToCSV,
  syncOrdersWithCloud,
} from '../utils/orderHistory'
import { useSeoMeta } from '../hooks/useSeoMeta'
import AdminOrderCard from '../components/AdminOrderCard'

// SHA-256 hash of staff master passphrase ('crust2026')
const ADMIN_HASH = 'cda3768bb69ae55562f75c033c33347083fa28278bcce172ce7e0104ede0775d'

export default function AdminPage() {
  useSeoMeta({
    title: 'Admin Dashboard | The Crust Culture',
    description: 'Internal administration and order management.',
    robots: 'noindex, nofollow, noarchive',
  })

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const exp = sessionStorage.getItem('tcc_admin_expiry')
      return Boolean(exp && Date.now() < Number(exp))
    } catch {
      return false
    }
  })
  const [passphrase, setPassphrase] = useState('')
  const [authError, setAuthError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const [orders, setOrders] = useState([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'dine-in' | 'takeaway'
  const [timeFilter, setTimeFilter] = useState('all') // 'all' | 'today' | 'week' | 'month' | 'year'
  const [copiedId, setCopiedId] = useState(null)

  // Cloud sync runs STRICTLY if and only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return

    let mounted = true
    Promise.resolve().then(() => {
      if (mounted) setIsSyncing(true)
    })

    syncOrdersWithCloud()
      .then((synced) => {
        if (mounted) {
          setOrders(synced)
          setLastSynced(new Date())
        }
      })
      .catch((err) => {
        console.warn('Initial cloud sync error:', err)
      })
      .finally(() => {
        if (mounted) setIsSyncing(false)
      })
    return () => {
      mounted = false
    }
  }, [isAuthenticated])

  const handleAuthenticate = async (e) => {
    e.preventDefault()
    setAuthError('')

    // Check brute-force lockout
    try {
      const lockout = sessionStorage.getItem('tcc_admin_lockout')
      if (lockout && Date.now() < Number(lockout)) {
        const remainingMin = Math.ceil((Number(lockout) - Date.now()) / 60000)
        setAuthError(`Too many failed attempts. Locked out for ${remainingMin} more minute(s).`)
        return
      }
    } catch {
      /* ignore storage access error */
    }

    if (!passphrase.trim()) {
      setAuthError('Please enter the staff passphrase.')
      return
    }

    setIsVerifying(true)
    try {
      const msgBuffer = new TextEncoder().encode(passphrase.trim())
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      if (hashHex === ADMIN_HASH) {
        try {
          sessionStorage.setItem('tcc_admin_expiry', String(Date.now() + 2 * 60 * 60 * 1000))
          sessionStorage.removeItem('tcc_admin_attempts')
          sessionStorage.removeItem('tcc_admin_lockout')
        } catch {
          /* ignore storage access error */
        }
        setIsAuthenticated(true)
        setPassphrase('')
      } else {
        let attempts = 1
        try {
          attempts = Number(sessionStorage.getItem('tcc_admin_attempts') || '0') + 1
          sessionStorage.setItem('tcc_admin_attempts', String(attempts))
          if (attempts >= 5) {
            sessionStorage.setItem('tcc_admin_lockout', String(Date.now() + 15 * 60 * 1000))
            setAuthError('Too many failed attempts. Dashboard locked for 15 minutes.')
            return
          }
        } catch {
          /* ignore storage access error */
        }
        setAuthError(`Invalid passphrase. ${5 - attempts} attempt(s) remaining.`)
      }
    } catch {
      setAuthError('Cryptographic verification failed.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('tcc_admin_expiry')
      sessionStorage.removeItem('tcc_admin_attempts')
    } catch {
      /* ignore storage access error */
    }
    setOrders([])
    setIsAuthenticated(false)
  }

  const reloadOrders = async () => {
    setIsSyncing(true)
    try {
      const synced = await syncOrdersWithCloud()
      setOrders(synced)
      setLastSynced(new Date())
    } catch (err) {
      console.warn('Reload sync error:', err)
    } finally {
      setIsSyncing(false)
    }
  }

  // Metrics
  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const todayOrders = orders.filter((o) => (o.timestamp || 0) >= startOfToday)
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)

    const dayOfWeek = now.getDay()
    const diffToMonday = (dayOfWeek + 6) % 7
    const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday).getTime()
    const weekOrders = orders.filter((o) => (o.timestamp || 0) >= startOfThisWeek)
    const weekRevenue = weekOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    const monthOrders = orders.filter((o) => (o.timestamp || 0) >= startOfThisMonth)
    const monthRevenue = monthOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)

    // Breakdown metrics
    const dineInCount = orders.filter((o) => o.orderType === 'dine-in').length
    const takeawayCount = orders.filter((o) => o.orderType === 'takeaway').length
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

    // Repeat diners count
    const phoneCounts = {}
    orders.forEach((o) => {
      const p = (o.customerPhone || '').replace(/\D/g, '')
      if (p) phoneCounts[p] = (phoneCounts[p] || 0) + 1
    })
    const uniquePhones = Object.keys(phoneCounts)
    const repeatDiners = Object.values(phoneCounts).filter((c) => c > 1).length

    return {
      totalOrders,
      totalRevenue,
      todayOrders: todayOrders.length,
      todayRevenue,
      weekOrders: weekOrders.length,
      weekRevenue,
      monthOrders: monthOrders.length,
      monthRevenue,
      uniqueCustomers: uniquePhones.length || totalOrders,
      dineInCount,
      takeawayCount,
      avgOrderValue,
      repeatDiners,
    }
  }, [orders])

  // Filtered & Chronologically Sorted orders
  const filteredOrders = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    const dayOfWeek = now.getDay()
    const diffToMonday = (dayOfWeek + 6) % 7
    const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday).getTime()

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    const startOfThisYear = new Date(now.getFullYear(), 0, 1).getTime()

    return orders
      .filter((order) => {
        // Type filter
        if (filterType !== 'all' && order.orderType !== filterType) {
          return false
        }

        // Time period filter
        const ts = order.timestamp || 0
        if (timeFilter === 'today' && ts < startOfToday) {
          return false
        }
        if (timeFilter === 'week' && ts < startOfThisWeek) {
          return false
        }
        if (timeFilter === 'month' && ts < startOfThisMonth) {
          return false
        }
        if (timeFilter === 'year' && ts < startOfThisYear) {
          return false
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const nameMatch = (order.customerName || '').toLowerCase().includes(q)
          const phoneMatch = (order.customerPhone || '').includes(q)
          const idMatch = (order.id || '').toLowerCase().includes(q)
          const itemMatch = (order.items || []).some((i) => (i.name || '').toLowerCase().includes(q))
          return nameMatch || phoneMatch || idMatch || itemMatch
        }

        return true
      })
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  }, [orders, filterType, timeFilter, searchQuery])

  // Group orders into chronological periods: Days (Today/Yesterday) -> Week -> Month -> Year -> Older
  const groupedSections = useMemo(() => {
    if (filteredOrders.length === 0) return []

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000

    const dayOfWeek = now.getDay()
    const diffToMonday = (dayOfWeek + 6) % 7
    const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday).getTime()

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    const startOfThisYear = new Date(now.getFullYear(), 0, 1).getTime()

    const groups = [
      { id: 'today', title: 'Today', badge: 'Days', orders: [] },
      { id: 'yesterday', title: 'Yesterday', badge: 'Days', orders: [] },
      { id: 'week', title: 'Earlier This Week', badge: 'Week', orders: [] },
      { id: 'month', title: 'Earlier This Month', badge: 'Month', orders: [] },
      { id: 'year', title: 'Earlier This Year', badge: 'Year', orders: [] },
      { id: 'older', title: 'Previous Years & Archive', badge: 'Archive', orders: [] },
    ]

    filteredOrders.forEach((order) => {
      const ts = order.timestamp || 0
      if (ts >= startOfToday) {
        groups[0].orders.push(order)
      } else if (ts >= startOfYesterday) {
        groups[1].orders.push(order)
      } else if (ts >= startOfThisWeek) {
        groups[2].orders.push(order)
      } else if (ts >= startOfThisMonth) {
        groups[3].orders.push(order)
      } else if (ts >= startOfThisYear) {
        groups[4].orders.push(order)
      } else {
        groups[5].orders.push(order)
      }
    })

    return groups.filter((g) => g.orders.length > 0)
  }, [filteredOrders])

  const handleCopyLink = (order) => {
    if (!order.receiptUrl) return
    navigator.clipboard.writeText(order.receiptUrl)
    setCopiedId(order.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 shadow-xl space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/20">
            <FiLock className="text-xl" />
          </div>
          <div>
            <h1 className="font-display text-lg font-black text-[var(--text)]">
              Staff Authorization Required
            </h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              This dashboard is restricted to authorized kitchen & cafe management.
            </p>
          </div>

          <form onSubmit={handleAuthenticate} className="space-y-3 text-left">
            <div>
              <label
                htmlFor="staff-passphrase"
                className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--muted)] mb-1"
              >
                Enter Staff PIN / Passphrase
              </label>
              <input
                id="staff-passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-hidden focus:border-[var(--orange)]"
                autoFocus
                disabled={isVerifying}
              />
            </div>

            {authError && (
              <p role="alert" className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg p-2 border border-red-500/20">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--orange)] to-[#ea580c] py-2.5 text-xs font-black text-white shadow-md transition hover:brightness-110 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? 'Verifying Credentials...' : 'Access Dashboard'}
            </button>
          </form>

          <p className="text-[10px] text-[var(--muted)]">
            Protected by client-side SHA-256 cryptographic verification & rate-limiting.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto  px-2.5 py-3 sm:px-4 sm:py-3.5 space-y-2.5">
      {/* Compact Top Header */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-display text-sm sm:text-base font-black text-[var(--text)]">
            Customer Directory
          </h1>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold border transition-colors ${
              isSyncing
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            }`}
            title={lastSynced ? `Last synced: ${lastSynced.toLocaleTimeString()}` : 'Cloud sync'}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isSyncing ? 'bg-blue-500 animate-ping' : 'bg-emerald-500'
              }`}
            />
            <span>{isSyncing ? 'Syncing Excel...' : 'Excel / Sheets Synced'}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => exportOrdersToCSV(filteredOrders)}
            disabled={orders.length === 0}
            className="inline-flex items-center justify-center rounded-lg sm:rounded-full bg-[var(--orange)] h-7 w-7 sm:h-auto sm:w-auto sm:px-3 sm:py-1 text-white hover:brightness-110 transition cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Export CSV"
            aria-label="Export CSV"
          >
            <FiDownload className="text-xs sm:text-[10px]" />
            <span className="hidden sm:inline sm:text-[11px] sm:font-black sm:ml-1">Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-lg sm:rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer text-xs shadow-2xs"
            title="Log Out of Dashboard"
            aria-label="Log Out of Dashboard"
          >
            <FiLogOut className="text-xs" />
            <span className="hidden sm:inline sm:text-[11px] sm:font-black sm:ml-1">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Compact 4-Col Micro KPI Strip */}
      <div className="grid grid-cols-4 gap-1 sm:hidden">
        <button
          type="button"
          onClick={() => setTimeFilter('all')}
          className={`rounded-xl border p-1.5 text-center shadow-2xs transition active:scale-95 cursor-pointer ${
            timeFilter === 'all'
              ? 'border-[var(--orange)] bg-orange-500/10'
              : 'border-[var(--line)] bg-[var(--surface)]'
          }`}
        >
          <div className="text-[8.5px] font-bold text-[var(--muted)]">Orders</div>
          <div className="text-sm font-black text-[var(--text)]">{stats.totalOrders}</div>
          <div className="text-[7.5px] text-[var(--muted)]">All Time</div>
        </button>

        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-1.5 text-center shadow-2xs">
          <div className="text-[8.5px] font-bold text-emerald-700 dark:text-emerald-400">Revenue</div>
          <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{stats.totalRevenue}</div>
          <div className="text-[7.5px] text-[var(--muted)] truncate">Avg ₹{stats.avgOrderValue}</div>
        </div>

        <button
          type="button"
          onClick={() => setTimeFilter('today')}
          className={`rounded-xl border p-1.5 text-center shadow-2xs transition active:scale-95 cursor-pointer ${
            timeFilter === 'today'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-[var(--line)] bg-[var(--surface)]'
          }`}
        >
          <div className="text-[8.5px] font-bold text-blue-700 dark:text-blue-400">Today</div>
          <div className="text-sm font-black text-blue-600 dark:text-blue-400">{stats.todayOrders}</div>
          <div className="text-[7.5px] text-[var(--muted)]">₹{stats.todayRevenue}</div>
        </button>

        <div className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-1.5 text-center shadow-2xs">
          <div className="text-[8.5px] font-bold text-purple-700 dark:text-purple-400">Customers</div>
          <div className="text-sm font-black text-purple-600 dark:text-purple-400">{stats.uniqueCustomers}</div>
          <div className="text-[7.5px] text-[var(--muted)] truncate">Unique</div>
        </div>
      </div>

      {/* Desktop Cafe Analytics Stat Cards */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {/* Card 1: Total Orders */}
        <div
          role="button"
          tabIndex={0}
          aria-pressed={timeFilter === 'all'}
          onClick={() => setTimeFilter('all')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setTimeFilter('all')
            }
          }}
          className={`group relative overflow-hidden rounded-2xl border p-2.5 sm:p-3 transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
            timeFilter === 'all'
              ? 'border-[var(--orange)] bg-gradient-to-br from-orange-500/10 via-[var(--surface)] to-[var(--surface)] ring-1 ring-[var(--orange)]/30'
              : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--orange)]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">
              Total Orders
            </span>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 group-hover:scale-110 transition-transform">
              <FiShoppingBag className="text-xs sm:text-sm" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
              {stats.totalOrders}
            </span>
            <span className="text-[10px] font-bold text-[var(--muted)]">orders</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-1 pt-1.5 border-t border-[var(--line)]/50 text-[10px]">
            <span className="inline-flex items-center gap-1 rounded-md bg-stone-500/10 px-1.5 py-0.2 font-semibold text-[var(--muted)]">
              <span>🍽️ {stats.dineInCount}</span>
              <span>•</span>
              <span>🥡 {stats.takeawayCount}</span>
            </span>
            <span className="text-[9.5px] text-[var(--muted)] truncate">All Time</span>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br from-emerald-500/[0.06] via-[var(--surface)] to-[var(--surface)] p-2.5 sm:p-3 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">
              Total Revenue
            </span>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <FiTrendingUp className="text-xs sm:text-sm" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-[var(--line)]/50 text-[10px]">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.2 font-bold text-emerald-600 dark:text-emerald-400">
              Avg ₹{stats.avgOrderValue} / order
            </span>
            <span className="text-[9.5px] text-[var(--muted)] truncate">Sales</span>
          </div>
        </div>

        {/* Card 3: Today's Orders */}
        <div
          role="button"
          tabIndex={0}
          aria-pressed={timeFilter === 'today'}
          onClick={() => setTimeFilter('today')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setTimeFilter('today')
            }
          }}
          className={`group relative overflow-hidden rounded-2xl border p-2.5 sm:p-3 transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
            timeFilter === 'today'
              ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 via-[var(--surface)] to-[var(--surface)] ring-1 ring-blue-500/30'
              : 'border-[var(--line)] bg-[var(--surface)] hover:border-blue-500/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">
              Today&apos;s Orders
            </span>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <FiClock className="text-xs sm:text-sm" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
              {stats.todayOrders}
            </span>
            <span className="text-[10px] font-bold text-[var(--muted)]">
              {stats.todayOrders === 1 ? 'order' : 'orders'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-[var(--line)]/50 text-[10px]">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-1.5 py-0.2 font-bold text-blue-600 dark:text-blue-400">
              ₹{stats.todayRevenue.toLocaleString('en-IN')} today
            </span>
            <span className="text-[9.5px] text-blue-500 font-bold group-hover:underline">Filter &rarr;</span>
          </div>
        </div>

        {/* Card 4: Customers */}
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br from-purple-500/[0.05] via-[var(--surface)] to-[var(--surface)] p-2.5 sm:p-3 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/60 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">
              Customers
            </span>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <FiUsers className="text-xs sm:text-sm" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
              {stats.uniqueCustomers}
            </span>
            <span className="text-[10px] font-bold text-[var(--muted)]">contacts</span>
          </div>
          <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-[var(--line)]/50 text-[10px]">
            <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-1.5 py-0.2 font-bold text-purple-600 dark:text-purple-400">
              {stats.repeatDiners > 0 ? `${stats.repeatDiners} repeat` : '100% verified'}
            </span>
            <span className="text-[9.5px] text-[var(--muted)] truncate">Verified</span>
          </div>
        </div>
      </div>

      {/* Compact Filters & Timeline Row */}
      <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1 border-b border-[var(--line)]">
        {/* Timeline Tabs */}
        <div className="flex items-center gap-1 shrink-0" role="region" aria-label="Timeline filters">
          <span className="flex items-center gap-0.5 text-[9.5px] font-bold text-[var(--muted)] mr-0.5 shrink-0">
            <FiCalendar className="text-[9.5px] text-[var(--orange)]" aria-hidden="true" />
            <span className="hidden sm:inline">Timeline:</span>
          </span>

          {[
            { id: 'all', label: 'All' },
            { id: 'today', label: 'Today', count: stats.todayOrders },
            { id: 'week', label: 'Week', count: stats.weekOrders },
            { id: 'month', label: 'Month', count: stats.monthOrders },
            { id: 'year', label: 'Year' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={timeFilter === tab.id}
              onClick={() => setTimeFilter(tab.id)}
              className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                timeFilter === tab.id
                  ? 'bg-gradient-to-r from-[var(--orange)] to-[#ea580c] text-white shadow-2xs'
                  : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`rounded-full px-1 py-0.1 text-[8px] font-black ${
                    timeFilter === tab.id ? 'bg-white/25 text-white' : 'bg-[var(--surface-strong)] text-[var(--text)]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="h-3 w-[1px] bg-[var(--line)] shrink-0 hidden sm:block" />

        {/* Order Type Filter Pills with Live Counts */}
        <div className="flex items-center gap-1 rounded-xl bg-[var(--surface-strong)]/80 p-0.5 border border-[var(--line)] shrink-0" role="region" aria-label="Order type filters">
          {[
            { id: 'all', label: 'All', count: stats.totalOrders },
            { id: 'dine-in', label: '🍽️ Dine', count: stats.dineInCount },
            { id: 'takeaway', label: '🥡 Take', count: stats.takeawayCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={filterType === tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[var(--surface)] border border-[var(--orange)] text-[var(--orange)] shadow-2xs'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1 py-0.1 text-[8px] font-black ${
                  filterType === tab.id
                    ? 'bg-orange-500/15 text-[var(--orange)]'
                    : 'bg-stone-500/10 text-[var(--muted)]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Search & Refresh Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
            placeholder="Search by customer name, phone, or order ID..."
            aria-label="Search orders by customer name, phone, or order ID"
            className="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] pl-8 pr-8 py-1.5 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--orange)] transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-5 w-5 place-items-center rounded-full bg-[var(--surface-strong)] text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <FiX className="text-[10px]" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] text-[var(--muted)] hidden sm:inline">
            Showing <strong className="text-[var(--text)]">{filteredOrders.length}</strong> of{' '}
            {orders.length}
          </span>

          <button
            type="button"
            onClick={reloadOrders}
            disabled={isSyncing}
            className="grid h-7 w-7 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer disabled:opacity-50"
            title="Sync with Google Sheets & refresh records"
            aria-label="Sync with Google Sheets and refresh records"
          >
            <FiRefreshCw className={`text-[11px] ${isSyncing ? 'animate-spin text-[var(--orange)]' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Chronologically Grouped Orders List */}
      {isSyncing && orders.length === 0 ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center space-y-3">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--orange)] border-t-transparent" />
          <div className="space-y-0.5">
            <h3 className="text-xs font-black text-[var(--text)]">Loading Excel Records...</h3>
            <p className="text-[11px] text-[var(--muted)]">Fetching verified orders directly from your Google Sheet.</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)]/50 p-6 text-center space-y-2">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface-strong)] text-lg text-[var(--muted)]">
            <FiShoppingBag />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-black text-[var(--text)]">No orders found in Excel</h3>
            <p className="text-[11px] text-[var(--muted)] max-w-sm mx-auto">
              {searchQuery
                ? 'No orders match your search query.'
                : 'Only orders present in your Excel / Google Sheet will appear here.'}
            </p>
            {(searchQuery || timeFilter !== 'all' || filterType !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setTimeFilter('all')
                  setFilterType('all')
                }}
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-3 py-1 text-xs font-bold text-[var(--orange)] hover:border-[var(--orange)] transition cursor-pointer"
              >
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {groupedSections.map((group) => {
            const groupTotalRevenue = group.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)

            return (
              <div key={group.id} className="space-y-1.5">
                {/* Slim Timeline Period Header */}
                <div className="flex items-center justify-between border-b border-[var(--line)]/70 pb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-[var(--text)] uppercase tracking-wider">
                      {group.title}
                    </span>
                    <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-1.5 py-0.1 text-[9px] font-black text-[var(--gold)]">
                      {group.orders.length}
                    </span>
                  </div>

                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                    Total: ₹{groupTotalRevenue}
                  </span>
                </div>

                {/* Orders in this Period - Structured Kitchen Ticket Layout */}
                <div className="space-y-2">
                  {group.orders.map((order) => (
                    <AdminOrderCard
                      key={order.id}
                      order={order}
                      copiedId={copiedId}
                      onCopyLink={handleCopyLink}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
