import { VEHICLE_TYPES, fullName, initials, type SavedPassenger, type SavedVehicle } from '../../data/passengers'
import { EllipsisVerticalIcon } from './icons'
import { VehicleGlyph } from './VehicleForm'

// Saved profile cards (live PassengerCard / VehicleCard): 1px neutral-200 border, 16px radius, p-4, gap-3, min-h 76.
const CARD = 'flex min-h-[76px] items-center gap-[12px] rounded-16 border border-[#e5e5e5] bg-white p-[16px] transition-all duration-200'

function MoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center gap-[4px]">
      <button type="button" aria-label="Edit options" onClick={onClick} className="flex size-[36px] items-center justify-center rounded-12 text-[#a1a1a1] transition-colors hover:bg-[#f8fafc]">
        <EllipsisVerticalIcon />
      </button>
    </div>
  )
}

export function PassengerRow({ p, onMore }: { p: SavedPassenger; onMore: () => void }) {
  return (
    <div className={CARD}>
      <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#f2f2f7] text-[12px] leading-[18px] font-medium text-[#8e8e93]">{initials(p)}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] leading-[24px] font-medium text-[#1c1917]">{fullName(p)}</p>
        <div className="mt-[4px] flex items-center gap-[4px] text-[12px] leading-[16px] text-[#8e8e93] capitalize">
          <span>{[p.type, p.gender, p.nationality].filter(Boolean).join(' · ')}</span>
        </div>
      </div>
      <MoreButton onClick={onMore} />
    </div>
  )
}

export function VehicleRow({ v, onMore }: { v: SavedVehicle; onMore: () => void }) {
  const icon = VEHICLE_TYPES.find((t) => t.label === v.type)!.icon
  return (
    <div className={CARD}>
      <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] p-[8px] text-[#8e8e93]">
        <VehicleGlyph icon={icon} size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[16px] leading-[24px] font-medium text-[#1c1917] capitalize">{v.type}</div>
        <div className="mt-[4px] flex items-center gap-[4px] text-[12px] leading-[16px] text-[#8e8e93] capitalize">
          <span>{[v.plate, v.year, v.make, v.model].filter(Boolean).join(' · ')}</span>
        </div>
      </div>
      <MoreButton onClick={onMore} />
    </div>
  )
}
