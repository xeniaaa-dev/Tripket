import { useBooking } from '../../booking/BookingContext'

// Figma: review "Banner" (node 12348:931) — like the shared RouteBanner but with Departs / Arrives dates under the cities.
export default function ReviewRouteBanner({ departs, arrives }: { departs: string; arrives: string }) {
  const { from, to } = useBooking().booking
  return (
    <div className="border-b-[0.5px] border-border-default bg-white px-[16px] py-[12px]">
      <div className="flex w-full items-center gap-[8px] whitespace-nowrap">
        <div className="flex flex-col items-start gap-[2px]">
          <p className="text-[26px] leading-[26px] font-bold tracking-[-0.65px] text-text-primary">{from.code}</p>
          <p className="text-[11px] leading-[16.5px] text-text-secondary">{from.city}</p>
          <p className="text-[11px] leading-[16.5px] text-text-secondary">{departs}</p>
        </div>
        <div className="flex h-[27px] min-w-px flex-1 items-center">
          <span className="size-[7.992px] shrink-0 rounded-full bg-[#f97316]" />
          <span className="h-[1.483px] flex-1 bg-[rgba(142,142,147,0.25)]" />
          <span className="size-[7.992px] shrink-0 rounded-full bg-[#aeaeb2]" />
        </div>
        <div className="flex flex-col items-end gap-[2px]">
          <p className="text-right text-[26px] leading-[26px] font-bold tracking-[-0.65px] text-text-primary">{to.code}</p>
          <p className="text-[11px] leading-[16.5px] text-text-secondary">{to.city}</p>
          <p className="text-[11px] leading-[16.5px] text-[#f97316]">{arrives}</p>
        </div>
      </div>
    </div>
  )
}
