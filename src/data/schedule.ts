// Schedule tab data — a static snapshot of the live app (book.tripket.ph/schedule, captured Nov 2026 from
// GET api.tripket.ph/api/legs/featured-schedules?date=yesterday|today|tomorrow, /api/legs/ports, /api/operators,
// /api/vessel-types). Days are re-anchored to the current date so Yesterday / Today / Tomorrow always work.
import logoHsStar from '../assets/live/schedule/logo-hs-star.jpg'
import logoMaayo from '../assets/live/schedule/logo-maayo.png'
import logoOceanjet from '../assets/live/schedule/logo-oceanjet.png'

export type VesselType = 'ro_ro' | 'fastcraft'
export type Operator = { id: number; name: string; logo: string; vessel: string; vesselType: VesselType }
export type SchedulePort = { id: number; name: string; city: string; province: string }

export const operators: Operator[] = [
  // names and (placeholder) vessel names match the booking flow's departures (src/data/departures.ts)
  { id: 1, name: 'Maayo Shipping', logo: logoMaayo, vessel: 'MV Maayo 1', vesselType: 'ro_ro' },
  { id: 2, name: 'OceanJet', logo: logoOceanjet, vessel: 'OceanJet 8', vesselType: 'fastcraft' },
  { id: 3, name: 'HS Marine', logo: logoHsStar, vessel: 'MV HS Marine 1', vesselType: 'fastcraft' },
]

/** /api/vessel-types → ["ro_ro","fastcraft"]; labels as the filter sheet maps them, and as the card badge (vessel.type_label) shows them */
export const vesselTypes: VesselType[] = ['ro_ro', 'fastcraft']
export const vesselTypeFilterLabel: Record<VesselType, string> = { ro_ro: 'RoRo', fastcraft: 'Fast craft' }
export const vesselTypeLabel: Record<VesselType, string> = { ro_ro: 'RoRo', fastcraft: 'Fast Craft' }

/** /api/legs/ports?sortColumn=name&enabled=true — already sorted by name */
export const schedulePorts: SchedulePort[] = [
  { id: 8, name: 'Bacolod City (Capital)', city: 'Bacolod City (Capital)', province: 'Negros Occidental' },
  { id: 15, name: 'Bato', city: 'Samboan', province: 'Cebu' },
  { id: 6, name: 'Cebu City (Capital)', city: 'Cebu City (Capital)', province: 'Cebu' },
  { id: 3, name: 'Dumaguete City (Capital)', city: 'Dumaguete City (Capital)', province: 'Negros Oriental' },
  { id: 9, name: 'Iloilo City (Capital)', city: 'Iloilo City (Capital)', province: 'Iloilo' },
  { id: 7, name: 'Jetafe', city: 'Jetafe', province: 'Bohol' },
  { id: 16, name: 'Larena', city: 'Larena', province: 'Siquijor' },
  { id: 17, name: 'Lazi', city: 'Lazi', province: 'Siquijor' },
  { id: 1, name: 'Liloan', city: 'Liloan', province: 'Cebu' },
  { id: 12, name: 'Maasin City (Capital)', city: 'City Of Maasin (Capital)', province: 'Southern Leyte' },
  { id: 10, name: 'Ormoc City', city: 'Ormoc City', province: 'Leyte' },
  { id: 11, name: 'Palompon', city: 'Palompon', province: 'Leyte' },
  { id: 18, name: 'Plaridel', city: 'Plaridel', province: 'Misamis Occidental' },
  { id: 2, name: 'Sibulan', city: 'Sibulan', province: 'Negros Oriental' },
  { id: 4, name: 'Siquijor (Capital)', city: 'Siquijor (Capital)', province: 'Siquijor' },
  { id: 13, name: 'Surigao City (Capital)', city: 'Surigao City (Capital)', province: 'Surigao Del Norte' },
  { id: 5, name: 'Tagbilaran City (Capital)', city: 'Tagbilaran City (Capital)', province: 'Bohol' },
  { id: 14, name: 'Tampi', city: 'San Jose', province: 'Negros Oriental' },
]

export type DayKey = 'yesterday' | 'today' | 'tomorrow'
export const dayKeys: DayKey[] = ['yesterday', 'today', 'tomorrow']

