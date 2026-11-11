import { startOfToday } from '../booking/date'
// Popular Routes as shown on the live guest Home (book.tripket.ph): its photos, text and prices.
import bohol from '../assets/live/home/bohol.jpg'
import cebu from '../assets/live/home/cebu.jpg'
import siquijor from '../assets/live/home/siquijor.jpg'
import type { PopularRoute } from '../components/PopularRouteCard'

// Home form state; empty like the live app ("Select Origin" / "Select Destination", date = today). Rebooking from Tickets presets it.
export const search = { from: '', to: '', date: startOfToday() }

/** "Today" is the real current date, as on the live app (past days are disabled in the calendars). */
export const today = startOfToday()

// fromCode/toCode map live's ports onto the ports of this prototype
export const popularRoutes: PopularRoute[] = [
  { from: 'DUM', to: 'SIQ', fromCode: 'DGT', toCode: 'LRN', name: 'Siquijor', landmark: 'Paliton Beach, Cambugahay Falls', price: 'from ₱120.00', duration: '~1h 15m', image: siquijor },
  { from: 'SIB', to: 'LIL', fromCode: 'SBL', toCode: 'LLN', name: 'Cebu', landmark: 'Mactan, Cebu', price: 'from ₱175.00', duration: '~40m', image: cebu },
  { from: 'DUM', to: 'TAG', fromCode: 'DGT', toCode: 'TAG', name: 'Bohol', landmark: 'Chocolate Hills', price: 'from ₱990.00', duration: '~2h 30m', image: bohol },
]
