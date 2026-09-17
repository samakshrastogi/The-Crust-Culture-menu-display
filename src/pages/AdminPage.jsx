import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiSearch,
  FiDownload,
  FiPhone,
  FiCopy,
  FiExternalLink,
  FiCheck,
  FiClock,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiPlus,
  FiShield,
  FiRefreshCw,
  FiCalendar,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import {
  getOrderHistory,
  exportOrdersToCSV,
  importOrderFromUrl,
  syncOrdersWithCloud,
} from '../utils/orderHistory'

export default function AdminPage() {
  const [orders, setOrders] = useState(() => getOrderHistory())
  const [isSyncing, setIsSyncing] = useState(true)
  const [lastSynced, setLastSynced] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'dine-in' | 'takeaway'
  const [timeFilter, setTimeFilter] = useState('all') // 'all' | 'today' | 'week' | 'month' | 'year'
  const [copiedId, setCopiedId] = useState(null)
  const [importInput, setImportInput] = useState('')
  const [importMessage, setImportMessage] = useState(null)
  const [showImportBox, setShowImportBox] = useState(false)

  // Cloud sync on initial page load
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
    } catch {
      setOrders(getOrderHistory())
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

    const uniquePhones = new Set(orders.map((o) => o.customerPhone).filter(Boolean))

    return {
      totalOrders,
      totalRevenue,
      todayOrders: todayOrders.length,
      todayRevenue,
      weekOrders: weekOrders.length,
      weekRevenue,
      monthOrders: monthOrders.length,
      monthRevenue,
      uniqueCustomers: uniquePhones.size || orders.length,
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
    <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-lg sm:text-xl font-black text-[var(--text)]">
              Customer Directory & Order Records
            </h1>
            <span className="rounded-full bg-emerald-600/15 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-black text-emerald-700 dark:text-emerald-300">
              Admin Portal
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-bold border transition-colors ${
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
              <span>{isSyncing ? 'Syncing...' : 'Google Sheets Synced'}</span>
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Auto-recorded order tickets, customer contacts, and verified receipt links.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowImportBox(!showImportBox)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:border-[var(--orange)] transition cursor-pointer"
          >
            <FiPlus className="text-xs" />
            <span>Import Link</span>
          </button>

          <button
            type="button"
            onClick={exportOrdersToCSV}
            disabled={orders.length === 0}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--orange)] px-3.5 py-1.5 text-xs font-black text-white hover:brightness-110 transition cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <FiDownload className="text-xs" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Manual Link Import Box (Collapsible) */}
      {showImportBox && (
        <form
          onSubmit={handleImportSubmit}
          className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-700 dark:text-amber-400">
              Paste & Import Order Link
            </span>
            <span className="text-[10px] text-[var(--muted)]">
              Paste any /order?v=... link to record it into this directory
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder="Paste order link or token here..."
              className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--orange)]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[var(--orange)] px-4 py-2 text-xs font-black text-white hover:brightness-110 cursor-pointer"
            >
              Import
            </button>
          </div>
          {importMessage && (
            <p
              className={`text-xs font-bold ${
                importMessage.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'
              }`}
            >
              {importMessage.message}
            </p>
          )}
        </form>
      )}

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[var(--muted)] text-xs">
            <span>Total Orders</span>
            <FiShoppingBag className="text-sm text-[var(--orange)]" />
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-[var(--text)]">
            {stats.totalOrders}
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">Synced via Google Sheets</div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[var(--muted)] text-xs">
            <span>Total Revenue</span>
            <FiDollarSign className="text-sm text-emerald-500" />
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{stats.totalRevenue}
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">All time total</div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[var(--muted)] text-xs">
            <span>Today&apos;s Orders</span>
            <FiClock className="text-sm text-blue-500" />
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-[var(--text)]">
            {stats.todayOrders}
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">₹{stats.todayRevenue} today</div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[var(--muted)] text-xs">
            <span>Customers</span>
            <FiUsers className="text-sm text-amber-500" />
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-[var(--text)]">
            {stats.uniqueCustomers}
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">Unique mobile contacts</div>
        </div>
      </div>

      {/* Time Period Filter Tabs: Days -> Week -> Month -> Year */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--muted)] mr-1 shrink-0">
            <FiCalendar className="text-xs text-[var(--orange)]" />
            <span>Timeline:</span>
          </span>

          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today (Days)', count: stats.todayOrders },
            { id: 'week', label: 'This Week', count: stats.weekOrders },
            { id: 'month', label: 'This Month', count: stats.monthOrders },
            { id: 'year', label: 'This Year' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeFilter(tab.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                timeFilter === tab.id
                  ? 'bg-gradient-to-r from-[var(--orange)] to-[#ea580c] text-white shadow-xs'
                  : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--gold)]/40'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-black ${
                    timeFilter === tab.id ? 'bg-white/25 text-white' : 'bg-[var(--surface-strong)] text-[var(--text)]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Order Type Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'dine-in', label: '🍽️ Dine-In' },
            { id: 'takeaway', label: '🥡 Takeaway' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`rounded-full px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[var(--surface-strong)] border border-[var(--orange)] text-[var(--orange)] ring-1 ring-[var(--orange)]/30'
                  : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar & Record Count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, or order ID..."
            className="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] pl-9 pr-3 py-2 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--orange)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted)]">
            Showing <strong className="text-[var(--text)]">{filteredOrders.length}</strong> of{' '}
            {orders.length} orders
          </span>

          <button
            type="button"
            onClick={reloadOrders}
            disabled={isSyncing}
            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer disabled:opacity-50"
            title="Sync with Google Sheets & refresh records"
          >
            <FiRefreshCw className={`text-xs ${isSyncing ? 'animate-spin text-[var(--orange)]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Chronologically Grouped Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)]/50 p-8 text-center space-y-3">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface-strong)] text-xl text-[var(--muted)]">
            <FiShoppingBag />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-[var(--text)]">No order records found</h3>
            <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
              {searchQuery
                ? 'No orders match your search query.'
                : 'Orders sent to WhatsApp or opened from ticket links will automatically appear here.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedSections.map((group) => {
            const groupTotalRevenue = group.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)

            return (
              <div key={group.id} className="space-y-3">
                {/* Timeline Period Section Header */}
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-[var(--text)] uppercase tracking-wide">
                      {group.title}
                    </span>
                    <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-2 py-0.2 text-[9.5px] font-extrabold text-[var(--gold)]">
                      {group.orders.length} {group.orders.length === 1 ? 'order' : 'orders'}
                    </span>
                  </div>

                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Total: ₹{groupTotalRevenue}
                  </span>
                </div>

                {/* Orders in this Period */}
                <div className="space-y-2.5">
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
                        className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 sm:p-4 shadow-xs transition hover:border-[var(--orange)]/40 space-y-3"
                      >
                        {/* Row 1: ID, Badge, Time & Amount */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)]/50 pb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-black text-[var(--orange)]">
                              {order.id}
                            </span>
                            <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-2 py-0.2 text-[10px] font-bold text-[var(--muted)]">
                              {order.orderType === 'dine-in' ? '🍽️ Dine-In' : '🥡 Takeaway'}
                            </span>
                            {order.securityCode && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                <FiShield className="text-[9px]" />
                                {order.securityCode}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                              <FiClock className="text-[10px]" />
                              {dateStr}
                            </span>
                            <span className="text-sm sm:text-base font-black text-[var(--orange)]">
                              ₹{order.total}
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Customer Contact & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <div className="font-black text-[var(--text)] text-sm">
                              {order.customerName || 'Guest'}
                            </div>
                            {cleanPhone ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[var(--muted)] font-medium">+91 {cleanPhone}</span>
                                <a
                                  href={`tel:+91${cleanPhone}`}
                                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                                  title="Call Customer"
                                >
                                  <FiPhone className="text-[9px]" />
                                  <span>Call</span>
                                </a>
                                <a
                                  href={`https://wa.me/91${cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                                  title="Message on WhatsApp"
                                >
                                  <FaWhatsapp className="text-[9px]" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            ) : (
                              <span className="text-[10px] text-[var(--muted)]">No phone provided</span>
                            )}
                          </div>

                          {/* Actions: Copy Link & View Ticket (NO DELETE ICONS) */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyLink(order)}
                              className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-1 text-[11px] font-bold text-[var(--text)] hover:border-[var(--orange)] transition cursor-pointer"
                              title="Copy Verified Order Link"
                            >
                              {copiedId === order.id ? (
                                <>
                                  <FiCheck className="text-emerald-500 text-xs" />
                                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <FiCopy className="text-xs" />
                                  <span>Copy Link</span>
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
                                className="inline-flex items-center gap-1 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/30 px-3 py-1 text-[11px] font-black text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white transition"
                              >
                                <FiExternalLink className="text-xs" />
                                <span>View Ticket</span>
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Row 3: Items Ordered Summary */}
                        {order.items && order.items.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {order.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-lg bg-[var(--surface-strong)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--text)] border border-[var(--line)]"
                              >
                                <span className="font-bold">{item.name}</span>
                                {item.size && (
                                  <span className="text-[9px] text-[var(--muted)]">({item.size})</span>
                                )}
                                <span className="rounded bg-[var(--surface)] px-1 text-[9.5px] font-black text-[var(--orange)]">
                                  x{item.quantity}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Row 4: Notes (if any) */}
                        {order.notes && (
                          <p className="text-[11px] italic text-[var(--muted)] border-l-2 border-amber-500 pl-2">
                            &ldquo;{order.notes}&rdquo;
                          </p>
                        )}
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
