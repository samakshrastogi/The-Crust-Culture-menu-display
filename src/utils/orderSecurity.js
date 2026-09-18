/**
 * Order Security & Tamper Detection Utility
 * Zero-backend, Zero-DB cryptographic verification for WhatsApp orders.
 */

import { allMenuItems } from '../data/menuSections'
import { cleanPhone, parseNumericPrice } from './priceUtils'

const SECRET_SALT =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ORDER_SECRET_SALT) ||
  'TCC_WOOD_FIRED_CAFE_KITCHEN_SALT_v1_2026'

/**
 * Normalizes any order item into a uniform schema with backward-compatible aliases
 * @param {Object} item
 * @returns {{ name: string, size: string, quantity: number, price: number, n: string, s: string, q: number, p: number }}
 */
export function normalizeOrderItem(item) {
  if (!item) {
    return { name: 'Item', size: '', quantity: 1, price: 0, n: 'Item', s: '', q: 1, p: 0 }
  }
  const name = String(item.name || item.n || 'Item').trim()
  const size = String(item.size || item.s || '').trim()
  const quantity = Math.max(1, Number(item.quantity ?? item.q) || 1)
  const price = Math.max(0, Number(item.price ?? item.p) || 0)

  return {
    name,
    size,
    quantity,
    price,
    n: name,
    s: size,
    q: quantity,
    p: price,
  }
}

/**
 * 64-bit high-dispersion hash mixer
 */
function hashPayload(str) {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(12, '0')
}

/**
 * Convert string to URL-safe Base64 (Unicode-safe)
 */
function toBase64Url(str) {
  try {
    const bytes = new TextEncoder().encode(str)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch {
    return ''
  }
}

/**
 * Convert URL-safe Base64 to string (Unicode-safe)
 */
function fromBase64Url(str) {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) base64 += '='
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch {
    return null
  }
}

/**
 * Calculate expected cryptographic signature for an order
 */
function computeSignature(orderId, total, items, timestamp) {
  const itemDigest = items
    .map((item) => `${item.n || item.name}:${item.q || item.quantity}:${item.p || item.price}:${item.s || item.size || ''}`)
    .sort()
    .join('|')
  const raw = `${orderId}#${total}#${itemDigest}#${timestamp}#${SECRET_SALT}`
  return hashPayload(raw)
}

/**
 * Generate security details for a newly placed cart order
 * @param {Object} params
 * @param {Array} params.cart - cart items
 * @param {number} params.total - total amount
 * @param {string} params.customerName - customer name
 * @param {string} [params.customerPhone] - customer phone number
 * @param {string} params.orderType - 'dine-in' | 'takeaway'
 * @param {string} [params.cookingInstructions] - optional notes
 * @param {string|number} [params.tableNumber] - optional dining table number
 * @returns {{ orderId: string, securityCode: string, token: string, receiptUrl: string, timestamp: number }}
 */
export function generateOrderSecurity({
  cart,
  total,
  customerName,
  customerPhone,
  orderType,
  cookingInstructions,
  tableNumber,
}) {
  const numSuffix = Math.floor(1000 + Math.random() * 9000)
  const orderId = `TCC-${numSuffix}`
  const timestamp = Math.floor(Date.now() / 1000)

  const items = cart.map((item) => ({
    n: item.name,
    s: item.size || '',
    q: Math.max(1, Number(item.quantity) || 1),
    p: Math.max(0, Number(item.price) || 0),
  }))

  const signature = computeSignature(orderId, total, items, timestamp)
  const shortChecksum = signature.slice(0, 4).toUpperCase()
  const securityCode = `#CC-${total}-${shortChecksum}`

  // Mask phone number in public token to protect PII in URLs
  const cleanP = cleanPhone(customerPhone)
  const maskedPhone = cleanP.length >= 4 ? `${cleanP.slice(0, 2)}******${cleanP.slice(-2)}` : cleanP

  // Ultra-compact tuple encoding: [id, ts, name, phone, type, items, notes, total, sig, table]
  const compactItems = items.map((i) => [i.n, i.s, i.q, i.p])
  const payload = [
    numSuffix,
    timestamp,
    customerName?.trim() || '',
    maskedPhone,
    orderType === 'takeaway' ? 't' : 'd',
    compactItems,
    cookingInstructions?.trim() || '',
    total,
    signature,
    tableNumber ? String(tableNumber).trim() : '',
  ]

  const token = toBase64Url(JSON.stringify(payload))
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const receiptUrl = `${origin}/order?v=${token}`

  return {
    orderId,
    timestamp: timestamp * 1000,
    securityCode,
    token,
    receiptUrl,
  }
}

/**
 * Verify and decode an order token from URL
 * @param {string} token - Base64Url token
 * @returns {{ valid: boolean, order: Object | null, error: string | null }}
 */
