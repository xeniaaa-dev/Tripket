import chevronDown from '../../assets/live/chevron-down.svg'
import close from '../../assets/live/close.svg'
import plus from '../../assets/live/plus.svg'
import { vehicleIcon, type VehicleType } from '../../data/step-passengers'
import Drawer from '../Drawer'

// Live "Passengers & Vehicle" bottom sheet on Passenger details (Change passenger count). Draft state lives in the page.
export default function CountSheet({
  open,
  count,
  vehicleType,
  vehiclesAllowed,
  onCount,
  onAddVehicle,
  onRemoveVehicle,
  onCancel,
  onDone,
}: {
  open: boolean
  count: number
  vehicleType: VehicleType | null
  vehiclesAllowed: boolean
  onCount: (n: number) => void
  onAddVehicle: () => void
  onRemoveVehicle: () => void
  onCancel: () => void
  onDone: () => void
}) {
  const textBtn = 'text-[16px] leading-[24px] font-medium text-[#f97316]'
  return (
    <Drawer open={open} onClose={onCancel} label="Passengers & Vehicle">
      <div className="min-h-[370px]">
      <div className="mx-auto mb-[8px] h-[4px] w-[36px] shrink-0 rounded-[2px] bg-[#e4e4e7]" />
      <div className="flex h-[40px] shrink-0 items-center justify-between">
        <button type="button" onClick={onCancel} className={textBtn}>
          Cancel
        </button>
        <h2 className="text-[20px] leading-[28px] font-bold text-[#1c1917]">Passengers &amp; Vehicle</h2>
        <button type="button" onClick={onDone} className={textBtn}>
          Done
        </button>
      </div>
      <div className="mt-[8px] border-t border-[#f1f5f9] pt-[16px]" />
      <div className="flex flex-col gap-[16px] pb-[8px]">
        <div className="flex items-center justify-between rounded-16 border border-[#d1d1d6] p-[16px]">
          <p className="text-[14px] leading-[20px] text-[#1c1917]">Passenger</p>
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Decrease passenger count"
              disabled={count <= 1}
              onClick={() => onCount(count - 1)}
              className="flex size-[40px] items-center justify-center rounded-full border border-[#f2f2f2] bg-white disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 8h9" stroke="#8e8e93" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
            <p aria-live="polite" className="w-[40px] text-center text-[14px] leading-[20px] font-medium text-[#0f172a]">
              {count}
            </p>
            <button type="button" aria-label="Increase passenger count" onClick={() => onCount(count + 1)} className="flex size-[40px] items-center justify-center rounded-full bg-[#f97316]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3.5v9M3.5 8h9" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="rounded-16 border border-[#d1d1d6] p-[16px]">
          {vehicleType ? (
            <>
              <p className="text-[14px] leading-[20px] font-medium text-[#1e293b]">Vehicles - 1</p>
              <div className="mt-[8px] flex items-center justify-between rounded-16 border border-[#f1f5f9] p-[12px]">
                <button type="button" onClick={onAddVehicle} aria-label={`Vehicle type: ${vehicleType}. Change`} className="flex items-center gap-[12px]">
                  <span className="rounded-full bg-[#f5f5f5] p-[8px]">
                    <img alt="" src={vehicleIcon(vehicleType)} className="block size-[24px]" />
                  </span>
                  <span className="text-[14px] leading-[20px] text-[#1c1917]">{vehicleType}</span>
                  <img alt="" src={chevronDown} className="size-[18px] shrink-0" />
                </button>
                <button type="button" aria-label="Remove vehicle" onClick={onRemoveVehicle} className="flex size-[36px] items-center justify-center rounded-[24px] bg-[rgba(246,51,154,0.05)]">
                  <img alt="" src={close} className="size-[16px]" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[14px] leading-[20px] text-[#1c1917]">Vehicles</p>
                <button type="button" disabled={!vehiclesAllowed} onClick={onAddVehicle} className="flex h-[36px] items-center gap-[8px] rounded-full px-[12px] disabled:opacity-50">
                  <img alt="" src={plus} className="size-[16px]" />
                  <span className="text-[14px] leading-[20px] font-medium text-[#9f2d00]">Add vehicle</span>
                </button>
              </div>
              {!vehiclesAllowed && (
                <p className="mt-[8px] text-[12px] leading-[18px] font-light text-[#5e5d5f]">Vehicles aren&apos;t available on this departure. Choose a RoRo schedule to bring one along.</p>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </Drawer>
  )
}
