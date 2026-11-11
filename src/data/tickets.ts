import type { BookingState, Ticket, TicketStatus as StoredStatus } from '../booking/BookingContext'
import { addDays, formatBookingDate, parseBookingDate, startOfToday } from '../booking/date'
import { search } from './home'
import { departures, findDeparture, type ShippingLine } from './departures'
import { mockPassengers, mockVehicles, SERVICE_FEE } from './step-review'

// My Tickets data + the prototype's ticket lifecycle (in memory, no backend).
// Card styles from the live app (book.tripket.ph/tickets STATUS_CONFIG); status labels, copy and the extra states
// (Generating ticket, partial cancellation, Departed) from Figma "Other Ticket Statuses" (11598:48401) and the
// confirmation screens (11598:51228 / 49782 / 52901).

// ---------------------------------------------------------------- lifecycle
/** Live: payment window is 15 minutes (progress = seconds left / 900). */
export const PAYMENT_WINDOW_MS = 15 * 60 * 1000
/** Simulated shipping line: OceanJet "under review" → Booked; Maayo "Generating ticket" → Booked. (HS Marine confirms on payment.) */
export const REVIEW_MS = 12000
export const GENERATE_MS = 8000
/** Simulated refund: For refund → Refunded */
export const REFUND_MS = 10000

/** Next stored status for a ticket at `now` (called every 500ms by BookingProvider). */
export function advanceTicket(t: Ticket, now: number): StoredStatus {
  const age = now - t.statusChangedAt
  switch (t.status) {
    case 'pending':
      return t.pendingUntil !== undefined && now >= t.pendingUntil ? 'expired' : 'pending'
    case 'under_review':
      return age >= REVIEW_MS ? 'confirmed' : 'under_review'
    case 'generating':
      return age >= GENERATE_MS ? 'confirmed' : 'generating'
    case 'for_refund':
      return age >= REFUND_MS ? 'refunded' : 'for_refund'
    default:
      return t.status
  }
}

// ---------------------------------------------------------------- shipping lines
// Each line has its own confirmation screens + boarding pass (Figma "Confirmation Screens OCEAN JET / HS / MAAYO SHIPPING",
// "Boarding Pass" 11598:57458): OceanJet = no QR, ticket numbers, admin review step; Maayo = QR codes, "generating ticket"
// step, Payment Failed screen; HS Marine = booking reference + seat numbers, no review step.
export type { ShippingLine }
export const LINES: Record<
  ShippingLine,
  { name: string; ticketLabel: string; prefix: string; refundCode: string; qr: boolean; seats: boolean; reference: boolean; paidStatus: StoredStatus }
> = {
  oceanjet: { name: 'OceanJet', ticketLabel: 'OCEANJET TICKET NO.', prefix: 'OJ', refundCode: 'OCJ', qr: false, seats: false, reference: false, paidStatus: 'under_review' },
  maayo: { name: 'Maayo Shipping', ticketLabel: 'MAAYO TICKET NO.', prefix: 'TKT', refundCode: 'MAY', qr: true, seats: false, reference: false, paidStatus: 'generating' },
  hsmarine: { name: 'HS Marine', ticketLabel: 'HS STAR MARINE TICKET NO.', prefix: 'HSS', refundCode: 'HSS', qr: false, seats: true, reference: true, paidStatus: 'confirmed' },
}

export const lineOf = (b: { departureId: string | null }): ShippingLine => findDeparture(b.departureId)?.line ?? 'oceanjet'

const hash = (s: string) => {
  let h = 2166136261
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}
const digits = (seed: string, n: number) => String(hash(seed) % 10 ** n).padStart(n, '0')

/** "OJ-821620-2273-2473" (per passenger, derived from the booking reference) */
export const ticketNo = (line: ShippingLine, ref: string, i: number) =>
  `${LINES[line].prefix}-${digits(`${ref}a${i}`, 6)}-${digits(`${ref}b${i}`, 4)}-${digits(`${ref}c${i}`, 4)}`
