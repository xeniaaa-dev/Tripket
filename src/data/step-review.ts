import type { BookingState, PassengerDetail, VehicleDetail } from '../booking/BookingContext'
import { arrivalNoteFor, findDeparture, type Departure } from './departures'
import { FREE_PER_VEHICLE, VEHICLE_FARE } from './step-details'
import { VOUCHERS } from './policy'

// Figma fallback for "Review & pay" (node 12348:746) — used when the earlier steps haven't filled the booking yet,
// so the screen renders exactly like Figma when opened directly.
export const mockPassengers: PassengerDetail[] = [
  { id: 'p1', fullName: 'Maria C. Santos', fareType: 'Regular', cabin: 'Economy', fare: null },
  { id: 'p2', fullName: 'Maria C. Santos', fareType: 'Regular', cabin: 'Economy', fare: null },
  { id: 'p3', fullName: 'Maria C. Santos', fareType: 'Regular', cabin: 'Economy', fare: 1350 },
]

export const mockVehicles: VehicleDetail[] = [{ id: 'v1', plate: 'FAU1995', model: 'Toyota Fortuner', type: 'SUV / Pickup', fare: 1350 }]

export type Trip = {
  /** "MV Lite Ferry 18" — Departure has no vessel name, so the operator is used for real departures */
  vessel: string
  /** "Lite Shipping" */
  operator: string
  vesselType: string
  departTime: string
  arriveTime: string
  duration: string
  arrivalNote: string
  /** operator logo asset (real departures only; the mock uses Figma's "LF" badge) */
  logo?: string
}

export const mockTrip: Trip = {
  vessel: 'MV Lite Ferry 18',
  operator: 'Lite Shipping',
  vesselType: 'RoRo',
  departTime: '12:00 AM',
  arriveTime: '5:00 AM',
  duration: '5H',
  arrivalNote: 'Arrives Thu, Apr 9',
}

/** Service Fee from Figma (₱84.00) */
export const SERVICE_FEE = 84

/** Service fee for a booking: waived by the NO-FEE (return-trip) voucher. */
export const serviceFeeOf = (b: { voucher?: string }) => (b.voucher && VOUCHERS[b.voucher]?.off === 'fee' ? 0 : SERVICE_FEE)

/** Peso discount from an amount voucher (SAVE200 etc.), never more than the fares. */
export function discountOf(b: { voucher?: string }, subtotal: number) {
  const off = b.voucher ? VOUCHERS[b.voucher]?.off : undefined
  return typeof off === 'number' ? Math.min(off, subtotal) : 0
}

/** Subtotal − voucher + service fee. */
export function priceOf(b: { voucher?: string }, subtotal: number) {
  const discount = discountOf(b, subtotal)
  const serviceFee = serviceFeeOf(b)
  return { subtotal, discount, serviceFee, voucher: b.voucher, total: subtotal - discount + serviceFee }
}

/** "All-in" estimate shown on a Select departure row, before passenger types and vehicle type are chosen (so Senior/PWD discounts and cabin upgrades aren't in it). */
export function estimateTotal(d: Departure, b: BookingState) {
  const free = b.vehicleCount > 0 ? FREE_PER_VEHICLE : 0
  const fares = Math.max(b.passengerCount - free, 0) * d.price
  const vehicles = b.vehicleCount * VEHICLE_FARE
  const fee = serviceFeeOf(b)
  return { fares, vehicles, fee, total: fares + vehicles + fee }
}

/** Booking data with the Figma fallback applied + computed money. */
export function reviewData(booking: BookingState) {
  const filled = booking.passengers.length > 0
  const passengers = filled ? booking.passengers : mockPassengers
  const vehicles = filled ? booking.vehicles : mockVehicles
  const d = findDeparture(booking.departureId)
  const trip: Trip = d
    ? { vessel: d.vessel, operator: d.operator, vesselType: d.vesselType, departTime: d.departTime, arriveTime: d.arriveTime, duration: d.duration, arrivalNote: arrivalNoteFor(d, booking.date), logo: d.logo }
    : mockTrip
  const subtotal = passengers.reduce((s, p) => s + (p.fare ?? 0), 0) + vehicles.reduce((s, v) => s + v.fare, 0)
  return { passengers, vehicles, trip, ...priceOf(booking, subtotal) }
}

/** Row style: "₱1350.00" */
export const peso = (n: number) => `₱${n.toFixed(2)}`
/** Total / CTA style: "₱2,490" */
export const pesoTotal = (n: number) => `₱${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "Wed, April 8 2026" → Date */
function parseBookingDate(date: string) {
  const m = date.match(/(\w+) (\d+),? (\d{4})$/)
  return m ? new Date(`${m[1]} ${m[2]}, ${m[3]}`) : null
}

/** "Wed, April 8 2026" → "Wed, Apr 8" (banner "Departs …") */
export function shortDate(date: string) {
  const d = parseBookingDate(date)
  if (!d) return date
  return `${d.toLocaleDateString('en-US', { weekday: 'short' })}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

/** "Wed, April 8 2026" → "Apr 8, Wednesday" (confirmation card) */
export function dayDate(date: string) {
  const d = parseBookingDate(date)
  if (!d) return date
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.toLocaleDateString('en-US', { weekday: 'long' })}`
}

/** "Arrives Thu, Apr 9" + booking date (for the year) → "Apr 9, Thursday" */
export function arrivalDayDate(arrivalNote: string, bookingDate: string) {
  const m = arrivalNote.match(/(\w{3}) (\d+)$/)
  const year = parseBookingDate(bookingDate)?.getFullYear() ?? new Date().getFullYear()
  if (!m) return arrivalNote
  return dayDate(`x, ${m[1]} ${m[2]} ${year}`)
}