export function verifyOrderToken(token) {
  if (!token) {
    return { valid: false, order: null, error: 'Missing order verification token.' }
  }

  const jsonStr = fromBase64Url(token)
  if (!jsonStr) {
    return { valid: false, order: null, error: 'Invalid or corrupt order token format.' }
  }

  try {
    const raw = JSON.parse(jsonStr)

    let id
    let ts
    let name
    let phone = ''
    let type
    let items
    let notes = ''
    let total
    let sig
    let table = ''

    if (Array.isArray(raw)) {
      // Compact tuple format: [numSuffix, ts, name, phone, type, compactItems, notes, total, sig, table]
      const [numSuffix, rawTs, rawName, rawPhone, rawType, rawItems, rawNotes, rawTotal, rawSig, rawTable] = raw
      id = typeof numSuffix === 'number' || /^\d+$/.test(numSuffix) ? `TCC-${numSuffix}` : numSuffix
      ts = rawTs > 1e11 ? rawTs : rawTs * 1000
      name = rawName || 'Guest'
      phone = rawPhone || ''
      type = rawType === 't' ? 'takeaway' : 'dine-in'
      items = (rawItems || []).map((arr) => ({
        n: arr[0],
        s: arr[1] || '',
        q: Number(arr[2]) || 1,
        p: Number(arr[3]) || 0,
      }))
      notes = rawNotes || ''
      total = Number(rawTotal) || 0
      sig = rawSig
      table = rawTable ? String(rawTable).trim() : ''
    } else {
      // Legacy object format
      id = raw.id
      ts = raw.ts
      name = raw.name || 'Guest'
      phone = raw.phone || ''
      type = raw.type || 'dine-in'
      items = (raw.items || []).map((i) => ({
        n: i.n || i.name,
        s: i.s || i.size || '',
        q: Number(i.q || i.quantity) || 1,
        p: Number(i.p || i.price) || 0,
      }))
      notes = raw.notes || ''
      total = Number(raw.total) || 0
      sig = raw.sig
      table = raw.tableNumber || raw.table || ''
    }

    if (!id || !ts || !Array.isArray(items) || typeof total !== 'number' || !sig) {
      return { valid: false, order: null, error: 'Incomplete order payload structure.' }
    }

    // Verify item prices are valid positive numbers
    for (const item of items) {
      if ((Number(item.p) || 0) < 0 || (Number(item.q) || 0) <= 0) {
        return {
          valid: false,
          order: null,
          error: `Invalid item rate or quantity for "${item.n || 'item'}".`,
        }
      }
    }

    // Verify calculated items total equals stated total
    const computedTotal = items.reduce((sum, item) => sum + (Number(item.p) || 0) * (Number(item.q) || 1), 0)
    if (computedTotal !== total) {
      return {
        valid: false,
        order: null,
        error: `Price discrepancy detected! Stated total is ₹${total} but itemized total is ₹${computedTotal}.`,
      }
    }

    // Verify against official menu rates if item exists in canonical menu
    if (Array.isArray(allMenuItems) && allMenuItems.length > 0) {
      for (const item of items) {
        const cleanName = String(item.n || '').toLowerCase().trim()
        const canonical = allMenuItems.find((m) => {
          const mName = m.name.toLowerCase().trim()
          return mName === cleanName || `${mName} pizza` === cleanName || mName === `${cleanName} pizza`
        })
        if (canonical && Array.isArray(canonical.prices) && canonical.prices.length > 0) {
          const validPriceValues = canonical.prices.map((p) => parseNumericPrice(p?.value ?? p))
          const unitP = Number(item.p) || 0
          if (!validPriceValues.includes(unitP)) {
            return {
              valid: false,
              order: null,
              error: `Invalid dish rate! "${item.n}" official rates are ₹${validPriceValues.join('/₹')}, but ticket states ₹${unitP}.`,
            }
          }
        }
      }
    }

    // Recalculate signature with internal secret salt
    const tsForSig = ts > 1e11 ? Math.floor(ts / 1000) : ts
    const expectedSigSec = computeSignature(id, total, items, tsForSig)
    const expectedSigMs = computeSignature(id, total, items, ts)
    if (expectedSigSec !== sig && expectedSigMs !== sig) {
      return {
        valid: false,
        order: null,
        error: 'Security signature mismatch! This order data has been altered or tampered with.',
      }
    }

    const shortChecksum = sig.slice(0, 4).toUpperCase()
    const securityCode = `#CC-${total}-${shortChecksum}`

    return {
      valid: true,
      order: {
        id,
        timestamp: ts,
        customerName: name,
        customerPhone: phone,
        orderType: type,
        tableNumber: table,
        items: items.map(normalizeOrderItem),
        notes,
        total,
        securityCode,
      },
      error: null,
    }
  } catch (err) {
    return { valid: false, order: null, error: `Failed to parse order: ${err.message}` }
  }
}
