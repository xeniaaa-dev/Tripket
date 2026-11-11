import chevronDown from '../../assets/live/chevron-down.svg'
import close from '../../assets/live/close.svg'
import plus from '../../assets/live/plus.svg'
import { vehicleIcon, type VehicleType } from '../../data/step-passengers'

type Props = {
  /** null = no vehicle (the app allows one vehicle on this step) */
  vehicleType: VehicleType | null
  /** opens the "Select Vehicle Type" sheet (add, or change the type of the added vehicle) */
  onAdd: () => void
  onRemove: () => void
}

// Vehicle card — from the live app (book.tripket.ph → Passengers & vehicle), not Figma. Sizes/colors from its computed styles.
export default function VehiclesCard({ vehicleType, onAdd, onRemove }: Props) {
  if (!vehicleType) {
    return (
      <div className="flex items-start justify-between gap-[12px] rounded-16 border border-[#f2f2f2] p-[16px]">
        <div>
          <p className="text-[16px] leading-[24px] text-[#262626]">Vehicle</p>
          <p className="mt-[3px] text-[12px] leading-[18px] text-[#8e8e93]">No vehicle — passengers only</p>
        </div>
        <button type="button" onClick={onAdd} className="-mt-[4px] flex h-[36px] items-center gap-[8px] rounded-full px-[12px]">
          <img alt="" src={plus} className="size-[16px]" />
          <span className="text-[14px] leading-[20px] font-medium text-[#9f2d00]">Add vehicle</span>
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-16 border border-[#dedee0] p-[16px]">
      <p className="text-[14px] leading-[20px] font-medium text-[#1e293b]">Vehicles - 1</p>
      <div className="mt-[8px] flex items-center justify-between rounded-16 border border-[#f1f5f9] p-[12px]">
        <button type="button" onClick={onAdd} aria-label={`Vehicle type: ${vehicleType}. Change`} className="flex items-center gap-[12px]">
          <span className="rounded-full bg-[#f5f5f5] p-[8px]">
            <img alt="" src={vehicleIcon(vehicleType)} className="block size-[24px]" />
          </span>
          <span className="text-[14px] leading-[20px] text-[#1c1917]">{vehicleType}</span>
          <img alt="" src={chevronDown} className="size-[18px] shrink-0" />
        </button>
        <button
          type="button"
          aria-label="Remove vehicle"
          onClick={onRemove}
          className="flex size-[36px] items-center justify-center rounded-[24px] bg-[rgba(246,51,154,0.05)]"
        >
          <img alt="" src={close} className="size-[16px]" />
        </button>
      </div>
    </div>
  )
}
