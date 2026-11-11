import { useState, type ReactNode } from 'react'
import deleteIcon from '../../assets/figma/step-details/delete-02.svg'
import pencilEdit from '../../assets/figma/step-details/pencil-edit-02.svg'
import { cabins, peso } from '../../data/step-details'
import { ArrowDownOrange, ArrowSlot, CarFilled, CarGreen, CheckOrange, MotorbikeOrange, UserOrange } from './icons'

/** Section title row, e.g. "Passengers · 3" (node 12519:3877) */
export function SectionHeader({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-[19.492px] items-center gap-[7.992px]">
      {icon}
      <p className="text-[14px] leading-[21px] font-medium text-text-secondary">{children}</p>
    </div>
  )
}

/** "FREE up to 2 passengers" banner (node 11598:39247) */
export function FreeBanner() {
  return (
    <div className="flex items-start gap-[8px] rounded-16 bg-[rgba(36,138,61,0.06)] px-[13.995px] pt-[13.995px] pb-[14px]">
      <CarGreen />
      <div className="flex flex-1 flex-col gap-px">
        <p className="text-[13px] leading-[19.5px] font-medium text-text-primary">FREE up to 2 passengers</p>
        <p className="h-[19px] text-[12px] leading-[18px] text-text-secondary">1 driver + companion</p>
      </div>
    </div>
  )
}

