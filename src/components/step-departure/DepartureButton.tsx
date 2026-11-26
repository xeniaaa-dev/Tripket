import type { Departure, Unavailable } from '../../data/departures'
import { TimeArrow } from './icons'

const peso = (n: number) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Operator logo tile, 42px (live: bordered rounded tile)
function OperatorLogo({ src, fit = 'cover' }: { src: string; fit?: Departure['logoFit'] }) {
  if (fit === 'plain')
    return (
      <span className="relative block size-[42px] shrink-0 overflow-hidden rounded-12">
        <img alt="" src={src} className="absolute inset-0 size-full max-w-none object-cover" />
      </span>
    )
  if (fit === 'inset')
    return (
      <span className="relative block size-[42px] shrink-0 overflow-clip rounded-12 border border-[#f0f0f0] bg-white">
        <img alt="" src={src} className="absolute top-[9px] left-[3px] h-[22px] w-[34px] max-w-none object-cover" />
      </span>
    )
  return (
    <span className="relative block size-[42px] shrink-0 rounded-12 border border-[#f0f0f0]">
      <img alt="" src={src} className="absolute inset-0 size-full max-w-none rounded-12 object-cover" />
    </span>
  )
}

// Live departure row: logo tile, operator + badge, times + duration, date line; price on the right. Data/wording is ours.
// Per-person fare on the right (Figma); the all-in estimated total pops up above the Next button once a departure is picked.
// Unavailable (user's reference): departed / fully booked rows fade out with an "Unavailable" pill instead of the fare;
// a sailing with fewer seats than passengers keeps its fare, shows "Only N seats left" and the pill. Unavailable rows can't be picked.
const UnavailablePill = () => <span className="rounded-full bg-[#e5e5ea] px-[10px] py-[2px] text-[12px] leading-[18px] font-medium whitespace-nowrap text-[#6c6c70]">Unavailable</span>

export default function DepartureButton({ departure: d, selected, first, last, onSelect, unavailable = null }: { departure: Departure; selected: boolean; first: boolean; last: boolean; onSelect: () => void; unavailable?: Unavailable }) {
  const faded = unavailable === 'departed' || unavailable === 'full'
  const fewSeats = d.seatsLeft !== undefined && d.seatsLeft > 0 && d.seatsLeft <= 5 && !faded
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={!!unavailable}
      aria-label={unavailable ? `${d.operator} ${d.departTime}, unavailable` : undefined}
      onClick={onSelect}
      className={`flex w-full items-center gap-[10px] px-[12px] py-[12px] text-left transition-colors ${selected ? "relative z-10 bg-[#fff3e7] after:pointer-events-none after:absolute after:inset-x-0 after:border after:border-[#f97316] after:content-['']" : 'bg-white'} ${selected ? (first ? 'after:top-0 after:rounded-t-[15px]' : 'after:-top-px') : ''} ${selected ? (last ? 'after:bottom-0 after:rounded-b-[15px]' : 'after:-bottom-px') : ''} ${last ? '' : 'border-b border-[#e5e5e5]'}`}
    >
      <span className={faded ? 'opacity-40' : ''}>
        <OperatorLogo src={d.logo} fit={d.logoFit} />
      </span>
      <span className={`flex min-w-0 flex-1 flex-col ${faded ? 'opacity-40' : ''}`}>
        <span className="flex h-[20px] items-center gap-[8px]">
          <span className="text-[14px] leading-[20px] whitespace-nowrap text-[#1e293b]">{d.operator}</span>
          <span className={`rounded-full px-[8px] text-[12px] leading-[18px] whitespace-nowrap ${d.vesselType === 'Fast Craft' ? 'bg-[rgba(0,122,255,0.08)] text-[#007aff]' : 'bg-[#f0fdf4] text-[#16a34a]'}`}>{d.vesselType}</span>
        </span>
        <span className="flex h-[24px] items-center gap-[4px] whitespace-nowrap">
          <span className="text-[16px] leading-[24px] font-semibold text-[#0f172a]">{d.departTime}</span>
          <TimeArrow />
          <span className="text-[16px] leading-[24px] text-[#737373]">{d.arriveTime}</span>
          <span className="ml-[2px] text-[12px] leading-[16px] text-[#d4d4d4]">{d.duration.toLowerCase()}</span>
        </span>
        <span className={`text-[12px] leading-[18px] whitespace-nowrap ${d.nextDayArrival ? 'text-primary-default' : 'text-[#8e8e93]'}`}>{d.arrivalNote}</span>
        {fewSeats && (
          <span className="mt-[2px] flex items-center gap-[6px] text-[12px] leading-[18px] font-medium whitespace-nowrap text-[#c2410c]">
            <svg width="11" height="10" viewBox="0 0 11 10" aria-hidden>
              <path d="M5.5 0 11 10H0z" fill="currentColor" />
            </svg>
            Only {d.seatsLeft} seat{d.seatsLeft === 1 ? '' : 's'} left
          </span>
        )}
      </span>
      {faded ? (
        <span className="shrink-0 self-start">
          <UnavailablePill />
        </span>
      ) : (
        <span className="flex shrink-0 flex-col items-end self-stretch pt-[0.5px]">
          <span className="text-[16px] leading-[24px] font-extrabold whitespace-nowrap text-[#0f172a]">{peso(d.price)}</span>
          <span className="text-[12px] leading-[16px] whitespace-nowrap text-[#94a3b8]">/ person</span>
          {selected && <span className="mt-[2px] text-[14px] leading-[18px] font-semibold text-primary-default">Selected</span>}
          {unavailable === 'seats' && (
            <span className="mt-auto pt-[4px]">
              <UnavailablePill />
            </span>
          )}
        </span>
      )}
    </button>
  )
}
