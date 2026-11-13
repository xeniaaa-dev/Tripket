import { useSyncExternalStore } from 'react'

// Prototype-only switches set from the floating "Prototype controls" panel (src/components/PrototypeControls.tsx).
// Read outside React with `protoFlags()`, inside with `useProtoFlags()`.
export type ProtoFlags = {
  /** shipping-line steps (review → booked, generating → booked, refund) take ~1s instead of 8–12s */
  fast: boolean
  /** the next Maayo card payment is declined → Payment Failed (resets after use) */
  declineNext: boolean
  /** Figma "You're offline" toast (back online → "Back online") */
  offline: boolean
  /** whole app shows the Figma Maintenance Screen */
  maintenance: boolean
  /** Review & pay email card: force one of its four Figma states (auto = behave normally) */
  emailState: 'auto' | 'default' | 'focus' | 'mismatch' | 'confirmed'
}

let flags: ProtoFlags = { fast: false, declineNext: false, offline: false, maintenance: false, emailState: 'auto' }
const listeners = new Set<() => void>()

export const protoFlags = () => flags
export function setProtoFlag<K extends keyof ProtoFlags>(key: K, value: ProtoFlags[K]) {
  flags = { ...flags, [key]: value }
  listeners.forEach((l) => l())
}
export const useProtoFlags = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    protoFlags,
  )
