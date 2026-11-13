import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking, type PassengerDetail, type VehicleDetail } from '../booking/BookingContext'
import { formatBookingDate, parseBookingDate, startOfToday } from '../booking/date'
import { repriced, withVehicleFare } from '../booking/flows'
import BookingHeader from '../components/booking/BookingHeader'
import DateSheet from '../components/booking/DateSheet'
import RouteBanner from '../components/booking/RouteBanner'
import StepFooter from '../components/booking/StepFooter'
import { SheetPresence } from '../components/Drawer'
import CarriedNote from '../components/flows/CarriedNote'
import CarriedPassengerSheet from '../components/flows/CarriedPassengerSheet'
import { ActionSheet } from '../components/passengers/Sheets'
import SelectField from '../components/SelectField'
import BookingPassengerSheet from '../components/step-details/BookingPassengerSheet'
import { VehicleFormSheet } from '../components/step-details/Forms'
import { VehicleRowIcon } from '../components/step-details/icons'
import type { VehicleType } from '../data/step-details'

type Sheet =
  | { kind: 'date' }
  | { kind: 'add-pax' }
  | { kind: 'edit-pax'; id: string }
  | { kind: 'add-veh' }
  | { kind: 'edit-veh'; id: string }
  | { kind: 'actions'; type: 'pax' | 'veh'; id: string }
  | null

const initialsOf = (name: string) => {
  const w = name.split(' ').filter((s) => !s.endsWith('.'))
  return `${w[0]?.[0] ?? ''}${w[w.length - 1]?.[0] ?? ''}`.toUpperCase()
}

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-[20px] border border-[#ececf0] bg-white p-[12px]">
    <h3 className="px-[4px] pt-[4px] pb-[12px] text-[11px] leading-[16px] font-medium tracking-[0.5px] text-[#8e8e93] uppercase">{title}</h3>
    <div className="flex flex-col gap-[8px]">{children}</div>
  </section>
)

const AddButton = ({ onClick, children }: { onClick: () => void; children: string }) => (
  <button type="button" onClick={onClick} className="flex h-[44px] w-full items-center justify-center gap-[6px] rounded-16 border border-[#e5e5ea] bg-white text-[13px] font-semibold text-[#f97316] transition-transform active:scale-[0.99]">
    <span aria-hidden>+</span>
    {children}
  </button>
)

