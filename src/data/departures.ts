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
}

// Figma: "SingleCompanyDepartureList" (node 11598:39455), "Book - Select Departure" frames 11598:39412 / 11598:40090.
// Times/prices follow the live app's list (OceanJet and HS Star Marine ₱420 / ₱388); Maayo and the vessel names are placeholders.
const oceanjet = { line: 'oceanjet', operator: 'OceanJet', vessel: 'OceanJet 8', logo: oceanjetLogo, logoFit: 'inset', vesselType: 'Fast Craft', price: 420 } as const
const hsMarine = { line: 'hsmarine', operator: 'HS Marine', vessel: 'MV HS Marine 1', logo: hsMarineLogo, logoFit: 'cover', vesselType: 'RoRo', price: 388 } as const
const maayo = { line: 'maayo', operator: 'Maayo Shipping', vessel: 'MV Maayo 1', logo: maayoLogo, logoFit: 'plain', vesselType: 'RoRo', price: 350 } as const

export const departures: Departure[] = [
  { ...maayo, id: 'maayo-0400', departTime: '4:00 AM', arriveTime: '5:30 AM', duration: '1H 30M', arrivalNote: '' },
  { ...hsMarine, id: 'hsmarine-0920', departTime: '9:20 AM', arriveTime: '10:50 AM', duration: '1H 30M', arrivalNote: '' },
  { ...oceanjet, id: 'oceanjet-1100', departTime: '11:00 AM', arriveTime: '11:40 AM', duration: '40M', arrivalNote: '' },
  { ...oceanjet, id: 'oceanjet-1300', departTime: '1:00 PM', arriveTime: '1:40 PM', duration: '40M', arrivalNote: '' },
  { ...maayo, id: 'maayo-1400', departTime: '2:00 PM', arriveTime: '3:30 PM', duration: '1H 30M', arrivalNote: '' },
  { ...hsMarine, id: 'hsmarine-1715', departTime: '5:15 PM', arriveTime: '6:45 PM', duration: '1H 30M', arrivalNote: '' },
  { ...oceanjet, id: 'oceanjet-1910', departTime: '7:10 PM', arriveTime: '7:50 PM', duration: '40M', arrivalNote: '' },
]

export const findDeparture = (id: string | null) => departures.find((d) => d.id === id)

/** "Arrives Wed, Nov 11" for the booked travel date (all prototype departures arrive the same day). */
export function arrivalNoteFor(d: Departure, bookingDate: string) {
  const day = parseBookingDate(bookingDate)
  day.setDate(day.getDate() + (d.nextDayArrival ? 1 : 0))
  const weekday = day.toLocaleDateString('en-US', { weekday: 'short' })
  const month = day.toLocaleDateString('en-US', { month: 'short' })
  return `Arrives ${weekday}, ${month} ${day.getDate()}`
}
