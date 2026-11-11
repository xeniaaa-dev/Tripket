import { useEffect, type ReactNode } from 'react'
import { useSheetMotion } from '../Drawer'
import { CloseIcon, PencilIcon, TrashIcon } from './icons'

// Live HeroUI drawer chrome (book.tripket.ph): white panel, 16px top radius, layered shadow, 36×4 handle, black/50 backdrop.
// Motion comes from useSheetMotion() (enter 250ms / exit 200ms, cubic-bezier(0.32,0.72,0,1)). Render inside <SheetPresence>.
const SHADOW = 'shadow-[0_2px_8px_rgba(0,0,0,0.06),0_-6px_12px_rgba(0,0,0,0.03),0_14px_28px_rgba(0,0,0,0.08)]'

function SheetFrame({ label, onClose, dismissable, className, children }: { label: string; onClose: () => void; dismissable: boolean; className: string; children: ReactNode }) {
  const motion = useSheetMotion()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden onClick={dismissable ? onClose : undefined} className="absolute inset-0 bg-black/50" style={motion.backdrop} />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
        <section role="dialog" aria-modal="true" aria-label={label} className={`pointer-events-auto relative flex w-full max-w-[512px] flex-col rounded-t-[16px] bg-white ${SHADOW} ${className}`} style={motion.panel}>
          <div className="flex justify-center pb-[8px]">
            <div className="h-[4px] w-[36px] rounded-[2px] bg-[#e4e4e7]" />
          </div>
          {children}
        </section>
      </div>
    </div>
  )
}

/**
 * Add / edit profile sheet (live SAVED_PASSENGER_FORM_SHEET / SAVED_VEHICLE_FORM_SHEET): 95% screen tall, not dismissable by
 * backdrop tap, grey round close button, 18px/800 slate-800 title over a slate-100 rule, scrolling body with the submit button at its end.
 */
export function FormSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <SheetFrame label={title} onClose={onClose} dismissable={false} className="h-[calc(var(--screen-vh)*95)] p-[24px]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-[16px] right-[16px] flex size-[40px] items-center justify-center rounded-full bg-[#f5f5f5] text-[#737373] transition-transform active:scale-95"
      >
        <CloseIcon />
      </button>
      <div className="border-b border-[#f1f5f9] pb-[16px]">
        <h2 className="text-[18px] leading-[28px] font-extrabold text-[#1d293d]">{title}</h2>
      </div>
      <div className="-mx-[3px] mt-[8px] flex min-h-0 flex-1 flex-col overflow-y-auto px-[3px] pt-[16px] pb-[24px] text-[14px] text-[#71717a] [scrollbar-width:none]">{children}</div>
    </SheetFrame>
  )
}

/**
 * ⋮ menu on a saved passenger / vehicle — the user's design ("Passenger Actions"): grab handle, bold name with a round
 * close button, then two outlined rows: "Edit …" and a red "Remove …" (opens the delete confirmation). Backdrop tap closes.
 */
export function ActionSheet({ title, noun, onClose, onEdit, onRemove }: { title: string; noun: string; onClose: () => void; onEdit: () => void; onRemove: () => void }) {
  return (
    <SheetFrame label="Profile actions" onClose={onClose} dismissable className="max-h-[calc(var(--screen-vh)*95)] px-[24px] pt-[12px] pb-[32px]">
      <div className="mt-[12px] flex items-center justify-between gap-[12px]">
        <h2 className="min-w-0 truncate text-[20px] leading-[28px] font-bold text-[#1c1917]">{title}</h2>
        <button type="button" aria-label="Close" onClick={onClose} className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-[#8e8e93] transition-transform active:scale-95">
          <CloseIcon />
        </button>
      </div>
      <div className="mt-[20px] flex flex-col gap-[12px]">
        <button
          type="button"
          onClick={onEdit}
          className="flex h-[62px] w-full items-center gap-[14px] rounded-16 border border-[#d9d9dc] bg-white px-[12px] text-left text-[16px] font-medium text-[#1c1917] transition-colors hover:bg-[#fafafa] active:scale-[0.99]"
        >
          <span className="flex size-[36px] items-center justify-center rounded-full bg-[#f0f0f2] text-[#6b6b70]">
            <PencilIcon size={18} />
          </span>
          Edit {noun}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-[62px] w-full items-center gap-[14px] rounded-16 border border-[#e5483a] bg-white px-[12px] text-left text-[16px] font-medium text-[#e5483a] transition-colors hover:bg-[#fff5f4] active:scale-[0.99]"
        >
          <span className="flex size-[36px] items-center justify-center rounded-full bg-[#f8cdc8] text-[#e5483a]">
            <TrashIcon size={18} />
          </span>
          Remove {noun}
        </button>
      </div>
    </SheetFrame>
  )
}

/** "Delete Confirmation" — the user's design: centred title and note, a red "Delete" button and an outlined orange "Keep …". */
export function ConfirmDeleteSheet({ title, note, keepLabel, onDelete, onKeep }: { title: string; note: string; keepLabel: string; onDelete: () => void; onKeep: () => void }) {
  return (
    <SheetFrame label="Delete confirmation" onClose={onKeep} dismissable className="px-[24px] pt-[12px] pb-[32px]">
      <h2 className="mt-[14px] text-center text-[18px] leading-[26px] font-bold text-[#1c1917]">{title}</h2>
      <p className="mx-auto mt-[8px] max-w-[330px] text-center text-[14px] leading-[22px] text-[#5e5d5f]">{note}</p>
      <button type="button" onClick={onDelete} className="mt-[20px] h-[56px] w-full rounded-16 bg-[#e2432d] text-[16px] font-bold text-white transition-transform active:scale-[0.99]">
        Delete
      </button>
      <button type="button" onClick={onKeep} className="mt-[12px] h-[56px] w-full rounded-16 border-2 border-[#e8721d] bg-white text-[16px] font-bold text-[#e8721d] transition-transform active:scale-[0.99]">
        {keepLabel}
      </button>
    </SheetFrame>
  )
}
