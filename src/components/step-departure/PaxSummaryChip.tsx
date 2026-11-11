import { Van, UserMultiple } from './icons'

// Figma: StepSchedule summary chip (node 11598:39418) — "3 passenger · 1 vehicle"; vehicle part hidden when 0 (frame 11598:40090)
export default function PaxSummaryChip({ passengers, vehicles }: { passengers: number; vehicles: number }) {
  return (
    <div className="flex h-[24px] items-center gap-[6px] self-start rounded-full bg-[#f5f5f5] px-[12px] text-[12px] leading-[18px] whitespace-nowrap">
      <UserMultiple />
      <span className="text-[#404040]">{passengers} passenger</span>
      {vehicles > 0 && (
        <>
          <span className="text-text-secondary">·</span>
          <Van />
          <span className="text-[#404040]">{vehicles} vehicle</span>
        </>
      )}
    </div>
  )
}