// Live rows, in API order: "operatorId originPortId destinationPortId HH:MM(Asia/Manila) durationHours", "|"-separated.
const raw: Record<DayKey, string> = {
yesterday: `2 5 6 08:20 2|2 8 9 08:50 1|1 2 1 09:00 0.5|1 1 2 09:00 0.5|2 6 5 09:20 2|2 5 6 09:20 2|3 3 4 09:20 0.67|
2 6 10 09:30 3|2 10 6 09:30 3|1 14 15 09:30 0.5|1 15 14 09:30 0.5|2 17 18 09:40 1.5|2 4 3 10:00 0.67|
2 6 7 10:00 1.25|2 6 11 10:00 3|2 12 13 10:30 2|1 14 15 10:30 0.5|1 15 14 10:30 0.5|1 1 2 10:30 0.5|
1 2 1 10:30 0.5|2 5 3 10:40 2|2 6 5 10:40 2|2 5 6 10:40 2|2 3 4 11:00 0.67|2 9 8 11:00 1|1 14 15 11:30 0.5|
1 15 14 11:30 0.5|2 6 5 11:40 2|2 5 6 11:40 2|2 7 6 11:45 1.25|2 4 3 12:00 0.67|1 2 1 12:00 0.5|
1 1 2 12:00 0.5|1 14 15 12:30 0.5|1 15 14 12:30 0.5|2 3 4 13:00 0.67|2 3 5 13:00 2|2 6 5 13:00 2|2 5 6 13:00 2|
2 8 9 13:00 1|2 6 10 13:00 3|2 10 6 13:00 3|2 13 12 13:00 2|2 6 7 13:30 1.25|2 11 6 13:30 3|1 14 15 13:30 0.5|
1 15 14 13:30 0.5|1 1 2 13:30 0.5|1 2 1 13:30 0.5|2 6 5 14:00 2|2 5 6 14:00 2|3 4 3 14:20 0.67|2 4 5 14:30 2|
2 9 8 14:30 1|1 2 1 15:00 0.5|1 1 2 15:00 0.5|2 18 17 15:10 1.5|2 7 6 15:15 1.25|2 5 4 15:20 2|2 6 5 15:20 2|
2 5 6 15:20 2|2 12 6 15:30 3|1 14 15 15:30 0.5|1 15 14 15:30 0.5|2 6 5 16:20 2|2 5 6 16:20 2|2 6 10 16:30 3|
2 10 6 16:30 3|1 14 15 16:30 0.5|1 15 14 16:30 0.5|1 1 2 16:30 0.5|1 2 1 16:30 0.5|2 8 9 16:40 1|2 5 6 17:00 2|
2 6 7 17:00 1.25|2 17 5 17:00 2|3 3 4 17:15 0.67|2 9 8 17:30 1|2 6 5 17:40 2|2 5 6 17:40 2|2 4 3 18:00 0.67|
1 2 1 18:00 0.5|1 1 2 18:00 0.5|1 14 15 18:30 0.5|1 15 14 18:30 0.5|2 6 7 18:45 1.25|2 7 6 18:45 1.25|
2 3 4 19:10 0.67|1 14 15 19:30 0.5|1 15 14 19:30 0.5|1 2 1 19:30 0.5|1 1 2 19:30 0.5|1 2 1 21:00 0.5|
1 1 2 21:00 0.5|1 14 15 21:30 0.5|1 15 14 21:30 0.5|1 2 1 22:30 0.5|1 1 2 22:30 0.5|1 14 15 23:30 0.5|
1 15 14 23:30 0.5|1 14 15 04:00 0.5|1 15 14 04:00 0.5|1 2 1 04:30 0.5|1 1 2 04:30 0.5|1 14 15 05:00 0.5|
1 15 14 05:00 0.5|2 6 5 05:10 2|2 8 9 05:45 1|2 4 3 06:00 0.67|2 6 5 06:00 2|2 5 6 06:00 2|2 6 10 06:00 3|
2 10 6 06:00 3|1 2 1 06:00 0.5|1 1 2 06:00 0.5|2 6 7 06:30 1.25|2 7 6 06:30 1.25|1 14 15 06:30 0.5|
1 15 14 06:30 0.5|2 6 5 07:00 2|2 6 12 07:00 3|2 5 6 07:05 2|2 3 4 07:20 0.67|2 9 8 07:20 1|2 5 17 07:20 2|
2 5 4 07:30 2|1 1 2 07:30 0.5|1 2 1 07:30 0.5|3 4 3 07:35 0.67|1 14 15 08:00 0.5|1 15 14 08:00 0.5|
2 7 6 08:15 1.25|2 4 5 08:20 2|2 6 5 08:20 2`,
today: `1 14 15 04:00 0.5|1 15 14 04:00 0.5|1 2 1 04:30 0.5|1 1 2 04:30 0.5|1 14 15 05:00 0.5|1 15 14 05:00 0.5|
2 6 5 05:10 2|2 8 9 05:45 1|2 4 3 06:00 0.67|2 6 5 06:00 2|2 5 6 06:00 2|2 6 10 06:00 3|2 10 6 06:00 3|
1 2 1 06:00 0.5|1 1 2 06:00 0.5|2 6 7 06:30 1.25|2 7 6 06:30 1.25|1 14 15 06:30 0.5|1 15 14 06:30 0.5|
2 6 5 07:00 2|2 6 12 07:00 3|2 5 6 07:05 2|2 3 4 07:20 0.67|2 9 8 07:20 1|2 5 17 07:20 2|2 5 4 07:30 2|
1 1 2 07:30 0.5|1 2 1 07:30 0.5|3 4 3 07:35 0.67|1 14 15 08:00 0.5|1 15 14 08:00 0.5|2 7 6 08:15 1.25|
2 4 5 08:20 2|2 6 5 08:20 2|2 5 6 08:20 2|2 8 9 08:50 1|1 2 1 09:00 0.5|1 1 2 09:00 0.5|2 6 5 09:20 2|
2 5 6 09:20 2|3 3 4 09:20 0.67|2 6 10 09:30 3|2 10 6 09:30 3|1 14 15 09:30 0.5|1 15 14 09:30 0.5|
2 17 18 09:40 1.5|2 4 3 10:00 0.67|2 6 7 10:00 1.25|2 6 11 10:00 3|2 12 13 10:30 2|1 14 15 10:30 0.5|
1 15 14 10:30 0.5|1 1 2 10:30 0.5|1 2 1 10:30 0.5|2 5 3 10:40 2|2 6 5 10:40 2|2 5 6 10:40 2|2 3 4 11:00 0.67|
2 9 8 11:00 1|1 14 15 11:30 0.5|1 15 14 11:30 0.5|2 6 5 11:40 2|2 5 6 11:40 2|2 7 6 11:45 1.25|
2 4 3 12:00 0.67|1 2 1 12:00 0.5|1 1 2 12:00 0.5|1 14 15 12:30 0.5|1 15 14 12:30 0.5|2 3 4 13:00 0.67|
2 3 5 13:00 2|2 6 5 13:00 2|2 5 6 13:00 2|2 8 9 13:00 1|2 6 10 13:00 3|2 10 6 13:00 3|2 13 12 13:00 2|
2 6 7 13:30 1.25|2 11 6 13:30 3|1 14 15 13:30 0.5|1 15 14 13:30 0.5|1 1 2 13:30 0.5|1 2 1 13:30 0.5|
2 6 5 14:00 2|2 5 6 14:00 2|3 4 3 14:20 0.67|2 4 5 14:30 2|2 9 8 14:30 1|1 2 1 15:00 0.5|1 1 2 15:00 0.5|
2 18 17 15:10 1.5|2 7 6 15:15 1.25|2 5 4 15:20 2|2 6 5 15:20 2|2 5 6 15:20 2|2 12 6 15:30 3|1 14 15 15:30 0.5|
1 15 14 15:30 0.5|2 6 5 16:20 2|2 5 6 16:20 2|2 6 10 16:30 3|2 10 6 16:30 3|1 14 15 16:30 0.5|
1 15 14 16:30 0.5|1 1 2 16:30 0.5|1 2 1 16:30 0.5|2 8 9 16:40 1|2 5 6 17:00 2|2 6 7 17:00 1.25|2 17 5 17:00 2|
3 3 4 17:15 0.67|2 9 8 17:30 1|2 6 5 17:40 2|2 5 6 17:40 2|2 4 3 18:00 0.67|1 2 1 18:00 0.5|1 1 2 18:00 0.5|
1 14 15 18:30 0.5|1 15 14 18:30 0.5|2 6 7 18:45 1.25|2 7 6 18:45 1.25|2 3 4 19:10 0.67|1 14 15 19:30 0.5|
1 15 14 19:30 0.5|1 2 1 19:30 0.5|1 1 2 19:30 0.5|1 2 1 21:00 0.5|1 1 2 21:00 0.5|1 14 15 21:30 0.5|
1 15 14 21:30 0.5|1 2 1 22:30 0.5|1 1 2 22:30 0.5|1 14 15 23:30 0.5|1 15 14 23:30 0.5`,
tomorrow: `1 1 16 02:00 3|1 1 16 02:00 3|1 14 15 04:00 0.5|1 15 14 04:00 0.5|1 2 1 04:30 0.5|1 1 2 04:30 0.5|
1 14 15 05:00 0.5|1 15 14 05:00 0.5|2 6 5 05:10 2|2 8 9 05:45 1|2 4 3 06:00 0.67|2 6 5 06:00 2|2 5 6 06:00 2|
2 6 10 06:00 3|2 10 6 06:00 3|1 2 1 06:00 0.5|1 1 2 06:00 0.5|2 6 7 06:30 1.25|2 7 6 06:30 1.25|
1 14 15 06:30 0.5|1 15 14 06:30 0.5|2 6 5 07:00 2|2 6 12 07:00 3|2 5 6 07:05 2|2 3 4 07:20 0.67|2 9 8 07:20 1|
2 5 17 07:20 2|2 5 4 07:30 2|1 1 2 07:30 0.5|1 2 1 07:30 0.5|3 4 3 07:35 0.67|1 14 15 08:00 0.5|
1 15 14 08:00 0.5|2 7 6 08:15 1.25|2 4 5 08:20 2|2 6 5 08:20 2|2 5 6 08:20 2|2 8 9 08:50 1|1 2 1 09:00 0.5|
1 1 2 09:00 0.5|2 6 5 09:20 2|2 5 6 09:20 2|3 3 4 09:20 0.67|2 6 10 09:30 3|2 10 6 09:30 3|1 14 15 09:30 0.5|
1 15 14 09:30 0.5|2 17 18 09:40 1.5|2 4 3 10:00 0.67|2 6 7 10:00 1.25|2 6 11 10:00 3|2 12 13 10:30 2|
1 14 15 10:30 0.5|1 15 14 10:30 0.5|1 1 2 10:30 0.5|1 2 1 10:30 0.5|2 5 3 10:40 2|2 6 5 10:40 2|2 5 6 10:40 2|
2 3 4 11:00 0.67|2 9 8 11:00 1|1 14 15 11:30 0.5|1 15 14 11:30 0.5|2 6 5 11:40 2|2 5 6 11:40 2|
2 7 6 11:45 1.25|2 4 3 12:00 0.67|1 2 1 12:00 0.5|1 1 2 12:00 0.5|1 14 15 12:30 0.5|1 15 14 12:30 0.5|
2 3 4 13:00 0.67|2 3 5 13:00 2|2 6 5 13:00 2|2 5 6 13:00 2|2 8 9 13:00 1|2 6 10 13:00 3|2 10 6 13:00 3|
2 13 12 13:00 2|1 16 1 13:00 3|2 6 7 13:30 1.25|2 11 6 13:30 3|1 14 15 13:30 0.5|1 15 14 13:30 0.5|
1 1 2 13:30 0.5|1 2 1 13:30 0.5|2 6 5 14:00 2|2 5 6 14:00 2|3 4 3 14:20 0.67|2 4 5 14:30 2|2 9 8 14:30 1|
1 2 1 15:00 0.5|1 1 2 15:00 0.5|2 18 17 15:10 1.5|2 7 6 15:15 1.25|2 5 4 15:20 2|2 6 5 15:20 2|2 5 6 15:20 2|
2 12 6 15:30 3|1 14 15 15:30 0.5|1 15 14 15:30 0.5|2 6 5 16:20 2|2 5 6 16:20 2|2 6 10 16:30 3|2 10 6 16:30 3|
1 14 15 16:30 0.5|1 15 14 16:30 0.5|1 1 2 16:30 0.5|1 2 1 16:30 0.5|2 8 9 16:40 1|2 5 6 17:00 2|
2 6 7 17:00 1.25|2 17 5 17:00 2|3 3 4 17:15 0.67|2 9 8 17:30 1|2 6 5 17:40 2|2 5 6 17:40 2|2 4 3 18:00 0.67|
1 2 1 18:00 0.5|1 1 2 18:00 0.5|1 14 15 18:30 0.5|1 15 14 18:30 0.5|2 6 7 18:45 1.25|2 7 6 18:45 1.25|
2 3 4 19:10 0.67|1 14 15 19:30 0.5|1 15 14 19:30 0.5|1 2 1 19:30 0.5|1 1 2 19:30 0.5|1 2 1 21:00 0.5|
1 1 2 21:00 0.5|1 14 15 21:30 0.5|1 15 14 21:30 0.5|1 2 1 22:30 0.5|1 1 2 22:30 0.5|1 14 15 23:30 0.5|
1 15 14 23:30 0.5`,
}

