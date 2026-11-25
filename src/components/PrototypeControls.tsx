import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { defaultBooking, useBooking, type Ticket } from '../booking/BookingContext'
import { addDays, formatBookingDate, parseBookingDate, startOfToday } from '../booking/date'
import { anotherPatch, freshPatch, returnPatch } from '../booking/flows'
import { departures } from '../data/departures'
import { buildTicket, LINES, lineOf, moneyOf, PAYMENT_WINDOW_MS, STATUS, toView, type ShippingLine, type TicketStatus } from '../data/tickets'
import { setProtoFlag, useProtoFlags, voucherDemo } from '../proto/flags'
import { useTicketActions } from './tickets/useTicketActions'

// Floating "Prototype controls" (modelled on pd-hospitality-user.vercel.app). Minimal, plain-language tabs:
//   Status        – the booking lifecycle as a tappable track ("Current") + one "Next step" button
//   Walkthroughs  – auto-playing demos with a caption bar (play / pause / skip)
//   Dates         – move the trip's travel date, shorten the payment window
//   Conditions    – simulation switches + reset
//   Screens       – every screen, searchable
// Every action answers with a short confirmation. Prototype only — not in Figma or live.

type Tab = 'status' | 'walkthroughs' | 'dates' | 'conditions' | 'screens'
const TABS: [Tab, string][] = [
  ['status', 'Status'],
  ['walkthroughs', 'Walkthroughs'],
  ['dates', 'Dates'],
  ['conditions', 'Conditions'],
  ['screens', 'Screens'],
]
const LINE_LIST: ShippingLine[] = ['oceanjet', 'hsmarine', 'maayo']
const LOGO = Object.fromEntries(LINE_LIST.map((l) => [l, departures.find((d) => d.line === l)?.logo])) as Record<ShippingLine, string | undefined>

/** Colour per traveller state (chip dot, status track). */
type Key = TicketStatus | 'none'
const LOOK: Record<Key, { color: string; name: string }> = {
  none: { color: '#a1a1aa', name: 'Nothing booked' },
  pending: { color: '#f59e0b', name: 'Pending payment' },
  under_review: { color: '#3b82f6', name: 'Under review' },
  generating: { color: '#3b82f6', name: 'Generating ticket' },
  confirmed: { color: '#22c55e', name: 'Booked' },
  completed: { color: '#64748b', name: 'Departed' },
  for_refund: { color: '#a855f7', name: 'For refund' },
  refunded: { color: '#8b5cf6', name: 'Refunded' },
  expired: { color: '#ef4444', name: 'Expired' },
  failed: { color: '#ef4444', name: 'Payment failed' },
}

// ---------------------------------------------------------------- building blocks (module level, see lint rule static-components)

const Label = ({ children }: { children: ReactNode }) => <p className="pb-[8px] text-[11px] leading-[16px] font-medium text-[#8e8e93]">{children}</p>

const Dot = ({ color, size = 8 }: { color: string; size?: number }) => <span className="shrink-0 rounded-full" style={{ background: color, width: size, height: size }} />

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const PlayIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M7 4.5v15l13-7.5z" />
  </svg>
)

const Segmented = <T extends string>({ value, items, onChange }: { value: T; items: [T, ReactNode][]; onChange: (v: T) => void }) => (
  <div className="grid gap-[2px] rounded-[10px] bg-[#f4f4f5] p-[2px]" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
    {items.map(([v, label]) => (
      <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={`flex items-center justify-center gap-[6px] rounded-[8px] py-[6px] text-[12px] font-medium whitespace-nowrap transition-colors ${value === v ? 'bg-white text-[#18181b] shadow-[0_1px_2px_rgba(0,0,0,0.08)]' : 'text-[#71717a] hover:text-[#18181b]'}`}>
        {label}
      </button>
    ))}
  </div>
)

const Switch = ({ title, desc, on, onClick }: { title: string; desc: string; on: boolean; onClick: () => void }) => (
  <button type="button" role="switch" aria-checked={on} onClick={onClick} className="flex w-full items-center gap-[12px] py-[11px] text-left">
    <span className="min-w-0 flex-1">
      <span className="block text-[13px] leading-[18px] font-medium text-[#18181b]">{title}</span>
      <span className="block text-[11.5px] leading-[16px] text-[#8e8e93]">{desc}</span>
    </span>
    <span className={`flex h-[22px] w-[38px] shrink-0 items-center rounded-full px-[2px] transition-colors ${on ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'}`}>
      <span className={`size-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-[16px]' : ''}`} />
    </span>
  </button>
)

