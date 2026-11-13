import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking } from '../booking/BookingContext'
import BookingHeader from '../components/booking/BookingHeader'
import DateSelector from '../components/booking/DateSelector'
import RouteBanner from '../components/booking/RouteBanner'
import StepFooter from '../components/booking/StepFooter'
import { UserMultiple } from '../components/step-passengers/icons'
import PassengerCounter from '../components/step-passengers/PassengerCounter'
import VehiclesCard from '../components/step-passengers/VehiclesCard'
import VehicleTypeSheet from '../components/step-passengers/VehicleTypeSheet'
import { DEFAULT_VEHICLE_TYPE, type VehicleType } from '../data/step-passengers'

// Figma: "Book - Default" (node 11598:43506) and "Book - Add Passengers - With Passengers and Vehicles" (node 11598:40358)
export default function PassengersVehicle() {
  const navigate = useNavigate()
  const { booking, update } = useBooking()
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(booking.vehicleCount > 0 ? DEFAULT_VEHICLE_TYPE : null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const setVehicle = (type: VehicleType | null) => {
    setVehicleType(type)
    update({ vehicleCount: type ? 1 : 0 })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <BookingHeader title="Passengers & vehicle" screen="book" />
      <RouteBanner>
        <DateSelector />
      </RouteBanner>
      {/* live: label row (icon inset 10px), then the two cards */}
      <section className="px-[16px] pt-[16px]">
        <div className="flex h-[20px] items-center gap-[8px] px-[10px]">
          <UserMultiple />
          <h2 className="text-[14px] leading-[20px] font-medium text-[#8e8e93]">Passengers &amp; vehicle</h2>
        </div>
        <div className="mt-[28px] flex flex-col gap-[17px]">
          <PassengerCounter count={booking.passengerCount} onChange={(passengerCount) => update({ passengerCount })} />
          <VehiclesCard
            vehicleType={vehicleType}
            onAdd={() => setSheetOpen(true)}
            onRemove={() => setVehicle(null)}
          />
        </div>
      </section>
      <div className="flex-1" />
      <StepFooter onClick={() => navigate('/book/departure', { replace: true })}>Next: Select departure</StepFooter>
      <VehicleTypeSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={(type) => {
          setVehicle(type)
          setSheetOpen(false)
        }}
      />
    </div>
  )
}