/**
 * Not on live: every live leg was "Scheduled" with no actual departure (ACTUAL DEPARTURE / ESTIMATED ARRIVAL = TBA).
 * The card also has delayed (actual departure later than scheduled) and cancelled states — a few are seeded here,
 * on the first page of Today, so those designs can be seen. Key = row index in the day. Delete to match live exactly.
 */
const overrides: Partial<Record<DayKey, Record<number, { actual?: string; cancelledReason?: string }>>> = {
  yesterday: {
    1: { actual: '09:05' },
    4: { cancelledReason: 'Trip cancelled due to adverse weather conditions.' },
  },
  today: {
    2: { cancelledReason: 'Trip cancelled due to adverse weather conditions.' },
    5: { actual: '05:25' },
  },
}

export type Departure = {
  id: string
  operator: Operator
  origin: SchedulePort
  destination: SchedulePort
  /** scheduled departure */
  departure: Date
  actualDeparture: Date | null
  /** hours */
  duration: number
  cancelled: boolean
  cancelledAt: Date | null
  cancellationReason: string | null
}

const portById = new Map(schedulePorts.map((p) => [p.id, p]))
const opById = new Map(operators.map((o) => [o.id, o]))

function atTime(day: Date, hm: string) {
  const [h, m] = hm.split(':').map(Number)
  const d = new Date(day)
  d.setHours(h, m, 0, 0)
  return d
}

