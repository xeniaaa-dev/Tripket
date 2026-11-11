import { formatHours, formatTime, formatTimeAgo, portInitial, portName, vesselTypeLabel, type Departure } from '../../data/schedule'

// Departure card — the live app's schedule card (book.tripket.ph/schedule), from the user's screenshot:
// 16px radius, 40px logo tile, 14px bold vessel name + green type badge, 24px bold route codes (orange origin),
// "3H 0M" over a short line, port names, then a Scheduled departure / Estimated arrival row split by a divider.
// Cancelled / delayed variants (not visible on live for a guest) keep the earlier design: red header line, struck-through times, pink banner.
const BADGE = {
  ro_ro: 'bg-[rgba(36,138,61,0.08)] text-[#248a3d]',
  fastcraft: 'bg-[rgba(0,122,255,0.08)] text-[#007aff]',
}

function Cell({ label, value, struck, tone, divider }: { label: string; value: string; struck?: boolean; tone?: 'orange'; divider?: boolean }) {
  return (
    <div className={`flex flex-1 flex-col items-center p-[12px] ${divider ? 'border-l border-[#dddee0]' : ''}`}>
      <p className="text-[10px] leading-[15px] text-[#a1a1a1] uppercase">{label}</p>
      <p className={`text-[16px] leading-[24px] font-bold ${struck ? 'text-[#8e8e93] line-through' : tone === 'orange' ? 'text-[#f97316]' : 'text-black'}`}>{value}</p>
    </div>
  )
}

export default function DepartureCard({ d }: { d: Departure }) {
  const cancelled = d.cancelled
  const delayed = !cancelled && d.actualDeparture !== null && d.actualDeparture > d.departure
  const arrivalOf = (t: Date) => formatTime(new Date(t.getTime() + d.duration * 3600e3))
  const departs = formatTime(d.departure)
  // a delayed trip's estimated arrival follows its actual departure
  const arrives = arrivalOf(delayed ? d.actualDeparture! : d.departure)

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#e5e5e5] bg-white shadow-[0_1px_3px_#f1f5f9,0_1px_2px_-1px_#f1f5f9]">
      {cancelled && (
        <div className="flex items-baseline gap-[8px] px-[16px] pt-[12px] text-[12px] leading-[16px]">
          <span className="font-bold text-[#991b1b]">Cancelled</span>
          <span className="font-medium text-[#b56b6b]">{formatTimeAgo(d.cancelledAt!.getTime())}</span>
        </div>
      )}
      {delayed && (
        <div className="flex items-baseline gap-[8px] px-[16px] pt-[12px] text-[12px] leading-[16px]">
          <span className="font-bold text-[#c2410c]">Delayed</span>
          <span className="font-medium text-[#d08a5f]">{formatTimeAgo(d.actualDeparture!.getTime())}</span>
        </div>
      )}

      <div className={`flex items-center gap-[12px] px-[16px] pb-[16px] ${cancelled || delayed ? 'pt-[8px]' : 'pt-[16px]'}`}>
        <img alt={d.operator.name} src={d.operator.logo} className="size-[40px] shrink-0 rounded-[8px] border border-[#f1f5f9] object-contain p-[4px]" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[6px]">
            <span className="truncate text-[14px] leading-[20px] font-bold text-[#404040]">{d.operator.vessel}</span>
            <span className={`shrink-0 rounded-full px-[8px] py-[2px] text-[12px] leading-[16px] font-medium whitespace-nowrap ${BADGE[d.operator.vesselType]}`}>
              {vesselTypeLabel[d.operator.vesselType]}
            </span>
          </div>
          <div className="text-[11px] leading-[16.5px] font-medium text-[#a1a1a1]">{d.operator.name}</div>
        </div>
      </div>

      <div className="px-[16px] pb-[8px]">
        <div className="flex items-center">
          <p className={`max-w-2/9 grow text-[24px] leading-[32px] font-bold ${cancelled ? 'text-[#8e8e93]' : 'text-[#f97316]'}`}>{portInitial(d.origin.name)}</p>
          <div className="relative flex max-w-5/9 flex-1 grow flex-col items-center px-[48px]">
            <span className="absolute bottom-[4px] text-[10px] leading-[15px] whitespace-nowrap text-[#a1a1a1] uppercase">{formatHours(d.duration)}</span>
            <div className="relative h-[2px] w-full bg-[#d4d4d4]">
              <span className={`absolute top-1/2 left-0 size-[8px] -translate-y-1/2 rounded-full ${cancelled ? 'bg-[#a1a1a1]' : 'bg-[#ff6900]'}`} />
              <span className="absolute top-1/2 right-0 size-[8px] -translate-y-1/2 rounded-full bg-[#a1a1a1]" />
            </div>
          </div>
          <p className={`max-w-2/9 grow text-right text-[24px] leading-[32px] font-bold ${cancelled ? 'text-[#8e8e93]' : 'text-[#1c1917]'}`}>{portInitial(d.destination.name)}</p>
        </div>
        <div className="flex justify-between gap-[8px]">
          <p className="mt-[2px] text-[11px] leading-[16.5px] text-[#8e8e93]">{portName(d.origin.name)}</p>
          <p className="mt-[2px] truncate text-right text-[11px] leading-[16.5px] text-[#a1a1a1]">{portName(d.destination.name)}</p>
        </div>
      </div>

      <div className="flex border-t border-[#ececf0] text-center">
        <Cell label="Scheduled departure" value={departs} struck={cancelled} />
        <Cell label="Estimated arrival" value={arrives} struck={cancelled} tone={delayed ? 'orange' : undefined} divider />
      </div>
      {cancelled && (
        <p className="bg-[#fde8e8] px-[12px] py-[7px] text-center text-[13px] leading-[18px] font-semibold text-[#991b1b]">
          {d.cancellationReason ?? 'Trip cancelled.'}
        </p>
      )}
    </div>
  )
}