/** One step on the status track. */
function Step({ k, current, done, sub, onClick, last }: { k: Key; current: boolean; done: boolean; sub: string; onClick: () => void; last?: boolean }) {
  const look = LOOK[k]
  return (
    <button type="button" onClick={onClick} className="group relative flex w-full gap-[12px] text-left">
      {!last && <span className="absolute top-[18px] bottom-[-2px] left-[5px] w-px" style={{ background: done ? look.color : '#e4e4e7' }} />}
      <span className="relative z-10 mt-[5px] flex size-[11px] shrink-0 items-center justify-center rounded-full border-2 bg-white transition-transform group-hover:scale-125" style={{ borderColor: current || done ? look.color : '#d4d4d8', background: current || done ? look.color : '#fff', boxShadow: current ? `0 0 0 4px ${look.color}26` : undefined }} />
      <span className="min-w-0 flex-1 pb-[14px]">
        <span className="flex items-center gap-[8px]">
          <span className={`text-[13px] leading-[20px] ${current ? 'font-semibold text-[#18181b]' : 'font-medium text-[#3f3f46] group-hover:text-[#18181b]'}`}>{look.name}</span>
          {current && <span className="rounded-[4px] bg-[#f4f4f5] px-[5px] text-[10px] leading-[16px] font-medium text-[#52525b]">Current</span>}
        </span>
        <span className="block text-[11.5px] leading-[16px] text-[#a1a1aa]">{sub}</span>
      </span>
    </button>
  )
}

/** Side branch next to a step (Expired, Payment failed, For refund, Refunded). */
const Branch = ({ k, current, onClick, hint }: { k: Key; current: boolean; onClick: () => void; hint?: string }) => (
  <button type="button" onClick={onClick} title={hint} className={`flex items-center gap-[6px] rounded-[8px] border px-[8px] py-[4px] text-[11.5px] transition-colors ${current ? 'border-[#18181b] font-semibold text-[#18181b]' : 'border-[#e4e4e7] text-[#52525b] hover:border-[#a1a1aa]'}`}>
    <Dot color={LOOK[k].color} size={6} />
    {LOOK[k].name}
  </button>
)

// ---------------------------------------------------------------- walkthroughs (auto-play)

type Scene = { caption: string; run: () => void; ms?: number }
type Walkthrough = { id: string; title: string; blurb: string; scenes: Scene[] }
type Playing = { story: Walkthrough; i: number; paused: boolean; done: boolean }
const SCENE_MS = 3400
/** "Offline toast" screen button: turns the connection back on after a few seconds */
let offlineTimer: ReturnType<typeof setTimeout> | undefined

