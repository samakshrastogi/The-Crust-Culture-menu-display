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
            <span>{isSyncing ? 'Syncing...' : 'Google Sheets Synced'}</span>
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
            onClick={exportOrdersToCSV}
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

      {/* Micro Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2 sm:p-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-[var(--muted)] text-[10.5px]">
            <span>Total Orders</span>
            <FiShoppingBag className="text-xs text-[var(--orange)]" />
          </div>
          <div className="mt-0.5 text-base sm:text-lg font-black text-[var(--text)] leading-tight">
            {stats.totalOrders}
          </div>
          <div className="text-[9px] text-[var(--muted)] mt-0.5 truncate">Synced across devices</div>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2 sm:p-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-[var(--muted)] text-[10.5px]">
            <span>Total Revenue</span>
            <FiDollarSign className="text-xs text-emerald-500" />
          </div>
          <div className="mt-0.5 text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 leading-tight">
            ₹{stats.totalRevenue}
          </div>
          <div className="text-[9px] text-[var(--muted)] mt-0.5 truncate">All time total</div>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2 sm:p-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-[var(--muted)] text-[10.5px]">
            <span>Today&apos;s Orders</span>
            <FiClock className="text-xs text-blue-500" />
          </div>
          <div className="mt-0.5 text-base sm:text-lg font-black text-[var(--text)] leading-tight">
            {stats.todayOrders}
          </div>
          <div className="text-[9px] text-[var(--muted)] mt-0.5 truncate">₹{stats.todayRevenue} today</div>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2 sm:p-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-[var(--muted)] text-[10.5px]">
            <span>Customers</span>
            <FiUsers className="text-xs text-amber-500" />
          </div>
          <div className="mt-0.5 text-base sm:text-lg font-black text-[var(--text)] leading-tight">
            {stats.uniqueCustomers}
          </div>
          <div className="text-[9px] text-[var(--muted)] mt-0.5 truncate">Unique contacts</div>
        </div>
      </div>

      {/* Compact Filters & Timeline Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--muted)] mr-1 shrink-0">
            <FiCalendar className="text-[10px] text-[var(--orange)]" />
            <span>Timeline:</span>
          </span>

          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today', count: stats.todayOrders },
            { id: 'week', label: 'Week', count: stats.weekOrders },
            { id: 'month', label: 'Month', count: stats.monthOrders },
            { id: 'year', label: 'Year' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeFilter(tab.id)}
              className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold transition-all cursor-pointer ${
                timeFilter === tab.id
                  ? 'bg-gradient-to-r from-[var(--orange)] to-[#ea580c] text-white shadow-2xs'
                  : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--gold)]/40'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`rounded-full px-1 py-0.2 text-[8.5px] font-black ${
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
        <div className="flex items-center gap-1 shrink-0">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'dine-in', label: '🍽️ Dine-In' },
            { id: 'takeaway', label: '🥡 Takeaway' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold transition cursor-pointer ${
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

      {/* Compact Search & Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, or order ID..."
            className="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] pl-8 pr-3 py-1.5 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--orange)]"
          />
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
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)]/50 p-6 text-center space-y-2">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface-strong)] text-lg text-[var(--muted)]">
            <FiShoppingBag />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-black text-[var(--text)]">No order records found</h3>
            <p className="text-[11px] text-[var(--muted)] max-w-sm mx-auto">
              {searchQuery
                ? 'No orders match your search query.'
                : 'Orders sent to WhatsApp or opened from ticket links will automatically appear here.'}
            </p>
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

                {/* Orders in this Period */}
                <div className="space-y-1.5">
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
                        className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2.5 sm:p-3 shadow-2xs transition hover:border-[var(--orange)]/40 space-y-2"
                      >
                        {/* Row 1: ID, Badges, Time, Price & Top Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[var(--line)]/40 pb-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-black text-[var(--orange)]">
                              {order.id}
                            </span>
                            <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-1.5 py-0.2 text-[9.5px] font-bold text-[var(--muted)]">
                              {order.orderType === 'dine-in' ? '🍽️ Dine-In' : '🥡 Takeaway'}
                            </span>
                            {order.securityCode && (
                              <span className="inline-flex items-center gap-0.5 font-mono text-[9.5px] text-emerald-600 dark:text-emerald-400 font-bold">
                                <FiShield className="text-[8.5px]" />
                                {order.securityCode}
                              </span>
                            )}
                            <span className="text-[10px] text-[var(--muted)] flex items-center gap-1 ml-1">
                              <FiClock className="text-[9px]" />
                              {dateStr}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[var(--orange)]">
                              ₹{order.total}
                            </span>

                            {/* Compact Action Buttons */}
                            <button
                              type="button"
                              onClick={() => handleCopyLink(order)}
                              className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-0.5 text-[10px] font-bold text-[var(--text)] hover:border-[var(--orange)] transition cursor-pointer"
                              title="Copy Verified Order Link"
                            >
                              {copiedId === order.id ? (
                                <>
                                  <FiCheck className="text-emerald-500 text-[10px]" />
                                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <FiCopy className="text-[10px]" />
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
                                className="inline-flex items-center gap-1 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/30 px-2 py-0.5 text-[10px] font-black text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white transition"
                              >
                                <FiExternalLink className="text-[10px]" />
                                <span>Ticket</span>
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Row 2: Customer Name, Phone & Quick Contact */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[var(--text)] text-xs">
                              {order.customerName || 'Guest'}
                            </span>
                            {cleanPhone ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[var(--muted)] text-[11px]">+91 {cleanPhone}</span>
                                <a
                                  href={`tel:+91${cleanPhone}`}
                                  className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                                  title="Call Customer"
                                >
                                  <FiPhone className="text-[8.5px]" />
                                  <span>Call</span>
                                </a>
                                <a
                                  href={`https://wa.me/91${cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                                  title="Message on WhatsApp"
                                >
                                  <FaWhatsapp className="text-[8.5px]" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            ) : (
                              <span className="text-[9.5px] text-[var(--muted)]">No phone provided</span>
                            )}
                          </div>
                        </div>

                        {/* Row 3: Items Ordered (Compact Pills) */}
                        {order.items && order.items.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {order.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-strong)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text)] border border-[var(--line)]"
                              >
                                <span className="font-semibold">{item.name}</span>
                                {item.size && (
                                  <span className="text-[8.5px] text-[var(--muted)]">({item.size})</span>
                                )}
                                <span className="rounded bg-[var(--surface)] px-1 text-[9px] font-black text-[var(--orange)]">
                                  x{item.quantity}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Row 4: Notes (if any) */}
                        {order.notes && (
                          <p className="text-[10.5px] italic text-[var(--muted)] border-l-2 border-amber-500 pl-1.5 py-0.2">
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
