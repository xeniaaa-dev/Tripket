import type { ReactNode } from 'react'

// Figma "Carried-over note" (12328:7167): orange-tint info box with a check, shown on Book another trip and Return trip.
export default function CarriedNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-[10px] rounded-16 bg-[#fff1e6] px-[14px] py-[12px] text-[12px] leading-[18px] text-[#f97316]">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-[2px] shrink-0">
        <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p>{children}</p>
    </div>
  )
}

export const carriedText = (passengers: number, vehicles: number) =>
  `${passengers} passenger${passengers === 1 ? '' : 's'}${vehicles > 0 ? ` · ${vehicles} vehicle${vehicles === 1 ? '' : 's'}` : ''} carried over`
