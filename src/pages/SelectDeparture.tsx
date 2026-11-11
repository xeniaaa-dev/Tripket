import { useNavigate } from 'react-router'
import BookingHeader from '../components/booking/BookingHeader'
import DateSelector from '../components/booking/DateSelector'
import RouteBanner from '../components/booking/RouteBanner'
import StepFooter from '../components/booking/StepFooter'
import DepartureButton from '../components/step-departure/DepartureButton'
import PaxSummaryChip from '../components/step-departure/PaxSummaryChip'
import { useBooking } from '../booking/BookingContext'
import { arrivalNoteFor, departures } from '../data/departures'

// Figma: "Book - Select Departure" — nothing selected (11598:39412), departure selected (11598:40090)
export default function SelectDeparture() {
  const navigate = useNavigate()
  const { booking, update } = useBooking()
  // Live: with a vehicle on the booking only vehicle-capable (RoRo) sailings are offered; Fast Craft can't carry one.
  const list = booking.vehicleCount > 0 ? departures.filter((d) => d.vesselType === 'RoRo') : departures
  const picked = list.some((d) => d.id === booking.departureId) ? booking.departureId : null
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <BookingHeader title="Select departure" step={2} />
      <RouteBanner>
        <DateSelector />
      </RouteBanner>

      <div className="px-[16px] pt-[16px]">
        <div className="flex"><PaxSummaryChip passengers={booking.passengerCount} vehicles={booking.vehicleCount} /></div>
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
              last={i === list.length - 1}
              onSelect={() => update({ departureId: d.id })}
            />
          ))}
        </div>
      </div>

      <div className="flex-1" />
      <StepFooter
        fade
        note={!picked && <p className="mb-[8px] text-center text-[14px] leading-[20px] text-[#f97316]">Select a vessel and departure time to continue</p>}
        disabled={!picked} onClick={() => navigate('/book/details', { replace: true })}>
        Next: Passenger details
      </StepFooter>
    </div>
  )
}
