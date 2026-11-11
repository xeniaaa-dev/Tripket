import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router'
import rotateCw from '../assets/live/schedule/rotate-cw.svg'
import ticketStar from '../assets/live/tickets/ticket-star.svg'
import { useBooking } from '../booking/BookingContext'
import { SheetPresence } from '../components/Drawer'
import BoardingPassSheet from '../components/tickets/BoardingPassSheet'
import SortSelect from '../components/tickets/SortSelect'
import TicketCard from '../components/tickets/TicketCard'
import TicketDetails from '../components/tickets/TicketDetails'
import { useTicketActions } from '../components/tickets/useTicketActions'
import { formatTimeAgo } from '../data/schedule'
import { demoTickets, GROUPS, isUnread, markRead, sortTickets, SORTS, STATUS, toView, type SortId, type StatusGroup, type TicketView } from '../data/tickets'

// Tickets tab (live: book.tripket.ph/tickets). Guest with no bookings = live exactly: "My Tickets", disabled sort pill,
// "No tickets yet" empty state. Once there are bookings the page behaves like live's signed-in view: Upcoming / Past /
// Cancelled tabs (?group=), "N Trips", working sort (?sort=), status cards. /tickets/:id = booking details.
// /tickets?demo=1 (or oceanjet | maayo | hsmarine) adds one sample ticket per Figma status and shipping line.

const HOME = { state: { pageEnter: true, noLoader: true } }

function useTickets() {
  const { tickets } = useBooking()
  const [params] = useSearchParams()
  const real = tickets.map(toView)
  const demo = params.get('demo')
  return demo ? [...real, ...demoTickets(demo)] : real
}

/** HeroUI Tabs, "secondary" variant: underline indicator slides (translate/width 250ms cubic-bezier(.32,.72,0,1)). */
function StatusTabs({ value, onChange, unread }: { value: StatusGroup; onChange: (g: StatusGroup) => void; unread: Record<StatusGroup, number> }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null)
  useLayoutEffect(() => {
    const el = refs.current[value]
    if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth })
  }, [value])
  return (
    <div className="relative border-b border-neutral-200">
      <div role="tablist" aria-label="Filter by status" className="relative inline-flex w-max min-w-full gap-9 pt-2">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            ref={(el) => {
              refs.current[g.id] = el
            }}
            type="button"
            role="tab"
            aria-selected={value === g.id}
            onClick={() => onChange(g.id)}
            className={`relative z-[1] h-10 w-auto text-base font-semibold transition-colors duration-150 ${value === g.id ? 'text-[#f97316]' : 'text-neutral-400 hover:opacity-70'}`}
          >
            <span className="relative inline-flex shrink-0 items-start">
              {g.label}
              {unread[g.id] > 0 && (
                <span className="-mt-[8px] ml-[3px] flex size-[18px] items-center justify-center rounded-full bg-[#f97316] text-[10px] leading-none font-bold text-white">
                  {unread[g.id]}
                </span>
              )}
            </span>
          </button>
        ))}
        {bar && (
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-0.5 bg-[#f97316] transition-[translate,width] duration-250 ease-[cubic-bezier(.32,.72,0,1)]"
            style={{ width: bar.w, translate: `${bar.x}px 0` }}
          />
        )}
      </div>
    </div>
  )
}

