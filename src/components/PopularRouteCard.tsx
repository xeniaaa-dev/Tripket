import RouteChip from './RouteChip'
import { OPERATORS, type ShippingLine } from '../data/departures'

export type PopularRoute = {
  /** Chip labels as on live */
  from: string
  to: string
  /** Our port codes that the card opens booking with */
  fromCode: string
  toCode: string
  name: string
  landmark: string
  price: string
  duration: string
  image: string
  /** operators sailing this route: logos top-right of the card */
  lines?: ShippingLine[]
}

/** Operator logos, top-right: small white circles, overlapping when more than one; 3 max, then "+N" */
function OperatorLogos({ lines }: { lines: ShippingLine[] }) {
  const shown = lines.length > 3 ? lines.slice(0, 2) : lines
  const more = lines.length - shown.length
  return (
    <span className="flex items-center" aria-label={`Operated by ${lines.map((l) => OPERATORS[l].operator).join(', ')}`}>
      {shown.map((l, i) => {
        const o = OPERATORS[l]
        return (
          <span key={l} className={`relative flex size-[32px] items-center justify-center overflow-hidden rounded-full bg-white ring-[1.5px] ring-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] ${i > 0 ? '-ml-[10px]' : ''}`}>
            <img alt="" src={o.logo} className={`size-full max-w-none ${o.logoFit === 'inset' ? 'object-contain p-[4px]' : 'object-cover'}`} />
          </span>
        )
      })}
      {more > 0 && (
        <span className="relative -ml-[10px] flex size-[32px] items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#1c1917] ring-[1.5px] ring-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]">+{more}</span>
      )}
    </span>
  )
}

// Live Popular Routes card: 45% of the column wide, 2:3, radius 24, photo + black gradient, chip top-left, text bottom.
export default function PopularRouteCard({ route, onSelect }: { route: PopularRoute; onSelect?: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative aspect-[2/3] w-[45%] shrink-0 cursor-pointer snap-center overflow-hidden rounded-3xl text-left shadow-sm"
    >
      <img alt={route.name} src={route.image} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <span className="absolute top-3 left-3">
        <RouteChip from={route.from} to={route.to} />
      </span>
      {route.lines && route.lines.length > 0 && (
        <span className="absolute top-3 right-3">
          <OperatorLogos lines={route.lines} />
        </span>
      )}
      <span className="absolute right-3 bottom-3 left-3 flex flex-col gap-2 text-white">
        <span>
          <span className="block text-[16px] leading-tight font-bold">{route.name}</span>
          <span className="mt-0.5 flex items-center gap-1 text-[10px] leading-[15px] text-white/80">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">{route.landmark}</span>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-[9px] leading-[13.5px] font-bold">{route.price}</span>
          <span className="rounded-full bg-black/50 px-1.5 py-0.5 text-[9px] leading-[13.5px] font-medium backdrop-blur-md">{route.duration}</span>
        </span>
      </span>
    </button>
  )
}
