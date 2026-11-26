import { useNavigate } from 'react-router'
import { useBooking, type TicketStatus } from '../booking/BookingContext'
import { showSuccess } from '../components/passengers/Toast'
import FadeIn from '../components/settings/FadeIn'
import { ChevronLeft } from '../components/settings/icons'
import { useTicketActions } from '../components/tickets/useTicketActions'
import { buildTicket, lineOf, toView, type ShippingLine } from '../data/tickets'
import { ago, markAllRead, markRead, useNotifications, type AppNotification, type NotificationKind } from '../data/notifications'

// Sample Notifications page (no Figma yet): same shell as Privacy/Terms (white header, slate-50 body).
// Unread rows have an orange-tint background and a dot. Tapping one marks it read and runs its sample action:
// Continue payment → the card payment sheet (pay → confirmation screen), View booking/boarding pass/refund → booking details,
// View schedule → Schedule tab, Book a trip → copies SAVE200 and goes Home. A missing sample booking is created on the fly.
/** the sample booking each notification is about (line, status, days from today; refunds cancel every passenger) */
const BOOKING: Partial<Record<NotificationKind, [ShippingLine, TicketStatus, number]>> = {
  payment: ['maayo', 'pending', 5],
  reminder: ['oceanjet', 'confirmed', 1],
  confirmed: ['hsmarine', 'confirmed', 3],
  refund: ['oceanjet', 'refunded', 12],
}

const TONE: Record<NotificationKind, { bg: string; fg: string; path: string }> = {
  confirmed: { bg: '#dcfce7', fg: '#16a34a', path: 'M5 13l4 4L19 7' },
  reminder: { bg: '#ffedd5', fg: '#ea580c', path: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  payment: { bg: '#fef3c7', fg: '#d97706', path: 'M3 7h18v10H3zM3 11h18M7 15h3' },
  delay: { bg: '#fee2e2', fg: '#dc2626', path: 'M12 8v5M12 16.5v.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z' },
  refund: { bg: '#dbeafe', fg: '#2563eb', path: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4' },
  promo: { bg: '#f3e8ff', fg: '#9333ea', path: 'M3 9a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 0 0-4V5H3zM9 5v14' },
}

function Row({ n, onOpen }: { n: AppNotification; onOpen: () => void }) {
  const t = TONE[n.kind]
  return (
    <button type="button" onClick={onOpen} className={`flex w-full items-start gap-[12px] px-[16px] py-[14px] text-left transition-colors ${n.read ? 'bg-white active:bg-[#f8fafc]' : 'bg-[#fff3e7] active:bg-[#ffe8d1]'}`}>
      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full ring-2 ring-white" style={{ background: t.bg, color: t.fg }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={t.path} />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-[8px]">
          <span className={`text-[14px] leading-[20px] text-[#1c1917] ${n.read ? 'font-medium' : 'font-bold'}`}>{n.title}</span>
          <span className="shrink-0 pt-[2px] text-[11px] leading-[16px] text-[#8e8e93]">{ago(n.minutesAgo)}</span>
        </span>
        <span className="mt-[2px] block text-[13px] leading-[18px] text-[#6c6c70]">{n.body}</span>
        {n.action && (
          <span className={`mt-[8px] inline-flex items-center gap-[2px] text-[13px] leading-[18px] font-semibold ${n.kind === 'payment' && !n.read ? 'rounded-full bg-[#f97316] px-[12px] py-[6px] text-white' : 'text-[#f97316]'}`}>
            {n.action.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 6 6 6-6 6" />
            </svg>
          </span>
        )}
      </span>
      {!n.read && <span className="mt-[6px] size-[8px] shrink-0 rounded-full bg-[#f97316]" aria-label="Unread" />}
    </button>
  )
}

export default function Notifications() {
  const navigate = useNavigate()
  const list = useNotifications()
  const unread = list.filter((n) => !n.read).length
  const groups: [string, AppNotification[]][] = [
    ['Today', list.filter((n) => n.minutesAgo < 60 * 24)],
    ['Earlier', list.filter((n) => n.minutesAgo >= 60 * 24)],
  ]
  const { tickets, seedTickets } = useBooking()
  const { continuePayment, paymentSheet } = useTicketActions()

  /** the booking this notification is about: an existing one with that line + status, else a new sample one */
  const bookingFor = (kind: NotificationKind) => {
    const [line, status, days] = BOOKING[kind]!
    const found = tickets.findLast((t) => t.status === status && lineOf(t.booking) === line)
    if (found) return found
    const t = buildTicket(line, status, days, status === 'refunded' ? ['p1', 'p2', 'p3'] : [])
    seedTickets([...tickets, t])
    return t
  }

  const open = (n: AppNotification) => {
    markRead(n.id)
    switch (n.action?.do) {
      case 'pay': {
        const t = bookingFor(n.kind)
        // the booking may have expired or been paid meanwhile: show it instead of a payment sheet
        if (t.status === 'pending') continuePayment(toView(t))
        else navigate(`/tickets/${t.id}`)
        break
      }
      case 'ticket':
        navigate(`/tickets/${bookingFor(n.kind).id}`)
        break
      case 'schedule':
        navigate('/schedule')
        break
      case 'voucher':
        navigator.clipboard?.writeText('SAVE200').catch(() => {})
        navigate('/')
        setTimeout(() => showSuccess('Code SAVE200 copied. Paste it at Review & pay.'), 300)
        break
    }
  }

  return (
    <FadeIn className="flex h-[calc(var(--screen-vh)*100)] flex-col overflow-hidden bg-white">
      <header className="flex shrink-0 items-center gap-[12px] bg-white p-[16px]">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)} className="flex size-[40px] shrink-0 items-center justify-center rounded-full border border-[#f1f5f9] text-[#334155] transition-transform active:scale-95">
          <ChevronLeft size={16} />
        </button>
        <h1 className="flex-1 text-[16px] leading-[24px] font-medium text-text-primary">Notifications</h1>
        {unread > 0 && (
          <button type="button" onClick={markAllRead} className="text-[13px] leading-[18px] font-semibold text-[#f97316]">
            Mark all as read
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto pt-[8px] pb-[48px] [scrollbar-width:none]">
        {list.length === 0 ? (
          <div className="flex flex-col items-center pt-[96px] text-center">
            <span className="flex size-[64px] items-center justify-center rounded-full bg-[#ffedd5] text-[#f97316]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </span>
            <p className="mt-[16px] text-[16px] leading-[24px] font-bold text-[#1c1917]">No notifications yet</p>
            <p className="mt-[4px] text-[14px] leading-[20px] text-[#6c6c70]">Trip reminders and booking updates will show up here.</p>
          </div>
        ) : (
          groups
            .filter(([, items]) => items.length > 0)
            .map(([label, items]) => (
              <section key={label} className="mb-[20px]">
                <h2 className="mb-[4px] px-[16px] text-[12px] leading-[16px] font-bold tracking-[0.6px] text-[#8e8e93] uppercase">{label}</h2>
                <div className="divide-y divide-[#e5e5ea]">
                  {items.map((n) => (
                    <Row key={n.id} n={n} onOpen={() => open(n)} />
                  ))}
                </div>
              </section>
            ))
        )}
      </div>
      {paymentSheet}
    </FadeIn>
  )
}