/** All departures of a day (offset −1/0/+1 from the current date) */
export function departuresFor(key: DayKey, now = new Date()): Departure[] {
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayKeys.indexOf(key) - 1)
  return raw[key]
    .replace(/\s*\n\s*/g, '')
    .split('|')
    .map((row, i) => {
      const [op, from, to, hm, dur] = row.split(' ')
      const o = overrides[key]?.[i]
      const departure = atTime(day, hm)
      return {
        id: `${key}-${i}`,
        operator: opById.get(Number(op))!,
        origin: portById.get(Number(from))!,
        destination: portById.get(Number(to))!,
        departure,
        actualDeparture: o?.actual ? atTime(day, o.actual) : null,
        duration: Number(dur),
        cancelled: Boolean(o?.cancelledReason),
        cancelledAt: o?.cancelledReason ? new Date(now.getTime() - 40 * 60e3) : null,
        cancellationReason: o?.cancelledReason ?? null,
      }
    })
}

export type ScheduleFilter = {
  origin: SchedulePort | null
  vesselType: VesselType | null
  operatorId: number | null
}
export const emptyFilter: ScheduleFilter = { origin: null, vesselType: null, operatorId: null }

/** What the API filters on: origin_port_id, vessel_type, operator_id */
export function filterDepartures(list: Departure[], f: ScheduleFilter) {
  return list.filter(
    (d) =>
      (!f.origin || d.origin.id === f.origin.id) &&
      (!f.vesselType || d.operator.vesselType === f.vesselType) &&
      (!f.operatorId || d.operator.id === f.operatorId),
  )
}

