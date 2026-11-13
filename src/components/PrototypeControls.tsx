import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { defaultBooking, useBooking, type Ticket } from '../booking/BookingContext'
import { addDays, formatBookingDate, parseBookingDate, startOfToday } from '../booking/date'
import { anotherPatch, freshPatch, returnPatch } from '../booking/flows'
import { buildTicket, LINES, lineOf, PAYMENT_WINDOW_MS, STATUS, toView, type ShippingLine } from '../data/tickets'
import { setProtoFlag, useProtoFlags } from '../proto/flags'
import { useTicketActions } from './tickets/useTicketActions'

// Floating "Prototype controls" state machine (modelled on pd-hospitality-user.vercel.app): jump the whole prototype to any
// traveller state, fire shipping-line events, shift the clock, flip conditions, or open any page. Prototype only — not in Figma or live.

type Tab = 'state' | 'clock' | 'events' | 'conditions' | 'pages'
const TABS: [Tab, string][] = [['state', 'State'], ['clock', 'Clock'], ['events', 'Events'], ['conditions', 'Conditions'], ['pages', 'Pages']]
const LINE_LIST: ShippingLine[] = ['oceanjet', 'hsmarine', 'maayo']

const Icon = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
)
const ICON = {
  wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.1L3 17.7V21h3.3l6.3-6.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
  ticket: 'M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3zM13 6v12',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  page: 'M6 3h9l4 4v14H6zM14 3v5h5',
  route: 'M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 17h6a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h6',
}

