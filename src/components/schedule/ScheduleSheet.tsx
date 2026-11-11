import { useEffect, type ReactNode } from 'react'
import closeIcon from '../../assets/live/schedule/close.svg'
import { SheetPresence, useSheetMotion } from '../Drawer'

// Live HeroUI drawer chrome used by the schedule sheets (PORT_SELECT_SHEET, SCHEDULE_FILTER_SHEET):
// white panel, 16px top radius, 24px padding, layered shadow, 36×4 grab handle, 40px grey close button top-right.
function Panel({ onClose, label, fullHeight, children }: { onClose: () => void; label: string; fullHeight?: boolean; children: ReactNode }) {
  const motion = useSheetMotion()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/50 motion-reduce:transition-none" style={motion.backdrop} />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
        <section
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className={`pointer-events-auto relative flex w-full max-w-[512px] flex-col rounded-t-[16px] bg-white p-[24px] shadow-[0_2px_8px_#0000000f,0_-6px_12px_#00000008,0_14px_28px_#00000014] motion-reduce:transition-none ${
            fullHeight ? 'h-[calc(var(--screen-vh)*95)]' : 'max-h-[calc(var(--screen-vh)*95)]'
          }`}
          style={motion.panel}
        >
          <div aria-hidden className="flex shrink-0 justify-center pb-[8px]">
            <div className="h-[4px] w-[36px] rounded-[2px] bg-[#e4e4e7]" />
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-[16px] right-[16px] flex size-[40px] items-center justify-center rounded-full bg-[#f5f5f5] transition-transform duration-250 active:scale-95"
          >
            <img alt="" src={closeIcon} className="size-[16px]" />
          </button>
          {children}
        </section>
      </div>
    </div>
  )
}

export default function ScheduleSheet({
  open,
  onClose,
  label,
  fullHeight,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  /** the port sheet is h-full (95% of the screen); the filter sheet hugs its content */
  fullHeight?: boolean
  children: ReactNode
}) {
  return (
    <SheetPresence open={open}>
      <Panel onClose={onClose} label={label} fullHeight={fullHeight}>
        {children}
      </Panel>
    </SheetPresence>
  )
}
