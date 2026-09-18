import { memo } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPhone,
  FiCopy,
  FiCheck,
  FiClock,
  FiShield,
  FiFileText,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import { cleanPhone } from '../utils/priceUtils'

export default memo(function AdminOrderCard({ order, copiedId, onCopyLink }) {
  const dateStr = order.timestamp
    ? new Date(order.timestamp).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : ''

  const phoneDigits = cleanPhone(order.customerPhone)
  const isDineIn = order.orderType === 'dine-in'
  const isCopied = copiedId === order.id

  const ticketHref = order.receiptUrl
    ? order.receiptUrl.includes('/order?v=')
      ? `/order?v=${order.receiptUrl.split('?v=')[1]}`
      : order.receiptUrl
    : null

  return (
    <div
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2.5 sm:p-3.5 shadow-2xs transition-all hover:border-[var(--orange)]/60 hover:shadow-sm border-l-4 ${
        isDineIn ? 'border-l-amber-500' : 'border-l-emerald-500'
      }`}
    >
      {/* Mobile Layout (< md) */}
      <div className="md:hidden space-y-1.5">
        {/* Row 1: ID, Type, Price, Actions */}
        <div className="flex items-center justify-between gap-1 border-b border-[var(--line)]/50 pb-1.5">
          <div className="flex items-center gap-1">
            <span className="font-mono text-[11px] font-black text-[var(--orange)] bg-orange-500/10 px-1.5 py-0.2 rounded border border-orange-500/20">
              #{order.id}
            </span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[8.5px] font-bold border ${
                isDineIn
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
              }`}
            >
              {isDineIn ? '🍽️ Dine' : '🥡 Take'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-[var(--orange)]">₹{order.total}</span>
            <button
              type="button"
              onClick={() => onCopyLink(order)}
              className="inline-flex items-center gap-0.5 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-0.5 text-[9.5px] font-bold text-[var(--text)] hover:border-[var(--orange)] active:scale-95 cursor-pointer"
            >
              {isCopied ? <FiCheck className="text-emerald-500 text-[9px]" /> : <FiCopy className="text-[9px]" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
            {ticketHref && (
              <Link
                to={ticketHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-2 py-0.5 text-[9.5px] font-black text-white hover:brightness-110 active:scale-95"
              >
                <span>Ticket</span>
              </Link>
            )}
          </div>
        </div>

        {/* Row 2: Customer Name, Phone & Quick Actions */}
        <div className="flex items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-[var(--text)] text-xs">{order.customerName || 'Guest'}</span>
            {phoneDigits && <span className="text-[var(--muted)] text-[10.5px] font-medium">+91 {phoneDigits}</span>}
          </div>

          {phoneDigits && (
            <div className="flex items-center gap-1 shrink-0">
              <a
                href={`tel:+91${phoneDigits}`}
                className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.2 text-[8.5px] font-bold text-emerald-700 dark:text-emerald-300"
                title="Call Customer"
              >
                <FiPhone className="text-[8px]" />
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/91${phoneDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.2 text-[8.5px] font-bold text-emerald-700 dark:text-emerald-300"
                title="Message on WhatsApp"
              >
                <FaWhatsapp className="text-[8px]" />
                <span>WhatsApp</span>
              </a>
            </div>
          )}
        </div>

        {/* Row 3: Items Pills */}
        {order.items && order.items.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {order.items.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-strong)] px-1.5 py-0.5 text-[9.5px] font-medium text-[var(--text)] border border-[var(--line)]"
              >
                <span className="rounded bg-orange-500/15 px-1 py-0.1 text-[8.5px] font-black text-[var(--orange)]">
                  {item.quantity || 1}x
                </span>
                <span className="font-bold">{item.name}</span>
                {item.size && <span className="text-[8px] text-[var(--muted)]">({item.size})</span>}
              </span>
            ))}
          </div>
        )}

        {/* Row 4: Timestamp & Security Code */}
        <div className="flex items-center justify-between text-[9px] text-[var(--muted)] pt-0.5">
          <span className="flex items-center gap-1">
            <FiClock className="text-[8.5px]" />
            {dateStr}
          </span>
          {order.securityCode && (
            <span className="font-mono text-[8.5px] text-emerald-600 dark:text-emerald-400 font-bold">
              {order.securityCode}
            </span>
          )}
        </div>

        {order.notes && (
          <div className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9.5px] text-amber-800 dark:text-amber-300 italic">
            📝 &ldquo;{order.notes}&rdquo;
          </div>
        )}
      </div>

      {/* Desktop 12-Col Layout (md & above) */}
      <div className="hidden md:grid md:grid-cols-12 gap-3 items-start">
        {/* Column 1: Order & Diner Info */}
        <div className="md:col-span-4 space-y-1.5 border-b md:border-b-0 md:border-r border-[var(--line)]/50 pb-2.5 md:pb-0 md:pr-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-xs font-black text-[var(--orange)] bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">
              #{order.id}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold border ${
                isDineIn
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
              }`}
            >
              {isDineIn ? '🍽️ Dine-In' : '🥡 Takeaway'}
            </span>
          </div>

          <div className="space-y-0.5 pt-0.5">
            <h3 className="font-extrabold text-[var(--text)] text-sm">{order.customerName || 'Guest'}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {phoneDigits ? (
                <>
                  <span className="font-medium text-xs text-[var(--muted)]">+91 {phoneDigits}</span>
                  <div className="flex items-center gap-1">
                    <a
                      href={`tel:+91${phoneDigits}`}
                      className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition"
                      title="Call Customer"
                    >
                      <FiPhone className="text-[8.5px]" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/91${phoneDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition"
                      title="Message on WhatsApp"
                    >
                      <FaWhatsapp className="text-[8.5px]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </>
              ) : (
                <span className="text-[9.5px] italic text-[var(--muted)]">No phone provided</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] pt-0.5">
            <FiClock className="text-[10px] text-[var(--muted)]" />
            <span>{dateStr}</span>
            {order.securityCode && (
              <span className="inline-flex items-center gap-0.5 font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-bold ml-auto">
                <FiShield className="text-[8px]" />
                {order.securityCode}
              </span>
            )}
          </div>
        </div>

        {/* Column 2: Items & Cooking Notes */}
        <div className="md:col-span-5 space-y-2 border-b md:border-b-0 md:border-r border-[var(--line)]/50 pb-2.5 md:pb-0 md:pr-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
              Ordered Items ({order.items?.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0) || 0})
            </span>
          </div>

          {order.items && order.items.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {order.items.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-strong)] px-2 py-1 text-[11px] font-medium text-[var(--text)] border border-[var(--line)] shadow-2xs"
                >
                  <span className="rounded bg-orange-500/15 px-1 py-0.2 text-[9.5px] font-black text-[var(--orange)]">
                    {item.quantity || 1}x
                  </span>
                  <span className="font-bold">{item.name}</span>
                  {item.size && <span className="text-[9px] text-[var(--muted)]">({item.size})</span>}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[var(--muted)] italic">Items details in verified receipt</p>
          )}

          {order.notes && (
            <div className="flex items-start gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 px-2 py-1.5 text-[10.5px] text-amber-800 dark:text-amber-300">
              <span className="shrink-0 font-bold">📝 Note:</span>
              <span className="italic font-medium">&ldquo;{order.notes}&rdquo;</span>
            </div>
          )}
        </div>

        {/* Column 3: Amount & Action Buttons */}
        <div className="md:col-span-3 flex flex-col justify-between h-full space-y-2.5 text-left md:text-right md:pl-1">
          <div>
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider block">
              Grand Total
            </span>
            <span className="text-xl sm:text-2xl font-black text-[var(--orange)] tracking-tight block">
              ₹{order.total}
            </span>
          </div>

          <div className="flex items-center md:justify-end gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => onCopyLink(order)}
              className="inline-flex items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-1 text-[10.5px] font-bold text-[var(--text)] hover:border-[var(--orange)] transition cursor-pointer shadow-2xs"
              title="Copy Order Link"
            >
              {isCopied ? (
                <>
                  <FiCheck className="text-emerald-500 text-xs" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <FiCopy className="text-xs" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {ticketHref && (
              <Link
                to={ticketHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-3 py-1 text-[10.5px] font-black text-white hover:brightness-110 transition shadow-2xs"
              >
                <FiFileText className="text-xs" />
                <span>Ticket</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