type Item = { title: string; desc: string; icon: keyof typeof ICON; needs?: string | false; active?: boolean; run: () => void }

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mb-[16px]">
    <h3 className="px-[4px] pb-[8px] text-[11px] leading-[16px] font-semibold tracking-[0.8px] text-[#6b6b70] uppercase">{title}</h3>
    {children}
  </section>
)
const List = ({ items }: { items: Item[] }) => (
  <div className="divide-y divide-[#ececf0] overflow-hidden rounded-[14px] border border-[#e5e5ea] bg-white">
    {items.map((it) => (
      <button
        key={it.title}
        type="button"
        disabled={!!it.needs}
        onClick={it.run}
        className={`flex w-full items-center gap-[12px] px-[12px] py-[10px] text-left transition-colors disabled:opacity-60 disabled:hover:bg-white ${it.active ? 'bg-[#f4f4f5]' : 'hover:bg-[#fafafa]'}`}
      >
        <span className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-[#f1f1f4] text-[#5e5d5f]">
          <Icon d={ICON[it.icon]} />
        </span>
        <span className="min-w-0">
          <span className="block text-[13px] leading-[18px] font-semibold text-[#1c1917]">{it.title}</span>
          <span className={`block text-[12px] leading-[16px] ${it.needs ? 'text-[#8e8e93] italic' : 'text-[#6b6b70]'}`}>{it.needs || it.desc}</span>
        </span>
      </button>
    ))}
  </div>
)
const Toggle = ({ title, desc, on, onClick }: { title: string; desc: string; on: boolean; onClick: () => void }) => (
  <button type="button" role="switch" aria-checked={on} onClick={onClick} className="flex w-full items-center justify-between gap-[12px] px-[12px] py-[10px] text-left">
    <span>
      <span className="block text-[13px] leading-[18px] font-semibold text-[#1c1917]">{title}</span>
      <span className="block text-[12px] leading-[16px] text-[#6b6b70]">{desc}</span>
    </span>
    <span className={`flex h-[24px] w-[42px] shrink-0 items-center rounded-full px-[3px] transition-colors ${on ? 'bg-[#34c759]' : 'bg-[#d4d4d8]'}`}>
      <span className={`size-[18px] rounded-full bg-white shadow transition-transform ${on ? 'translate-x-[18px]' : ''}`} />
    </span>
  </button>
)
const Chips = ({ items }: { items: [string, string, () => void, boolean?, boolean?][] }) => (
  <div className="grid grid-cols-2 gap-[8px]">
    {items.map(([title, desc, run, disabled, active]) => (
      <button key={title} type="button" disabled={disabled} aria-pressed={!!active} onClick={run} className={`rounded-[12px] border p-[10px] text-left transition-colors disabled:opacity-50 ${active ? 'border-[#1c1917] bg-[#f4f4f5]' : 'border-[#e5e5ea] bg-white hover:bg-[#fafafa]'}`}>
        <span className="block text-[13px] leading-[18px] font-semibold text-[#1c1917]">{title}</span>
        <span className="block text-[11px] leading-[15px] text-[#6b6b70]">{desc}</span>
      </button>
    ))}
  </div>
)


export default function PrototypeControls() {
  const navigate = useNavigate()
  const { user, signIn, signOut } = useAuth()
  const { booking, update, reset, tickets, seedTickets, updateTicket } = useBooking()
  const { rebook, paymentSheet } = useTicketActions()
  const flags = useProtoFlags()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('state')
  const [line, setLine] = useState<ShippingLine>('oceanjet')

  const latest = tickets.length ? toView(tickets[tickets.length - 1]) : undefined
  const raw: Ticket | undefined = tickets[tickets.length - 1]
  const status = latest?.status

  const stateLabel = !latest ? (user ? 'Signed in, no trips' : 'Signed out') : STATUS[latest.status].label
  const go = (to: string) => navigate(to, { state: { pageEnter: true, noLoader: true } })
  const here = (patch: Partial<Ticket>) => raw && updateTicket(raw.id, patch)

  // ------------------------------------------------------------------ State: sign-in + a seeded trip, then the screen that shows it
  const start = (who: 'guest' | 'user', seed: Ticket | null, to: string) => {
    if (who === 'guest') signOut()
    else signIn('juan.delacruz@gmail.com')
    seedTickets(seed ? [seed] : [])
    update({ ...defaultBooking })
    go(to)
  }
  const stateItems: (Item & { id: string })[] = [
    { id: 'guest', title: 'Signed out', desc: 'Guest Home, nothing booked', icon: 'ticket', active: !latest && !user, run: () => start('guest', null, '/') },
    { id: 'user', title: 'Signed in, no trips', desc: 'Account, nothing booked yet', icon: 'ticket', active: !latest && !!user, run: () => start('user', null, '/') },
    { id: 'pending', title: 'Pending payment', desc: 'Seat held, 15:00 to pay', icon: 'ticket', active: status === 'pending', run: () => start('user', buildTicket(line, 'pending', 5), '/tickets') },
    { id: 'posted', title: 'Payment posted', desc: 'Under review, generating or booked, by line', icon: 'ticket', active: status === 'under_review' || status === 'generating', run: () => start('user', buildTicket(line, LINES[line].paidStatus, 5), '/tickets') },
    { id: 'booked', title: 'Booked', desc: 'Boarding pass ready', icon: 'ticket', active: status === 'confirmed', run: () => start('user', buildTicket(line, 'confirmed', 3), '/tickets') },
    { id: 'departed', title: 'Departed', desc: 'Trip finished: opens Past; Home gets Return trip + Recent Trips', icon: 'ticket', active: status === 'completed', run: () => start('user', buildTicket(line, 'confirmed', -2), '/tickets?group=past') },
    { id: 'for_refund', title: 'For refund', desc: 'Cancelled, refund in progress', icon: 'ticket', active: status === 'for_refund', run: () => start('user', buildTicket(line, 'for_refund', 9, ['p1', 'p2', 'p3']), '/tickets?group=cancelled') },
    { id: 'refunded', title: 'Refunded', desc: 'Refund completed', icon: 'ticket', active: status === 'refunded', run: () => start('user', buildTicket(line, 'refunded', 12, ['p1', 'p2', 'p3']), '/tickets?group=cancelled') },
    { id: 'expired', title: 'Expired', desc: 'Payment window ended', icon: 'ticket', active: status === 'expired', run: () => start('user', buildTicket(line, 'expired', 2), '/tickets?group=cancelled') },
    { id: 'failed', title: 'Payment failed', desc: 'Card declined (Maayo Shipping only)', icon: 'ticket', needs: line !== 'maayo' && 'Switch the shipping line to Maayo', active: status === 'failed', run: () => start('user', buildTicket(line, 'failed', 2), '/tickets?group=cancelled') },
  ]

  // ------------------------------------------------------------------ Events: things the shipping line / payment gateway do
  const need = (ok: boolean, why: string) => (!latest ? 'Needs a trip' : ok ? false : why)
  const ticketEvents: Item[] = [
    { title: 'Shipping line confirms booking', desc: 'Under review / generating → Booked', icon: 'bolt', needs: need(status === 'under_review' || status === 'generating', 'Needs a trip under review or generating'), run: () => here({ status: 'confirmed' }) },
    { title: 'Payment received', desc: 'Pending → the line’s first paid status', icon: 'bolt', needs: need(status === 'pending', 'Needs a pending payment'), run: () => latest && here({ status: LINES[latestLine(latest)].paidStatus, pendingUntil: undefined }) },
    { title: 'Payment window expires', desc: 'Pending → Expired', icon: 'bolt', needs: need(status === 'pending', 'Needs a pending payment'), run: () => here({ status: 'expired', pendingUntil: undefined }) },
    { title: 'Payment fails', desc: 'Pending → Payment failed (Maayo only)', icon: 'bolt', needs: need(status === 'pending' && latest !== undefined && latestLine(latest) === 'maayo', 'Needs a pending Maayo payment'), run: () => here({ status: 'failed', pendingUntil: undefined }) },
    { title: 'Cancel booking', desc: 'Booked → For refund (all passengers)', icon: 'bolt', needs: need(status === 'confirmed' || status === 'under_review' || status === 'generating', 'Needs a booked trip'), run: () => raw && here({ status: 'for_refund', cancelledPassengerIds: raw.booking.passengers.map((p) => p.id) }) },
    { title: 'Complete refund', desc: 'For refund → Refunded', icon: 'bolt', needs: need(status === 'for_refund', 'Needs a trip waiting for refund'), run: () => here({ status: 'refunded' }) },
  ]
  const sessionEvents: Item[] = [
    { title: 'Session expires', desc: 'Signed out → Session Expired screen', icon: 'bolt', needs: !user && 'Needs a signed-in user', run: () => (signOut(), go('/session-expired')) },
    { title: flags.offline ? 'Connection restored' : 'Lose connection', desc: flags.offline ? '“Back online” toast' : '“You’re offline” toast', icon: 'bolt', run: () => setProtoFlag('offline', !flags.offline) },
  ]
  const flowEvents: Item[] = [
    { title: 'Rebook this trip', desc: 'Date sheet → same route and shipping line', icon: 'route', needs: !latest && 'Needs a trip', run: () => latest && rebook(latest) },
    { title: 'Book return trip', desc: 'Route reversed, passengers carried over', icon: 'route', needs: !latest && 'Needs a trip', run: () => raw && (update(returnPatch(raw.booking)), go('/book/return')) },
    { title: 'Book another trip', desc: 'From = last destination', icon: 'route', needs: !latest && 'Needs a trip', run: () => raw && (update(anotherPatch(raw.booking)), go('/book/another')) },
  ]

  // ------------------------------------------------------------------ Clock
  // days from today to the latest trip's travel date (negative = already departed)
  const daysAway = raw ? Math.round((parseBookingDate(raw.booking.date).getTime() - startOfToday().getTime()) / 86_400_000) : null
  // Move the trip, then open the Tickets tab that shows it so the change is visible
  const shift = (days: number) => {
    if (!raw) return
    here({ booking: { ...raw.booking, date: formatBookingDate(addDays(startOfToday(), days)) } })
    const group = raw.status === 'confirmed' && days < 0 ? 'past' : STATUS[raw.status].group
    go(`/tickets?group=${group}`)
  }
  const dayItems: [string, string, number][] = [['Departs in 3 days', 'Upcoming', 3], ['Departs tomorrow', 'Tomorrow', 1], ['Departs today', 'Today', 0], ['Departed yesterday', 'Past → Departed', -1]]
  const windowItems: [string, number][] = [['15:00 left', PAYMENT_WINDOW_MS], ['1:00 left', 60_000], ['0:05 left', 5_000]]

  // ------------------------------------------------------------------ Pages
  const sampleBooking = () => raw?.booking ?? buildTicket('oceanjet', 'confirmed', 0).booking
  const stdPage = (to: string): (() => void) => () => {
    if (booking.flow !== 'standard') update(freshPatch)
    go(to)
  }
  const pages: [string, Item[]][] = [
    ['Tabs', [
      { title: 'Home', desc: 'Search, popular routes, return + recent trips', icon: 'page', run: () => go('/') },
      { title: 'Passengers', desc: 'Saved profiles & vehicles', icon: 'page', run: () => go('/passengers') },
      { title: 'Schedule', desc: 'Departure board', icon: 'page', run: () => go('/schedule') },
      { title: 'My Tickets', desc: 'Upcoming, past and cancelled', icon: 'page', run: () => go('/tickets') },
      { title: 'Settings', desc: 'Account and legal', icon: 'page', run: () => go('/account') },
    ]],
    ['Book', [
      { title: 'Passengers & vehicle', desc: 'Step 1 of 4', icon: 'page', run: stdPage('/book') },
      { title: 'Select departure', desc: 'Step 2 of 4', icon: 'page', run: stdPage('/book/departure') },
      { title: 'Passenger details', desc: 'Step 3 of 4', icon: 'page', run: stdPage('/book/details') },
      { title: 'Review & pay', desc: 'Step 4 of 4 · card, GCash, Maya, QR Ph', icon: 'page', run: stdPage('/book/review') },
      { title: 'Confirmation', desc: 'Latest trip’s screen for its status and line', icon: 'page', needs: !latest && 'Needs a trip', run: () => latest && go(`/book/confirmed?id=${latest.id}`) },
      { title: 'Booking details', desc: 'Latest trip, boarding pass and actions', icon: 'page', needs: !latest && 'Needs a trip', run: () => latest && go(`/tickets/${latest.id}`) },
    ]],
    ['Review & pay · email card', (['auto', 'default', 'focus', 'mismatch', 'confirmed'] as const).map((st): Item => ({
      title: { auto: 'Email · normal', default: 'Email · default', focus: 'Email · focused', mismatch: 'Email · emails don’t match', confirmed: 'Email · confirmed' }[st],
      desc: { auto: 'Not pinned: behaves as you type', default: 'Both fields empty', focus: 'Orange border on the email field', mismatch: 'Red confirm field + error message', confirmed: 'Green field, tick and “Confirmed”' }[st],
      icon: 'page',
      active: flags.emailState === st,
      run: () => {
        setProtoFlag('emailState', st)
        stdPage('/book/review')()
        setTimeout(() => document.getElementById('review-email')?.scrollIntoView({ block: 'center' }), 700)
      },
    }))],
    ['Other booking flows', [
      { title: 'Return trip · When do you return?', desc: '1 of 3', icon: 'route', run: () => (update(returnPatch(sampleBooking())), go('/book/return')) },
      { title: 'Return trip · Select departure', desc: '2 of 3', icon: 'route', run: () => (update(returnPatch(sampleBooking())), go('/book/departure')) },
      { title: 'Book another trip', desc: '1 of 4 · To is blank', icon: 'route', run: () => (update(anotherPatch(sampleBooking())), go('/book/another')) },
      { title: 'Rebook · Select departure', desc: '1 of 2 · same shipping line only', icon: 'route', run: () => (update({ ...sampleBooking(), flow: 'rebook', lineLock: 'oceanjet', departureId: null }), go('/book/departure')) },
    ]],
    ['Utility', [
      { title: 'Session expired', desc: 'Hourglass + Sign In', icon: 'page', run: () => go('/session-expired') },
      { title: 'Page not found', desc: '404 + Back to Home', icon: 'page', run: () => go('/not-a-real-page') },
      { title: 'Maintenance', desc: 'We’ll be back shortly + Refresh', icon: 'page', run: () => setProtoFlag('maintenance', true) },
      { title: 'Offline toast', desc: '“You’re offline”, then “Back online”', icon: 'page', run: () => setProtoFlag('offline', true) },
    ]],
    ['Account', [
      { title: 'Login · Welcome', desc: 'Continue with email or as guest', icon: 'page', run: () => go('/login') },
      { title: 'Privacy policy', desc: '', icon: 'page', run: () => go('/privacy') },
      { title: 'Terms of service', desc: '', icon: 'page', run: () => go('/terms') },
    ]],
  ]

  const reload = () => {
    signOut()
    seedTickets([])
    reset()
    setProtoFlag('fast', false)
    setProtoFlag('declineNext', false)
    setProtoFlag('offline', false)
    setProtoFlag('maintenance', false)
    setProtoFlag('emailState', 'auto')
    go('/')
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-expanded={false}
          aria-label="Open prototype controls"
          onClick={() => setOpen(true)}
          className="fixed right-[12px] bottom-[24px] z-[60] flex h-[34px] items-center gap-[6px] rounded-full border border-dashed border-[#c9c9ce] bg-white/95 px-[12px] text-[12px] font-bold text-[#1c1917] shadow-[0_4px_14px_rgba(0,0,0,0.12)] backdrop-blur max-[560px]:bottom-[84px]"
        >
          <Icon d={ICON.wrench} />
          {stateLabel}
        </button>
      )}
      {open && (
        <aside
          aria-label="Prototype controls"
          className="fixed right-[12px] bottom-[12px] z-[60] flex max-h-[calc(100dvh-24px)] w-[360px] max-w-[calc(100vw-24px)] flex-col rounded-[20px] border border-[#e5e5ea] bg-white p-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
        >
          <header className="flex items-start justify-between gap-[8px] px-[4px] pb-[10px]">
            <div>
              <p className="text-[11px] leading-[16px] font-semibold tracking-[0.8px] text-[#6b6b70] uppercase">Prototype controls</p>
              <p className="text-[14px] leading-[20px] font-bold text-[#1c1917]">{stateLabel}</p>
            </div>
            <button type="button" aria-label="Close prototype controls" onClick={() => setOpen(false)} className="flex size-[32px] items-center justify-center rounded-full bg-[#f1f1f4] text-[#5e5d5f]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </header>
          <div role="tablist" className="mb-[12px] grid grid-cols-3 gap-[2px] rounded-[12px] bg-[#f0eeee] p-[3px]">
            {TABS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`rounded-[10px] py-[8px] text-[12px] font-semibold transition-colors ${tab === id ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#6b6b70]'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-[2px] [scrollbar-width:thin]">
            {tab === 'state' && (
              <>
                <Section title="Shipping line">
                  <div className="grid grid-cols-3 gap-[4px] rounded-[12px] bg-[#f0eeee] p-[3px]">
                    {LINE_LIST.map((l) => (
                      <button key={l} type="button" aria-pressed={line === l} onClick={() => setLine(l)} className={`rounded-[10px] py-[7px] text-[12px] font-semibold ${line === l ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#6b6b70]'}`}>
                        {LINES[l].name}
                      </button>
                    ))}
                  </div>
                </Section>
                <Section title="Traveller state">
                  <div className="grid grid-cols-2 gap-[8px]">
                    {stateItems.map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        disabled={!!it.needs}
                        onClick={it.run}
                        className={`rounded-[12px] border p-[10px] text-left transition-colors disabled:opacity-50 ${it.active ? 'border-[#1c1917] bg-[#f4f4f5]' : 'border-[#e5e5ea] bg-white hover:bg-[#fafafa]'}`}
                      >
                        <span className="block text-[13px] leading-[18px] font-semibold text-[#1c1917]">{it.title}</span>
                        <span className="block text-[11px] leading-[15px] text-[#6b6b70]">{it.needs || it.desc}</span>
                      </button>
                    ))}
                  </div>
                </Section>
              </>
            )}

            {tab === 'clock' && (
              <>
                <p className="px-[4px] pb-[12px] text-[12px] leading-[16px] text-[#6b6b70]">Moves the latest trip in time. Departed trips unlock Return trip and Recent Trips on Home.</p>
                <Section title="Travel day">
                  <Chips items={dayItems.map(([t, d, n]) => [t, !latest ? 'Needs a trip' : d, () => shift(n), !latest, daysAway === n] as [string, string, () => void, boolean, boolean])} />
                  {raw && <p className="px-[4px] pt-[8px] text-[12px] leading-[16px] text-[#6b6b70]">Latest trip: {raw.booking.date} · {STATUS[latest!.status].tag.toLowerCase()}</p>}
                </Section>
                <Section title="Payment window">
                  <Chips items={windowItems.map(([t, ms]) => [t, status === 'pending' ? 'Pending payment' : 'Needs a pending payment', () => (here({ pendingUntil: Date.now() + ms }), go('/tickets')), status !== 'pending'] as [string, string, () => void, boolean])} />
                </Section>
              </>
            )}

            {tab === 'events' && (
              <>
                <Section title="Shipping line & payment events">
                  <List items={ticketEvents} />
                </Section>
                <Section title="Session & connection">
                  <List items={sessionEvents} />
                </Section>
                <Section title="Booking flows">
                  <List items={flowEvents} />
                </Section>
              </>
            )}

            {tab === 'conditions' && (
              <>
                <Section title="Simulation">
                  <div className="divide-y divide-[#ececf0] overflow-hidden rounded-[14px] border border-[#e5e5ea]">
                    <Toggle title="Fast timers" desc="Review, ticket generation and refunds take ~1s" on={flags.fast} onClick={() => setProtoFlag('fast', !flags.fast)} />
                    <Toggle title="Next payment fails" desc="Maayo card payment is declined once" on={flags.declineNext} onClick={() => setProtoFlag('declineNext', !flags.declineNext)} />
                  </div>
                </Section>
                <Section title="Connection">
                  <div className="divide-y divide-[#ececf0] overflow-hidden rounded-[14px] border border-[#e5e5ea]">
                    <Toggle title="Offline" desc="Shows the “You’re offline” toast" on={flags.offline} onClick={() => setProtoFlag('offline', !flags.offline)} />
                    <Toggle title="Maintenance mode" desc="The whole app shows “We’ll be back shortly”" on={flags.maintenance} onClick={() => setProtoFlag('maintenance', !flags.maintenance)} />
                  </div>
                </Section>
                <Section title="Data">
                  <List
                    items={[
                      { title: 'Clear trips', desc: 'Removes every booked trip', icon: 'ticket', run: () => seedTickets([]) },
                      { title: 'Reset prototype', desc: 'Signed out, no trips, default switches', icon: 'bolt', run: reload },
                    ]}
                  />
                </Section>
              </>
            )}

            {tab === 'pages' && pages.map(([title, items]) => (
              <Section key={title} title={title}>
                <List items={items} />
              </Section>
            ))}
          </div>
        </aside>
      )}
      {paymentSheet}
    </>
  )
}

const latestLine = (t: { booking: { departureId: string | null } }): ShippingLine => lineOf(t.booking)

