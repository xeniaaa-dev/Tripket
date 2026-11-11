/* oxlint-disable react/only-export-components -- sheet motion primitives live together */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// Bottom-sheet motion matching the live app (book.tripket.ph, HeroUI drawer):
// backdrop fades, sheet slides up from translate 0 100%.
// Enter 0.25s, exit 0.2s, both cubic-bezier(0.32, 0.72, 0, 1).
const EASE = 'cubic-bezier(0.32,0.72,0,1)'
const ENTER_MS = 250
const EXIT_MS = 200

type Phase = 'closed' | 'entering' | 'open' | 'exiting'
const Motion = createContext({ shown: true })

/**
 * Mounts a sheet while `open`, animates it in, and keeps it (with its last content) on screen until the exit animation ends.
 * Usage: <SheetPresence open={cond}>{cond && <MySheet … />}</SheetPresence> — the sheet styles itself with useSheetMotion().
 */
export function SheetPresence({ open, children }: { open: boolean; children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(open ? 'open' : 'closed')
  const [prevOpen, setPrevOpen] = useState(open)
  const [kept, setKept] = useState<ReactNode>(open ? children : null)
  if (open !== prevOpen) {
    setPrevOpen(open)
    setPhase(open ? 'entering' : 'exiting')
  }
  if (open && kept !== children) setKept(children)

  useEffect(() => {
    if (phase === 'entering') {
      // two frames so the browser paints the off-screen position before transitioning in
      let id = requestAnimationFrame(() => (id = requestAnimationFrame(() => setPhase('open'))))
      return () => cancelAnimationFrame(id)
    }
    if (phase === 'exiting') {
      const t = setTimeout(() => setPhase('closed'), EXIT_MS)
      return () => clearTimeout(t)
    }
  }, [phase])

  if (phase === 'closed') return null
  return <Motion value={{ shown: phase === 'open' }}>{kept}</Motion>
}

/** Inline styles for a sheet's backdrop and panel inside <SheetPresence>. */
export function useSheetMotion() {
  const { shown } = useContext(Motion)
  const t = `${shown ? ENTER_MS : EXIT_MS}ms ${EASE}`
  return {
    backdrop: { opacity: shown ? 1 : 0, transition: `opacity ${t}` },
    panel: { translate: shown ? '0 0' : '0 100%', transition: `translate ${t}` },
  }
}

function DrawerPanel({ onClose, label, children }: { onClose: () => void; label: string; children: ReactNode }) {
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
          className="pointer-events-auto relative flex max-h-[calc(var(--screen-vh)*95)] w-full max-w-[512px] flex-col rounded-t-[16px] bg-white p-[24px] motion-reduce:transition-none"
          style={motion.panel}
        >
          {children}
        </section>
      </div>
    </div>
  )
}

/** The live app's drawer chrome (white, 16px top radius, 24px padding, black/50 backdrop). Closes on backdrop tap or Esc. */
export default function Drawer({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  return (
    <SheetPresence open={open}>
      <DrawerPanel onClose={onClose} label={label}>
        {children}
      </DrawerPanel>
    </SheetPresence>
  )
}
