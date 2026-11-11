import { useState } from 'react'
import chevronLeft from '../../assets/live/booking/chevron-left.svg'
import chevronRight from '../../assets/live/booking/chevron-right.svg'
import close from '../../assets/live/booking/close.svg'
import { addDays, monthLabel, sameDay } from '../../booking/date'
import Drawer from '../Drawer'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Weeks of the month starting on Sunday, padded with the neighbouring months' days (live shows them faded). */
function weeksOf(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = addDays(first, -first.getDay())
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const days: Date[] = []
  for (let d = start; d <= last || d.getDay() !== 0; d = addDays(d, 1)) days.push(d)
  return Array.from({ length: days.length / 7 }, (_, i) => days.slice(i * 7, i * 7 + 7))
}

// "Select Travel Date" sheet — from the live app (book.tripket.ph → Passengers & vehicle → tap the date), not Figma.
// Past days are struck through and disabled, other-month days faded; picking a day closes the sheet.
export default function DateSheet({
  open,
  value,
  today,
  onSelect,
  onClose,
}: {
  open: boolean
  value: Date
  today: Date
  onSelect: (d: Date) => void
  onClose: () => void
}) {
  const [month, setMonth] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1))
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setMonth(new Date(value.getFullYear(), value.getMonth(), 1)) // reopen on the selected date's month
  }
  const atCurrentMonth = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth()
  const shift = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1))

  return (
    <Drawer open={open} onClose={onClose} label="Select Travel Date">
      <div className="flex justify-center pb-[8px]">
        <span className="h-[4px] w-[36px] rounded-[2px] bg-[#e4e4e7]" />
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-[16px] right-[16px] flex size-[40px] items-center justify-center rounded-full bg-[#f5f5f5]"
      >
        <img alt="" src={close} className="size-[16px]" />
      </button>
      <div className="border-b border-[#f1f5f9] pb-[16px]">
        <h2 className="text-[20px] leading-[28px] font-bold text-[#1e293b]">Select Travel Date</h2>
      </div>

      <div className="mt-[8px] -mx-[3px]">
        <header className="flex items-center justify-between border-b border-[#f5f5f5] px-[2px] pb-[16px]">
          <button
            type="button"
            aria-label="Previous"
            disabled={atCurrentMonth}
            onClick={() => shift(-1)}
            className="flex size-[40px] items-center justify-center rounded-full bg-[#f5f5f5] disabled:opacity-50"
          >
            <img alt="" src={chevronLeft} className="size-[16px]" />
          </button>
          <span className="text-[18px] leading-[28px] font-medium text-[#404040]">{monthLabel(month)}</span>
          <button type="button" aria-label="Next" onClick={() => shift(1)} className="flex size-[40px] items-center justify-center rounded-full bg-[#f5f5f5]">
            <img alt="" src={chevronRight} className="size-[16px]" />
          </button>
        </header>

        <table className="w-full table-fixed pt-[16px] text-[#71717a]" role="grid" aria-label={`Travel date, ${monthLabel(month)}`}>
          <thead>
            <tr>
              {WEEKDAYS.map((d) => (
                <th key={d} className="pt-[16px] pb-[8px] text-[12px] leading-[16px] font-medium">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeksOf(month).map((week, i) => (
              <tr key={i}>
                {week.map((d) => {
                  const outside = d.getMonth() !== month.getMonth()
                  const past = d < today
                  const selected = !outside && sameDay(d, value)
                  const disabled = outside || past
                  return (
                    <td key={d.getTime()} className="p-0">
                      <button
                        type="button"
                        disabled={disabled}
                        aria-pressed={selected}
                        onClick={() => onSelect(d)}
                        className={`mx-auto flex size-[50px] items-center justify-center rounded-full text-[14px] leading-[20px] font-medium transition-transform duration-250 ease-[cubic-bezier(0,0,0.2,1)] active:scale-95 ${
                          selected ? 'bg-[#ff6b00] text-white' : ''
                        } ${disabled ? 'opacity-50' : ''} ${past && !outside ? 'line-through' : ''}`}
                      >
                        {d.getDate()}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Drawer>
  )
}
