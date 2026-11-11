import { useEffect, useRef, useState } from 'react'
import check from '../../assets/live/tickets/check.svg'
import { SORTS, type SortId } from '../../data/tickets'

// Live: HeroUI Select "Sort tickets" (book.tripket.ph/tickets).
// Trigger: h-10 pill, white, 1px #f5f5f5 border, shadow-sm + inset-shadow-xs, 12px bold #3c3c43 value, chevron rotates 180° (150ms).
// Disabled (guest, no tickets): opacity .5, not-allowed. Popover: 200px, 16px radius, white, HeroUI overlay shadow;
// enter 150ms ease from opacity 0 / scale .95 / translateY -4px, exit 100ms ease to opacity 0 / scale .95.
// Items: px-3 py-2, 14px, selected row = orange gradient + check; pressed scale .98.

type Phase = 'closed' | 'entering' | 'open' | 'exiting'
const ENTER = 'opacity 150ms ease, transform 150ms ease'
const EXIT = 'opacity 100ms ease, transform 100ms ease'

export default function SortSelect({ value, onChange, disabled }: { value: SortId; onChange: (v: SortId) => void; disabled?: boolean }) {
  const [phase, setPhase] = useState<Phase>('closed')
  const root = useRef<HTMLDivElement>(null)
  const open = phase === 'entering' || phase === 'open'
  const label = SORTS.find((s) => s.id === value)?.label ?? SORTS[0].label

  useEffect(() => {
    if (phase === 'entering') {
      let id = requestAnimationFrame(() => (id = requestAnimationFrame(() => setPhase('open'))))
      return () => cancelAnimationFrame(id)
    }
    if (phase === 'exiting') {
      const t = setTimeout(() => setPhase('closed'), 100)
      return () => clearTimeout(t)
    }
  }, [phase])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setPhase('exiting')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPhase('exiting')
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = () => setPhase(open ? 'exiting' : 'entering')
  const pick = (id: SortId) => {
    onChange(id)
    setPhase('exiting')
  }

  const shown = phase === 'open'
  return (
    <div ref={root} className="relative flex">
      <button
        type="button"
        aria-label="Sort tickets"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={toggle}
        className="relative flex h-10 min-h-9 items-center gap-2 rounded-[14px] border border-neutral-200 bg-white py-2 pr-9 pl-4 text-sm shadow-sm inset-shadow-xs shadow-neutral-100 transition-colors duration-150 select-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex-1 truncate text-start text-sm font-semibold text-[#3c3c43]">{label}</span>
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="absolute inset-y-0 right-[9px] my-auto size-4 text-[#71717a] transition-[rotate] duration-150"
          style={{ rotate: open ? '180deg' : '0deg' }}
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
          />
        </svg>
      </button>

      {phase !== 'closed' && (
        <div
          role="listbox"
          aria-label="Sort tickets"
          className="absolute top-[calc(100%+4px)] right-0 z-40 w-[200px] overflow-hidden rounded-2xl border border-[#dedee0] bg-white text-sm text-[#18181b] shadow-[0_2px_8px_0_#0000000f,0_-6px_12px_0_#00000008,0_14px_28px_0_#00000014]"
          style={{
            transformOrigin: '118px 0',
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : phase === 'entering' ? 'translateY(-4px) scale(0.95)' : 'scale(0.95)',
            transition: phase === 'exiting' ? EXIT : phase === 'open' ? ENTER : 'none',
          }}
        >
          {SORTS.map((s) => {
            const selected = s.id === value
            return (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => pick(s.id)}
                className={`flex min-h-9 w-full items-center px-3 py-2 text-left transition-transform duration-250 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-[#f97316]/5 active:scale-[0.98] ${selected ? 'bg-linear-to-r from-[#f973161a] to-[#f973160a]' : 'bg-slate-50/10'}`}
              >
                <span className="flex w-full items-center justify-between gap-x-2">
                  <span className="w-4">{selected && <img alt="" src={check} className="size-[18px] max-w-none" />}</span>
                  <span className="flex flex-1 items-center justify-between gap-2">
                    <span>{s.label}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