/** HS Marine "MUM3MFM4X" / Maayo vehicle code base */
export const bookingRef = (ref: string) => (hash(ref).toString(36) + hash(`${ref}x`).toString(36)).toUpperCase().slice(0, 9)
const SEATS = ['J8', 'J4', 'J5', 'J6', 'J7', 'K1', 'K2', 'K3']
/** HS Marine seat numbers, assigned at confirmation (Figma "Seat: J8") */
export const seatOf = (i: number) => SEATS[i % SEATS.length]

// ---------------------------------------------------------------- view model
/** Shown status: stored status, plus "completed" (Departed) for a booked trip whose travel date is before today. */
export type TicketStatus = StoredStatus | 'completed'
export type StatusGroup = 'upcoming' | 'past' | 'cancelled'
export type TicketView = Omit<Ticket, 'status'> & { status: TicketStatus; reference: string }

export const isPast = (t: Ticket) => parseBookingDate(t.booking.date).getTime() < startOfToday().getTime()

export function toView(t: Ticket): TicketView {
  return { ...t, status: t.status === 'confirmed' && isPast(t) ? 'completed' : t.status, reference: t.id.replace(/^TKT-/, '') }
}

type StatusStyle = {
  /** card tag (Figma labels) */
  tag: string
  /** confirmation / booking-details header (live STATUS_CONFIG label + description) */
  label: string
  description: string
  /** text under the tag on the confirmation card (Figma confirmation screens) */
  note: string
  /** live STATUS_CONFIG.bg — card frame + message box */
  bg: string
  /** live STATUS_CONFIG.text — tag colour */
  text: string
  /** top colour of the confirmation card gradient (live bgLeniar) */
  from: string
  /** header icon circle (Figma confirmation screens) */
  iconBg: string
  group: StatusGroup
}

export const STATUS: Record<TicketStatus, StatusStyle> = {
  pending: {
    tag: 'PENDING PAYMENT',
    label: 'Booking submitted',
    description: 'Complete payment to reserve your seat',
    note: 'Your booking was already submitted — complete payment to confirm your seat.',
    bg: 'bg-amber-50',
    text: 'text-[#a19200]',
    from: '#fff8cf',
    iconBg: '#fef9c3',
    group: 'upcoming',
  },
  under_review: {
    tag: 'PROCESSING',
    label: 'Booking under review',
    description: 'Payment posted, waiting for admin confirmation',
    note: 'Payment posted. Review the booking before releasing boarding details.',
    bg: 'bg-blue-50',
    text: 'text-blue-500',
    from: 'rgba(199,232,255,0.5)',
    iconBg: '#e0edff',
    group: 'upcoming',
  },
  generating: {
    tag: 'GENERATING TICKET',
    label: 'Generating ticket',
    description: 'Confirmed by the shipping line',
    note: 'Please wait. Your ticket is being generated.',
    bg: 'bg-blue-50',
    text: 'text-blue-500',
    from: 'rgba(199,232,255,0.5)',
    iconBg: '#e0edff',
    group: 'upcoming',
  },
  confirmed: {
    tag: 'BOOKED',
    label: 'Booking confirmed',
    description: 'Your boarding pass is ready',
    note: 'Your booking is confirmed. Show your boarding pass at the port',
    bg: 'bg-[#34c759]/10',
    text: 'text-[#34c759]',
    from: '#c6efd0',
    iconBg: '#d7ffe1',
    group: 'upcoming',
  },
  completed: {
    tag: 'DEPARTED',
    label: 'Booking completed',
    description: 'Your trip has ended',
    note: 'Your voyage has ended. Thanks for traveling with Tripket.',
    bg: 'bg-zinc-200',
    text: 'text-neutral-600',
    from: '#f3f4f6',
    iconBg: '#f2f2f2',
    group: 'past',
  },
  for_refund: {
    tag: 'FOR REFUND',
    label: 'Refund in progress',
    description: 'Your cancelled booking is being processed',
    note: 'This booking was cancelled. Your refund is being processed.',
    bg: 'bg-rose-50',
    text: 'text-[#ff3b30]',
    from: '#ffecec',
    iconBg: '#ffe4e6',
    group: 'cancelled',
  },
  refunded: {
    tag: 'REFUNDED',
    label: 'Refund completed',
    description: 'Your refund has been returned',
    note: 'Refund completed',
    bg: 'bg-[#e4d1ff]',
    text: 'text-[#8b3eff]',
    from: '#f4ecff',
    iconBg: '#efe4ff',
    group: 'cancelled',
  },
  failed: {
    tag: 'PAYMENT FAILED',
    label: 'Payment Failed',
    description: 'Unable to process your payment',
    note: "We weren't able to process the payment for your booking.",
    bg: 'bg-rose-50',
    text: 'text-[#ff3b30]',
    from: '#ffecec',
    iconBg: '#ffe4e6',
    group: 'cancelled',
  },
  expired: {
    tag: 'EXPIRED',
    label: 'Booking expired',
    description: 'The payment window has ended',
    note: 'Payment was not completed before the payment window ended.',
    bg: 'bg-zinc-200',
    text: 'text-neutral-600',
    from: '#f3f4f6',
    iconBg: '#f2f2f2',
    group: 'cancelled',
  },
}

