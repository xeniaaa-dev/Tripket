import { useState } from 'react'
import calendar from '../../assets/figma/booking/calendar-04.svg'
import { useBooking } from '../../booking/BookingContext'
import { addDays, formatBookingDate, parseBookingDate, startOfToday } from '../../booking/date'
import DateSheet from './DateSheet'

const Chevron = ({ rotate = 0 }: { rotate?: number }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: `rotate(${rotate}deg)` }}>
    <path d="M6 3.5 10.5 8 6 12.5" stroke="#8e8e93" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Live app: fluid date row — long date pill (fills the width) + 40px prev/next buttons, 8px gaps.
// Behaviour from the live app: the date opens the "Select Travel Date" sheet; ‹ › move one day (‹ disabled on today).
export default function DateSelector() {
  const { booking, update } = useBooking()
  const [open, setOpen] = useState(false)
  const date = parseBookingDate(booking.date)
  const today = startOfToday()
  const setDate = (d: Date) => update({ date: formatBookingDate(d), departureId: null })

  return (
    <div className="flex h-[40px] gap-[8px]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-full min-w-0 flex-1 items-center gap-[8px] rounded-12 border border-[#f0f0f0] bg-white px-[16px]"
      >
        <img alt="" src={calendar} className="size-[18px]" />
        <span className="flex-1 text-left text-[16px] leading-[24px] text-[#404040]">{booking.date}</span>
        <Chevron rotate={90} />
      </button>
      <button
        type="button"
        aria-label="Previous date"
        disabled={date <= today}
        onClick={() => setDate(addDays(date, -1))}
        className="flex size-[40px] shrink-0 items-center justify-center rounded-12 border border-[#f0f0f0] bg-white disabled:opacity-50"
      >
        <Chevron rotate={180} />
      </button>
      <button
        type="button"
        aria-label="Next date"
        onClick={() => setDate(addDays(date, 1))}
        className="flex size-[40px] shrink-0 items-center justify-center rounded-12 border border-[#f0f0f0] bg-white"
      >
        <Chevron />
      </button>
      <DateSheet
        open={open}
        value={date}
        today={today}
        onClose={() => setOpen(false)}
        onSelect={(d) => {
          setDate(d)
          setOpen(false)
        }}
      />
    </div>
  )
}
