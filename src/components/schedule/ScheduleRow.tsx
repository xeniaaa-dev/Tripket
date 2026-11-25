import { fareOf } from '../../data/departures'
import { formatTime, portName, type Departure } from '../../data/schedule'

// Schedule list row (user's reference design): time + duration on the left, operator logo/name and "Origin to Destination"
// in the middle, "Departed" / "Cancelled" or the per-person fare + chevron on the right.
// Past and cancelled sailings are greyed out and not tappable; upcoming ones open the booking flow.
/** 0.5 → "30m", 1 → "1h", 1.5 → "1h 30m" (reference design) */
function shortHours(h: number) {
  const m = Math.round(h * 60)
  return [m >= 60 && `${Math.floor(m / 60)}h`, m % 60 && `${m % 60}m`].filter(Boolean).join(' ')
}

export default function ScheduleRow({ d, now, onBook, rowRef }: { d: Departure; now: number; onBook: (d: Departure) => void; rowRef?: (el: HTMLElement | null) => void }) {
  const departed = !d.cancelled && (d.actualDeparture ?? d.departure).getTime() <= now
  const delayed = !d.cancelled && d.actualDeparture !== null && d.actualDeparture > d.departure
  const off = d.cancelled || departed
  const [time, ampm] = formatTime(delayed ? d.actualDeparture! : d.departure).split(' ')

  const body = (
    <>
      <div className="w-[88px] shrink-0">
        <p className={`flex items-baseline gap-[4px] ${off ? 'text-[#48484a]' : 'text-[#1c1917]'}`}>
          <span className={`text-[24px] leading-[30px] tracking-[-0.5px] ${off ? 'font-normal' : 'font-bold'} ${d.cancelled ? 'line-through' : ''}`}>{time}</span>
          <span className={`text-[11px] leading-[14px] ${off ? 'font-normal' : 'font-bold'}`}>{ampm}</span>
        </p>
        <p className="mt-[2px] text-[11px] leading-[14px] text-[#8e8e93]">{shortHours(d.duration)}</p>
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-[8px]">
          <img alt="" src={d.operator.logo} className="size-[22px] shrink-0 rounded-[6px] border border-[#ececec] bg-white object-contain p-[1px]" />
          <span className={`truncate text-[13px] leading-[18px] font-medium ${off ? 'text-[#6c6c70]' : 'text-[#48484a]'}`}>{d.operator.name}</span>
        </p>
        <p className={`mt-[4px] truncate text-[15px] leading-[20px] ${off ? 'text-[#6c6c70]' : 'text-[#48484a]'}`}>{portName(d.origin.name)}</p>
        <p className={`truncate text-[15px] leading-[20px] ${off ? 'text-[#48484a]' : 'text-[#1c1917]'}`}>
          <span className="text-[#8e8e93]">to </span>
          {portName(d.destination.name)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end self-stretch">
        {d.cancelled ? (
          <span className="text-[12px] leading-[18px] font-semibold text-[#dc2626]">Cancelled</span>
        ) : departed ? (
          <span className="text-[12px] leading-[18px] text-[#6c6c70]">Departed</span>
        ) : (
          <>
            <span className="text-[16px] leading-[20px] font-bold text-[#1c1917]">₱{fareOf(d.operator.line)}</span>
            {delayed && <span className="mt-[2px] text-[11px] leading-[14px] font-semibold text-[#ea580c]">Delayed</span>}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-auto mb-[6px]" aria-hidden>
              <path d="m9 6 6 6-6 6" />
            </svg>
          </>
        )}
      </div>
    </>
  )

  const cls = 'flex w-full items-start gap-[12px] px-[16px] py-[14px] text-left'
  if (off)
    return (
      <div ref={rowRef} className={`${cls} bg-[#fafafa]`}>
        {body}
      </div>
    )
  return (
    <button
      ref={rowRef}
      type="button"
      onClick={() => onBook(d)}
      aria-label={`Book ${d.operator.name}, ${portName(d.origin.name)} to ${portName(d.destination.name)}, ${formatTime(d.departure)}`}
      className={`${cls} cursor-pointer bg-white transition-colors duration-100 hover:bg-[#fffaf5] active:bg-[#fff7ed]`}
    >
      {body}
    </button>
  )
}
