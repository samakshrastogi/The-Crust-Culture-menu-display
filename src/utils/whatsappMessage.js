/**
 * WhatsApp Order Message Formatter
 * Formats cart, customer details, and verified receipt link into a clean WhatsApp message.
 */

export function generateWhatsAppMessage({
  cart,
  cartCount,
  customerName,
  phoneStr,
  orderType,
  cookingInstructions,
  security,
  tableNumber,
}) {
  if (!cart || cart.length === 0) return ''

  const orderLine =
    orderType === 'dine-in'
      ? tableNumber
        ? `• *Order:* 🍽️ Dine-In (Table ${tableNumber})`
        : `• *Order:* 🍽️ Dine-In`
      : `• *Order:* 🛍️ Takeaway`

  const lines = [
    `🍕 *NEW ORDER - The Crust Culture*`,
    `*Order ID:* ${security.orderId}`,
    ``,
    `*CUSTOMER DETAILS*`,
    `• *Name:* ${customerName.trim()}`,
    `• *Phone:* +91 ${phoneStr}`,
    orderLine,
    ``,
    `*ITEMS ORDERED (${cartCount} ${cartCount === 1 ? 'item' : 'items'})*`,
    `----------------------------------`,
  ]

  cart.forEach((item, index) => {
    const sizeInfo = item.size ? ` (${item.size})` : ''
    lines.push(`${index + 1}. *${item.name}*${sizeInfo}  x${item.quantity}`)
  })

  if (cookingInstructions && cookingInstructions.trim()) {
    lines.push(`----------------------------------`)
    lines.push(``)
    lines.push(`*SPECIAL INSTRUCTIONS*`)
    lines.push(`"${cookingInstructions.trim()}"`)
  }

  lines.push(``)
  lines.push(`----------------------------------`)
  lines.push(`🧾 *VIEW OFFICIAL BILL & TICKET:*`)
  lines.push(`${security.receiptUrl}`)
  lines.push(`_(Kitchen: tap link to view verified total bill, genuine rates & print KOT)_`)
  lines.push(`----------------------------------`)
  lines.push(`_Sent via The Crust Culture Digital Menu_`)

  return lines.join('\n')
}
