import { useState, type ReactNode } from 'react'
import { operators, vesselTypeFilterLabel, vesselTypes, type ScheduleFilter, type VesselType } from '../../data/schedule'
import ScheduleSheet from './ScheduleSheet'

type Values = { vesselType: VesselType | null; operatorId: number | null }

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[40px] min-w-[48px] cursor-pointer items-center gap-[10px] rounded-full border px-[12px] text-[12px] leading-[16px] font-medium transition-all duration-150 active:scale-[0.97] ${
        selected ? 'border-[#d4d4d4] bg-[#f1f5f9] text-[#f97316]' : 'border-[#e5e5e5] bg-[#f8fafc] text-[#18181b]'
      }`}
    >
      <p className="flex-1 truncate text-center">{label}</p>
    </button>
  )
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="mb-[8px] text-[12px] leading-[16px] text-[#737373]">{label}</label>
      <div className="flex flex-wrap gap-[12px]">{children}</div>
    </div>
  )
}

// The form; mounted fresh each time the sheet opens so it starts from the applied filter (live: Formik + setFieldValue on open).
function FilterForm({ filter, onApply }: { filter: ScheduleFilter; onApply: (v: Values) => void }) {
  const [v, setV] = useState<Values>({ vesselType: filter.vesselType, operatorId: filter.operatorId })
  return (
    <>
      <div className="flex shrink-0 flex-row items-center justify-between border-b border-[#f1f5f9] pb-[16px]">
        <h2 className="text-left text-[18px] leading-[28px] font-extrabold text-[#1d293d]">Schedule filters</h2>
      </div>
      <div className="-mx-[3px] mt-[8px] flex min-h-0 flex-col overflow-y-auto px-[3px] pt-[16px] pb-[24px] text-left [scrollbar-width:none]">
        <div className="flex flex-col gap-[32px]">
          <Group label="VESSEL TYPE">
            <Chip label="All" selected={v.vesselType === null} onClick={() => setV({ ...v, vesselType: null })} />
            {vesselTypes.map((t) => (
              <Chip key={t} label={vesselTypeFilterLabel[t]} selected={v.vesselType === t} onClick={() => setV({ ...v, vesselType: t })} />
            ))}
          </Group>
          <Group label="OPERATOR">
            <Chip label="All" selected={v.operatorId === null} onClick={() => setV({ ...v, operatorId: null })} />
            {operators.map((o) => (
              <Chip key={o.id} label={o.name} selected={v.operatorId === o.id} onClick={() => setV({ ...v, operatorId: o.id })} />
            ))}
          </Group>
        </div>
      </div>
      <div className="mt-[20px] flex w-full shrink-0 justify-between gap-[12px]">
        {/* live: "Clear all" only resets the form; "Done" applies it */}
        <button
          type="button"
          onClick={() => setV({ vesselType: null, operatorId: null })}
          className="h-[56px] w-full rounded-[16px] px-[16px] text-[14px] leading-[20px] font-medium text-[#18181b] shadow-[0_10px_15px_-3px_#0000001a,0_4px_6px_-4px_#0000001a] transition-all duration-150 active:scale-[0.98]"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={() => onApply(v)}
          className="h-[56px] w-full rounded-[16px] bg-[#f97316] px-[16px] text-[14px] leading-[20px] font-extrabold text-white shadow-[0_10px_15px_-3px_#ff680040,0_4px_6px_-4px_#ff680040] transition-all duration-150 active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </>
  )
}

// Live SCHEDULE_FILTER_SHEET (funnel button): vessel type + operator chips.
export default function ScheduleFilterSheet({
  open,
  filter,
  onClose,
  onApply,
}: {
  open: boolean
  filter: ScheduleFilter
  onClose: () => void
  onApply: (v: Values) => void
}) {
  return (
    <ScheduleSheet open={open} onClose={onClose} label="Schedule filters">
      {open && <FilterForm filter={filter} onApply={onApply} />}
    </ScheduleSheet>
  )
}
