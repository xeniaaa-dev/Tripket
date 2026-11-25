import type { ShippingLine } from './departures'

// Prototype copy for the new "transparent pricing / operator terms / pre-boarding / return voucher" designs.
// These screens are not in the Figma file yet, so the wording is placeholder.

/** Return-trip voucher: zero service fee on the way back. Set by returnPatch, shown on Select departure, Review & pay and the receipt. */
export const VOUCHER = { code: 'NO-FEE', title: '₱0 service fee', note: 'on your way back' }

/**
 * Checkout voucher codes (prototype). One voucher per booking, typed on Review & pay.
 * `limited` vouchers are first-come, first-served: applying does not reserve one, it's only used when payment completes
 * (prototype: the "Vouchers run out at checkout" switch makes the next Pay find them all claimed).
 */
export type VoucherDef = { off: number | 'fee'; limited: boolean; expired?: boolean; line?: ShippingLine; min?: number; terms: string }
export const VOUCHERS: Record<string, VoucherDef> = {
  [VOUCHER.code]: { off: 'fee', limited: false, terms: 'Return trips booked from your confirmation' },
  SAVE200: { off: 200, limited: true, terms: '₱200 off any booking' },
  MAAYO150: { off: 150, limited: true, line: 'maayo', terms: 'Maayo Shipping routes only' },
  BIG500: { off: 500, limited: true, min: 5000, terms: '₱500 off bookings of ₱5,000 or more' },
  SUMMER100: { off: 100, limited: true, expired: true, terms: 'Expired May 31' },
}

export type VoucherCheck = 'ok' | 'invalid' | 'expired' | 'ineligible'
export function checkVoucher(code: string, { subtotal, line }: { subtotal: number; line: ShippingLine }): VoucherCheck {
  const v = VOUCHERS[code]
  if (!v) return 'invalid'
  if (v.expired) return 'expired'
  if ((v.line && v.line !== line) || (v.min && subtotal < v.min)) return 'ineligible'
  return 'ok'
}

/** Companion referral: shared code, the companion gets a discount on their first booking. */
export const REFERRAL = { code: 'KEN-TRIPKET', give: '₱50', get: '₱50' }

/** One policy row: short headline + one-line detail (app rows, not paragraphs). */
export type PolicyRow = { title: string; detail: string }
export type Policy = { cancellation: PolicyRow; refund: PolicyRow; baggage: PolicyRow; checkin: PolicyRow }

/** Operator-specific terms shown on Review & pay. */
export const POLICY: Record<ShippingLine, Policy> = {
  oceanjet: {
    cancellation: { title: 'Free cancellation', detail: 'Until 24 hours before departure' },
    refund: { title: '10% refund fee after that', detail: 'Non-refundable within 2 hours of departure' },
    baggage: { title: '20 kg checked + 7 kg carry-on', detail: 'Per passenger' },
    checkin: { title: 'Check-in closes 60 min before', detail: 'At the OceanJet counter' },
  },
  hsmarine: {
    cancellation: { title: 'Free cancellation', detail: 'Until 12 hours before departure' },
    refund: { title: 'Non-refundable after that', detail: 'Seats are released to other passengers' },
    baggage: { title: '25 kg checked + 7 kg carry-on', detail: 'Per passenger' },
    checkin: { title: 'Check-in closes 45 min before', detail: 'At the HS Marine counter' },
  },
  maayo: {
    cancellation: { title: 'Free cancellation', detail: 'Until 48 hours before departure' },
    refund: { title: '20% refund fee after that', detail: 'Non-refundable within 6 hours of departure' },
    baggage: { title: '30 kg checked + 7 kg carry-on', detail: 'Per passenger, up to 2 bags' },
    checkin: { title: 'Check-in closes 60 min before', detail: 'At the Maayo Shipping counter' },
  },
}

/** "9:20 AM" − 2h → "7:20 AM" */
export function hoursBefore(time: string, hours: number) {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return ''
  const mins = (((Number(m[1]) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0)) * 60 + Number(m[2]) - hours * 60 + 1440) % 1440
  const h = Math.floor(mins / 60)
  return `${h % 12 || 12}:${String(mins % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}
