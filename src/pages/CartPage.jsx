import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiPhone,
  FiCheckCircle,
  FiShield,
  FiAlertCircle,
  FiUser,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import FoodImage from '../components/FoodImage'
import VegIndicator from '../components/VegIndicator'
import { useCart } from '../hooks/useCart'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { allMenuItems } from '../data/menuSections'
import { CAFE_INFO } from '../data/cafeInfo'
import { generateOrderSecurity } from '../utils/orderSecurity'
import { saveOrderToHistory } from '../utils/orderHistory'

const CAFE_PHONE = CAFE_INFO.phone.waNumber

function formatPrice(value) {
  return `₹${value}`
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartCount, cartTotal, addToCart, clearCart } = useCart()

  const [orderType, setOrderType] = useState('dine-in')
  const [customerName, setCustomerName] = useLocalStorage('crust-customer-name', '')
  const [customerPhone, setCustomerPhone] = useLocalStorage('crust-customer-phone', '')
  const [cookingInstructions, setCookingInstructions] = useState('')
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [orderSent, setOrderSent] = useState(false)
  const [recCategory, setRecCategory] = useState('all')

  // Quick suggestions if tray is empty or for extra add-ons
  const popularAddOns = useMemo(() => {
    const targetNames = [
      'Farmhouse Pizza',
      'Cheesy Corn Paneer',
      'Paneer Tikka Stuffed',
      'Cold Coffee with Ice Cream',
    ]
    return allMenuItems.filter((i) => targetNames.includes(i.name)).slice(0, 4)
  }, [])

  // Check meal combo components in the active cart
  const mealStatus = useMemo(() => {
    const titles = cart.map((ci) => (ci.sectionTitle || ci.name || '').toLowerCase())
    const hasPizza = titles.some((t) => t.includes('pizza'))
    const hasSide = titles.some(
      (t) =>
        t.includes('garlic') ||
        t.includes('bread') ||
        t.includes('parcel') ||
        t.includes('nugget') ||
        t.includes('side'),
    )
    const hasDrink = titles.some(
      (t) =>
        t.includes('drink') ||
        t.includes('coffee') ||
        t.includes('soda') ||
        t.includes('chai') ||
        t.includes('tea') ||
        t.includes('lassi'),
    )
    const hasDip = titles.some(
      (t) => t.includes('dip') || t.includes('topping') || t.includes('burst'),
    )
    return { hasPizza, hasSide, hasDrink, hasDip }
  }, [cart])

  // Catalog of categorized recommendation candidates with pairing badges
  const recommendationPool = useMemo(() => {
    const sideNames = [
      { name: 'Garlic Bread Stuffed', pairingBadge: 'Top Pizza Companion' },
      { name: 'Veggie Garlic Bread', pairingBadge: 'Cheesy Garlic' },
      { name: 'Veg Parcel', pairingBadge: 'Pocket Friendly' },
      { name: 'Paneer Tikka Stuffed', pairingBadge: 'Chef Signature' },
      { name: 'Indi Tandoori Parcel', pairingBadge: 'Desi Spice' },
    ]
    const drinkNames = [
      { name: 'Cold Coffee with Ice Cream', pairingBadge: 'Chilled Refresher' },
      { name: 'Lemon Soda', pairingBadge: 'Fizzy & Tangy' },
      { name: 'Cold Coffee', pairingBadge: 'Smooth Brew' },
      { name: 'Sweet Lassi', pairingBadge: 'Creamy Classic' },
      { name: 'Shikanji', pairingBadge: 'Desi Cooler' },
    ]
    const friesNames = [
      { name: 'Peri Peri Fries', pairingBadge: 'Crispy & Spicy' },
      { name: 'Cheese Loaded Fries', pairingBadge: 'Melted Mozzarella' },
      { name: 'Veg Nuggets', pairingBadge: 'Crunchy Starter' },
      { name: 'Veg Fried Momos', pairingBadge: 'Crisp Street Bite' },
    ]
    const dipNames = [
      { name: 'Extra Dip', pairingBadge: 'Creamy Garlic Mayo' },
      { name: 'Cheese Burst', pairingBadge: 'Molten Cheese Center' },
      { name: 'Oregano', pairingBadge: 'Herb Seasoning' },
      { name: 'Chilli Flakes', pairingBadge: 'Extra Spice Kick' },
    ]

    const mapToItems = (list) =>
      list
        .map(({ name, pairingBadge }) => {
          const item = allMenuItems.find((i) => i.name.toLowerCase() === name.toLowerCase())
          return item ? { ...item, pairingBadge } : null
        })
        .filter(Boolean)

    return {
      sides: mapToItems(sideNames),
      drinks: mapToItems(drinkNames),
      fries: mapToItems(friesNames),
      dips: mapToItems(dipNames),
    }
  }, [])

  // Dynamic recommendation selection based on active tab and cart state
  const displayedRecommendations = useMemo(() => {
    if (cart.length === 0) return []

    const { sides, drinks, fries, dips } = recommendationPool

    if (recCategory === 'sides') return sides.slice(0, 4)
    if (recCategory === 'drinks') return drinks.slice(0, 4)
    if (recCategory === 'fries') return fries.slice(0, 4)
    if (recCategory === 'dips') return dips.slice(0, 4)

    // 'all': Guarantee 1 Side, 1 Drink, 1 Fries, 1 Dip for maximum meal diversity
    const picks = []
    if (sides[0]) picks.push(sides[0])
    if (drinks[0]) picks.push(drinks[0])
    if (fries[0]) picks.push(fries[0])
    if (dips[0]) picks.push(dips[0])

    return picks
  }, [cart.length, recCategory, recommendationPool])

  const generateWhatsAppMessage = (sec, cleanPhone) => {
    if (cart.length === 0) return ''

    const security =
      sec ||
      generateOrderSecurity({
        cart,
        total: cartTotal,
        customerName,
        customerPhone: cleanPhone,
        orderType,
        cookingInstructions,
      })

    const phoneStr = cleanPhone || customerPhone.replace(/\D/g, '')

    const lines = [
      `🍕 *NEW ORDER - The Crust Culture*`,
      `*Order ID:* ${security.orderId}`,
      ``,
      `*CUSTOMER DETAILS*`,
      `• *Name:* ${customerName.trim()}`,
      `• *Phone:* +91 ${phoneStr}`,
      `• *Order:* ${orderType === 'dine-in' ? '🍽️ Dine-In' : '🛍️ Takeaway'}`,
      ``,
      `*ITEMS ORDERED (${cartCount} ${cartCount === 1 ? 'item' : 'items'})*`,
      `----------------------------------`,
    ]

    cart.forEach((item, index) => {
      const sizeInfo = item.size ? ` (${item.size})` : ''
      lines.push(`${index + 1}. *${item.name}*${sizeInfo}  x${item.quantity}`)
    })

    if (cookingInstructions.trim()) {
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

  const handleSendWhatsAppOrder = () => {
    let hasError = false
    if (!customerName?.trim()) {
      setNameError('Please enter your name')
      hasError = true
    } else {
      setNameError('')
    }

    const cleanPhone = customerPhone?.replace(/\D/g, '') || ''
    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number')
      hasError = true
    } else {
      setPhoneError('')
    }

    if (hasError) {
      const targetId = !customerName?.trim() ? 'customer-name' : 'customer-phone'
      document.getElementById(targetId)?.focus()
      return
    }

    const security = generateOrderSecurity({
      cart,
      total: cartTotal,
      customerName,
      customerPhone: cleanPhone,
      orderType,
      cookingInstructions,
    })

    // Automatically record to admin order history
    saveOrderToHistory({
      id: security.orderId,
      timestamp: security.timestamp,
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      orderType,
      items: cart,
      total: cartTotal,
      securityCode: security.securityCode,
      notes: cookingInstructions,
      receiptUrl: security.receiptUrl,
    })

    const text = generateWhatsAppMessage(security, cleanPhone)
    if (!text) return
    const url = `https://api.whatsapp.com/send?phone=${CAFE_PHONE}&text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    clearCart()
    setOrderSent(true)
  }

  return (
    <div className="mx-auto  px-3 py-4 pb-28 sm:px-6 sm:py-8">
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
                  My Cart
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
          </div>
        </div>
      </section>

      {/* Cart Content */}
      {cart.length === 0 ? (
        /* Empty Cart State or Order Sent Confirmation */
        <div className="space-y-6">
          {orderSent ? (
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center sm:p-10 backdrop-blur-xs">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500 text-white text-3xl shadow-lg shadow-emerald-500/30 mb-4">
                <FiCheckCircle />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-[var(--text)]">
                Order Sent on WhatsApp!
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                Your order has been forwarded to our kitchen. Your cart has been cleared. We look forward to serving you fresh wood-fired goodness!
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/menu"
                  onClick={() => setOrderSent(false)}
                  className="touch-target inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-orange-500/25 transition hover:scale-105 active:scale-95"
                >
                  <span>Explore Menu & Order More</span>
                  <FiArrowRight className="text-sm" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)]/50 p-8 text-center sm:p-12">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[var(--surface-strong)] text-3xl shadow-inner mb-4">
                🍕
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[var(--text)]">
                Your cart is hungry!
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
          )}

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

            {/* Enhanced Smart Recommendations (Occupies Left Empty Space) */}
            {displayedRecommendations.length > 0 && (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 sm:p-4 shadow-sm space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs shadow-xs">
                      ✨
                    </span>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-[var(--gold)]">
                        Frequently Ordered Together
                      </h3>
                      <p className="text-[11px] text-[var(--muted)]">
                        Complete your meal with our chef's top pairings
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--orange)]/10 px-2 py-0.5 text-[10px] font-black text-[var(--orange)] border border-[var(--orange)]/20">
                    Pairings
                  </span>
                </div>

                {/* Meal Combo Status Bar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-[var(--surface-strong)] border border-[var(--line)] text-[11px]">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[var(--gold)] shrink-0">
                    Meal Combo:
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-colors ${
                      mealStatus.hasPizza
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black'
                        : 'bg-stone-500/10 text-[var(--muted)] font-medium'
                    }`}
                  >
                    <span>🍕 Pizza</span>
                    <span>{mealStatus.hasPizza ? '✓' : '+'}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-colors ${
                      mealStatus.hasSide
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black'
                        : 'bg-stone-500/10 text-[var(--muted)] font-medium'
                    }`}
                  >
                    <span>🍞 Side</span>
                    <span>{mealStatus.hasSide ? '✓' : '+'}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-colors ${
                      mealStatus.hasDrink
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black'
                        : 'bg-stone-500/10 text-[var(--muted)] font-medium'
                    }`}
                  >
                    <span>🥤 Drink</span>
                    <span>{mealStatus.hasDrink ? '✓' : '+'}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-colors ${
                      mealStatus.hasDip
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black'
                        : 'bg-stone-500/10 text-[var(--muted)] font-medium'
                    }`}
                  >
                    <span>🧀 Dip</span>
                    <span>{mealStatus.hasDip ? '✓' : '+'}</span>
                  </span>
                </div>

                {/* Quick Category Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
                  {[
                    { id: 'all', label: 'All Combinations' },
                    { id: 'sides', label: '🍞 Sides' },
                    { id: 'drinks', label: '🥤 Drinks' },
                    { id: 'fries', label: '🍟 Fries' },
                    { id: 'dips', label: '🧀 Dips' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setRecCategory(tab.id)}
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold transition-all cursor-pointer ${
                        recCategory === tab.id
                          ? 'bg-[var(--orange)] text-white shadow-xs'
                          : 'bg-[var(--surface-strong)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Recommendations 2x2 Grid with In-Card Steppers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {displayedRecommendations.map((recItem) => {
                    const priceVal = recItem.prices?.[0]?.value || '0'
                    const inCartItem = cart.find(
                      (ci) => ci.name?.toLowerCase().trim() === recItem.name?.toLowerCase().trim(),
                    )

                    return (
                      <div
                        key={recItem.id || recItem.name}
                        className="group flex items-center justify-between gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-2 transition-all hover:border-[var(--orange)]/60 hover:shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[var(--line)] bg-stone-900">
                            <FoodImage
                              src={recItem.image || recItem.sectionImage}
                              alt={recItem.name}
                              category="Pizza"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-0.5 left-0.5 scale-75 origin-top-left">
                              <VegIndicator veg={recItem.veg ?? true} />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[var(--text)] truncate group-hover:text-[var(--orange)]">
                              {recItem.name}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] mt-0.5">
                              <span className="font-black text-[var(--orange)]">
                                {formatPrice(priceVal)}
                              </span>
                              {recItem.pairingBadge && (
                                <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[9.5px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20 truncate">
                                  {recItem.pairingBadge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Interactive In-Card Stepper / Add Button */}
                        {inCartItem ? (
                          <div className="shrink-0 flex items-center rounded-lg border border-[#ea580c] bg-orange-50/80 dark:bg-orange-950/40 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(inCartItem.cartItemId, -1)}
                              className="grid h-6 w-6 place-items-center rounded text-xs font-black text-[#ea580c] hover:bg-[#ea580c] hover:text-white transition active:scale-90 cursor-pointer"
                              aria-label={`Decrease ${recItem.name} quantity`}
                            >
                              <FiMinus className="text-[10px]" />
                            </button>
                            <span className="w-5 text-center text-xs font-black text-[#ea580c]">
                              {inCartItem.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(inCartItem.cartItemId, 1)}
                              className="grid h-6 w-6 place-items-center rounded text-xs font-black text-[#ea580c] hover:bg-[#ea580c] hover:text-white transition active:scale-90 cursor-pointer"
                              aria-label={`Increase ${recItem.name} quantity`}
                            >
                              <FiPlus className="text-[10px]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCart(recItem, 0, 1)}
                            className="touch-target shrink-0 inline-flex items-center gap-1 rounded-lg bg-[var(--orange)] px-2.5 py-1.5 text-xs font-black text-white shadow-xs transition hover:brightness-110 active:scale-95 cursor-pointer"
                            title={`Add ${recItem.name} to cart`}
                            aria-label={`Add ${recItem.name} to cart`}
                          >
                            <FiPlus className="text-xs stroke-[3]" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
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

              {/* Customer Name (Required) */}
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="customer-name" className="block text-[11px] font-bold text-[var(--text)]">
                    Your Name <span className="text-[var(--orange)]">*</span>
                  </label>
                  {nameError && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                      <FiAlertCircle className="text-[11px]" />
                      {nameError}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-xs" />
                  <input
                    id="customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value)
                      if (e.target.value.trim()) setNameError('')
                    }}
                    placeholder="Enter your name"
                    className={`w-full rounded-xl border bg-[var(--surface-strong)] pl-8 pr-3 py-2 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none transition ${
                      nameError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[var(--line)] focus:border-[var(--orange)]'
                    }`}
                  />
                </div>
              </div>

              {/* Customer Phone Number (Required) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="customer-phone" className="block text-[11px] font-bold text-[var(--text)]">
                    Mobile Number <span className="text-[var(--orange)]">*</span>
                  </label>
                  {phoneError && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                      <FiAlertCircle className="text-[11px]" />
                      {phoneError}
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-[var(--muted)] select-none">
                    +91
                  </span>
                  <input
                    id="customer-phone"
                    type="tel"
                    maxLength={10}
                    required
                    value={customerPhone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setCustomerPhone(clean)
                      if (clean.length === 10) setPhoneError('')
                    }}
                    placeholder="10-digit mobile number"
                    className={`w-full rounded-xl border bg-[var(--surface-strong)] pl-11 pr-3 py-2 text-xs text-[var(--text)] placeholder-[var(--muted)] outline-none transition font-medium tracking-wide ${
                      phoneError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[var(--line)] focus:border-[var(--orange)]'
                    }`}
                  />
                </div>
                <p className="text-[9.5px] text-[var(--muted)]">
                  Saved on this device for one-tap reorders
                </p>
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

              {/* Tamper-proof Security Note */}
              <div className="flex items-center justify-center gap-1.5 pt-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <FiShield className="text-xs shrink-0" />
                <span>Tamper-proof verified kitchen ticket included</span>
              </div>

              {/* Direct Phone Support */}
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[var(--muted)]">
                <span>Need quick help?</span>
                <a
                  href={CAFE_INFO.phone.tel}
                  className="inline-flex items-center gap-1 font-bold text-[var(--orange)] hover:underline"
                >
                  <FiPhone className="text-xs" />
                  <span>Call {CAFE_INFO.phone.display}</span>
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
