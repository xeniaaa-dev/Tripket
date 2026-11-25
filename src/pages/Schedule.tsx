import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import chevronDown from '../assets/live/schedule/chevron-down-slate500.svg'
import closeOrange from '../assets/live/schedule/close-orange.svg'
import funnelOrange from '../assets/live/schedule/funnel-orange.svg'
import funnelSlate from '../assets/live/schedule/funnel-slate.svg'
import rotateCw from '../assets/live/schedule/rotate-cw.svg'
import DaySection from '../components/schedule/DaySection'
import EmptyPage from '../components/schedule/EmptyPage'
import PortSelectSheet from '../components/schedule/PortSelectSheet'
import ScheduleFilterSheet from '../components/schedule/ScheduleFilterSheet'
import { PAGE_LOAD } from '../components/PageLoader'
import { useBooking } from '../booking/BookingContext'
import { freshPatch } from '../booking/flows'
import { formatBookingDate } from '../booking/date'
import { scheduleDeparture } from '../data/departures'
import { dayOptions, departuresFor, emptyFilter, filterDepartures, formatTime, formatTimeAgo, portInitial, portName, type DayKey, type Departure, type ScheduleFilter } from '../data/schedule'

// Live keeps the filter in a global atom: it survives leaving and re-entering the tab (day selection does not).
let savedFilter: ScheduleFilter = emptyFilter

const outlineBtn = 'h-[42px] rounded-[16px] border text-[14px] leading-[20px] transition-[transform,background-color,box-shadow] duration-100 active:scale-[0.97]'
const idleShadow = 'shadow-[inset_0_1px_1px_#0000000d,0_1px_2px_#f5f5f5]'
const activeShadow = 'shadow-[inset_0_1px_1px_#0000000d,0_1px_2px_#f973161a]'

