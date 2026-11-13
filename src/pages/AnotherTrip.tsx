import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking } from '../booking/BookingContext'
import { formatBookingDate, parseBookingDate, startOfToday } from '../booking/date'
import BookingHeader from '../components/booking/BookingHeader'
import DateSheet from '../components/booking/DateSheet'
import StepFooter from '../components/booking/StepFooter'
import CarriedNote, { carriedText } from '../components/flows/CarriedNote'
import LeaveSheet from '../components/flows/LeaveSheet'
import PortPicker from '../components/home/PortPicker'
import SelectField from '../components/SelectField'
import SwapButton from '../components/SwapButton'
import { portByCity, ports } from '../data/ports'

type Sheet = 'origin' | 'destination' | 'date' | 'leave' | null

// Figma "Flow – Book Another Trip" 01–05 (12328:7134…7381): From = the previous destination, To blank, date = the previous
// arrival date, passengers & vehicles carried over (adjusted later on Passenger details).
export default function AnotherTrip() {
  const navigate = useNavigate()
  const { booking, update, reset } = useBooking()
  const [sheet, setSheet] = useState<Sheet>(null)
  const close = () => setSheet(null)
  const hasTo = !!booking.to.city
  const date = parseBookingDate(booking.date)
  const leave = () => {
    reset()
    navigate('/', { replace: true })
  }
  const fromPort = booking.from.city ? portByCity(booking.from.city) : undefined
  const toPort = hasTo ? portByCity(booking.to.city) : undefined
  const pick = (p: { code: string; city: string }) => ({ code: p.code, city: p.city })

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <BookingHeader title="Book another trip" screen="another" onBack={() => setSheet('leave')} />

      <div className="flex flex-1 flex-col gap-[12px] px-[16px] pt-[16px]">
        <div className="relative flex flex-col gap-[12px]">
          <SelectField label="From" value={booking.from.city} placeholder="Select Origin" onClick={() => setSheet('origin')} />
          <SwapButton
            className="absolute top-[54.5px] left-1/2 z-20 -translate-x-1/2"
            disabled={!hasTo}
            onClick={() => update({ from: booking.to, to: booking.from, departureId: null })}
          />
          <SelectField label="To" value={booking.to.city} placeholder="Select destination" onClick={() => setSheet('destination')} />
        </div>
        <SelectField label="Travel date" value={booking.date} chevron={false} onClick={() => setSheet('date')} />
        <CarriedNote>{carriedText(booking.passengerCount, booking.vehicleCount)} — you can adjust these at the passenger details step.</CarriedNote>
      </div>

      <StepFooter disabled={!hasTo || !booking.from.city} onClick={() => navigate('/book/departure', { replace: true })}>
        Next: Select Departure
      </StepFooter>

      <PortPicker
        open={sheet === 'origin'}
        title="Select Origin"
        ports={ports.filter((p) => p.code !== booking.to.code)}
        selected={fromPort?.code}
        onClose={close}
        onSelect={(p) => {
          update({ from: pick(p), departureId: null })
          close()
        }}
      />
      <PortPicker
        open={sheet === 'destination'}
        title="Select destination"
        ports={ports.filter((p) => p.code !== booking.from.code)}
        selected={toPort?.code}
        onClose={close}
        onSelect={(p) => {
          update({ to: pick(p), departureId: null })
          close()
        }}
      />
      <DateSheet
        open={sheet === 'date'}
        value={date}
        today={startOfToday()}
        onClose={close}
        onSelect={(d) => {
          update({ date: formatBookingDate(d), departureId: null })
          close()
        }}
      />
      <LeaveSheet open={sheet === 'leave'} onKeep={close} onLeave={leave} />
    </div>
  )
}

