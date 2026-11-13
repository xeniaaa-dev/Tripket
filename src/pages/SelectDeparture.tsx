import { useNavigate } from 'react-router'
import BookingHeader from '../components/booking/BookingHeader'
import DateSelector from '../components/booking/DateSelector'
import RouteBanner from '../components/booking/RouteBanner'
import StepFooter from '../components/booking/StepFooter'
import DepartureButton from '../components/step-departure/DepartureButton'
import PaxSummaryChip from '../components/step-departure/PaxSummaryChip'
import { useBooking } from '../booking/BookingContext'
import { nextPath } from '../booking/flows'
import { arrivalNoteFor, departures } from '../data/departures'
import { pesoTotal, reviewData } from '../data/step-review'

// Figma: "Book - Select Departure" — nothing selected (11598:39412), departure selected (11598:40090)
export default function SelectDeparture() {
  const navigate = useNavigate()
  const { booking, update } = useBooking()
  // Live: with a vehicle on the booking only vehicle-capable (RoRo) sailings are offered; Fast Craft can't carry one.
  // Rebook keeps the original shipping line: only its sailings are offered.
  const byLine = booking.lineLock ? departures.filter((d) => d.line === booking.lineLock) : departures
  const list = booking.vehicleCount > 0 ? byLine.filter((d) => d.vesselType === 'RoRo') : byLine
  const picked = list.some((d) => d.id === booking.departureId) ? booking.departureId : null
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
              onSelect={() => update({ departureId: d.id })}
            />
          ))}
        </div>
      </div>

      <div className="flex-1" />
      {/* Rebook / Return trip skip Passenger details (carried over) and go straight to Review & pay */}
      <StepFooter
        fade
        note={
          !picked ? (
            <p className="mb-[8px] text-center text-[14px] leading-[20px] text-[#f97316]">Select a vessel and departure time to continue</p>
          ) : booking.flow === 'rebook' || booking.flow === 'return' ? (
            <div className="mb-[8px] flex items-end justify-between px-[4px]">
              <div className="flex flex-col">
                <span className="text-[12px] leading-[16px] text-[#8e8e93]">Estimated total</span>
                <span className="text-[11px] leading-[16px] text-[#a1a1a1]">{booking.passengerCount} passenger{booking.passengerCount === 1 ? '' : 's'}</span>
              </div>
              <span className="text-[18px] leading-[24px] font-bold text-[#f97316]">~{pesoTotal(reviewData(booking).total)}</span>
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
