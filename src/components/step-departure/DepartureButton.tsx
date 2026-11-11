import type { Departure } from '../../data/departures'
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
export default function DepartureButton({ departure: d, selected, last, onSelect }: { departure: Departure; selected: boolean; last: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-[10px] px-[12px] py-[12px] text-left ${selected ? 'bg-[#fff3e7]' : 'bg-white'} ${last ? '' : 'border-b border-[#e5e5e5]'}`}
    >
      <OperatorLogo src={d.logo} fit={d.logoFit} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex h-[20px] items-center gap-[8px]">
          <span className="text-[14px] leading-[20px] whitespace-nowrap text-[#1e293b]">{d.operator}</span>
          <span className="rounded-full bg-[#f0fdf4] px-[8px] text-[12px] leading-[18px] whitespace-nowrap text-[#16a34a]">{d.vesselType}</span>
        </span>
        <span className="flex h-[24px] items-center gap-[4px] whitespace-nowrap">
          <span className="text-[16px] leading-[24px] font-semibold text-[#0f172a]">{d.departTime}</span>
          <TimeArrow />
          <span className="text-[16px] leading-[24px] text-[#737373]">{d.arriveTime}</span>
          <span className="ml-[2px] text-[12px] leading-[16px] text-[#d4d4d4]">{d.duration.toLowerCase()}</span>
        </span>
        <span className={`text-[12px] leading-[18px] whitespace-nowrap ${d.nextDayArrival ? 'text-primary-default' : 'text-[#8e8e93]'}`}>{d.arrivalNote}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end self-start pt-[0.5px]">
        <span className="text-[16px] leading-[24px] font-extrabold whitespace-nowrap text-[#0f172a]">{peso(d.price)}</span>
        <span className="text-[12px] leading-[16px] whitespace-nowrap text-[#94a3b8]">/ person</span>
        {selected && <span className="mt-[8px] text-[14px] leading-[21px] font-semibold text-primary-default">Selected</span>}
      </span>
    </button>
  )
}
