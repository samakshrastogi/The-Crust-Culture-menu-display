/**
 * Centralized Price & Phone Utility
 * Provides standard price parsing, formatting, note extraction, and phone cleaning.
 */

/**
 * Parses numeric price from any value or price string (e.g. 149, "149", "49 (Packaging Fee 10 Rs)")
 * @param {string|number} value
 * @returns {number}
 */
export function parseNumericPrice(value) {
  if (typeof value === 'number') return Math.round(value)
  const match = String(value || '').match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Separates base price and packaging/portion note
 * @param {string|number} value
 * @returns {{ price: string, note: string }}
 */
export function parsePriceParts(value) {
  if (!value) return { price: '', note: '' }
  const str = String(value).trim()
  const match = str.match(/^(\d+)\s*\((.*?)\)$/i)
  if (match) {
    return { price: `₹${match[1]}`, note: match[2] }
  }
  if (/rs/i.test(str)) {
    return { price: str, note: '' }
  }
  return { price: `₹${str}`, note: '' }
}

/**
 * Formats a price value with rupee symbol and optional note
 * @param {string|number} value
 * @returns {string}
 */
export function formatPrice(value) {
  const { price, note } = parsePriceParts(value)
  return note ? `${price} (${note})` : price
}

/**
 * Calculates the minimum available price for a menu item
 * @param {Object} item - Menu item object with prices array
 * @returns {number}
 */
export function getItemMinPrice(item) {
  if (!item?.prices?.length) return 0
  const numbers = item.prices
    .map((p) => parseNumericPrice(typeof p === 'object' && p !== null ? p.value : p))
    .filter((v) => v > 0)
  return numbers.length ? Math.min(...numbers) : 0
}

/**
 * Maps size code ('S', 'M', 'L') to descriptive label
 * @param {string} label
 * @param {boolean} isPizza
 * @returns {string}
 */
export function getSizeSubLabel(label, isPizza = false) {
  const clean = String(label || '').toUpperCase().trim()
  if (clean === 'S') return isPizza ? '7" Regular' : 'Small'
  if (clean === 'M') return isPizza ? '10" Medium' : 'Medium'
  if (clean === 'L') return isPizza ? '12" Large' : 'Large'
  if (clean === 'H') return 'Half'
  if (clean === 'F') return 'Full'
  return clean || 'Standard'
}

/**
 * Strips non-digit characters and normalizes Indian mobile numbers (removing +91 or 0 prefixes)
 * @param {string} phone
 * @returns {string} 10-digit clean mobile number string
 */
export function cleanPhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2)
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1)
  }
  return digits
}