/** Empty "— tap to fill" slot (passenger: node 12519:3888, vehicle: node 11598:39343) */
export function EmptySlot({ kind, title, subtitle, onClick }: { kind: 'passenger' | 'vehicle'; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-[12px] rounded-16 bg-brand-50 px-[12px] py-[12px] text-left shadow-[0_0_0_1px_rgba(249,115,22,0.2)] ${kind === 'passenger' ? 'min-h-[74px]' : 'min-h-[74px]'}`}
    >
      <span className="flex size-[35.983px] shrink-0 items-center justify-center rounded-full bg-white">
        {kind === 'passenger' ? <UserOrange /> : <MotorbikeOrange />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[1.989px]">
        <span className="text-[16px] leading-[24px] font-medium text-[#c2410c]">{title}</span>
        <span className="text-[12px] leading-[18px] text-text-secondary">{subtitle}</span>
      </span>
      <ArrowSlot />
    </button>
  )
}

/** Edit + delete icon buttons (node 11598:42978) */
function CardActions({ label, onEdit, onDelete }: { label: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex h-[44px] shrink-0 items-start justify-end gap-[4px]">
      <button type="button" aria-label={`Edit ${label}`} onClick={onEdit} className="relative size-[32px] overflow-clip">
        <img alt="" src={pencilEdit} className="absolute top-[4px] left-[3.84px] size-[24px]" />
      </button>
      <button type="button" aria-label={`Remove ${label}`} onClick={onDelete} className="relative size-[32px] overflow-clip">
        <img alt="" src={deleteIcon} className="absolute top-[4px] left-[3.84px] size-[24px]" />
      </button>
    </div>
  )
}

/** "Change class" dropdown (node 12348:1226) */
function CabinMenu({ value, onSelect, onClose }: { value: string; onSelect: (cabin: string) => void; onClose: () => void }) {
  return (
    <>
      <button type="button" aria-label="Close cabin menu" className="fixed inset-0 z-20 cursor-default" onClick={onClose} />
      <div
        role="menu"
        className="absolute top-[calc(100%+7px)] left-0 z-30 flex w-[195px] min-w-[140px] flex-col gap-[16px] overflow-clip rounded-16 border border-border-default bg-white p-[16px] shadow-[0_0_10px_0_rgba(0,0,0,0.1)]"
      >
        {cabins.map((c) => (
          <button
            key={c.name}
            type="button"
            role="menuitemradio"
            aria-checked={c.name === value}
            onClick={() => onSelect(c.name)}
            className="relative flex w-[132px] items-start justify-between font-medium whitespace-nowrap text-[#3c3c43]"
          >
            <span className="text-[13px] leading-[19.5px]">{c.name}</span>
            <span className="text-[14px] leading-[15px] tracking-[-0.84px]">{peso(c.price)}.00</span>
            {c.name === value && (
              <span className="absolute top-[4px] left-[148px]">
                <CheckOrange />
              </span>
            )}
          </button>
        ))}
      </div>
    </>
  )
}

/** Filled passenger card (node 11598:42963) */
export function PassengerCard({
  initials,
  name,
  detail,
  cabin,
  fare,
  onCabinChange,
  onEdit,
  onDelete,
}: {
  initials: string
  name: string
  detail: string
  cabin: string
  /** null = Free */
  fare: number | null
  onCabinChange: (cabin: string) => void
  onEdit: () => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="flex w-full items-start gap-[11.988px] rounded-16 border-[0.5px] border-border-default bg-white px-[16px] py-[12px]">
      <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#f2f2f2] text-[12px] leading-[18px] font-semibold text-text-secondary">
        {initials}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
        <div className="flex items-start gap-[2px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <p className="truncate text-[15px] leading-[22.5px] font-medium text-text-primary">{name}</p>
            <p className="truncate text-[12px] leading-[18px] text-text-secondary">{detail}</p>
          </div>
          <CardActions label={name} onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div className="flex w-full items-center justify-between py-[4px]">
          <div className="relative flex h-[20.469px] items-center">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-[4px] rounded-full bg-brand-50 px-[12px] py-[4px] text-[11px] leading-[16.5px] font-medium whitespace-nowrap"
            >
              <span className="text-text-primary">{cabin}</span>
              <span className="text-primary-default">·</span>
              <span className="text-primary-default">Change class</span>
              <ArrowDownOrange />
            </button>
            {menuOpen && (
              <CabinMenu
                value={cabin}
                onClose={() => setMenuOpen(false)}
                onSelect={(c) => {
                  onCabinChange(c)
                  setMenuOpen(false)
                }}
              />
            )}
          </div>
          {fare === null ? (
            <span className="rounded-[20.593px] bg-[#d7ffe1] px-[8.237px] py-[2.059px] text-[11px] leading-[16.5px] font-semibold text-[#34c759]">Free</span>
          ) : (
            <span className="text-[14px] leading-[21px] font-semibold text-primary-default">{peso(fare)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

/** Filled vehicle card (node 12173:1987) */
export function VehicleCard({ title, type, fare, onEdit, onDelete }: { title: string; type: string; fare: number; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex w-full items-start gap-[11.999px] rounded-16 border-[0.5px] border-border-default bg-white px-[15.996px] py-[16px]">
      <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#f2f2f2]">
        <CarFilled />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[1.998px]">
        <div className="flex items-center justify-between">
          <p className="min-w-0 flex-1 truncate text-[14px] leading-[21px] font-medium text-text-primary">{title}</p>
          <CardActions label={title} onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div className="flex h-[17.994px] items-center">
          <div className="flex h-[24px] w-full items-center justify-between">
            <span className="text-[12px] leading-[18px] text-[#8e8e93]">{type}</span>
            <span className="text-[14px] leading-[21px] font-semibold text-primary-default">{peso(fare)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** "Juan removed · Undo" toast (node 11598:43474) */
export function UndoToast({ message, onUndo }: { message: string; onUndo: () => void }) {
  return (
    <div
      role="status"
      className="fixed bottom-[101px] left-1/2 z-30 w-[calc(min(100%,512px)-32px)] -translate-x-1/2 flex h-[50px] items-center justify-between overflow-clip rounded-12 border border-border-default bg-[rgba(255,255,255,0.6)] p-[16px] text-[16px] leading-none tracking-[-0.96px] whitespace-nowrap shadow-nav backdrop-blur-[5px]"
    >
      <span className="text-text-primary">{message}</span>
      <button type="button" onClick={onUndo} className="font-semibold text-primary-default">
        Undo
      </button>
    </div>
  )
}
