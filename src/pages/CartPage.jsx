import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiPhone,
  FiCheckCircle,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import FoodImage from '../components/FoodImage'
import VegIndicator from '../components/VegIndicator'
import { useCart } from '../hooks/useCart'
import { menuSections } from '../data/menuSections'

const CAFE_PHONE = '919625261591'

function formatPrice(value) {
  return `₹${value}`
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal, addToCart } = useCart()
  const [searchParams] = useSearchParams()

  const defaultTable = searchParams.get('table') || ''
  const [orderType, setOrderType] = useState(defaultTable ? 'dine-in' : 'dine-in')
  const [tableNumber, setTableNumber] = useState(defaultTable)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [cookingInstructions, setCookingInstructions] = useState('')

  // Quick suggestions if tray is empty or for extra add-ons
  const popularAddOns = useMemo(() => {
    const targetNames = [
      'Farmhouse Pizza',
      'Cheesy Corn Paneer',
      'Paneer Tikka Stuffed',
      'Cold Coffee with Ice Cream',
    ]
    const all = menuSections.flatMap((s) =>
      s.items.map((item) => ({
        ...item,
        sectionId: s.id,
        sectionTitle: s.title,
        sectionImage: s.image,
      })),
    )
    return all.filter((i) => targetNames.includes(i.name)).slice(0, 4)
  }, [])

  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return ''

    let message = `🍕 *THE CRUST CULTURE — NEW ORDER* 🍕\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    message += `📋 *Items Ordered:*\n`

    cart.forEach((item) => {
      const sizeStr = item.size ? ` (${item.size})` : ''
      const lineTotal = item.price * item.quantity
      message += `• ${item.quantity}x ${item.name}${sizeStr} — ₹${lineTotal}\n`
    })

    message += `\n💰 *Grand Total: ₹${cartTotal}*\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`

    if (orderType === 'dine-in') {
      message += `🍽️ *Order Type:* Dine-In${tableNumber ? ` (Table ${tableNumber})` : ''}\n`
    } else {
      message += `🥡 *Order Type:* Takeaway / Pickup\n`
    }

    if (customerName.trim()) {
      message += `👤 *Customer Name:* ${customerName.trim()}\n`
    }
    if (customerPhone.trim()) {
      message += `📞 *Phone:* ${customerPhone.trim()}\n`
    }
    if (cookingInstructions.trim()) {
      message += `💬 *Cooking Notes:* ${cookingInstructions.trim()}\n`
    }

    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    message += `_Sent via The Crust Culture Digital Menu_`

    return message
  }

  const handleSendWhatsAppOrder = () => {
    const text = generateWhatsAppMessage()
    if (!text) return
    const url = `https://wa.me/${CAFE_PHONE}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 pb-28 sm:px-6 sm:py-8">
      {/* Header Banner */}
      <section className="mb-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6 shadow-sm transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[var(--orange)] to-amber-500 text-white shadow-md shadow-orange-500/20">
              <FiShoppingBag className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-[var(--text)]">
                  My Order Tray
                </h1>
                <span className="rounded-full bg-[var(--orange)]/10 px-2.5 py-0.5 text-xs font-black text-[var(--orange)] border border-[var(--orange)]/20">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                Review your items and send your order straight to our kitchen on WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/menu"
              className="touch-target inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-3.5 py-2 text-xs font-bold text-[var(--text)] transition hover:border-[var(--orange)] hover:text-[var(--orange)]"
            >
              <span>+ Add More</span>
            </Link>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="touch-target inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 transition hover:bg-red-500/20 active:scale-95 cursor-pointer"
                title="Clear all items in tray"
              >
                <FiTrash2 className="text-xs" />
                <span>Clear Tray</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Cart Content */}
      {cart.length === 0 ? (
        /* Empty Tray State */
        <div className="space-y-6">
          <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)]/50 p-8 text-center sm:p-12">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[var(--surface-strong)] text-3xl shadow-inner mb-4">
              🍕
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[var(--text)]">
              Your tray is hungry!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Explore our wood-fired sourdough pizzas, hot stuffed garlic breads, and chilled cafe beverages.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/menu"
                className="touch-target inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-orange-500/25 transition hover:scale-105 active:scale-95"
              >
                <span>Explore Digital Menu</span>
                <FiArrowRight className="text-sm" />
              </Link>
            </div>
          </div>

          {/* Popular Suggestions */}
          {popularAddOns.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--gold)]">
                ★ Highly Recommended by Chef
              </h3>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3.5">
                {popularAddOns.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2.5 shadow-2xs transition-all hover:border-[var(--gold)]/60 hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-900 mb-2">
                      <FoodImage
                        src={item.image || item.sectionImage}
                        alt={item.name}
                        category="Pizza"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <VegIndicator veg={item.veg} />
                        <h4 className="text-xs font-extrabold text-[var(--text)] line-clamp-1 group-hover:text-[var(--orange)]">
                          {item.name}
                        </h4>
                      </div>
                      <span className="text-xs font-black text-[var(--orange)]">
                        {item.prices?.[0]?.value ? `₹${item.prices[0].value}` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(item, 0, 1)}
                      className="touch-target mt-2 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-[var(--surface-strong)] py-1.5 text-xs font-black text-[var(--orange)] border border-[var(--line)] transition hover:bg-[var(--orange)] hover:text-white active:scale-95 cursor-pointer"
                    >
                      <FiPlus className="text-xs" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Active Cart View */
        <div className="grid gap-5 lg:grid-cols-12 items-start">
          {/* Left Column: Items List */}
          <div className="space-y-3 lg:col-span-7">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4 shadow-sm divide-y divide-[var(--line)]/50">
              {cart.map((item) => {
                const itemTotal = item.price * item.quantity
                return (
                  <div key={item.cartItemId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    {/* Thumbnail */}
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] bg-stone-900">
                      <FoodImage
                        src={item.image}
                        alt={item.name}
                        category="Pizza"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-1 left-1">
                        <VegIndicator veg={item.veg} />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h3 className="text-xs sm:text-sm font-extrabold text-[var(--text)] truncate">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.size && (
                          <span className="rounded bg-[var(--surface-strong)] px-1.5 py-0.2 text-[10px] font-bold text-[var(--gold)] border border-[var(--line)]">
                            {item.size}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-[var(--muted)]">
                          {formatPrice(item.price)} each
                        </span>
                      </div>
                      <div className="text-xs font-black text-[var(--orange)]">
                        {formatPrice(itemTotal)}
                      </div>
                    </div>

                    {/* Quantity Stepper & Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-0.5 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="grid h-7 w-7 place-items-center rounded-lg text-xs text-[var(--text)] transition hover:bg-[var(--line)] active:scale-90 cursor-pointer"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <FiMinus className="text-[11px]" />
                        </button>
                        <span className="w-7 text-center text-xs font-black text-[var(--text)]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="grid h-7 w-7 place-items-center rounded-lg text-xs text-[var(--text)] transition hover:bg-[var(--line)] active:scale-90 cursor-pointer"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <FiPlus className="text-[11px]" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-[var(--muted)] hover:text-red-500 transition cursor-pointer"
                        title="Remove item"
                        aria-label={`Remove ${item.name}`}
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Special Instructions */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 sm:p-4 shadow-sm">
              <label htmlFor="cooking-notes" className="block text-xs font-black uppercase tracking-wider text-[var(--gold)] mb-1.5">
                💬 Cooking / Packaging Notes
              </label>
              <input
                id="cooking-notes"
                type="text"
                value={cookingInstructions}
                onChange={(e) => setCookingInstructions(e.target.value)}
                placeholder="e.g. Extra crisp crust, less spicy, send extra ketchup"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--orange)] transition"
              />
            </div>
          </div>

          {/* Right Column: Order Details & WhatsApp Action */}
          <div className="space-y-3.5 lg:col-span-5">
            {/* Order Type & Diner Info Card */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 sm:p-4 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--gold)]">
                Select Order Type
              </span>

              {/* Order Type Selector */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dine-in', label: '🍽️ Dine-In' },
                  { id: 'takeaway', label: '🥡 Takeaway' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setOrderType(t.id)}
                    className={`rounded-xl py-2 px-1 text-center text-xs font-bold border transition-all cursor-pointer ${
                      orderType === t.id
                        ? 'border-[var(--orange)] bg-[var(--orange)]/10 text-[var(--orange)] ring-1 ring-[var(--orange)]/50'
                        : 'border-[var(--line)] bg-[var(--surface-strong)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Inputs Based on Order Type */}
              {orderType === 'dine-in' && (
                <div className="space-y-1 pt-1">
                  <label htmlFor="table-number" className="block text-[11px] font-bold text-[var(--muted)]">
                    Table Number (Optional)
                  </label>
                  <input
                    id="table-number"
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 3 or Counter"
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--orange)] transition"
                  />
                </div>
              )}

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div className="space-y-1">
                  <label htmlFor="customer-name" className="block text-[11px] font-bold text-[var(--muted)]">
                    Name (Optional)
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-2 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--orange)] transition"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="customer-phone" className="block text-[11px] font-bold text-[var(--muted)]">
                    Phone (Optional)
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-2 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--orange)] transition"
                  />
                </div>
              </div>
            </div>

            {/* Bill Breakdown Card */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 sm:p-4 shadow-sm space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--gold)]">
                Bill Breakdown
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[var(--muted)]">
                  <span>Item Subtotal ({cartCount} items)</span>
                  <span className="font-bold text-[var(--text)]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[var(--muted)]">
                  <span>Taxes & Kitchen Service</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Included</span>
                </div>
                <div className="flex justify-between text-[var(--muted)]">
                  <span>Packaging Charges</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0 Free</span>
                </div>
                <div className="pt-2 border-t border-[var(--line)] flex justify-between items-baseline">
                  <span className="font-extrabold text-sm text-[var(--text)]">Grand Total</span>
                  <span className="text-xl sm:text-2xl font-black text-[var(--orange)]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Primary Action Button: Send Order on WhatsApp */}
              <button
                type="button"
                onClick={handleSendWhatsAppOrder}
                className="touch-target group relative mt-2 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] px-4 py-3.5 text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] border border-white/20 cursor-pointer"
              >
                <FaWhatsapp className="text-xl shrink-0" />
                <div className="text-left">
                  <div className="text-sm sm:text-base font-black tracking-wide leading-none">
                    Send Order on WhatsApp
                  </div>
                  <div className="text-[10px] text-emerald-100 font-medium mt-0.5">
                    Direct confirmation with cafe kitchen • Zero commission
                  </div>
                </div>
              </button>

              {/* Direct Phone Support */}
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[var(--muted)]">
                <span>Need quick help?</span>
                <a
                  href="tel:+919625261591"
                  className="inline-flex items-center gap-1 font-bold text-[var(--orange)] hover:underline"
                >
                  <FiPhone className="text-xs" />
                  <span>Call 96252 61591</span>
                </a>
              </div>
            </div>

            {/* Cafe Assurance Strip */}
            <div className="flex items-center justify-around rounded-xl border border-[var(--line)]/50 bg-[var(--surface-strong)]/30 py-2 px-2 text-[10px] font-bold text-[var(--muted)] text-center">
              <span className="flex items-center gap-1">
                <FiCheckCircle className="text-emerald-500" />
                100% Pure Veg
              </span>
              <span>•</span>
              <span>Stone Oven Baked</span>
              <span>•</span>
              <span>Baked Fresh in 15m</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
