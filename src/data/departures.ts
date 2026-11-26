import hsMarineLogo from '../assets/live/schedule/logo-hs-star.jpg'
import maayoLogo from '../assets/figma/step-departure/maayo.png'
import oceanjetLogo from '../assets/figma/step-departure/oceanjet.png'
import { parseBookingDate } from '../booking/date'

/** The three shipping lines in the prototype. Each has its own confirmation screens and boarding pass (see Figma
 *  "Confirmation Screens OCEAN JET / HS / MAAYO SHIPPING" and "Boarding Pass"). */
export type ShippingLine = 'oceanjet' | 'hsmarine' | 'maayo'

// Departures shown on "Select departure". Owned by that screen; other screens read via findDeparture().
export type Departure = {
  id: string
  line: ShippingLine
  /** "OceanJet" | "HS Marine" | "Maayo Shipping" */
  operator: string
  /** placeholder vessel name (the live app doesn't expose real vessel names to guests) */
  vessel: string
  /** imported asset URL of the operator logo */
  logo: string
  vesselType: string // "RoRo" | "Fast Craft"
  departTime: string // "12:00 AM"
  arriveTime: string // "7:00 PM"
  duration: string // "1H 30M"
  /** @deprecated static text — the date depends on the booking, use arrivalNoteFor(d, booking.date) */
  arrivalNote: string
  price: number // per person, pesos
  /** arrives on a later day than it departs (Figma shows that note in orange) */
  nextDayArrival?: boolean
  /** how the logo sits in its 40px tile in Figma: plain (Maayo), cover (bordered tile), inset (white tile, 33×22 image) */
  logoFit?: 'plain' | 'cover' | 'inset'
  /** seats still open (sample); unset = plenty. 0 = fully booked */
  seatsLeft?: number
}

// Figma: "SingleCompanyDepartureList" (node 11598:39455), "Book - Select Departure" frames 11598:39412 / 11598:40090.
// Times/prices follow the live app's list (OceanJet and HS Star Marine ₱420 / ₱388); Maayo and the vessel names are placeholders.
const oceanjet = { line: 'oceanjet', operator: 'OceanJet', vessel: 'OceanJet 8', logo: oceanjetLogo, logoFit: 'inset', vesselType: 'Fast Craft', price: 420 } as const
const hsMarine = { line: 'hsmarine', operator: 'HS Marine', vessel: 'MV HS Marine 1', logo: hsMarineLogo, logoFit: 'cover', vesselType: 'RoRo', price: 388 } as const
const maayo = { line: 'maayo', operator: 'Maayo Shipping', vessel: 'MV Maayo 1', logo: maayoLogo, logoFit: 'plain', vesselType: 'RoRo', price: 350 } as const

/** Operator name + logo per shipping line (Home popular route cards) */
export const OPERATORS: Record<ShippingLine, { operator: string; logo: string; logoFit: Departure['logoFit'] }> = { oceanjet, hsmarine: hsMarine, maayo }

export const departures: Departure[] = [
  { ...maayo, id: 'maayo-0400', departTime: '4:00 AM', arriveTime: '5:30 AM', duration: '1H 30M', arrivalNote: '' },
  { ...hsMarine, id: 'hsmarine-0920', departTime: '9:20 AM', arriveTime: '10:50 AM', duration: '1H 30M', arrivalNote: '' },
  { ...oceanjet, id: 'oceanjet-1100', departTime: '11:00 AM', arriveTime: '11:40 AM', duration: '40M', arrivalNote: '' },
  { ...oceanjet, id: 'oceanjet-1300', departTime: '1:00 PM', arriveTime: '1:40 PM', duration: '40M', arrivalNote: '', seatsLeft: 0 },
  { ...maayo, id: 'maayo-1400', departTime: '2:00 PM', arriveTime: '3:30 PM', duration: '1H 30M', arrivalNote: '' },
  { ...hsMarine, id: 'hsmarine-1715', departTime: '5:15 PM', arriveTime: '6:45 PM', duration: '1H 30M', arrivalNote: '', seatsLeft: 2 },
  { ...oceanjet, id: 'oceanjet-1910', departTime: '7:10 PM', arriveTime: '7:50 PM', duration: '40M', arrivalNote: '' },
]

// Sailings picked on the Schedule tab: added to the booking's departure list (Select departure shows it first, selected)
const fromSchedule = new Map<string, Departure>()
const LINE = { oceanjet, hsmarine: hsMarine, maayo }
const clock = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
/** Register a Schedule sailing as a bookable departure; returns its id */
export function scheduleDeparture(t: { id: string; line: ShippingLine; departure: Date; hours: number }) {
  const mins = Math.round(t.hours * 60)
  const arrive = new Date(t.departure.getTime() + mins * 60e3)
  const id = `schedule-${t.id}`
  fromSchedule.set(id, {
    ...LINE[t.line],
    id,
    departTime: clock(t.departure),
    arriveTime: clock(arrive),
    duration: [mins >= 60 && `${Math.floor(mins / 60)}H`, mins % 60 && `${mins % 60}M`].filter(Boolean).join(' '),
    arrivalNote: '',
    nextDayArrival: arrive.getDate() !== t.departure.getDate(),
  })
  return id
}
/** per-person fare of a shipping line (Schedule rows show it) */
export const fareOf = (line: ShippingLine) => LINE[line].price

export const findDeparture = (id: string | null | undefined) => (id ? (fromSchedule.get(id) ?? departures.find((d) => d.id === id)) : undefined)

/** "Arrives Wed, Nov 11" for the booked travel date (all prototype departures arrive the same day). */
export function arrivalNoteFor(d: Departure, bookingDate: string) {
  const day = parseBookingDate(bookingDate)
  day.setDate(day.getDate() + (d.nextDayArrival ? 1 : 0))
  const weekday = day.toLocaleDateString('en-US', { weekday: 'short' })
  const month = day.toLocaleDateString('en-US', { month: 'short' })
  return `Arrives ${weekday}, ${month} ${day.getDate()}`
}

/** when the sailing leaves on the booked travel date */
export function departsAt(d: Departure, bookingDate: string) {
  const day = parseBookingDate(bookingDate)
  const m = d.departTime.match(/(\d+):(\d+) (AM|PM)/)
  if (m) day.setHours((Number(m[1]) % 12) + (m[3] === 'PM' ? 12 : 0), Number(m[2]))
  return day
}

/** Why a sailing can't be booked (Select departure): already left, fully booked, or fewer seats than passengers */
export type Unavailable = 'departed' | 'full' | 'seats' | null
export function unavailableReason(d: Departure, bookingDate: string, passengers: number, now = Date.now()): Unavailable {
  if (departsAt(d, bookingDate).getTime() <= now) return 'departed'
  if (d.seatsLeft === 0) return 'full'
  if (d.seatsLeft !== undefined && d.seatsLeft < passengers) return 'seats'
  return null
}
