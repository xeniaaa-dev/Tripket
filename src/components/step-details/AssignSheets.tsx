import { savedVehicles, type SavedPassenger, type SavedVehicle } from '../../data/step-details'
import BottomSheet from './BottomSheet'
import { ArrowManual, ArrowManualFaint, ArrowRow, PencilOrange, VehicleRowIcon } from './icons'

/** "Assign Passenger" sheet (node 12421:1084). Rows already assigned to another slot are disabled ("Already added", node 12421:1119). */
export function AssignPassengerSheet({
  saved,
  takenIds,
  onPick,
  onManual,
  onClose,
}: {
  saved: SavedPassenger[]
  takenIds: string[]
  onPick: (p: SavedPassenger) => void
  onManual: () => void
  onClose: () => void
}) {
  return (
    <BottomSheet title="Assign Passenger" onClose={onClose}>
      <div className="flex flex-col gap-[11.988px] px-[16px] pb-[40px]">
        <button type="button" onClick={onManual} className="flex h-[72.489px] w-full items-center gap-[11.988px] rounded-16 bg-brand-50 px-[15.985px] text-left">
          <span className="flex size-[39.996px] shrink-0 items-center justify-center rounded-[20px] bg-white">
            <PencilOrange />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-[15px] leading-[22.5px] font-medium text-text-primary">Fill in manually</span>
            <span className="text-[12px] leading-[18px] whitespace-nowrap text-text-secondary">Enter name, age, ID &amp; passenger type</span>
          </span>
          <ArrowManual />
        </button>
        <div className="flex w-full flex-col gap-[7.992px]">
          <p className="pl-[4px] text-[12px] leading-[18px] font-medium text-text-secondary">Saved passengers</p>
          {saved.map((p) => {
            const taken = takenIds.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                disabled={taken}
                onClick={() => onPick(p)}
                className={`flex h-[61.46px] w-full items-center gap-[11.988px] rounded-16 bg-white text-left ${
                  taken ? 'border border-border-default px-[12.988px] opacity-40' : 'border-[0.5px] border-border-default px-[12.488px]'
                }`}
              >
                <span className="flex size-[35.983px] shrink-0 items-center justify-center rounded-full bg-[#f2f2f2] text-[12px] leading-[18px] font-semibold text-text-secondary">
                  {p.initials}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[14px] leading-[21px] font-medium text-text-primary">{p.fullName}</span>
                  {taken ? (
                    <span className="text-[11px] leading-[16.5px] text-text-secondary">{p.shortDetail} · Already added</span>
                  ) : (
                    <span className="h-[16.491px] text-[12px] leading-[18px] whitespace-nowrap text-text-secondary">{p.detail}</span>
                  )}
                </span>
                {!taken && <ArrowRow />}
              </button>
            )
          })}
        </div>
      </div>
    </BottomSheet>
  )
}

/** Vehicle sheet, e.g. "Vehicle 1" (node 11598:42080) */
export function AssignVehicleSheet({
  title,
  takenIds,
  onPick,
  onManual,
  onClose,
}: {
  title: string
  takenIds: string[]
  onPick: (v: SavedVehicle) => void
  onManual: () => void
  onClose: () => void
}) {
  return (
    <BottomSheet title={title} onClose={onClose}>
      <div className="flex flex-col gap-[11.988px] px-[16px] pb-[40px]">
        <button type="button" onClick={onManual} className="flex h-[90.498px] w-full items-center gap-[13.995px] rounded-16 bg-[#fff7f1] px-[15.985px] text-left">
          <span className="flex size-[39.996px] shrink-0 items-center justify-center rounded-[20px] bg-white">
            <PencilOrange />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-[15px] leading-[22.5px] font-medium text-text-primary">Enter vehicle info manually</span>
            <span className="flex-1 text-[12px] leading-[18px] text-[#8e8e93]">Type plate number &amp; select vehicle type</span>
          </span>
          <ArrowManualFaint />
        </button>
        <div className="flex flex-col gap-[7.992px]">
          <p className="pl-[4px] text-[12px] leading-[18px] font-medium text-[#8e8e93]">Saved vehicles</p>
          <div className="flex flex-col gap-[5.985px]">
            {savedVehicles.map((v) => {
              const taken = takenIds.includes(v.id)
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={taken}
                  onClick={() => onPick(v)}
                  className={`flex w-full items-center gap-[11.988px] rounded-16 bg-white text-left ${
                    taken ? 'h-[62px] border border-border-default px-[12.988px] opacity-40' : 'h-[61.46px] border-[0.5px] border-border-default px-[12.488px]'
                  }`}
                >
                  <span className="flex size-[35.983px] shrink-0 items-center justify-center rounded-full bg-[#f2f2f2]">
                    <VehicleRowIcon type={v.type} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[14px] leading-[21px] font-medium tracking-[-0.56px] whitespace-nowrap text-text-primary">
                      {v.plate} {v.model}
                    </span>
                    <span className={`text-[11px] leading-[16.5px] ${taken ? 'text-[#8e8e93]' : 'text-text-secondary'}`}>
                      {v.type}
                      {taken && ' · Already added'}
                    </span>
                  </span>
                  <ArrowRow muted={taken} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </BottomSheet>
  )
}
