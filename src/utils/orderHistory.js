/**
 * Order History & Admin Recording Utility
 * Manages customer order records, links, and CSV export without a backend.
 */
import { verifyOrderToken } from './orderSecurity'

const STORAGE_KEY = 'crust-admin-orders-v1'

/**
 * Google Apps Script Webhook URL for Google Sheets cloud synchronization.
 * The Apps Script backend code with multi-sheet support (All Records, Today, This Week, This Month, This Year)
 * is located at: google-sheets-script/Code.gs
 */
export const GOOGLE_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwHIoW4z_YMZuRTDU1UAs9hpTwd1Ez9LbpyzRHRWWgEbPMVhLY3XAP-nULQ1raoMAvuZg/exec'

/**
 * Send an order to the permanent Google Sheets cloud database (background fire-and-forget)
 * @param {Object} record
 */
export async function sendOrderToCloud(record) {
  if (typeof window === 'undefined' || !GOOGLE_SHEETS_WEBHOOK_URL || !record) return
  try {
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(record),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
    })
  } catch (err) {
    console.warn('Background sync to Google Sheets failed:', err)
  }
}

/**
 * Fetch orders from Google Sheets cloud database and merge with local cache
 * @returns {Promise<Array>}
 */
export async function syncOrdersWithCloud() {
  if (typeof window === 'undefined') return getOrderHistory()
  try {
    const res = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'GET',
      redirect: 'follow',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    if (data && data.success && Array.isArray(data.orders)) {
      const local = getOrderHistory()
      const mergedMap = new Map()

      // 1. Put cloud orders in map first
      data.orders.forEach((o) => {
        if (o && o.id) {
          mergedMap.set(o.id, {
            ...o,
            total: Number(o.total) || 0,
            timestamp: Number(o.timestamp) || Date.now(),
          })
        }
      })

      // 2. Add local orders if any were placed offline or not yet in cloud
      local.forEach((o) => {
        if (o && o.id) {
          if (!mergedMap.has(o.id)) {
            mergedMap.set(o.id, o)
            // Send missing order to cloud in background
            sendOrderToCloud(o)
          }
        }
      })

      // 3. Sort chronologically (newest first)
      const combined = Array.from(mergedMap.values()).sort(
        (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
      )

      // 4. Update local cache
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(combined.slice(0, 500)))
      return combined
    }

    return getOrderHistory()
  } catch (err) {
    console.warn('Failed to sync orders with cloud:', err)
    return getOrderHistory()
  }
}

/**
 * Get all stored orders from storage, newest first
 * @returns {Array}
 */
export function getOrderHistory() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Failed to read order history:', err)
    return []
  }
}

/**
 * Save or update an order record in history
 * @param {Object} order
 * @returns {Array} updated list of orders
 */
export function saveOrderToHistory(order) {
  if (typeof window === 'undefined' || !order) return []

  try {
    const current = getOrderHistory()
    const orderId = order.id || order.orderId

    if (!orderId) return current

    // Normalize record structure
    const record = {
      id: orderId,
      timestamp: order.timestamp || Date.now(),
      customerName: order.customerName || order.name || 'Guest',
      customerPhone: order.customerPhone || order.phone || '',
      orderType: order.orderType || order.type || 'dine-in',
      items: (order.items || []).map((i) => ({
        name: i.n || i.name,
        size: i.s || i.size || '',
        quantity: Number(i.q || i.quantity) || 1,
        price: Number(i.p || i.price) || 0,
      })),
      total: Number(order.total) || 0,
      securityCode: order.securityCode || '',
      notes: order.notes || order.cookingInstructions || '',
      receiptUrl:
        order.receiptUrl ||
        (order.token ? `${window.location.origin}/order?v=${order.token}` : window.location.href),
      recordedAt: Date.now(),
    }

    // Check if order already exists
    const existingIndex = current.findIndex((o) => o.id === orderId)
    let updated

    if (existingIndex > -1) {
      // Merge / update existing
      updated = [...current]
      updated[existingIndex] = { ...updated[existingIndex], ...record }
    } else {
      // Add new record at top
      updated = [record, ...current]
    }

    // Keep up to 500 latest orders
    if (updated.length > 500) {
      updated = updated.slice(0, 500)
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    // Background cloud sync to Google Sheets (fire and forget)
    sendOrderToCloud(record)

    return updated
  } catch (err) {
    console.error('Failed to save order to history:', err)
    return getOrderHistory()
  }
}

/**
 * Delete a specific order by ID
 * @param {string} orderId
 * @returns {Array}
 */
export function deleteOrderFromHistory(orderId) {
  if (typeof window === 'undefined') return []
  try {
    const current = getOrderHistory()
    const updated = current.filter((o) => o.id !== orderId)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (err) {
    console.error('Failed to delete order:', err)
    return getOrderHistory()
  }
}

/**
 * Clear all order history
 */
export function clearOrderHistory() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('Failed to clear order history:', err)
  }
}

/**
 * Parse an order URL and import it into history
 * @param {string} urlString
 * @returns {{ success: boolean, order: Object | null, message: string }}
 */
export function importOrderFromUrl(urlString) {
  try {
    const trimmed = urlString.trim()
    let token = ''

    if (trimmed.includes('?v=')) {
      const parts = trimmed.split('?v=')
      token = parts[1].split('&')[0]
    } else {
      token = trimmed
    }

    const { valid, order, error } = verifyOrderToken(token)
    if (!valid || !order) {
      return { success: false, order: null, message: error || 'Invalid order token or signature.' }
    }

    saveOrderToHistory({
      ...order,
      receiptUrl: trimmed.startsWith('http') ? trimmed : `${window.location.origin}/order?v=${token}`,
    })

    return { success: true, order, message: `Successfully imported order ${order.id}!` }
  } catch (err) {
    return { success: false, order: null, message: `Failed to import: ${err.message}` }
  }
}

/**
 * Export all orders to a formatted CSV spreadsheet for Excel / Sheets
 */
export function exportOrdersToCSV() {
  const orders = getOrderHistory()
  if (orders.length === 0) return false

  const headers = [
    'Order ID',
    'Date & Time',
    'Customer Name',
    'Phone Number',
    'Order Type',
    'Items Summary',
    'Total Amount (INR)',
    'Security Code',
    'Special Notes',
    'Verified Link',
  ]

  const rows = orders.map((o) => {
    const dateStr = o.timestamp ? new Date(o.timestamp).toLocaleString('en-IN') : ''
    const itemsSummary = (o.items || [])
      .map((i) => `${i.name}${i.size ? ` (${i.size})` : ''} x${i.quantity} [Rs.${i.price * i.quantity}]`)
      .join('; ')

    return [
      `"${o.id || ''}"`,
      `"${dateStr}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.orderType || ''}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      `"${o.total || 0}"`,
      `"${o.securityCode || ''}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`,
      `"${o.receiptUrl || ''}"`,
    ]
  })

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `the-crust-culture-orders-${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}