// Schedule tab — rebuilt from the live app (book.tripket.ph/schedule).
export default function Schedule() {
  // only sailings you can still book: Today and Tomorrow
  const days = useMemo(() => dayOptions().filter((d) => d.key !== 'yesterday'), [])
  const navigate = useNavigate()
  const { update } = useBooking()
  const [filter, setFilterState] = useState<ScheduleFilter>(savedFilter)
  const setFilter = (f: ScheduleFilter) => {
    savedFilter = f
    setFilterState(f)
  }
  const [selected, setSelected] = useState<DayKey>('today')
  const [totals, setTotals] = useState<Partial<Record<DayKey, number>>>({})
  const onTotal = useCallback((key: DayKey, n: number) => setTotals((t) => (t[key] === n ? t : { ...t, [key]: n })), [])

  // "Updated just now" + Refresh (icon spins for 600ms; the label re-renders every 30s)
  const [refreshedAt, setRefreshedAt] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())
  const [spinning, setSpinning] = useState(false)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])
  const refresh = () => {
    setSpinning(true)
    setRefreshedAt(Date.now())
    setNow(Date.now())
    setTimeout(() => setSpinning(false), 600)
  }

  const [sheet, setSheet] = useState<'port' | 'filter' | null>(null)

  const groupRefs = useRef<Partial<Record<DayKey, HTMLDivElement | null>>>({})
  const selectDay = (key: DayKey) => {
    setSelected(key)
    requestAnimationFrame(() => {
      setTimeout(() => groupRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    })
  }

  // Tapping a sailing starts booking it: route + date filled in, and that sailing pre-selected on Select departure
  const book = (d: Departure) => {
    const port = (name: string) => ({ code: portInitial(name), city: portName(name) })
    const id = scheduleDeparture({ id: d.id, line: d.operator.line, departure: d.departure, hours: d.duration })
    update({ ...freshPatch, flow: 'schedule', from: port(d.origin.name), to: port(d.destination.name), date: formatBookingDate(d.departure), scheduleTrip: id, departureId: id })
    navigate('/book', { state: PAGE_LOAD })
  }

  // "Next trip" pill: the first sailing today that hasn't left yet; shown while that row is off screen, tap to jump to it
  const nextTrip = useMemo(
    () =>
      filterDepartures(departuresFor('today'), filter)
        .sort((a, b) => a.departure.getTime() - b.departure.getTime())
        .find((d) => !d.cancelled && (d.actualDeparture ?? d.departure).getTime() > now),
    [filter, now],
  )
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null)
  const [nextDir, setNextDir] = useState<'up' | 'down' | null>(null)
  useEffect(() => {
    if (!nextEl) return
    // on screen = between the sticky filters (top) and the tab bar (bottom); otherwise point the pill toward it
    const check = () => {
      const r = nextEl.getBoundingClientRect()
      setNextDir(r.top > innerHeight - 110 ? 'down' : r.bottom < 230 ? 'up' : null)
    }
    check()
    addEventListener('scroll', check, { passive: true })
    addEventListener('resize', check)
    return () => {
      removeEventListener('scroll', check)
      removeEventListener('resize', check)
    }
  }, [nextEl])
  const showNext = nextEl && nextDir

  const current = days.find((d) => d.key === selected) ?? days[0]
  const allEmpty = Object.keys(totals).length >= days.length && Object.values(totals).every((n) => n === 0)
  const extraFilters = Boolean(filter.vesselType || filter.operatorId)
  const anyFilter = extraFilters || Boolean(filter.origin)

  return (
    <div className="relative mx-auto min-h-dvh max-w-[512px] bg-white pt-[12px] pb-[128px] select-none">
      <header className="relative mt-[8px] flex items-center gap-[8px] px-[20px] pb-[8px]">
        <div>
          <h2 className="text-[30px] leading-[36px] font-bold tracking-[-0.75px] text-[#1c1917]">Schedule</h2>
          <p className="mt-[4px] text-[14px] leading-[20px] text-[#737373]">
            {current.label}, {current.sub} · {totals[selected] ?? 0} departures
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-20 bg-white pt-[8px]">
        <div className="grid grid-cols-2 gap-[10px] px-[20px] pb-[14px]">
          {days.map((d) => {
            const on = d.key === selected
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => selectDay(d.key)}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-[16px] border px-[4px] py-[11px] transition-all duration-150 ${
                  on
                    ? 'border-transparent bg-gradient-to-b from-[#f97316] to-[#ea580c] text-white shadow-[0_6px_14px_-4px_rgba(249,115,22,0.55)]'
                    : 'border-[#e5e5e5] bg-white text-[#1c1917] shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-[#fafafa]'
                }`}
              >
                <span className={`text-[11px] leading-[14px] ${on ? 'text-white/85' : 'text-[#6b6b6b]'}`}>{d.sub2}</span>
                <span className="mt-[3px] text-[15px] leading-[20px] font-extrabold">{d.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-[10px] px-[20px] py-[14px]">
          <button
            type="button"
            onClick={() => setSheet('port')}
            className={`${outlineBtn} flex w-full items-center justify-between gap-[8px] overflow-hidden px-[16px] text-ellipsis whitespace-nowrap ${
              filter.origin ? `border-[#ffd6a7] bg-[#fff7ed] font-medium text-[#f97316] ${activeShadow}` : `border-[#e5e5e5] bg-white ${idleShadow}`
            }`}
          >
            <span className="truncate">
              {filter.origin ? (
                `From: ${filter.origin.name}`
              ) : (
                <>
                  <span className="font-medium text-[#8a8a8e]">From:</span> <span className="font-bold text-[#314158]">All</span>
                </>
              )}
            </span>
            <div className="flex items-center gap-[8px]">
              {filter.origin && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Clear origin filter"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFilter({ ...filter, origin: null })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation()
                      setFilter({ ...filter, origin: null })
                    }
                  }}
                  className="-m-[2px] flex size-[24px] cursor-pointer justify-center rounded-full p-[2px] hover:bg-[#e2e8f0]/60"
                >
                  <img alt="" src={closeOrange} className="size-[16px] shrink-0" />
                </span>
              )}
              <img alt="" src={chevronDown} className="size-[20px] shrink-0" />
            </div>
          </button>
          <button
            type="button"
            aria-label="Schedule filters"
            onClick={() => setSheet('filter')}
            className={`${outlineBtn} relative flex w-[42px] shrink-0 items-center justify-center ${
              extraFilters ? `border-[#ffd6a7] bg-[#fff7ed] ${activeShadow}` : `border-[#e5e5e5] bg-white ${idleShadow}`
            }`}
          >
            <img alt="" src={extraFilters ? funnelOrange : funnelSlate} className="size-[20px] shrink-0" />
            {extraFilters && <span className="absolute top-[6px] right-[6px] size-[8px] rounded-full bg-[#f97316]" />}
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-[#e5e5e5] px-[20px] py-[10px] text-[13px] leading-[18px] text-[#737373]">
          <span>{formatTimeAgo(refreshedAt)}</span>
          <button type="button" onClick={refresh} className="flex cursor-pointer items-center gap-[6px] font-bold text-[#f97316] transition-colors duration-150 hover:text-[#ea580c]">
            <img alt="" src={rotateCw} className={`size-[16px] ${spinning ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {showNext && nextTrip && (
          // floats at the bottom of the screen, just above the tab bar
          <div className="pointer-events-none fixed inset-x-0 bottom-[104px] z-30 flex justify-center">
            <button
              type="button"
              onClick={() => nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="animate-pop-up pointer-events-auto flex h-[40px] cursor-pointer items-center gap-[8px] rounded-full bg-[#f97316] px-[18px] text-[14px] font-bold text-white shadow-[0_6px_16px_rgba(249,115,22,0.35)] transition-transform active:scale-[0.97]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={nextDir === 'up' ? 'rotate-180' : ''} aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
              Next trip <span className="font-extrabold">{formatTime(nextTrip.actualDeparture ?? nextTrip.departure)}</span>
            </button>
          </div>
        )}
      </div>

      <div className={allEmpty ? 'hidden' : 'mt-[8px] space-y-[8px] px-[20px]'}>
        {days.map((d) => (
          <div
            key={d.key}
            ref={(el) => {
              groupRefs.current[d.key] = el
            }}
            className="scroll-mt-[198px]"
          >
            <DaySection
              day={d}
              filter={filter}
              now={now}
              onTotal={onTotal}
              onBook={book}
              nextId={d.key === 'today' ? nextTrip?.id : undefined}
              nextRef={d.key === 'today' ? setNextEl : undefined}
            />
          </div>
        ))}
      </div>
      {allEmpty && (
        <div className="flex min-h-[calc(var(--screen-vh)*60)] items-center justify-center">
          <EmptyPage
            title="No departures match your filters"
            description="There are no scheduled departures to show right now. Check a different route or come back later."
            buttonText={anyFilter ? 'Clear filters' : undefined}
            onButton={() => {
              setFilter(emptyFilter)
              setSelected('today')
            }}
          />
        </div>
      )}

      <PortSelectSheet
        open={sheet === 'port'}
        selected={filter.origin}
        onClose={() => setSheet(null)}
        onSelect={(origin) => setFilter({ ...filter, origin })}
      />
      <ScheduleFilterSheet
        open={sheet === 'filter'}
        filter={filter}
        onClose={() => setSheet(null)}
        onApply={(v) => {
          setFilter({ ...filter, ...v })
          setSheet(null)
        }}
      />
    </div>
  )
}