function PlayerBar({ play, onPause, onNext, onStop }: { play: Playing; onPause: () => void; onNext: () => void; onStop: () => void }) {
  const scene = play.story.scenes[play.i]
  const btn = 'flex size-[30px] items-center justify-center rounded-full text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b]'
  return (
    <div className="fixed top-[12px] left-1/2 z-[70] w-[min(calc(100vw-24px),440px)] -translate-x-1/2 rounded-[16px] border border-[#e4e4e7] bg-white/95 px-[14px] pt-[12px] pb-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur">
      <div className="flex items-start gap-[10px]">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] leading-[16px] text-[#8e8e93]">
            {play.story.title} · {play.done ? 'Finished' : `Step ${play.i + 1} of ${play.story.scenes.length}`}
          </p>
          <p key={play.i} className="animate-page-enter text-[14px] leading-[20px] font-medium text-[#18181b]">{play.done ? 'End of walkthrough.' : scene.caption}</p>
        </div>
        <div className="flex shrink-0">
          {!play.done && (
            <>
              <button type="button" onClick={onPause} aria-label={play.paused ? 'Play' : 'Pause'} className={btn}>
                {play.paused ? (
                  <PlayIcon />
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                )}
              </button>
              <button type="button" onClick={onNext} aria-label="Next step" className={btn}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4 5v14l10-7zM16 5h3v14h-3z" />
                </svg>
              </button>
            </>
          )}
          <button type="button" onClick={onStop} aria-label="Stop walkthrough" className={btn}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-[10px] flex gap-[3px]">
        {play.story.scenes.map((s, i) => (
          <span key={s.caption} className="h-[3px] flex-1 overflow-hidden rounded-full bg-[#f4f4f5]">
            <span
              key={`${play.i}-${play.paused}`}
              className="block h-full rounded-full bg-[#18181b]"
              style={
                i < play.i || play.done
                  ? { width: '100%' }
                  : i === play.i && !play.paused
                    ? { width: '100%', animation: `story-fill ${s.ms ?? SCENE_MS}ms linear backwards` }
                    : { width: i === play.i ? '50%' : '0%' }
              }
            />
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- drag

/** Drag handle for the floating controls: returns the current offset + pointer handlers; `moved()` tells a drag from a click. */
function useDrag() {
  const [off, setOff] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLElement | null>(null)
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; dist: number } | null>(null)
  const handlers = {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if ((e.target as HTMLElement).closest('[data-nodrag]')) return
      e.currentTarget.setPointerCapture(e.pointerId)
      drag.current = { sx: e.clientX, sy: e.clientY, ox: off.x, oy: off.y, dist: 0 }
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.sx
      const dy = e.clientY - d.sy
      d.dist = Math.max(d.dist, Math.abs(dx) + Math.abs(dy))
      let x = d.ox + dx
      let y = d.oy + dy
      const r = ref.current?.getBoundingClientRect()
      if (r) {
        const cx = Math.min(Math.max(r.left + (x - off.x), 4), window.innerWidth - r.width - 4) - r.left - (x - off.x)
        const cy = Math.min(Math.max(r.top + (y - off.y), 4), window.innerHeight - r.height - 4) - r.top - (y - off.y)
        x += cx
        y += cy
      }
      setOff({ x, y })
    },
    onPointerUp: () => {
      setTimeout(() => (drag.current = null), 0)
    },
  }
  const moved = () => (drag.current?.dist ?? 0) > 4
  const clamp = () => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const dx = Math.min(Math.max(r.left, 4), Math.max(window.innerWidth - r.width - 4, 4)) - r.left
    const dy = Math.min(Math.max(r.top, 4), Math.max(window.innerHeight - r.height - 4, 4)) - r.top
    if (dx || dy) setOff((o) => ({ x: o.x + dx, y: o.y + dy }))
  }
  return { off, ref, handlers, moved, clamp }
}

// ---------------------------------------------------------------- panel

export default function PrototypeControls() {
  const navigate = useNavigate()
  const { user, signIn, signOut } = useAuth()
  const { booking, update, reset, tickets, seedTickets, updateTicket } = useBooking()
  const { rebook, paymentSheet } = useTicketActions()
  const flags = useProtoFlags()
  const [open, setOpen] = useState(false)
  const { off, ref, handlers, moved, clamp } = useDrag()
  useLayoutEffect(clamp, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  const place = { translate: `${off.x}px ${off.y}px` }
  const [tab, setTab] = useState<Tab>('status')
  const [line, setLine] = useState<ShippingLine>('oceanjet')
  const [query, setQuery] = useState('')

  // short confirmation after each action (in the panel, or on the chip when closed)
  const [note, setNote] = useState<{ text: string; id: number } | null>(null)
  useEffect(() => {
    if (!note) return
    const t = setTimeout(() => setNote(null), 2200)
    return () => clearTimeout(t)
  }, [note])
  const noteId = useRef(0)
  const flash = (text: string) => setNote({ text, id: ++noteId.current })

  const latest = tickets.length ? toView(tickets[tickets.length - 1]) : undefined
  const raw: Ticket | undefined = tickets[tickets.length - 1]
  const status: Key = latest?.status ?? 'none'
  const look = LOOK[status]
  const latestLine = raw ? lineOf(raw.booking) : line
  const stateLabel = status === 'none' ? (user ? 'Signed in · no trips' : 'Guest · no trips') : `${look.name} · ${LINES[latestLine].name}`

  // leaving for any screen also ends maintenance mode (otherwise the maintenance screen keeps covering everything)
  const go = (to: string) => {
    if (flags.maintenance) setProtoFlag('maintenance', false)
    navigate(to, { state: { pageEnter: true, noLoader: true } })
  }
  // Figma toasts: "You're offline", then "Back online" a few seconds later
  const playOffline = () => {
    clearTimeout(offlineTimer)
    setProtoFlag('offline', true)
    offlineTimer = setTimeout(() => setProtoFlag('offline', false), 3500)
  }
  const here = (patch: Partial<Ticket>) => raw && updateTicket(raw.id, patch)

  // ------------------------------------------------ jump to a booking status (signed in, one seeded trip, then the screen that shows it)
  const seed = (t: Ticket | null, to: string, who: 'guest' | 'user' = 'user') => {
    if (who === 'guest') signOut()
    else signIn('juan.delacruz@gmail.com')
    seedTickets(t ? [t] : [])
    update({ ...defaultBooking })
    go(to)
  }
  const jump = (k: Key, l: ShippingLine = line) => {
    switch (k) {
      case 'none': seed(null, '/', user ? 'user' : 'guest'); break
      case 'pending': seed(buildTicket(l, 'pending', 5), '/tickets'); break
      case 'under_review':
      case 'generating': seed(buildTicket(l, LINES[l].paidStatus, 5), '/tickets'); break
      case 'confirmed': seed(buildTicket(l, 'confirmed', 3), '/tickets'); break
      case 'completed': seed(buildTicket(l, 'confirmed', -2), '/tickets?group=past'); break
      case 'for_refund': seed(buildTicket(l, 'for_refund', 9, ['p1', 'p2', 'p3']), '/tickets?group=cancelled'); break
      case 'refunded': seed(buildTicket(l, 'refunded', 12, ['p1', 'p2', 'p3']), '/tickets?group=cancelled'); break
      case 'expired': seed(buildTicket(l, 'expired', 2), '/tickets?group=cancelled'); break
      case 'failed': seed(buildTicket('maayo', 'failed', 2), '/tickets?group=cancelled'); break
    }
    flash(`Status set to ${LOOK[k].name}`)
  }

  // ------------------------------------------------ "Next step" button
  const paidKey: Key = LINES[latestLine].paidStatus
  const next: { label: string; sub: string; run: () => void } =
    status === 'none'
      ? { label: 'Book a trip', sub: 'Creates a booking waiting for payment', run: () => jump('pending') }
      : status === 'pending'
        ? { label: 'Payment received', sub: `Moves to ${LOOK[paidKey].name} (${LINES[latestLine].name})`, run: () => (here({ status: LINES[latestLine].paidStatus, pendingUntil: undefined }), raw && go(`/book/confirmed?id=${raw.id}`), flash('Payment received')) }
        : status === 'under_review' || status === 'generating'
          ? { label: 'Shipping line confirms', sub: 'Moves to Booked, boarding pass ready', run: () => (here({ status: 'confirmed' }), raw && go(`/book/confirmed?id=${raw.id}`), flash('Booking confirmed')) }
          : status === 'confirmed'
            ? { label: 'Trip departs', sub: 'Moves to Departed, shown under Past', run: () => (raw && here({ booking: { ...raw.booking, date: formatBookingDate(addDays(startOfToday(), -1)) } }), go('/tickets?group=past'), flash('Trip departed')) }
            : status === 'completed'
              ? { label: 'Book the return trip', sub: 'Opens the return flow with the NO-FEE voucher', run: () => (raw && (update(returnPatch(raw.booking)), go('/book/return')), flash('Return trip started')) }
              : status === 'for_refund'
                ? { label: 'Refund completed', sub: 'Moves to Refunded', run: () => (here({ status: 'refunded' }), flash('Refund completed')) }
                : { label: 'Start over', sub: 'Creates a new booking waiting for payment', run: () => jump('pending') }

  // ------------------------------------------------ walkthroughs
  const walkthroughs: Walkthrough[] = (() => {
    const l = line
    // each walkthrough builds its own ticket so scenes don't depend on stale state
    const t1 = buildTicket(l, 'pending', 5)
    const t2 = buildTicket(l, 'pending', 5)
    const t3 = buildTicket(l, 'confirmed', 3)
    const t4 = buildTicket(l, 'confirmed', 3)
    const t5 = buildTicket('maayo', 'pending', 4)
    return [
      {
        id: 'happy', title: 'Book and board', blurb: 'Empty account to departed trip',
        scenes: [
          { caption: 'Juan opens Tripket. Nothing booked yet.', run: () => seed(null, '/') },
          { caption: 'He books a trip but hasn’t paid yet.', run: () => seed(t1, '/tickets') },
          { caption: `He pays. ${LINES[l].name} receives the payment.`, run: () => (updateTicket(t1.id, { status: LINES[l].paidStatus, pendingUntil: undefined }), go(`/book/confirmed?id=${t1.id}`)) },
          { caption: 'Booking confirmed. Tripket offers the return trip.', run: () => updateTicket(t1.id, { status: 'confirmed' }), ms: 4200 },
          { caption: 'Travel day passes. The trip is now Departed.', run: () => (updateTicket(t1.id, { booking: { ...t1.booking, date: formatBookingDate(addDays(startOfToday(), -1)) } }), go('/tickets?group=past')) },
          { caption: 'Home now suggests booking the return.', run: () => go('/') },
        ],
      },
      {
        id: 'expire', title: 'Payment window expires', blurb: 'Unpaid booking runs out of time',
        scenes: [
          { caption: 'A booking is waiting for payment.', run: () => seed(t2, '/tickets') },
          { caption: '5 seconds left to pay.', run: () => updateTicket(t2.id, { pendingUntil: Date.now() + 5000 }), ms: 6500 },
          { caption: 'Time is up. The seats are released.', run: () => undefined },
        ],
      },
      {
        id: 'refund', title: 'Cancel and refund', blurb: 'Booked trip cancelled, money returned',
        scenes: [
          { caption: 'Juan has a booked trip.', run: () => seed(t3, '/tickets') },
          { caption: 'He opens the booking details.', run: () => go(`/tickets/${t3.id}`) },
          { caption: 'He cancels. The refund is in progress.', run: () => (updateTicket(t3.id, { status: 'for_refund', cancelledPassengerIds: t3.booking.passengers.map((p) => p.id) }), go('/tickets?group=cancelled')) },
          { caption: 'The refund is completed.', run: () => updateTicket(t3.id, { status: 'refunded' }) },
        ],
      },
      {
        id: 'return', title: 'Return trip', blurb: 'Passengers carried over, NO-FEE voucher',
        scenes: [
          { caption: 'Booking confirmed. The return-trip prompt appears.', run: () => seed(t4, `/book/confirmed?id=${t4.id}`), ms: 4200 },
          { caption: 'Route reversed, passengers already filled in.', run: () => (update(returnPatch(t4.booking)), go('/book/return')) },
          { caption: 'NO-FEE voucher applied to every departure.', run: () => go('/book/departure') },
        ],
      },
      {
        id: 'declined', title: 'Card declined', blurb: 'Maayo Shipping payment fails',
        scenes: [
          { caption: 'A Maayo Shipping booking is waiting for payment.', run: () => seed(t5, '/tickets') },
          { caption: 'The card is declined. Payment failed.', run: () => (updateTicket(t5.id, { status: 'failed', pendingUntil: undefined }), go(`/book/confirmed?id=${t5.id}`)) },
        ],
      },
      {
        id: 'offline', title: 'Connection lost', blurb: 'Offline and back-online toasts',
        scenes: [
          { caption: 'Browsing the schedule.', run: () => (setProtoFlag('offline', false), go('/schedule')) },
          { caption: 'Connection lost. “You’re offline” toast.', run: () => setProtoFlag('offline', true) },
          { caption: 'Connection restored. “Back online” toast.', run: () => setProtoFlag('offline', false) },
        ],
      },
    ]
  })()

  const [play, setPlay] = useState<Playing | null>(null)
  const startWalkthrough = (w: Walkthrough) => {
    setOpen(false)
    w.scenes[0].run()
    setPlay({ story: w, i: 0, paused: false, done: false })
  }
  const advance = () =>
    setPlay((p) => {
      if (!p || p.done) return p
      if (p.i >= p.story.scenes.length - 1) return { ...p, done: true }
      p.story.scenes[p.i + 1].run()
      return { ...p, i: p.i + 1 }
    })
  useEffect(() => {
    if (!play || play.paused) return
    if (play.done) {
      const t = setTimeout(() => setPlay(null), 2600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(advance, play.story.scenes[play.i].ms ?? SCENE_MS)
    return () => clearTimeout(t)
  }, [play]) // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------------------------------ dates
  const daysAway = raw ? Math.round((parseBookingDate(raw.booking.date).getTime() - startOfToday().getTime()) / 86_400_000) : null
  const shift = (days: number) => {
    if (!raw) return
    here({ booking: { ...raw.booking, date: formatBookingDate(addDays(startOfToday(), days)) } })
    const group = raw.status === 'confirmed' && days < 0 ? 'past' : STATUS[raw.status].group
    go(`/tickets?group=${group}`)
    flash(days < 0 ? 'Travel date moved to yesterday' : days === 0 ? 'Travel date set to today' : `Travel date set to ${days} day${days === 1 ? '' : 's'} from now`)
  }
  const DAYS: [number, string][] = [[-1, 'Yesterday'], [0, 'Today'], [1, 'Tomorrow'], [3, 'In 3 days'], [7, 'In a week']]
  const WINDOWS: [string, number][] = [['15:00', PAYMENT_WINDOW_MS], ['1:00', 60_000], ['0:05', 5_000]]

  // ------------------------------------------------ screens
  const sampleBooking = () => raw?.booking ?? buildTicket('oceanjet', 'confirmed', 0).booking
  const stdPage = (to: string) => () => {
    if (booking.flow !== 'standard') update(freshPatch)
    go(to)
  }
  type Screen = { title: string; hint?: string; run: () => void; needs?: string | false; active?: boolean }
  // Voucher states: open Review & pay with no voucher, then the field types this code and presses Apply
  const voucherTry = (title: string, code: string, hint = code): Screen => ({
    title,
    hint,
    run: () => {
      stdPage('/book/review')()
      update({ voucher: undefined })
      setTimeout(() => {
        voucherDemo.clear?.()
        if (code === 'GONE') voucherDemo.gone?.()
        else voucherDemo.apply?.(code)
        document.getElementById('voucher')?.scrollIntoView({ block: 'center' })
      }, 700)
    },
  })
  const notEligible = lineOf(booking) === 'maayo' ? 'BIG500' : 'MAAYO150'
  // Paid with SAVE200, then a status after payment: one seeded trip, opens its booking details
  const paidWithVoucher = (title: string, status: 'confirmed' | 'for_refund' | 'refunded', days: number): Screen => ({
    title,
    hint: `SAVE200 · ${LINES[line].name}`,
    run: () => {
      const t = buildTicket(line, status, days, status === 'confirmed' ? [] : ['p1', 'p2', 'p3'])
      const withVoucher = { ...t.booking, voucher: 'SAVE200' }
      seed({ ...t, booking: withVoucher, total: moneyOf({ booking: withVoucher }).total }, `/tickets?group=${status === 'confirmed' ? 'upcoming' : 'cancelled'}`)
      // open its details once the seeded trip is in (going straight there can race the seed and bounce back to the list)
      setTimeout(() => go(`/tickets/${t.id}`), 80)
    },
  })
  const emailPin = (st: 'auto' | 'default' | 'focus' | 'mismatch' | 'confirmed', title: string): Screen => ({
    title,
    active: flags.emailState === st,
    run: () => {
      setProtoFlag('emailState', st)
      stdPage('/book/review')()
      setTimeout(() => document.getElementById('review-email')?.scrollIntoView({ block: 'center' }), 700)
    },
  })
  const screens: [string, Screen[]][] = [
    ['Main tabs', [
      { title: 'Home', run: () => go('/') },
      { title: 'Passengers', run: () => go('/passengers') },
      { title: 'Schedule', run: () => go('/schedule') },
      { title: 'My Tickets', run: () => go('/tickets') },
      { title: 'Settings', run: () => go('/account') },
    ]],
    ['Booking steps', [
      { title: '1. Passengers & vehicle', run: stdPage('/book') },
      { title: '2. Select departure', run: stdPage('/book/departure') },
      { title: '3. Passenger details', run: stdPage('/book/details') },
      { title: '4. Review & pay', run: stdPage('/book/review') },
      { title: 'Confirmation', needs: !latest && 'Needs a trip', run: () => latest && go(`/book/confirmed?id=${latest.id}`) },
      { title: 'Booking details', needs: !latest && 'Needs a trip', run: () => latest && go(`/tickets/${latest.id}`) },
    ]],
    ['Email field states (Review & pay)', [
      emailPin('auto', 'Normal'),
      emailPin('default', 'Empty'),
      emailPin('focus', 'Focused'),
      emailPin('mismatch', 'Emails don’t match'),
      emailPin('confirmed', 'Confirmed'),
    ]],
    ['Voucher states (Review & pay)', [
      voucherTry('Applied', 'SAVE200'),
      voucherTry('Invalid code', 'XYZ123'),
      voucherTry('Expired', 'SUMMER100'),
      voucherTry('Not eligible', notEligible),
      voucherTry('No longer available', 'GONE', 'SAVE200, fails at Pay'),
    ]],
    ['Paid with a voucher', [
      paidWithVoucher('Paid · confirmed', 'confirmed', 3),
      paidWithVoucher('Cancelled · for refund', 'for_refund', 9),
      paidWithVoucher('Refunded', 'refunded', 12),
    ]],
    ['Other booking flows', [
      { title: 'Return trip · date', run: () => (update(returnPatch(sampleBooking())), go('/book/return')) },
      { title: 'Return trip · departure', run: () => (update(returnPatch(sampleBooking())), go('/book/departure')) },
      { title: 'Book another trip', run: () => (update(anotherPatch(sampleBooking())), go('/book/another')) },
      { title: 'Rebook · departure', run: () => (update({ ...sampleBooking(), flow: 'rebook', lineLock: 'oceanjet', departureId: null }), go('/book/departure')) },
    ]],
    ['System screens', [
      { title: 'Session expired', run: () => go('/session-expired') },
      { title: 'Page not found', run: () => go('/not-a-real-page') },
      { title: 'Maintenance', run: () => setProtoFlag('maintenance', true) },
      { title: 'Offline toast', run: () => playOffline() },
    ]],
    ['Account', [
      { title: 'Login', run: () => go('/login') },
      { title: 'Privacy policy', run: () => go('/privacy') },
      { title: 'Terms of service', run: () => go('/terms') },
    ]],
  ]
  const q = query.trim().toLowerCase()
  const shownScreens = screens.map(([g, items]) => [g, items.filter((s) => !q || s.title.toLowerCase().includes(q) || g.toLowerCase().includes(q))] as const).filter(([, items]) => items.length > 0)

  const reload = () => {
    signOut()
    seedTickets([])
    reset()
    setProtoFlag('fast', false)
    setProtoFlag('declineNext', false)
    setProtoFlag('vouchersGone', false)
    setProtoFlag('offline', false)
    setProtoFlag('maintenance', false)
    setProtoFlag('emailState', 'auto')
    go('/')
    flash('Prototype reset')
  }

  // status track: main path + where the current status sits on it
  const MAIN: Key[] = ['none', 'pending', paidKey === 'confirmed' ? 'under_review' : paidKey, 'confirmed', 'completed']
  const order = (k: Key) => (k === 'generating' || k === 'under_review' ? 2 : MAIN.indexOf(k))
  const pos = order(status)
  const mainSub: Record<string, string> = {
    none: user ? 'Signed in, no bookings' : 'Guest, no bookings',
    pending: '15 minutes to pay',
    under_review: 'OceanJet checks the payment',
    generating: 'Maayo Shipping issues the ticket',
    confirmed: 'Boarding pass ready',
    completed: 'Travel date has passed',
  }
  const more: [string, boolean, () => void][] = [
    ['Rebook', !latest, () => latest && rebook(latest)],
    ['Book another trip', !raw, () => raw && (update(anotherPatch(raw.booking)), go('/book/another'))],
    ['Session expires', !user, () => (signOut(), go('/session-expired'))],
    [flags.offline ? 'Restore connection' : 'Lose connection', false, () => setProtoFlag('offline', !flags.offline)],
  ]

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-expanded={false}
          aria-label="Open prototype controls"
          ref={(el) => void (ref.current = el)}
          {...handlers}
          style={{ ...place, touchAction: 'none' }}
          onClick={() => !moved() && setOpen(true)}
          className="fixed right-[12px] bottom-[24px] z-[60] flex h-[34px] cursor-grab items-center gap-[8px] rounded-full border border-[#e4e4e7] bg-white px-[12px] text-[12px] font-medium text-[#18181b] shadow-[0_4px_14px_rgba(0,0,0,0.1)] select-none active:cursor-grabbing max-[560px]:bottom-[84px]"
        >
          <Dot color={look.color} />
          {note ? <span key={note.id} className="animate-page-enter">{note.text}</span> : stateLabel}
        </button>
      )}

      {open && (
        <aside
          aria-label="Prototype controls"
          ref={(el) => void (ref.current = el)}
          style={place}
          className="fixed right-[12px] bottom-[12px] z-[60] flex max-h-[calc(100dvh-24px)] w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[20px] border border-[#e4e4e7] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
        >
          {/* header: drag handle + current status */}
          <header {...handlers} style={{ touchAction: 'none' }} className="cursor-grab px-[16px] pt-[14px] pb-[12px] select-none active:cursor-grabbing">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[#8e8e93]">Prototype controls</p>
              <button type="button" data-nodrag aria-label="Close prototype controls" onClick={() => setOpen(false)} className="flex size-[26px] items-center justify-center rounded-full text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="mt-[4px] flex items-center gap-[8px]">
              <Dot color={look.color} size={10} />
              <p className="text-[16px] leading-[22px] font-semibold text-[#18181b]">{look.name}</p>
            </div>
            <p className="truncate pl-[18px] text-[12px] text-[#8e8e93]">
              {user ? 'Signed in as Juan' : 'Guest'}
              {raw && ` · ${LINES[latestLine].name} · ${raw.booking.from.code} → ${raw.booking.to.code}`}
            </p>
          </header>

          {/* tabs */}
          <div role="tablist" className="flex justify-between border-b border-[#f0f0f0] px-[16px]">
            {TABS.map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`relative shrink-0 pt-[2px] pb-[10px] text-[12px] font-medium transition-colors ${tab === id ? 'text-[#18181b]' : 'text-[#a1a1aa] hover:text-[#52525b]'}`}>
                {label}
                {tab === id && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#18181b]" />}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-[16px] pt-[14px] pb-[16px] [scrollbar-width:thin]">
            {tab === 'status' && (
              <div className="animate-page-enter">
                <div className="mb-[16px] grid grid-cols-1 gap-y-[6px]">
                  <span className="text-[11px] font-medium text-[#8e8e93]">User</span>
                  <Segmented
                    value={user ? 'user' : 'guest'}
                    items={[['guest', 'Guest'], ['user', 'Signed in']]}
                    onChange={(v) => (v === 'user' ? (signIn('juan.delacruz@gmail.com'), flash('Signed in as Juan')) : (signOut(), flash('Signed out')))}
                  />
                  <span className="mt-[6px] text-[11px] font-medium text-[#8e8e93]">Shipping line</span>
                  <Segmented
                    value={line}
                    items={LINE_LIST.map((l) => [l, <>{LOGO[l] && <img alt="" src={LOGO[l]} className="size-[16px] rounded-[4px] object-contain" />}{LINES[l].name.replace(' Shipping', '')}</>])}
                    onChange={(l) => (setLine(l), flash(`${LINES[l].name} selected`))}
                  />
                </div>

                <Label>Booking status · tap a step to jump to it</Label>
                <div className="pl-[2px]">
                  {MAIN.map((k, i) => (
                    <div key={k}>
                      <Step k={status === 'generating' && i === 2 ? 'generating' : k} current={pos === i} done={pos > i} sub={mainSub[k] ?? ''} onClick={() => jump(k)} last={i === MAIN.length - 1} />
                      {(k === 'pending' || k === 'confirmed') && (
                        <div className="-mt-[6px] mb-[12px] ml-[23px] flex flex-wrap gap-[6px]">
                          {k === 'pending' ? (
                            <>
                              <Branch k="expired" current={status === 'expired'} onClick={() => jump('expired')} />
                              <Branch k="failed" current={status === 'failed'} onClick={() => jump('failed')} hint="Maayo Shipping only" />
                            </>
                          ) : (
                            <>
                              <Branch k="for_refund" current={status === 'for_refund'} onClick={() => jump('for_refund')} />
                              <Branch k="refunded" current={status === 'refunded'} onClick={() => jump('refunded')} />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button type="button" onClick={next.run} className="mt-[4px] flex w-full items-center gap-[12px] rounded-[12px] bg-[#18181b] px-[14px] py-[11px] text-left text-white transition-colors hover:bg-[#27272a] active:scale-[0.99]">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] text-white/55">Next step</span>
                    <span className="block text-[14px] leading-[20px] font-semibold">{next.label}</span>
                    <span className="block truncate text-[11.5px] text-white/55">{next.sub}</span>
                  </span>
                  <Arrow />
                </button>

                <div className="mt-[16px]">
                  <Label>Other events</Label>
                  <div className="flex flex-wrap gap-[6px]">
                    {more.map(([label, disabled, run]) => (
                      <button key={label} type="button" disabled={disabled} onClick={() => (run(), flash(label))} className="rounded-[8px] border border-[#e4e4e7] px-[10px] py-[5px] text-[12px] text-[#3f3f46] transition-colors hover:border-[#a1a1aa] hover:text-[#18181b] disabled:opacity-40 disabled:hover:border-[#e4e4e7]">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'walkthroughs' && (
              <div className="animate-page-enter">
                <p className="pb-[10px] text-[12px] leading-[17px] text-[#8e8e93]">Plays a flow on its own, with captions at the top. Pause, skip or stop anytime.</p>
                <div className="divide-y divide-[#f0f0f0]">
                  {walkthroughs.map((w) => (
                    <button key={w.id} type="button" onClick={() => startWalkthrough(w)} className="group flex w-full items-center gap-[12px] py-[11px] text-left">
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] leading-[18px] font-medium text-[#18181b]">{w.title}</span>
                        <span className="block text-[11.5px] leading-[16px] text-[#8e8e93]">
                          {w.blurb} · {w.scenes.length} steps
                        </span>
                      </span>
                      <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full border border-[#e4e4e7] text-[#52525b] transition-colors group-hover:border-[#18181b] group-hover:bg-[#18181b] group-hover:text-white">
                        <PlayIcon />
                      </span>
                    </button>
                  ))}
                </div>
                <p className="pt-[8px] text-[11px] text-[#a1a1aa]">Uses the shipping line selected under Status ({LINES[line].name}).</p>
              </div>
            )}

            {tab === 'dates' && (
              <div className="animate-page-enter">
                <Label>Travel date of the latest trip</Label>
                {!raw ? (
                  <p className="rounded-[10px] bg-[#f4f4f5] p-[12px] text-[12px] text-[#71717a]">No trip yet. Pick a status under Status first.</p>
                ) : (
                  <>
                    <div className="relative flex justify-between pt-[2px]">
                      <span className="absolute top-[8px] right-[24px] left-[24px] h-px bg-[#e4e4e7]" />
                      {DAYS.map(([d, label]) => {
                        const on = daysAway === d
                        return (
                          <button key={d} type="button" onClick={() => shift(d)} className="group relative z-10 flex w-[60px] flex-col items-center gap-[6px]">
                            <span className={`size-[13px] rounded-full border-2 transition-all ${on ? 'border-[#18181b] bg-[#18181b]' : 'border-[#d4d4d8] bg-white group-hover:border-[#71717a]'}`} />
                            <span className={`text-[11px] ${on ? 'font-semibold text-[#18181b]' : 'text-[#8e8e93]'}`}>{label}</span>
                          </button>
                        )
                      })}
                    </div>
                    <p className="pt-[10px] text-[11.5px] text-[#a1a1aa]">Currently {raw.booking.date}</p>
                  </>
                )}

                <div className="mt-[20px]">
                  <Label>Time left to pay</Label>
                  <div className="grid grid-cols-3 gap-[6px]">
                    {WINDOWS.map(([t, ms]) => (
                      <button key={t} type="button" disabled={status !== 'pending'} onClick={() => (here({ pendingUntil: Date.now() + ms }), go('/tickets'), flash(`${t} left to pay`))} className="rounded-[10px] border border-[#e4e4e7] py-[9px] font-mono text-[15px] text-[#18181b] transition-colors hover:border-[#a1a1aa] disabled:opacity-40 disabled:hover:border-[#e4e4e7]">
                        {t}
                      </button>
                    ))}
                  </div>
                  {status !== 'pending' && <p className="pt-[8px] text-[11.5px] text-[#a1a1aa]">Needs a booking in Pending payment.</p>}
                </div>
              </div>
            )}

            {tab === 'conditions' && (
              <div className="animate-page-enter">
                <div className="divide-y divide-[#f0f0f0]">
                  <Switch title="Fast timers" desc="Review, ticket issuing and refunds take about 1 second" on={flags.fast} onClick={() => setProtoFlag('fast', !flags.fast)} />
                  <Switch title="Next payment fails" desc="Maayo Shipping declines the next card payment" on={flags.declineNext} onClick={() => setProtoFlag('declineNext', !flags.declineNext)} />
                  <Switch title="Vouchers run out at checkout" desc="Paying with a voucher fails: someone else checked out first. Try SAVE200, MAAYO150, BIG500, SUMMER100" on={flags.vouchersGone} onClick={() => setProtoFlag('vouchersGone', !flags.vouchersGone)} />
                  <Switch title="Offline" desc="Shows the “You’re offline” toast" on={flags.offline} onClick={() => setProtoFlag('offline', !flags.offline)} />
                  <Switch title="Maintenance mode" desc="The whole app shows the maintenance screen" on={flags.maintenance} onClick={() => setProtoFlag('maintenance', !flags.maintenance)} />
                </div>
                <div className="mt-[12px] flex gap-[8px]">
                  <button type="button" onClick={() => (seedTickets([]), flash('Trips cleared'))} className="flex-1 rounded-[10px] border border-[#e4e4e7] py-[9px] text-[12.5px] font-medium text-[#3f3f46] hover:border-[#a1a1aa]">
                    Clear trips
                  </button>
                  <button type="button" onClick={reload} className="flex-1 rounded-[10px] border border-[#e4e4e7] py-[9px] text-[12.5px] font-medium text-[#dc2626] hover:border-[#fca5a5]">
                    Reset prototype
                  </button>
                </div>
              </div>
            )}

            {tab === 'screens' && (
              <div className="animate-page-enter">
                <label className="mb-[14px] flex h-[34px] items-center gap-[8px] rounded-[10px] border border-[#e4e4e7] px-[10px] focus-within:border-[#a1a1aa]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search screens" className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-[#a1a1aa]" />
                </label>
                {shownScreens.length === 0 && <p className="py-[16px] text-center text-[12px] text-[#8e8e93]">No screen matches “{query}”.</p>}
                {shownScreens.map(([group, items]) => (
                  <section key={group} className="mb-[14px]">
                    <Label>{group}</Label>
                    <div className="grid grid-cols-2 gap-[6px]">
                      {items.map((s) => (
                        <button
                          key={s.title}
                          type="button"
                          disabled={!!s.needs}
                          title={s.needs || undefined}
                          onClick={() => (s.run(), flash(`Opened ${s.title}`))}
                          className={`truncate rounded-[10px] border px-[10px] py-[8px] text-left text-[12px] transition-colors disabled:opacity-40 ${s.active ? 'border-[#18181b] font-medium text-[#18181b]' : 'border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b]'}`}
                        >
                          {s.title}
                          {s.hint && <span className="block truncate text-[10.5px] text-[#a1a1aa]">{s.hint}</span>}
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          {/* action confirmation */}
          {note && (
            <div key={note.id} className="animate-page-enter pointer-events-none absolute inset-x-[16px] bottom-[14px] rounded-[10px] bg-[#18181b] px-[12px] py-[8px] text-center text-[12px] font-medium text-white shadow-lg">
              {note.text}
            </div>
          )}
        </aside>
      )}

      {play && <PlayerBar play={play} onPause={() => setPlay((p) => p && { ...p, paused: !p.paused })} onNext={advance} onStop={() => setPlay(null)} />}
      {paymentSheet}
    </>
  )
}