function TicketList() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const all = useTickets()
  const authorized = all.length > 0
  const group = (GROUPS.find((g) => g.id === params.get('group'))?.id ?? 'upcoming') as StatusGroup
  const sort = (SORTS.find((s) => s.id === params.get('sort'))?.id ?? 'departure_asc') as SortId
  const [pass, setPass] = useState<TicketView | null>(null)
  const { continuePayment, rebook, returnTrip, paymentSheet } = useTicketActions()

  // "Updated just now" + Refresh (icon spins 600ms; label re-renders every 30s)
  const [refreshedAt, setRefreshedAt] = useState(() => Date.now())
  const [, setTick] = useState(0)
  const [spinning, setSpinning] = useState(false)
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000)
    return () => clearInterval(id)
  }, [])
  const refresh = () => {
    setSpinning(true)
    setRefreshedAt(Date.now())
    setTimeout(() => setSpinning(false), 600)
  }

  const setQuery = (g: StatusGroup, s: SortId) => {
    const next = new URLSearchParams(params)
    next.set('group', g)
    if (s === 'departure_asc') next.delete('sort')
    else next.set('sort', s)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  // unread badges: opening a tab marks its tickets read (live calls countRead, then refetches the counts)
  const [, bump] = useState(0)
  const unread = Object.fromEntries(GROUPS.map((g) => [g.id, all.filter((t) => STATUS[t.status].group === g.id && isUnread(t)).length])) as Record<StatusGroup, number>
  const ids = all.filter((t) => STATUS[t.status].group === group && isUnread(t)).map((t) => t.id)
  const idsKey = ids.join()
  useEffect(() => {
    if (!idsKey) return
    const t = setTimeout(() => {
      markRead(idsKey.split(','))
      bump((n) => n + 1)
    }, 600)
    return () => clearTimeout(t)
  }, [idsKey])

  const list = sortTickets(
    all.filter((t) => STATUS[t.status].group === group),
    sort,
  )
  const groupLabel = GROUPS.find((g) => g.id === group)!.label.toLowerCase()

  return (
    <div className="relative mx-auto min-h-dvh max-w-lg bg-white px-4 pt-6 pb-[120px] select-none">
      <header className="relative flex items-center gap-2 pb-3">
        <div>
          <h2 className="text-[32px] leading-[1.15] font-bold tracking-[-0.8px] text-[#1c1917]">My Tickets</h2>
        </div>
        <div className="absolute right-0" />
      </header>

      {authorized && <StatusTabs value={group} onChange={(g) => setQuery(g, sort)} unread={unread} />}

      <div className="flex items-center justify-between gap-2 pt-3 pb-3">
        {list.length > 0 ? (
          <p className="text-sm text-neutral-500">
            <span className="font-bold text-neutral-900">{list.length}</span> <span className="font-medium"> Trip{list.length !== 1 ? 's' : ''}</span>
          </p>
        ) : (
          <span />
        )}
        <SortSelect value={sort} onChange={(s) => setQuery(group, s)} disabled={!authorized} />
      </div>
      <div className="flex items-center justify-between pb-5 text-sm text-neutral-500">
        <span>{formatTimeAgo(refreshedAt)}</span>
        <button type="button" onClick={refresh} className="flex cursor-pointer items-center gap-1.5 font-semibold text-[#f97316] transition-colors duration-150 hover:text-[#ea580c]">
          <img alt="" src={rotateCw} className={`size-4 ${spinning ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {list.length > 0 ? (
        <section className="mb-8">
          <div className="space-y-3">
            {list.map((t) => (
              <TicketCard
                key={t.id}
                ticket={t}
                onDetails={() => navigate(`/tickets/${t.id}${params.get('demo') ? `?demo=${params.get('demo')}` : ''}`)}
                onBoardingPass={() => setPass(t)}
                onRebook={() => rebook(t)}
                onReturnTrip={() => returnTrip(t)}
                onPay={() => continuePayment(t)}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <img alt="" src={ticketStar} className="size-9" />
          <div className="mb-1 text-lg font-medium text-[#1c1917]">{`No ${group !== 'upcoming' ? `${groupLabel} ` : ''}tickets yet`}</div>
          <div className="mb-6 max-w-[85%] text-[13px] leading-[1.38] font-light break-normal text-[#8e8e93]">Your booked trips will appear here.</div>
          <div className="flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/', HOME)}
              className="flex h-10 items-center justify-center rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-[transform,background-color] duration-250 hover:bg-orange-600 active:scale-[0.97]"
            >
              Book a trip
            </button>
          </div>
        </div>
      )}

      <SheetPresence open={pass !== null}>{pass && <BoardingPassSheet ticket={pass} onClose={() => setPass(null)} />}</SheetPresence>
      {paymentSheet}
    </div>
  )
}

function TicketRoute() {
  const { id } = useParams()
  const ticket = useTickets().find((t) => t.id === id)
  const [pass, setPass] = useState(false)
  if (!ticket) return <Navigate to="/tickets" replace />
  return (
    <>
      <TicketDetails ticket={ticket} onBoardingPass={() => setPass(true)} />
      <SheetPresence open={pass}>{pass && <BoardingPassSheet ticket={ticket} onClose={() => setPass(false)} />}</SheetPresence>
    </>
  )
}

export default function Tickets() {
  return (
    <Routes>
      <Route index element={<TicketList />} />
      <Route path=":id" element={<TicketRoute />} />
    </Routes>
  )
}
