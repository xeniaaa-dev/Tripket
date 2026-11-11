import type { ReactNode } from 'react'
import { useBooking } from '../../booking/BookingContext'

// Live app: fluid banner — 24px bold codes, 11px city names, orange → gray dots joined by a line (centred, ~53% wide),
// optional date row below, 1px bottom border.
// variant "details" (step 3) keeps its own slightly different look (darker end dot, border).
export default function RouteBanner({ children, variant = 'date' }: { children?: ReactNode; variant?: 'date' | 'details' }) {
  const { from, to } = useBooking().booking
  const details = variant === 'details'
  return (
    <div className={`border-b border-[#f0f0f0] bg-white px-[16px] pt-[11px] ${children ? 'pb-[14px]' : 'pb-[12px]'}`}>
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-[7px]">
          <p className="text-[24px] leading-[24px] font-bold tracking-[-0.3px] text-[#171717]">{from.code}</p>
          <p className="text-[11px] leading-[16.5px] text-[#8e8e93]">{from.city}</p>
        </div>
        <div className="absolute inset-x-[23.7%] top-[8px] flex h-[8px] items-center">
          <span className="size-[8px] shrink-0 rounded-full bg-[#f97316]" />
          <span className="h-[1.5px] flex-1 bg-[#d1d1d6]" />
          <span className={`size-[8px] shrink-0 rounded-full ${details ? 'bg-[#5e5d5f]' : 'bg-[#a3a3a3]'}`} />
        </div>
        <div className="flex flex-col items-end gap-[7px]">
          <p className="text-[24px] leading-[24px] font-bold tracking-[-0.3px] text-[#171717]">{to.code}</p>
          <p className="text-right text-[11px] leading-[16.5px] text-[#8e8e93]">{to.city}</p>
        </div>
      </div>
      {children && <div className="mt-[9px]">{children}</div>}
    </div>
  )
}