export const GROUPS: { id: StatusGroup; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
]

export const SORTS = [
  { id: 'departure_asc', label: 'Travel Date (Earliest)' },
  { id: 'departure_desc', label: 'Travel Date (Latest)' },
  { id: 'created_desc', label: 'Recently Booked' },
] as const
export type SortId = (typeof SORTS)[number]['id']

/** "1:00 PM" → minutes after midnight */
function minutes(time: string) {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  return ((Number(m[1]) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0)) * 60 + Number(m[2])
}

export function departureTs(t: { booking: BookingState }) {
  const d = findDeparture(t.booking.departureId)
  return parseBookingDate(t.booking.date).getTime() + minutes(d?.departTime ?? '12:00 AM') * 60_000
}

export function sortTickets(list: TicketView[], sort: SortId) {
  const out = [...list]
  if (sort === 'created_desc') return out.sort((a, b) => b.createdAt - a.createdAt)
  out.sort((a, b) => departureTs(a) - departureTs(b))
  return sort === 'departure_desc' ? out.reverse() : out
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
/** live formatDesignDate: "Apr 8, Wednesday" */
export const designDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${DAYS[d.getDay()]}`

/** live formatHours(h, true): 5 → "5h 0m", 1.5 → "1h 30m" */
export function formatHours(h: number) {
  const total = Math.round(h * 60)
  return `${Math.floor(total / 60)}h ${total % 60}m`
}

/** Trip facts for a ticket (departure + dates). */
export function tripOf(t: { booking: BookingState }) {
  const d = findDeparture(t.booking.departureId)
  const depart = parseBookingDate(t.booking.date)
  const arrive = d?.nextDayArrival ? addDays(depart, 1) : depart
  const hours = Number(d?.duration.match(/(\d+(?:\.\d+)?)H/i)?.[1] ?? 0) + Number(d?.duration.match(/(\d+)M/i)?.[1] ?? 0) / 60
  return {
    line: lineOf(t.booking),
    vessel: d?.vessel ?? 'Vessel Name',
    vesselType: d?.vesselType ?? 'RoRo',
    operator: d ? LINES[d.line].name : 'Operator Name',
    logo: d?.logo,
    departTime: d?.departTime ?? '',
    arriveTime: d?.arriveTime ?? '',
    duration: formatHours(hours),
    departDate: designDate(depart),
    arriveDate: designDate(arrive),
    sameDay: depart.getTime() === arrive.getTime(),
    /** Figma banner: "Wed, Apr 1 · 1:00 PM" */
    short: `${depart.toLocaleDateString('en-US', { weekday: 'short' })}, ${MONTHS[depart.getMonth()]} ${depart.getDate()} · ${d?.departTime ?? ''}`,
  }
}

/** Paid amounts for a ticket (same maths as Review & pay). */
export function moneyOf(t: { booking: BookingState }) {
  const { passengers, vehicles } = t.booking
  const subtotal = passengers.reduce((s, p) => s + (p.fare ?? 0), 0) + vehicles.reduce((s, v) => s + v.fare, 0)
  return { subtotal, serviceFee: SERVICE_FEE, total: subtotal + SERVICE_FEE }
}

/** Partial cancellation counts (Figma 11598:49042 / 11598:49136) */
export function partialOf(t: TicketView) {
  const cancelled = t.cancelledPassengerIds.length
  return cancelled > 0 && cancelled < t.booking.passengers.length ? { cancelled, total: t.booking.passengers.length, kept: t.booking.passengers.length - cancelled } : null
}

/** Layout of the confirmation / booking-details screen (Figma confirmation screens differ per status) */
export type Layout = 'list' | 'tickets' | 'cancelled' | 'generating'

export type Screen = {
  tag: string
  label: string
  description: string
  note: string
  /** line under the note on refund screens ("[Cancellation Reason]" in Figma) */
  reason?: string
  text: string
  from: string
  iconBg: string
  layout: Layout
  totalLabel: string
  partial: boolean
}

/** What the confirmation screen shows for a ticket: copy per status and shipping line (Figma confirmation screens). */
export function screenOf(t: TicketView): Screen {
  const line = lineOf(t.booking)
  const p = partialOf(t)
  const partial = Boolean(p) && t.status === 'confirmed'
  const st = STATUS[partial ? 'for_refund' : t.status]
  const base = { tag: st.tag, label: st.label, description: st.description, note: st.note, text: st.text, from: st.from, iconBg: st.iconBg, partial }
  switch (t.status) {
    case 'pending':
      return { ...base, layout: 'list', totalLabel: 'Total amount due' }
    case 'under_review':
      return { ...base, layout: 'list', totalLabel: 'Total amount paid' }
    case 'generating':
      return {
        ...base,
        label: 'Payment received',
        description: 'Generating your ticket',
        note: 'Keep this open. Your ticket is being generated.',
        layout: 'generating',
        totalLabel: 'Total amount paid',
      }
    case 'confirmed':
      if (partial && p) {
        return {
          ...base,
          label: line === 'hsmarine' ? 'Booking Partially Cancelled' : 'Refund in progress',
          note:
            line === 'hsmarine'
              ? `${p.cancelled} of ${p.total} tickets was cancelled. Your refund for it is being processed. The other ${p.kept} tickets are still valid.`
              : `${p.cancelled} of ${p.total} passengers cancelled. Your refund for the cancelled passengers is being processed.`,
          reason: 'Cancelled by you',
          layout: 'cancelled',
          totalLabel: 'Total paid',
        }
      }
      return { ...base, layout: 'tickets', totalLabel: 'Total amount paid' }
    case 'completed':
      return { ...base, layout: 'tickets', totalLabel: 'Total amount paid' }
    case 'for_refund':
      return { ...base, reason: 'Cancelled by you', layout: 'cancelled', totalLabel: 'Total paid' }
    case 'refunded':
      return { ...base, reason: 'Cancelled by you', layout: 'cancelled', totalLabel: 'Total paid' }
    default:
      return { ...base, layout: 'list', totalLabel: 'Total amount' }
  }
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const LONG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dd = (d: Date) => String(d.getDate()).padStart(2, '0')

/** Refund block (Figma "Refund details"): full refund = everything paid; partial = the cancelled passengers' fares (fee kept). */
export function refundOf(t: TicketView) {
  const line = lineOf(t.booking)
  const { total } = moneyOf(t)
  const full = t.status === 'for_refund' || t.status === 'refunded'
  const refund = full
    ? total
    : t.booking.passengers.filter((p) => t.cancelledPassengerIds.includes(p.id)).reduce((s, p) => s + (p.fare ?? 0), 0)
  const at = new Date(t.statusChangedAt)
  const expected = new Date(at.getFullYear(), at.getMonth(), at.getDate() + 3)
  return {
    full,
    original: total,
    refund,
    remaining: total - refund,
    method: 'GCash •••• 4821',
    reference: `RF-${LINES[line].refundCode}-${digits(`${t.reference}r`, 4)}-${digits(`${t.reference}s`, 3)}R`,
    expected: `By ${SHORT_MONTHS[expected.getMonth()]} ${dd(expected)}, ${expected.getFullYear()}`,
    sent: `${LONG_MONTHS[at.getMonth()]} ${at.getDate()}, ${at.getFullYear()}`,
  }
}

export const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// ---------------------------------------------------------------- Home prefill (Rebook / Book Return Trip)
/** Home reads its form defaults from data/home `search` when it mounts; set them before navigating to '/'. */
export function prefillHome(from: string, to: string, date: Date) {
  const today = startOfToday()
  search.from = from
  search.to = to
  search.date = date.getTime() < today.getTime() ? today : date
}

// ---------------------------------------------------------------- per-session UI memory
const seen = new Set<string>()
export const isUnread = (t: TicketView) => !seen.has(t.id)
export const markRead = (ids: string[]) => ids.forEach((id) => seen.add(id))
/** "Continue to payment" banners closed with × */
export const dismissedBanners = new Set<string>()
/** "Payment Window Expired" modals already shown */
export const expiredAcked = new Set<string>()

// ---------------------------------------------------------------- demo tickets (/tickets?demo=1 | oceanjet | maayo | hsmarine)
// One card per Figma status and shipping line, for reviewing states a fresh booking can't reach (Departed, Refunded, …).
function demoBooking(line: ShippingLine, n: number, offsetDays: number): BookingState {
  const list = departures.filter((d) => d.line === line)
  return {
    from: { code: 'DGT', city: 'Dumaguete' },
    to: { code: 'DPT', city: 'Dapitan' },
    date: formatBookingDate(addDays(startOfToday(), offsetDays)),
    passengerCount: 3,
    vehicleCount: 1,
    departureId: list[n % list.length].id,
    passengers: mockPassengers,
    vehicles: mockVehicles,
  }
}

const ALL = ['p1', 'p2', 'p3']
// [line, status, departure #, days from today, cancelled passenger ids]
const DEMO: [ShippingLine, StoredStatus, number, number, string[]?][] = [
  ['oceanjet', 'confirmed', 0, 3],
  ['oceanjet', 'under_review', 1, 7],
  ['oceanjet', 'pending', 2, 5],
  ['oceanjet', 'confirmed', 0, -6],
  ['oceanjet', 'for_refund', 1, 9, ALL],
  ['oceanjet', 'refunded', 2, 12, ALL],
  ['oceanjet', 'expired', 0, 2],
  ['oceanjet', 'confirmed', 1, 4, ['p3']],
  ['oceanjet', 'confirmed', 2, -3, ['p3']],
  ['maayo', 'generating', 0, 6],
  ['maayo', 'confirmed', 1, 3],
  ['maayo', 'confirmed', 0, -5],
  ['maayo', 'for_refund', 1, 9, ALL],
  ['maayo', 'refunded', 0, 12, ALL],
  ['maayo', 'confirmed', 1, 5, ['p3']],
  ['maayo', 'expired', 0, 2],
  ['maayo', 'failed', 1, 2],
  ['hsmarine', 'pending', 0, 4],
  ['hsmarine', 'confirmed', 1, 3],
  ['hsmarine', 'confirmed', 0, 5, ['p3']],
  ['hsmarine', 'confirmed', 1, -4],
  ['hsmarine', 'for_refund', 0, 9, ALL],
  ['hsmarine', 'refunded', 1, 12, ALL],
  ['hsmarine', 'expired', 0, 2],
]

let demoCache: TicketView[] | null = null
/** @param which '1' = every line, or one of oceanjet | maayo | hsmarine */
export function demoTickets(which: string): TicketView[] {
  if (!demoCache) {
    const now = Date.now()
    demoCache = DEMO.map(([line, status, dep, offset, cancelled = []], i) => {
      const booking = demoBooking(line, dep, offset)
      const t: Ticket = {
        id: `TKT-DEMO${i + 1}`,
        createdAt: now - i * 3_600_000,
        booking,
        total: moneyOf({ booking }).total,
        status,
        statusChangedAt: now,
        pendingUntil: status === 'pending' ? now + 890_000 : undefined,
        cancelledPassengerIds: cancelled,
      }
      return toView(t)
    })
  }
  return which === '1' ? demoCache : demoCache.filter((t) => lineOf(t.booking) === which)
}
