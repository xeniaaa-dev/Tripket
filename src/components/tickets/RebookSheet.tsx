import { addDays, startOfToday } from '../../booking/date'
import type { BookingState } from '../../booking/BookingContext'
import { findDeparture } from '../../data/departures'
import DateSheet from '../booking/DateSheet'

const day = (d: Date) => `${d.toLocaleDateString('en-US', { weekday: 'short' })}, ${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}`

// Figma "Rebook Trip" date sheet (12328:4761): the original route + operator + vessel type, then a calendar.
// Pick a new date → "Continue — Sun, Jul 26". The route, shipping line, passengers and vehicles stay as booked.
export default function RebookSheet({ booking, onClose, onContinue }: { booking: BookingState | null; onClose: () => void; onContinue: (d: Date) => void }) {
  const dep = booking ? findDeparture(booking.departureId) : undefined
  const today = startOfToday()
  return (
    <DateSheet
      open={!!booking}
      value={today}
      today={today}
      title="Rebook Trip"
      onClose={onClose}
      onSelect={onContinue}
      confirm={{ idle: 'Select a date', label: (d) => `Continue — ${day(d)}`, minDate: addDays(today, 0) }}
      summary={
        booking && (
          <div className="flex items-center gap-[12px]">
            {dep && <img alt="" src={dep.logo} className="size-[40px] shrink-0 rounded-12 border border-[#f0f0f0] bg-white object-contain p-[2px]" />}
            <div className="min-w-0">
              <p className="truncate text-[15px] leading-[22px] font-bold text-[#171717]">
                {booking.from.city} → {booking.to.city}
              </p>
              {dep && (
                <p className="text-[12px] leading-[16px] text-[#8e8e93]">
                  {dep.operator} · {dep.vesselType}
                </p>
              )}
            </div>
          </div>
        )
      }
    />
  )
}
