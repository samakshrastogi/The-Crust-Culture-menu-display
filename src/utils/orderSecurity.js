/**
 * Order Security & Tamper Detection Utility
 * Zero-backend, Zero-DB cryptographic verification for WhatsApp orders.
 */

const SECRET_SALT = 'TCC_WOOD_FIRED_CAFE_KITCHEN_SALT_v1_2026'

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
  } catch (err) {
    console.error('Base64 encoding error', err)
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
  } catch (err) {
    console.error('Base64 decoding error', err)
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
 * @param {string} params.cookingInstructions - optional notes
 * @returns {{ orderId: string, securityCode: string, token: string, receiptUrl: string }}
 */
export function generateOrderSecurity({ cart, total, customerName, customerPhone, orderType, cookingInstructions }) {
  // Generate random 4-digit order suffix
  const numSuffix = Math.floor(1000 + Math.random() * 9000)
  const orderId = `TCC-${numSuffix}`
  const timestamp = Math.floor(Date.now() / 1000)

  const items = cart.map((item) => ({
    n: item.name,
    s: item.size || '',
    q: item.quantity,
    p: item.price,
  }))

  const signature = computeSignature(orderId, total, items, timestamp)
  const shortChecksum = signature.slice(0, 4).toUpperCase()

  // Anti-tamper code e.g. #CC-398-8F2B
  const securityCode = `#CC-${total}-${shortChecksum}`

  // Ultra-compact tuple encoding: [id, ts, name, phone, type, items, notes, total, sig]
  // items: [ [name, size, qty, price], ... ]
  const compactItems = items.map((i) => [i.n, i.s, i.q, i.p])
  const payload = [
    numSuffix,
    timestamp,
    customerName?.trim() || '',
    customerPhone?.trim() || '',
    orderType === 'takeaway' ? 't' : 'd',
    compactItems,
    cookingInstructions?.trim() || '',
    total,
    signature,
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

    if (Array.isArray(raw)) {
      // Ultra-compact tuple format: [numSuffix, ts, name, phone, type, compactItems, notes, total, sig]
      const [numSuffix, rawTs, rawName, rawPhone, rawType, rawItems, rawNotes, rawTotal, rawSig] = raw
      id = typeof numSuffix === 'number' || /^\d+$/.test(numSuffix) ? `TCC-${numSuffix}` : numSuffix
      ts = rawTs > 1e11 ? rawTs : rawTs * 1000 // handle sec vs ms
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
    }

    if (!id || !ts || !Array.isArray(items) || typeof total !== 'number' || !sig) {
      return { valid: false, order: null, error: 'Incomplete order payload structure.' }
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
        items,
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
