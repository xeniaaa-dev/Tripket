import { cabins, FREE_PER_VEHICLE, VEHICLE_FARE } from '../data/step-details'
import { findDeparture } from '../data/departures'
import type { BookingState, PassengerDetail, VehicleDetail } from './BookingContext'
import { addDays, formatBookingDate, parseBookingDate, startOfToday } from './date'

// The three extra booking flows from Figma "Other Booking Flows" (12328:2344), on top of the normal 4-step booking:
//   Rebook            – same route + shipping line, new date only        → Select departure → Review & pay      (2 steps)
//   Return trip       – route reversed, new date, edit pax / vehicle      → When do you return → Select departure → Review & pay (3)
//   Book another trip – continues from the last destination, new To       → Book another trip → Select departure → Passenger details → Review & pay (4; Figma says 5 because of Add-ons, which this app doesn't have)
export type Flow = BookingState['flow']
export type Screen = 'book' | 'another' | 'return' | 'departure' | 'details' | 'review'

export const FLOW_SCREENS: Record<Flow, Screen[]> = {
  standard: ['book', 'departure', 'details', 'review'],
  another: ['another', 'departure', 'details', 'review'],
  rebook: ['departure', 'review'],
  return: ['return', 'departure', 'review'],
}

export const SCREEN_PATH: Record<Screen, string> = {
  book: '/book',
  another: '/book/another',
  return: '/book/return',
  departure: '/book/departure',
  details: '/book/details',
  review: '/book/review',
}

export const stepOf = (flow: Flow, screen: Screen) => FLOW_SCREENS[flow].indexOf(screen) + 1
/** Path of the screen after `screen` in this flow (undefined at the end). */
export const nextPath = (flow: Flow, screen: Screen) => {
  const next = FLOW_SCREENS[flow][stepOf(flow, screen)]
  return next ? SCREEN_PATH[next] : undefined
}
/** Path of the screen before `screen` in this flow (undefined on the first screen → Home). */
export const prevPath = (flow: Flow, screen: Screen) => {
  const prev = FLOW_SCREENS[flow][stepOf(flow, screen) - 2]
  return prev ? SCREEN_PATH[prev] : undefined
}

export const EMPTY_PORT = { code: '', city: '' }

/** Back to the normal flow: drops everything a special flow carried over. */
export const freshPatch: Partial<BookingState> = {
  flow: 'standard',
  lineLock: undefined,
  departureId: null,
  passengers: [],
  vehicles: [],
}

const carried = (b: BookingState) => ({
  passengers: b.passengers,
  vehicles: b.vehicles,
  passengerCount: b.passengers.length || b.passengerCount,
  vehicleCount: b.vehicles.length,
  departureId: null,
})

/** The date the previous trip arrives (all prototype sailings arrive the same day unless flagged). */
const arrivalDate = (b: BookingState) => addDays(parseBookingDate(b.date), findDeparture(b.departureId)?.nextDayArrival ? 1 : 0)
const notBeforeToday = (d: Date) => (d < startOfToday() ? startOfToday() : d)

/** Rebook: same route, shipping line, passengers and vehicles; only the date changes. */
export const rebookPatch = (b: BookingState, date: Date): Partial<BookingState> => ({
  ...carried(b),
  from: b.from,
  to: b.to,
  date: formatBookingDate(date),
  flow: 'rebook',
  lineLock: findDeparture(b.departureId)?.line,
})

/** Return trip: route reversed; date defaults to the day after arrival. */
export const returnPatch = (b: BookingState): Partial<BookingState> => ({
  ...carried(b),
  from: b.to,
  to: b.from,
  date: formatBookingDate(notBeforeToday(addDays(arrivalDate(b), 1))),
  flow: 'return',
  lineLock: undefined,
})

/** Book another trip: previous destination becomes From, To is blank, date = previous arrival date. */
export const anotherPatch = (b: BookingState): Partial<BookingState> => ({
  ...carried(b),
  from: b.to,
  to: EMPTY_PORT,
  date: formatBookingDate(notBeforeToday(arrivalDate(b))),
  flow: 'another',
  lineLock: undefined,
})

const cabinPrice = (cabin: string) => cabins.find((c) => c.name === cabin)?.price ?? cabins[0].price

/** Re-price carried passengers after an edit (first FREE_PER_VEHICLE ride free when a vehicle is booked). */
export function repriced(passengers: PassengerDetail[], vehicles: VehicleDetail[]): PassengerDetail[] {
  const free = vehicles.length > 0 ? FREE_PER_VEHICLE : 0
  return passengers.map((p, i) => ({ ...p, fare: i < free ? null : cabinPrice(p.cabin) }))
}

export const withVehicleFare = (v: Omit<VehicleDetail, 'fare'>): VehicleDetail => ({ ...v, fare: VEHICLE_FARE })
