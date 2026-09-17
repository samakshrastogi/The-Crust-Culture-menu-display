import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiSearch,
  FiDownload,
  FiPhone,
  FiCopy,
  FiCheck,
  FiClock,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiPlus,
  FiShield,
  FiRefreshCw,
  FiCalendar,
  FiX,
  FiFileText,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import {
  exportOrdersToCSV,
  importOrderFromUrl,
  syncOrdersWithCloud,
} from '../utils/orderHistory'

export default function AdminPage() {
  const [orders, setOrders] = useState([])
  const [isSyncing, setIsSyncing] = useState(true)
  const [lastSynced, setLastSynced] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'dine-in' | 'takeaway'
  const [timeFilter, setTimeFilter] = useState('all') // 'all' | 'today' | 'week' | 'month' | 'year'
  const [copiedId, setCopiedId] = useState(null)
  const [importInput, setImportInput] = useState('')
  const [importMessage, setImportMessage] = useState(null)
  const [showImportBox, setShowImportBox] = useState(false)

  // Cloud sync on initial page load (strictly shows only what exists in Excel/Google Sheets)
  useEffect(() => {
    let mounted = true
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
  }, [])

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

  const handleImportSubmit = (e) => {
    e.preventDefault()
    if (!importInput.trim()) return

    const result = importOrderFromUrl(importInput)
    setImportMessage(result)
    if (result.success) {
      setImportInput('')
      reloadOrders()
      setTimeout(() => setImportMessage(null), 4000)
    }
  }

  return (
    <div className="mx-auto  px-2.5 py-3 sm:px-4 sm:py-3.5 space-y-2.5">
      {/* Compact Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-display text-sm sm:text-base font-black text-[var(--text)]">
            Customer Directory
          </h1>
          <span className="rounded-full bg-emerald-600/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-black text-emerald-700 dark:text-emerald-300">
            Admin
          </span>
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
            onClick={() => setShowImportBox(!showImportBox)}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-1 text-[11px] font-bold text-[var(--text)] hover:border-[var(--orange)] transition cursor-pointer"
          >
            <FiPlus className="text-[10px]" />
            <span>Import Link</span>
          </button>

          <button
            type="button"
            onClick={() => exportOrdersToCSV(filteredOrders)}
            disabled={orders.length === 0}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--orange)] px-3 py-1 text-[11px] font-black text-white hover:brightness-110 transition cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <FiDownload className="text-[10px]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Manual Link Import Box (Collapsible) */}
      {showImportBox && (
        <form
          onSubmit={handleImportSubmit}
          className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-2.5 space-y-1.5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-700 dark:text-amber-400">
              Paste & Import Order Link
            </span>
            <span className="text-[9px] text-[var(--muted)]">
              Paste any /order?v=... link
            </span>
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder="Paste order link or token here..."
              className="flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--orange)]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--orange)] px-3 py-1.5 text-xs font-black text-white hover:brightness-110 cursor-pointer"
            >
              Import
            </button>
          </div>
          {importMessage && (
            <p
              className={`text-[11px] font-bold ${
                importMessage.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'
              }`}
            >
              {importMessage.message}
            </p>
          )}
        </form>
      )}

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
          onClick={() => setTimeFilter('all')}
          onKeyDown={(e) => e.key === 'Enter' && setTimeFilter('all')}
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
          onClick={() => setTimeFilter('today')}
          onKeyDown={(e) => e.key === 'Enter' && setTimeFilter('today')}
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
        <div className="flex items-center gap-1 shrink-0">
          <span className="flex items-center gap-0.5 text-[9.5px] font-bold text-[var(--muted)] mr-0.5 shrink-0">
            <FiCalendar className="text-[9.5px] text-[var(--orange)]" />
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
        <div className="flex items-center gap-1 rounded-xl bg-[var(--surface-strong)]/80 p-0.5 border border-[var(--line)] shrink-0">
          {[
            { id: 'all', label: 'All', count: stats.totalOrders },
            { id: 'dine-in', label: '🍽️ Dine', count: stats.dineInCount },
            { id: 'takeaway', label: '🥡 Take', count: stats.takeawayCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
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
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
            placeholder="Search by customer name, phone, or order ID..."
            className="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] pl-8 pr-8 py-1.5 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--orange)] transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-5 w-5 place-items-center rounded-full bg-[var(--surface-strong)] text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer"
              title="Clear search"
            >
              <FiX className="text-[10px]" />
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
          >
            <FiRefreshCw className={`text-[11px] ${isSyncing ? 'animate-spin text-[var(--orange)]' : ''}`} />
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
                  {group.orders.map((order) => {
                    const dateStr = order.timestamp
                      ? new Date(order.timestamp).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : ''

                    const cleanPhone = (order.customerPhone || '').replace(/\D/g, '')

                    return (
                      <div
                        key={order.id}
                        className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2.5 sm:p-3.5 shadow-2xs transition-all hover:border-[var(--orange)]/60 hover:shadow-sm border-l-4 ${
                          order.orderType === 'dine-in' ? 'border-l-amber-500' : 'border-l-emerald-500'
                        }`}
                      >
                        {/* Mobile Ultra-Compact Layout (< md) */}
                        <div className="md:hidden space-y-1.5">
                          {/* Row 1: ID, Type, Price, Copy, Ticket */}
                          <div className="flex items-center justify-between gap-1 border-b border-[var(--line)]/50 pb-1.5">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[11px] font-black text-[var(--orange)] bg-orange-500/10 px-1.5 py-0.2 rounded border border-orange-500/20">
                                #{order.id}
                              </span>
                              <span
                                className={`rounded-full px-1.5 py-0.2 text-[8.5px] font-bold border ${
                                  order.orderType === 'dine-in'
                                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
                                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                                }`}
                              >
                                {order.orderType === 'dine-in' ? '🍽️ Dine' : '🥡 Take'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-black text-[var(--orange)]">
                                ₹{order.total}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyLink(order)}
                                className="inline-flex items-center gap-0.5 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-0.5 text-[9.5px] font-bold text-[var(--text)] hover:border-[var(--orange)] active:scale-95 cursor-pointer"
                              >
                                {copiedId === order.id ? (
                                  <FiCheck className="text-emerald-500 text-[9px]" />
                                ) : (
                                  <FiCopy className="text-[9px]" />
                                )}
                                <span>{copiedId === order.id ? 'Copied' : 'Copy'}</span>
                              </button>
                              {order.receiptUrl && (
                                <Link
                                  to={
                                    order.receiptUrl.includes('/order?v=')
                                      ? `/order?v=${order.receiptUrl.split('?v=')[1]}`
                                      : order.receiptUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-2 py-0.5 text-[9.5px] font-black text-white hover:brightness-110 active:scale-95"
                                >
                                  <span>Ticket</span>
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Row 2: Customer Name, Phone & Quick Actions */}
                          <div className="flex items-center justify-between gap-1 text-xs">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-[var(--text)] text-xs">
                                {order.customerName || 'Guest'}
                              </span>
                              {cleanPhone && (
                                <span className="text-[var(--muted)] text-[10.5px] font-medium">+91 {cleanPhone}</span>
                              )}
                            </div>

                            {cleanPhone && (
                              <div className="flex items-center gap-1 shrink-0">
                                <a
                                  href={`tel:+91${cleanPhone}`}
                                  className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.2 text-[8.5px] font-bold text-emerald-700 dark:text-emerald-300"
                                  title="Call Customer"
                                >
                                  <FiPhone className="text-[8px]" />
                                  <span>Call</span>
                                </a>
                                <a
                                  href={`https://wa.me/91${cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.2 text-[8.5px] font-bold text-emerald-700 dark:text-emerald-300"
                                  title="Message on WhatsApp"
                                >
                                  <FaWhatsapp className="text-[8px]" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Row 3: Items Pills */}
                          {order.items && order.items.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {order.items.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-strong)] px-1.5 py-0.5 text-[9.5px] font-medium text-[var(--text)] border border-[var(--line)]"
                                >
                                  <span className="rounded bg-orange-500/15 px-1 py-0.1 text-[8.5px] font-black text-[var(--orange)]">
                                    {item.quantity || 1}x
                                  </span>
                                  <span className="font-bold">{item.name}</span>
                                  {item.size && (
                                    <span className="text-[8px] text-[var(--muted)]">({item.size})</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Row 4: Timestamp & Security Code & Note */}
                          <div className="flex items-center justify-between text-[9px] text-[var(--muted)] pt-0.5">
                            <span className="flex items-center gap-1">
                              <FiClock className="text-[8.5px]" />
                              {dateStr}
                            </span>
                            {order.securityCode && (
                              <span className="font-mono text-[8.5px] text-emerald-600 dark:text-emerald-400 font-bold">
                                {order.securityCode}
                              </span>
                            )}
                          </div>

                          {order.notes && (
                            <div className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9.5px] text-amber-800 dark:text-amber-300 italic">
                              📝 &ldquo;{order.notes}&rdquo;
                            </div>
                          )}
                        </div>

                        {/* Desktop 12-Col Layout (md & above) */}
                        <div className="hidden md:grid md:grid-cols-12 gap-3 items-start">
                          {/* Column 1: Order & Diner Info */}
                          <div className="md:col-span-4 space-y-1.5 border-b md:border-b-0 md:border-r border-[var(--line)]/50 pb-2.5 md:pb-0 md:pr-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-xs font-black text-[var(--orange)] bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">
                                #{order.id}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold border ${
                                  order.orderType === 'dine-in'
                                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
                                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                                }`}
                              >
                                {order.orderType === 'dine-in' ? '🍽️ Dine-In' : '🥡 Takeaway'}
                              </span>
                            </div>

                            <div className="pt-0.5">
                              <h4 className="text-sm font-black text-[var(--text)] tracking-tight">
                                {order.customerName || 'Guest Diner'}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-[var(--muted)] mt-0.5 flex-wrap">
                                {cleanPhone ? (
                                  <>
                                    <span className="font-medium">+91 {cleanPhone}</span>
                                    <div className="flex items-center gap-1">
                                      <a
                                        href={`tel:+91${cleanPhone}`}
                                        className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition"
                                        title="Call Customer"
                                      >
                                        <FiPhone className="text-[8.5px]" />
                                        <span>Call</span>
                                      </a>
                                      <a
                                        href={`https://wa.me/91${cleanPhone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition"
                                        title="Message on WhatsApp"
                                      >
                                        <FaWhatsapp className="text-[8.5px]" />
                                        <span>WhatsApp</span>
                                      </a>
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-[9.5px] italic text-[var(--muted)]">No phone provided</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] pt-0.5">
                              <FiClock className="text-[10px] text-[var(--muted)]" />
                              <span>{dateStr}</span>
                              {order.securityCode && (
                                <span className="inline-flex items-center gap-0.5 font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-bold ml-auto">
                                  <FiShield className="text-[8px]" />
                                  {order.securityCode}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Column 2: Items & Cooking Notes */}
                          <div className="md:col-span-5 space-y-2 border-b md:border-b-0 md:border-r border-[var(--line)]/50 pb-2.5 md:pb-0 md:pr-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
                                Ordered Items ({order.items?.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0) || 0})
                              </span>
                            </div>

                            {order.items && order.items.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {order.items.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-strong)] px-2 py-1 text-[11px] font-medium text-[var(--text)] border border-[var(--line)] shadow-2xs"
                                  >
                                    <span className="rounded bg-orange-500/15 px-1 py-0.2 text-[9.5px] font-black text-[var(--orange)]">
                                      {item.quantity || 1}x
                                    </span>
                                    <span className="font-bold">{item.name}</span>
                                    {item.size && (
                                      <span className="text-[9px] text-[var(--muted)]">({item.size})</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-[var(--muted)] italic">Items details in verified receipt</p>
                            )}

                            {/* Cooking / Special Instructions Callout */}
                            {order.notes && (
                              <div className="flex items-start gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 px-2 py-1.5 text-[10.5px] text-amber-800 dark:text-amber-300">
                                <span className="shrink-0 font-bold">📝 Note:</span>
                                <span className="italic font-medium">&ldquo;{order.notes}&rdquo;</span>
                              </div>
                            )}
                          </div>

                          {/* Column 3: Amount & Action Buttons */}
                          <div className="md:col-span-3 flex flex-col justify-between h-full space-y-2.5 text-left md:text-right md:pl-1">
                            <div>
                              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider block">
                                Grand Total
                              </span>
                              <span className="text-xl sm:text-2xl font-black text-[var(--orange)] tracking-tight block">
                                ₹{order.total}
                              </span>
                            </div>

                            <div className="flex items-center md:justify-end gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleCopyLink(order)}
                                className="inline-flex items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-1 text-[10.5px] font-bold text-[var(--text)] hover:border-[var(--orange)] transition cursor-pointer shadow-2xs"
                                title="Copy Order Link"
                              >
                                {copiedId === order.id ? (
                                  <>
                                    <FiCheck className="text-emerald-500 text-xs" />
                                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <FiCopy className="text-xs" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>

                              {order.receiptUrl && (
                                <Link
                                  to={
                                    order.receiptUrl.includes('/order?v=')
                                      ? `/order?v=${order.receiptUrl.split('?v=')[1]}`
                                      : order.receiptUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-3 py-1 text-[10.5px] font-black text-white hover:brightness-110 transition shadow-2xs"
                                >
                                  <FiFileText className="text-xs" />
                                  <span>Ticket</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
