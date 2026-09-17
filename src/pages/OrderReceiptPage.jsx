import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiPrinter,
  FiArrowLeft,
  FiClock,
  FiUser,
  FiShield,
  FiFileText,
} from 'react-icons/fi'
import { verifyOrderToken } from '../utils/orderSecurity'

export default function OrderReceiptPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('v') || ''

  const verificationResult = useMemo(() => {
    return verifyOrderToken(token)
  }, [token])

  const { valid, order, error } = verificationResult

  const formattedDate = order?.timestamp
    ? new Date(order.timestamp).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : ''

  return (
    <div className="mx-auto max-w-2xl px-3 py-6 sm:px-6 sm:py-10">
      {/* Top Navigation */}
      <div className="mb-4 flex items-center justify-between no-print">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text)] transition hover:border-[var(--orange)]"
        >
          <FiArrowLeft className="text-xs" />
          <span>Back to Menu</span>
        </Link>

        {valid && (
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-3.5 py-1.5 text-xs font-black text-[var(--text)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition cursor-pointer active:scale-95 shadow-2xs"
          >
            <FiPrinter className="text-xs" />
            <span>Print KOT / Ticket</span>
          </button>
        )}
      </div>

      {valid && order ? (
        /* VALID VERIFIED KOT / RECEIPT */
        <article className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-lg transition-colors print:border-none print:shadow-none print:bg-white print:text-black">
          {/* Official Verification Header */}
          <div className="border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                  <FiCheckCircle className="text-xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Verified Authentic Order
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-black text-emerald-700 dark:text-emerald-300">
                      <FiShield className="text-[9px]" />
                      Tamper-Proof
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] font-medium">
                    Cryptographically generated direct from The Crust Culture web menu
                  </p>
                </div>
              </div>

              {/* Order ID Badge */}
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Order ID</span>
                <div className="font-mono text-base sm:text-lg font-black text-[var(--orange)]">{order.id}</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-5">
            {/* Cafe & Order Meta Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4 text-xs">
              <div className="space-y-1">
                <h1 className="font-display text-base sm:text-lg font-black text-[var(--text)]">
                  The Crust Culture
                </h1>
                <p className="text-[11px] text-[var(--muted)]">Wood Fired Cafe • Kitchen Order Ticket</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-right">
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1.5">
                  <span className="block text-[9px] font-bold uppercase text-[var(--muted)]">Order Type</span>
                  <span className="font-black text-[var(--text)] uppercase tracking-wider">
                    {order.orderType === 'dine-in' ? '🍽️ Dine-In' : '🛍️ Takeaway'}
                  </span>
                </div>

                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1.5">
                  <span className="block text-[9px] font-bold uppercase text-[var(--muted)]">Customer</span>
                  <span className="font-black text-[var(--text)] flex items-center gap-1">
                    <FiUser className="text-[10px] text-[var(--orange)]" />
                    {order.customerName}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamp & Anti-Tamper Security Code */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-3 text-xs">
              <div className="flex items-center gap-1.5 text-[var(--muted)] font-medium">
                <FiClock className="text-xs text-[var(--orange)]" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  Security Code:
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-[var(--text)] bg-[var(--surface)] px-2.5 py-0.5 rounded-lg border border-[var(--line)]">
                  {order.securityCode}
                </span>
              </div>
            </div>

            {/* Itemized Dish List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2 text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
                <span>Item & Portion</span>
                <div className="flex items-center gap-6">
                  <span className="w-10 text-center">Qty</span>
                  <span className="w-16 text-right">Unit Price</span>
                  <span className="w-16 text-right">Total</span>
                </div>
              </div>

              <div className="divide-y divide-[var(--line)]/50">
                {order.items.map((item, index) => {
                  const unitPrice = Number(item.p) || 0
                  const qty = Number(item.q) || 1
                  const rowTotal = unitPrice * qty

                  return (
                    <div key={`${item.id || item.n}-${index}`} className="flex items-center justify-between py-2.5 text-xs">
                      <div className="min-w-0 pr-2">
                        <p className="font-extrabold text-[var(--text)] leading-snug">
                          {item.n}
                        </p>
                        {item.s && (
                          <span className="inline-block rounded bg-[var(--surface-strong)] px-1.5 py-0.2 text-[9px] font-bold text-[var(--muted)] border border-[var(--line)]">
                            {item.s}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <span className="w-10 text-center font-black text-[var(--text)]">
                          x{qty}
                        </span>
                        <span className="w-16 text-right text-[var(--muted)] font-semibold">
                          ₹{unitPrice}
                        </span>
                        <span className="w-16 text-right font-black text-[var(--text)]">
                          ₹{rowTotal}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Cooking Notes */}
            {order.notes && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs space-y-0.5">
                <div className="flex items-center gap-1.5 font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[10px]">
                  <FiFileText className="text-xs" />
                  <span>Special Kitchen Instructions</span>
                </div>
                <p className="italic text-[var(--text)]">&ldquo;{order.notes}&rdquo;</p>
              </div>
            )}

            {/* Billing Summary */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-3.5 sm:p-4 space-y-2">
              <div className="flex justify-between text-xs text-[var(--muted)]">
                <span>Subtotal ({order.items.reduce((sum, i) => sum + (Number(i.q) || 1), 0)} items)</span>
                <span className="font-bold text-[var(--text)]">₹{order.total}</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--muted)]">
                <span>Packaging Charges</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0 Free</span>
              </div>
              <div className="border-t border-[var(--line)] pt-2.5 flex items-baseline justify-between">
                <span className="text-sm font-extrabold text-[var(--text)]">Verified Grand Total</span>
                <span className="text-2xl font-black text-[var(--orange)]">₹{order.total}</span>
              </div>
            </div>

            {/* Verification Guarantee Footer */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs text-emerald-800 dark:text-emerald-300 font-medium space-y-0.5">
              <p className="font-bold">
                🔒 Official Cafe Kitchen Verification: <span className="font-mono font-black">{order.securityCode}</span>
              </p>
              <p className="text-[10.5px] opacity-80">
                This digital ticket is genuine and cannot be modified. Charge only the verified amount shown above.
              </p>
            </div>
          </div>
        </article>
      ) : (
        /* TAMPERED OR INVALID ORDER WARNING */
        <article className="rounded-3xl border-2 border-red-500/50 bg-[var(--surface)] p-6 sm:p-8 shadow-xl text-center space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-500/15 text-3xl text-red-600 dark:text-red-400">
            <FiAlertTriangle />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-black text-red-600 dark:text-red-400">
              ⚠️ Tampered or Invalid Order Ticket
            </h2>
            <p className="text-xs text-[var(--muted)] max-w-md mx-auto leading-relaxed">
              {error || 'This order link has an invalid cryptographic signature or the prices have been manually modified in WhatsApp.'}
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-left text-red-800 dark:text-red-300 space-y-1">
            <p className="font-extrabold">🚨 Safety Notice for Cafe Kitchen:</p>
            <p className="text-[11px] leading-relaxed">
              Do <strong>NOT</strong> accept payments based on the text message. The customer may have manually changed the prices or items in their WhatsApp chat box before sending. Please verify items against the official cafe menu.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-6 py-2.5 text-xs font-black text-white shadow-md transition hover:brightness-105"
            >
              <FiArrowLeft className="text-xs" />
              <span>Go to Official Menu</span>
            </Link>
          </div>
        </article>
      )}
    </div>
  )
}