/** Page size the live app requests (pageLimit=10, "Show more departure" loads the next page) */
export const PAGE_SIZE = 10
/** Simulated API latency (live: ~420ms from mount until the first page renders) */
export const LOAD_MS = 450

// ---- live formatting helpers (copied from the live bundle) ----

/** live getPortName: drop "(…)" and keep at most 3 words — "Cebu City (Capital)" → "Cebu City", "Liloan" → "Liloan" */
export const portName = (name: string) => name.replace(/\s*\(.*?\)\s*/g, '').trim().split(/\s+/).slice(0, 3).join(' ')
/** live getPortInital: first 3 letters, upper-cased — "Liloan" → "LIL", "Larena" → "LAR" */
export const portInitial = (name: string) => name.slice(0, 3).toUpperCase()
/** live formatHours: 3 → "3h 0m", 1.5 → "1h 30m" (the card shows it upper-cased: "3H 0M") */
export function formatHours(h: number) {
  const total = Math.round(60 * h)
  return `${Math.floor(total / 60)}h ${total % 60}m`
}
/** "4:00 AM" */
export const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
/** formatTimeAgo(ts, "Updated ") */
export function formatTimeAgo(ts: number, prefix = 'Updated ') {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (!(s >= 60)) return `${prefix}just now`
  const m = Math.floor(s / 60)
  if (m < 60) return `${prefix}${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${prefix}${h}h ago`
  return `${prefix}${Math.floor(h / 24)}d ago`
}

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export type DayOption = { key: DayKey; label: string; /** "Nov 10" */ sub: string; /** "Tue, 10 Nov" */ sub2: string }
export function dayOptions(now = new Date()): DayOption[] {
  const labels = ['Yesterday', 'Today', 'Tomorrow']
  return dayKeys.map((key, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i - 1)
    return { key, label: labels[i], sub: `${MO[d.getMonth()]} ${d.getDate()}`, sub2: `${WD[d.getDay()]}, ${d.getDate()} ${MO[d.getMonth()]}` }
  })
}
