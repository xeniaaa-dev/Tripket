import { useSyncExternalStore } from 'react'

// Prototype-only switches set from the floating "Prototype controls" panel (src/components/PrototypeControls.tsx).
// Read outside React with `protoFlags()`, inside with `useProtoFlags()`.
export type ProtoFlags = {
  /** shipping-line steps (review → booked, generating → booked, refund) take ~1s instead of 8–12s */
  fast: boolean
  /** the next Maayo card payment is declined → Payment Failed (resets after use) */
  declineNext: boolean
  /** the next Pay with a limited voucher finds them all claimed → "Voucher no longer available" (resets after use) */
  vouchersGone: boolean
  /** Figma "You're offline" toast (back online → "Back online") */
  offline: boolean
  /** whole app shows the Figma Maintenance Screen */
  maintenance: boolean
  /** Review & pay email card: force one of its four Figma states (auto = behave normally) */
  emailState: 'auto' | 'default' | 'focus' | 'mismatch' | 'confirmed'
  /** Review & pay Vouchers card: normal list, none usable for this booking (all greyed out), or no vouchers at all */
  voucherList: 'auto' | 'none-usable' | 'empty'
  /** voucher animation version to compare: dust lands under the Total in the page, or in the fixed Pay bar at the bottom */
  voucherAnim: 'inline' | 'bar'
}

let flags: ProtoFlags = { fast: false, declineNext: false, vouchersGone: false, offline: false, maintenance: false, emailState: 'auto', voucherList: 'auto', voucherAnim: 'inline' }
const listeners = new Set<() => void>()

/** Prototype controls → Voucher states: Review & pay registers these while it's open (type + Apply a code / show "no longer available"). */
export const voucherDemo: { apply?: (code: string) => void; clear?: () => void; gone?: () => void } = {}

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
