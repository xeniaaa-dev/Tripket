import { VEHICLE_TYPES, type VehicleType } from '../../data/step-passengers'
import Drawer from '../Drawer'

// "Select Vehicle Type" sheet — from the live app (book.tripket.ph → Passengers & vehicle → Add vehicle), not Figma.
export default function VehicleTypeSheet({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (type: VehicleType) => void }) {
  return (
    <Drawer open={open} onClose={onClose} label="Select Vehicle Type">
      <h2 className="text-[20px] leading-[28px] font-bold text-[#1e293b]">Select Vehicle Type</h2>
      <div className="mt-[8px] flex min-h-[calc(var(--screen-vh)*80)] flex-col overflow-y-auto pt-[16px] pb-[24px]">
        {VEHICLE_TYPES.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => onSelect(t.label)}
            className="flex items-center gap-[12px] border-b border-[#f1f5f9] py-[12px] text-left transition-all duration-150 last:border-0"
          >
            <span className="rounded-full bg-[#f5f5f5] p-[8px]">
              <img alt="" src={t.icon} className="block size-[24px]" />
            </span>
            <span className="text-[14px] leading-[20px] text-[#262626]">{t.label}</span>
          </button>
        ))}
      </div>
    </Drawer>
  )
}
