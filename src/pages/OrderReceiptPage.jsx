import { useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiPrinter,
  FiArrowLeft,
  FiClock,
  FiUser,
  FiPhone,
  FiShield,
  FiFileText,
} from 'react-icons/fi'
import { verifyOrderToken } from '../utils/orderSecurity'
import { saveOrderToHistory } from '../utils/orderHistory'

export default function OrderReceiptPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('v') || ''

  const verificationResult = useMemo(() => {
    return verifyOrderToken(token)
  }, [token])

  const { valid, order, error } = verificationResult

  useEffect(() => {
    if (valid && order) {
      saveOrderToHistory({
        ...order,
        receiptUrl: window.location.href,
      })
    }
  }, [valid, order])

  const formattedDate = order?.timestamp
    ? new Date(order.timestamp).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : ''

  return (
    <div className="mx-auto max-w-md px-3 py-4 sm:py-6 pb-16">
      {/* Top Action Bar */}
      <div className="mb-3 flex items-center justify-between no-print">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--text)] transition hover:border-[var(--orange)]"
        >
          <FiArrowLeft className="text-xs" />
          <span>Menu</span>
        </Link>

        {valid && (
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--orange)] px-3.5 py-1 text-xs font-black text-white hover:brightness-110 transition cursor-pointer active:scale-95 shadow-xs"
          >
            <FiPrinter className="text-xs" />
            <span>Print KOT</span>
          </button>
        )}
      </div>

      {valid && order ? (
        /* COMPACT AUTHENTIC KOT / RECEIPT TICKET */
        <article className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-md transition-colors print:border-none print:shadow-none print:bg-white print:text-black">
          {/* Header Bar */}
          <div className="border-b border-[var(--line)] bg-gradient-to-r from-emerald-500/10 via-[var(--surface-strong)] to-[var(--surface-strong)]/40 px-3.5 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white text-[10px]">
                  <FiCheckCircle />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Verified Authentic KOT
                </span>
                <span className="rounded-full bg-emerald-600/15 border border-emerald-500/30 px-1.5 py-0.2 text-[8px] font-black text-emerald-700 dark:text-emerald-300">
                  Tamper-Proof
                </span>
              </div>

              <span className="font-mono text-xs font-black text-[var(--orange)]">
                {order.id}
              </span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 space-y-3.5">
            {/* Cafe Branding & Order Type */}
            <div className="text-center border-b border-dashed border-[var(--line)] pb-3">
              <h1 className="font-display text-base font-black tracking-tight text-[var(--text)]">
                The Crust Culture
              </h1>
              <p className="text-[10px] text-[var(--muted)] font-medium">
                Wood Fired Cafe • Kitchen Order Ticket
              </p>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/25 px-3 py-0.5 text-xs font-black text-[var(--orange)]">
                <span>{order.orderType === 'dine-in' ? '🍽️ DINE-IN ORDER' : '🥡 TAKEAWAY ORDER'}</span>
              </div>
            </div>

            {/* Customer & Timestamp Info Grid */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)]/60 p-2.5 text-[11px]">
              <div className="space-y-0.5">
                <span className="block text-[9px] font-black uppercase text-[var(--muted)]">Customer</span>
                <span className="font-extrabold text-[var(--text)] flex items-center gap-1 truncate">
                  <FiUser className="text-[10px] text-[var(--orange)] shrink-0" />
                  <span className="truncate">{order.customerName}</span>
                </span>
              </div>

              {order.customerPhone ? (
                <div className="space-y-0.5 text-right">
                  <span className="block text-[9px] font-black uppercase text-[var(--muted)]">Phone</span>
                  <a
                    href={`tel:+91${order.customerPhone}`}
                    className="font-extrabold text-[var(--orange)] hover:underline flex items-center justify-end gap-1"
                  >
                    <FiPhone className="text-[9px] shrink-0" />
                    <span>{order.customerPhone}</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-0.5 text-right">
                  <span className="block text-[9px] font-black uppercase text-[var(--muted)]">Order ID</span>
                  <span className="font-mono font-bold text-[var(--text)]">{order.id}</span>
                </div>
              )}

              <div className="space-y-0.5 pt-1 border-t border-[var(--line)]/50">
                <span className="block text-[9px] font-black uppercase text-[var(--muted)]">Placed At</span>
                <span className="font-medium text-[var(--text)] flex items-center gap-1">
                  <FiClock className="text-[9px] text-[var(--muted)] shrink-0" />
                  <span>{formattedDate}</span>
                </span>
              </div>

              <div className="space-y-0.5 text-right pt-1 border-t border-[var(--line)]/50">
                <span className="block text-[9px] font-black uppercase text-[var(--muted)]">Security Code</span>
                <span className="font-mono font-black text-[var(--text)]">{order.securityCode}</span>
              </div>
            </div>

            {/* Itemized Dish Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <caption className="sr-only">Itemized order details</caption>
                <thead>
                  <tr className="border-b border-[var(--line)] text-[9px] font-black uppercase tracking-wider text-[var(--muted)]">
                    <th scope="col" className="pb-1 font-black">Item &amp; Portion</th>
                    <th scope="col" className="pb-1 text-center w-8 font-black">Qty</th>
                    <th scope="col" className="pb-1 text-right w-12 font-black">Rate</th>
                    <th scope="col" className="pb-1 text-right w-14 font-black">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]/40">
                  {order.items.map((item, index) => {
                    const unitPrice = Number(item.p) || 0
                    const qty = Number(item.q) || 1
                    const rowTotal = unitPrice * qty

                    return (
                      <tr key={`${item.n}-${index}`}>
                        <td className="py-1.5 min-w-0 pr-1 leading-snug">
                          <span className="font-extrabold text-[var(--text)]">
                            {item.n}
                          </span>
                          {item.s && (
                            <span className="ml-1 text-[10px] text-[var(--muted)] font-medium">
                              ({item.s})
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 text-center font-black text-[var(--text)]">
                          x{qty}
                        </td>
                        <td className="py-1.5 text-right text-[var(--muted)] font-medium text-[11px]">
                          ₹{unitPrice}
                        </td>
                        <td className="py-1.5 text-right font-black text-[var(--text)]">
                          ₹{rowTotal}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Special Instructions */}
            {order.notes && (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-2 text-xs space-y-0.5">
                <div className="flex items-center gap-1 font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[9px]">
                  <FiFileText className="text-[10px]" />
                  <span>Chef Note</span>
                </div>
                <p className="italic text-[var(--text)] text-[11px]">&ldquo;{order.notes}&rdquo;</p>
              </div>
            )}

            {/* Billing Summary */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)]/60 p-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-[var(--muted)] text-[11px]">
                <span>Items Subtotal ({order.items.reduce((sum, i) => sum + (Number(i.q) || 1), 0)} items)</span>
                <span className="font-bold text-[var(--text)]">₹{order.total}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)] text-[11px]">
                <span>Packaging Charges</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0 Free</span>
              </div>
              <div className="border-t border-[var(--line)] pt-1.5 flex items-baseline justify-between">
                <span className="font-black text-xs text-[var(--text)] uppercase tracking-wider">
                  Verified Grand Total
                </span>
                <span className="text-lg font-black text-[var(--orange)]">
                  ₹{order.total}
                </span>
              </div>
            </div>

            {/* Footer Guarantee */}
            <div className="border-t border-dashed border-[var(--line)] pt-2.5 text-center text-[10px] text-[var(--muted)] space-y-0.5">
              <div className="flex items-center justify-center gap-1 font-black text-emerald-700 dark:text-emerald-400">
                <FiShield className="text-xs" />
                <span>Verified Kitchen Copy • Code: {order.securityCode}</span>
              </div>
              <p className="text-[9px] opacity-75">
                Genuine ticket generated directly from The Crust Culture web menu.
              </p>
            </div>
          </div>
        </article>
      ) : (
        /* TAMPERED OR INVALID ORDER WARNING */
        <article role="alert" className="rounded-2xl border-2 border-red-500/50 bg-[var(--surface)] p-5 text-center space-y-3">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-500/15 text-2xl text-red-600 dark:text-red-400">
            <FiAlertTriangle />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-black text-red-600 dark:text-red-400">
              ⚠️ Tampered or Invalid Order Ticket
            </h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              {error || 'This order link has an invalid cryptographic signature or the data was altered.'}
            </p>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-left text-red-800 dark:text-red-300 space-y-1">
            <p className="font-extrabold text-[11px]">Notice for Cafe Kitchen:</p>
            <p className="text-[10.5px] leading-relaxed">
              Do <strong>NOT</strong> accept payments based on modified WhatsApp text. Charge only verified menu rates.
            </p>
          </div>

          <div className="pt-1">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-5 py-2 text-xs font-black text-white shadow-sm hover:brightness-105"
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
