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
    .map((item) => `${item.id || item.n}:${item.q || item.quantity}:${item.p || item.price}:${item.s || item.size || ''}`)
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
 * @param {string} params.orderType - 'dine-in' | 'takeaway'
 * @param {string} params.cookingInstructions - optional notes
 * @returns {{ orderId: string, securityCode: string, token: string, receiptUrl: string }}
 */
export function generateOrderSecurity({ cart, total, customerName, orderType, cookingInstructions }) {
  // Generate random 4-digit order suffix
  const orderId = `TCC-${Math.floor(1000 + Math.random() * 9000)}`
  const timestamp = Date.now()

  const compactItems = cart.map((item) => ({
    id: item.id,
    n: item.name,
    s: item.size || '',
    q: item.quantity,
    p: item.price,
  }))

  const signature = computeSignature(orderId, total, compactItems, timestamp)
  const shortChecksum = signature.slice(0, 4).toUpperCase()

  // Anti-tamper code e.g. #CC-398-8F2B (embeds total and 4-hex checksum)
  const securityCode = `#CC-${total}-${shortChecksum}`

  const payload = {
    id: orderId,
    ts: timestamp,
    name: customerName?.trim() || 'Guest',
    type: orderType || 'dine-in',
    items: compactItems,
    notes: cookingInstructions?.trim() || '',
    total,
    sig: signature,
  }

  const token = toBase64Url(JSON.stringify(payload))
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const receiptUrl = `${origin}/order?v=${token}`

  return {
    orderId,
    timestamp,
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
    const payload = JSON.parse(jsonStr)
    const { id, ts, name, type, items, notes, total, sig } = payload

    if (!id || !ts || !Array.isArray(items) || typeof total !== 'number' || !sig) {
      return { valid: false, order: null, error: 'Incomplete order payload structure.' }
    }

    // Verify calculated items total equals stated total
    const computedTotal = items.reduce((sum, item) => sum + (Number(item.p) || 0) * (Number(item.q) || 1), 0)
    if (computedTotal !== total) {
      return {
        valid: false,
        order: payload,
        error: `Price discrepancy detected! Stated total is ₹${total} but itemized total is ₹${computedTotal}.`,
      }
    }

    // Recalculate signature with internal secret salt
    const expectedSignature = computeSignature(id, total, items, ts)
    if (expectedSignature !== sig) {
      return {
        valid: false,
        order: payload,
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
