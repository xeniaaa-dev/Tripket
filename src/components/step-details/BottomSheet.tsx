import type { ReactNode } from 'react'
import { useSheetMotion } from '../Drawer'
import { CloseX } from './icons'

// Figma: "BottomSheet" (node 12421:1084) — dimmed backdrop (node 11598:42079), handle, title row with close button.
export default function BottomSheet({
  title,
  onClose,
  children,
  maxHeight = 'calc(100% - 128px)',
}: {
  title: string
  onClose: () => void
  children: ReactNode
  /** sheets with long forms start 128px from the top of the screen (node 11598:40897) */
  maxHeight?: string
}) {
  const motion = useSheetMotion() // live-app sheet animation (see Drawer.tsx)
  return (
    <div className="fixed inset-0 z-40">
      <button type="button" aria-label="Close" onClick={onClose} style={motion.backdrop} className="absolute inset-0 cursor-default bg-[rgba(0,0,0,0.3)]" />
      <div
        role="dialog"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[512px] flex-col rounded-t-[24px] bg-white drop-shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
        style={{ maxHeight, ...motion.panel }}
      >
        <div className="flex h-[13.995px] shrink-0 justify-center pt-[9.999px]">
          <span className="h-[3.996px] w-[35.983px] rounded-full bg-border-default" />
        </div>
        <div className="flex h-[67.969px] shrink-0 items-center justify-between px-[16px]">
          <h2 className="text-[17px] leading-[25.5px] font-bold text-text-primary">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="flex size-[43.992px] items-center justify-center rounded-full bg-[#f8f8fa]">
            <CloseX />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

/** "Confirmation Modal - Unsaved Changes (Bottom Sheet)" (node 11598:45677) */
export function UnsavedChangesSheet({ what, onContinue, onDiscard }: { what: string; onContinue: () => void; onDiscard: () => void }) {
  const motion = useSheetMotion()
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Continue editing" onClick={onContinue} style={motion.backdrop} className="absolute inset-0 cursor-default bg-[rgba(0,0,0,0.3)]" />
      <div role="alertdialog" aria-label="Unsaved changes" style={motion.panel} className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[512px] flex-col items-center overflow-clip rounded-t-[24px] bg-white px-[16px] pt-[14px] pb-[33px]">
        <span className="h-[4px] w-[36px] rounded-[2px] bg-border-default" />
        <p className="mt-[18px] w-full text-center text-[17px] font-bold text-text-primary">Unsaved changes</p>
        <p className="mt-[9px] w-full text-center text-[13.5px] leading-[1.45] font-medium text-text-muted">
          You've entered {what} details that haven't been saved yet. What would you like to do?
        </p>
        <button type="button" onClick={onContinue} className="mt-[15px] h-[56px] w-full rounded-16 bg-primary-default text-[16px] font-bold text-white">
          Continue Editing
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="mt-[12px] h-[56px] w-full rounded-16 border-[1.5px] border-border-default bg-white text-[15px] leading-[22.5px] font-bold text-[#ef4444]"
        >
          Discard Changes
        </button>
      </div>
    </div>
  )
}
