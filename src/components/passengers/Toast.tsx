/* oxlint-disable react/only-export-components -- toast store + its renderer live together */
import { useEffect, useState, useSyncExternalStore } from 'react'
import { CheckIcon } from './icons'

// Live success toast (HeroUI toast, top placement): white pill, 24px radius, green check + green 14px/500 text,
// shown ~4s, 16px from the top of the window, centered over the app column.
let current: { id: number; message: string } | null = null
let seq = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function showSuccess(message: string) {
  current = { id: ++seq, message }
  emit()
}

const VISIBLE_MS = 4000
const FADE_MS = 250

export function Toaster() {
  const toast = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
  )
  const [shown, setShown] = useState<number | null>(null)

  useEffect(() => {
    if (!toast) return
    const raf = requestAnimationFrame(() => setShown(toast.id))
    const hide = setTimeout(() => setShown(null), VISIBLE_MS)
    const clear = setTimeout(() => {
      if (current?.id === toast.id) {
        current = null
        emit()
      }
    }, VISIBLE_MS + FADE_MS)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hide)
      clearTimeout(clear)
    }
  }, [toast])

  if (!toast) return null
  const visible = shown === toast.id
  return (
    <div
      role="status"
      className="fixed inset-x-[16px] top-[16px] z-[70] mx-auto flex max-w-[480px] items-center gap-[6px] rounded-[24px] bg-white px-[16px] py-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.06),0_-6px_12px_rgba(0,0,0,0.03),0_14px_28px_rgba(0,0,0,0.08)]"
      style={{ opacity: visible ? 1 : 0, translate: visible ? '0 0' : '0 -8px', transition: `opacity ${FADE_MS}ms ease, translate ${FADE_MS}ms ease` }}
    >
      <span className="flex size-[28px] items-center justify-center p-[4px] text-[#00bc7d]">
        <CheckIcon />
      </span>
      <span className="text-[14px] leading-[20px] font-medium text-[#2b7745]">{toast.message}</span>
    </div>
  )
}