// Figma "Flow – Return Trip" 02 / 02a (12328:9214, 12328:9302): "When do you return?" — route reversed, return date, and the
// passengers / vehicles carried over from the original booking (edit, remove or add). Next → Select departure → Review & pay.
export default function ReturnTrip() {
  const navigate = useNavigate()
  const { booking, update } = useBooking()
  const [sheet, setSheet] = useState<Sheet>(null)
  const close = () => setSheet(null)
  const { passengers, vehicles } = booking

  const save = (nextPax: PassengerDetail[], nextVeh: VehicleDetail[]) =>
    update({ passengers: repriced(nextPax, nextVeh), vehicles: nextVeh, passengerCount: nextPax.length, vehicleCount: nextVeh.length, departureId: null })

  const actions = sheet?.kind === 'actions' ? sheet : null
  const actionPax = actions?.type === 'pax' ? passengers.find((p) => p.id === actions.id) : undefined
  const actionVeh = actions?.type === 'veh' ? vehicles.find((v) => v.id === actions.id) : undefined
  const editPax = sheet?.kind === 'edit-pax' ? passengers.find((p) => p.id === sheet.id) : undefined
  const editVeh = sheet?.kind === 'edit-veh' ? vehicles.find((v) => v.id === sheet.id) : undefined
  const then = (next: Sheet) => {
    close()
    setTimeout(() => setSheet(next), 200) // like the live app: the action sheet slides out, then the next one in
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f8f8]">
      <BookingHeader title="When do you return?" screen="return" />
      <RouteBanner />

      <div className="flex flex-1 flex-col gap-[16px] px-[16px] pt-[20px] pb-[16px]">
        <h2 className="text-[18px] leading-[26px] font-semibold text-[#171717]">When do you want to return?</h2>
        <SelectField label="Return date" value={booking.date} onClick={() => setSheet({ kind: 'date' })} className="bg-white" />

        <Card title="Passengers being carried over">
          {passengers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSheet({ kind: 'actions', type: 'pax', id: p.id })}
              className="flex items-center gap-[12px] rounded-16 border border-[#e5e5ea] bg-white p-[12px] text-left transition-transform active:scale-[0.99]"
            >
              <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#f1f1f4] text-[13px] font-medium text-[#8e8e93]">{initialsOf(p.fullName)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] leading-[22px] font-semibold text-[#171717]">{p.fullName}</span>
                <span className="block text-[12px] leading-[16px] text-[#8e8e93]">{p.fareType}</span>
              </span>
            </button>
          ))}
          <AddButton onClick={() => setSheet({ kind: 'add-pax' })}>Add another passenger</AddButton>
        </Card>

        <Card title="Vehicles">
          {vehicles.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSheet({ kind: 'actions', type: 'veh', id: v.id })}
              className="flex items-center gap-[12px] rounded-16 border border-[#e5e5ea] bg-white p-[12px] text-left transition-transform active:scale-[0.99]"
            >
              <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#f1f1f4]">
                <VehicleRowIcon type={v.type as VehicleType} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] leading-[20px] font-semibold text-[#171717]">{`${v.plate} ${v.model}`}</span>
                <span className="block text-[12px] leading-[16px] text-[#8e8e93]">{v.type.replace(' / ', '/')}</span>
              </span>
              <span aria-hidden className="text-[#a3a3a3]">›</span>
            </button>
          ))}
          {vehicles.length === 0 && <AddButton onClick={() => setSheet({ kind: 'add-veh' })}>Add a vehicle</AddButton>}
        </Card>

        <CarriedNote>Passenger details from your original booking are carried over — no need to re-enter IDs or add-ons.</CarriedNote>
      </div>

      <StepFooter
        disabled={passengers.length === 0}
        note={passengers.length === 0 ? <p className="mb-[8px] text-center text-[14px] leading-[20px] text-[#f97316]">Add at least one passenger to continue</p> : null}
        onClick={() => navigate('/book/departure', { replace: true })}
      >
        Next: Choose Ferry
      </StepFooter>

      <DateSheet
        open={sheet?.kind === 'date'}
        value={parseBookingDate(booking.date)}
        today={startOfToday()}
        title="Select Return Date"
        onClose={close}
        onSelect={(d) => {
          update({ date: formatBookingDate(d), departureId: null })
          close()
        }}
      />
      <SheetPresence open={!!actions}>
        {actions && (
          <ActionSheet
            title={actionPax?.fullName ?? `${actionVeh?.plate ?? ''} ${actionVeh?.model ?? ''}`.trim()}
            noun={actions.type === 'pax' ? 'Passenger' : 'Vehicle'}
            onClose={close}
            onEdit={() => then({ kind: actions.type === 'pax' ? 'edit-pax' : 'edit-veh', id: actions.id })}
            onRemove={() => {
              if (actions.type === 'pax') save(passengers.filter((p) => p.id !== actions.id), vehicles)
              else save(passengers, vehicles.filter((v) => v.id !== actions.id))
              close()
            }}
          />
        )}
      </SheetPresence>
      <SheetPresence open={sheet?.kind === 'add-pax'}>
        {sheet?.kind === 'add-pax' && (
          <BookingPassengerSheet
            onClose={close}
            onSubmit={(p) => {
              save([...passengers, { id: `pax-${Date.now()}`, fullName: p.fullName, fareType: p.fareType, cabin: 'Economy', fare: null }], vehicles)
              close()
            }}
          />
        )}
      </SheetPresence>
      <SheetPresence open={!!editPax}>
        {editPax && (
          <CarriedPassengerSheet
            fullName={editPax.fullName}
            fareType={editPax.fareType}
            onClose={close}
            onSubmit={(p) => {
              save(passengers.map((x) => (x.id === editPax.id ? { ...x, ...p } : x)), vehicles)
              close()
            }}
          />
        )}
      </SheetPresence>
      <SheetPresence open={sheet?.kind === 'add-veh'}>
        {sheet?.kind === 'add-veh' && (
          <VehicleFormSheet
            onClose={close}
            onSubmit={(v) => {
              save(passengers, [...vehicles, withVehicleFare({ id: `veh-${Date.now()}`, ...v })])
              close()
            }}
          />
        )}
      </SheetPresence>
      <SheetPresence open={!!editVeh}>
        {editVeh && (
          <VehicleFormSheet
            initial={{ plate: editVeh.plate, model: editVeh.model, type: editVeh.type as VehicleType }}
            onClose={close}
            onSubmit={(v) => {
              save(passengers, vehicles.map((x) => (x.id === editVeh.id ? { ...x, ...v } : x)))
              close()
            }}
          />
        )}
      </SheetPresence>
    </div>
  )
}
