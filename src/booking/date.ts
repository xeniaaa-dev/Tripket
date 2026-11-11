// Booking dates are stored as display strings in the live app's format, e.g. "Wed, Nov 11, 2026"
// (Figma's "Wed, April 8 2026" wraps for long months like November). The parser accepts both.
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const formatBookingDate = (d: Date) => `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`

export function parseBookingDate(s: string) {
  const m = s.match(/([A-Za-z]+) (\d{1,2}),? (\d{4})/)
  const month = m ? MONTHS.findIndex((x) => x.startsWith(m[1].slice(0, 3))) : -1
  return m && month >= 0 ? new Date(Number(m[3]), month, Number(m[2])) : startOfToday()
}

export function startOfToday() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime()
export const monthLabel = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
