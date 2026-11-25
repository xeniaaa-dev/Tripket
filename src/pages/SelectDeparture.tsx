import { useNavigate } from 'react-router'
import BookingHeader from '../components/booking/BookingHeader'
import DateSelector from '../components/booking/DateSelector'
import RouteBanner from '../components/booking/RouteBanner'
import StepFooter from '../components/booking/StepFooter'
import DepartureButton from '../components/step-departure/DepartureButton'
import PaxSummaryChip from '../components/step-departure/PaxSummaryChip'
import { useBooking } from '../booking/BookingContext'
import { nextPath } from '../booking/flows'
import { arrivalNoteFor, departures, findDeparture } from '../data/departures'
import { estimateTotal, pesoTotal, reviewData } from '../data/step-review'
import { VOUCHER } from '../data/policy'
import infoNote from '../assets/figma/confirmation/info-note.svg'

// Figma: "Book - Select Departure" — nothing selected (11598:39412), departure selected (11598:40090)
export default function SelectDeparture() {
  const navigate = useNavigate()
  const { booking, update } = useBooking()
  // Live: with a vehicle on the booking only vehicle-capable (RoRo) sailings are offered; Fast Craft can't carry one.
  // Rebook keeps the original shipping line: only its sailings are offered.
  // a sailing picked on the Schedule tab is listed first
  const picked0 = findDeparture(booking.scheduleTrip)
  const all = picked0 ? [picked0, ...departures] : departures
  const byLine = booking.lineLock ? all.filter((d) => d.line === booking.lineLock) : all
  const list = booking.vehicleCount > 0 ? byLine.filter((d) => d.vesselType === 'RoRo') : byLine
  // passenger types and vehicle type are only known once Passenger details has been filled (or carried over by a rebook / return trip)
  const booked = booking.passengers.length > 0
  const picked = list.some((d) => d.id === booking.departureId) ? booking.departureId : null
  const pickedDeparture = list.find((d) => d.id === picked)
  // all-in estimate for the picked sailing: exact once passengers are filled (rebook / return trip)
  const estimate = pickedDeparture && (booked ? reviewData(booking).total : estimateTotal(pickedDeparture, booking).total)
  const who = `${booking.passengerCount} passenger${booking.passengerCount === 1 ? '' : 's'}${booking.vehicleCount > 0 ? ' · 1 vehicle' : ''}`
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <BookingHeader title="Select departure" screen="departure" />
      <RouteBanner>
        <DateSelector />
      </RouteBanner>

      <div className="px-[16px] pt-[16px]">
        <div className="flex flex-wrap items-center gap-[8px]">
          <PaxSummaryChip passengers={booking.passengerCount} vehicles={booking.vehicleCount} />
          {booking.vehicleCount > 0 && (
            // Figma "RoRo filter explanation" (12328:7664): why Fast Craft sailings are hidden
            <span className="rounded-full bg-[#f4f4f5] px-[12px] py-[6px] text-[12px] leading-[16px] text-[#5e5d5f]">RoRo only · vehicle in booking</span>
          )}
          {booking.voucher === VOUCHER.code && (
            <span className="rounded-full bg-[#f0fdf4] px-[12px] py-[6px] text-[12px] leading-[16px] font-semibold text-[#16a34a]">
              {VOUCHER.code} · {VOUCHER.title} applied
            </span>
          )}
        </div>
        <h2 className="mt-[9px] text-[14px] leading-[20px] font-semibold tracking-[0.3px] text-[#8e8e93] uppercase">Departures</h2>
        <div className="mt-[12px] mb-[16px] flex flex-col overflow-clip rounded-16 border border-[#e5e5e5] bg-white">
          {list.length === 0 && (
            <div className="px-[24px] py-[40px] text-center">
              <p className="text-[16px] leading-[24px] font-semibold text-[#1c1917]">No trips available</p>
              <p className="mt-[4px] text-[13px] leading-[19px] text-[#8e8e93]">There are no available sailings for this route. Try a different date or change your route.</p>
            </div>
          )}
          {list.map((d, i) => (
            <DepartureButton
              key={d.id}
              departure={{ ...d, arrivalNote: arrivalNoteFor(d, booking.date) }}
              selected={picked === d.id}
              first={i === 0}
              last={i === list.length - 1}
              // tapping the selected departure again unselects it (estimated total hides, Next disables)
              onSelect={() => update({ departureId: picked === d.id ? null : d.id })}
            />
          ))}
        </div>
        {list.length > 0 && (
          // what the estimate covers, in the app's info-note tile (same as the terminal-fee note on Review & pay)
          <div className="mb-[16px] flex items-start gap-[10px] rounded-16 bg-[#f8f8fa] px-[16px] py-[12px]">
            <img alt="" src={infoNote} className="mt-px size-[15px]" />
            <p className="flex-1 text-[11px] leading-[15.95px] text-[#5e5d5f]">
              Estimated total for {booking.passengerCount} passenger{booking.passengerCount === 1 ? '' : 's'}
              {booking.vehicleCount > 0 ? ' and 1 vehicle' : ''}, service fee included.{' '}
              {booked ? '' : 'Senior/PWD discounts and vehicle type are applied in the next steps. '}Port fees are paid at the port.
            </p>
          </div>
        )}
      </div>

      <div className="flex-1" />
      {/* Rebook / Return trip skip Passenger details (carried over) and go straight to Review & pay */}
      <StepFooter
        fade
        note={
          !picked ? (
            <p className="mb-[8px] text-center text-[14px] leading-[20px] text-[#f97316]">Select a vessel and departure time to continue</p>
          ) : estimate !== undefined ? (
            // pops up smoothly above the Next button when a departure is picked; switching departures just updates the price
            <div
              aria-live="polite"
              className="animate-pop-up mb-[12px] flex items-center justify-between gap-[12px] rounded-16 border border-[#fed7aa] bg-[#fff7ed] px-[16px] py-[10px] shadow-[0_6px_16px_rgba(249,115,22,0.10)]"
            >
              <div className="flex min-w-0 flex-col">
                <span className="text-[13px] leading-[18px] font-semibold text-[#1c1917]">Estimated total</span>
                <span className="truncate text-[11.5px] leading-[16px] text-[#8e8e93]">
                  {who} · service fee included
                </span>
              </div>
              <span className="flex shrink-0 items-start text-[22px] leading-[28px] font-extrabold text-[#f97316]">
                {pesoTotal(estimate)}
              </span>
            </div>
          ) : null
        }
        disabled={!picked}
        onClick={() => navigate(nextPath(booking.flow, 'departure') ?? '/book/review', { replace: true })}
      >
        {nextPath(booking.flow, 'departure') === '/book/details' ? 'Next: Passenger details' : 'Next: Review & Pay'}
      </StepFooter>
    </div>
  )
}
