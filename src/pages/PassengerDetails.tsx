import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { useBooking, type PassengerDetail, type VehicleDetail } from '../booking/BookingContext'
import BookingHeader from '../components/booking/BookingHeader'
import RouteBanner from '../components/booking/RouteBanner'
import StepFooter from '../components/booking/StepFooter'
import { SheetPresence } from '../components/Drawer'
import VehicleTypeSheet from '../components/step-passengers/VehicleTypeSheet'
import BookingPassengerSheet from '../components/step-details/BookingPassengerSheet'
import CountSheet from '../components/step-details/CountSheet'
import EmailSheet from '../components/step-details/EmailSheet'
import { ageFrom, fullName, initials as initialsFor, useSaved } from '../data/passengers'
import { DEFAULT_VEHICLE_TYPE, type VehicleType as PickedVehicleType } from '../data/step-passengers'
import { AssignPassengerSheet, AssignVehicleSheet } from '../components/step-details/AssignSheets'
import { VehicleFormSheet } from '../components/step-details/Forms'
import { CarSecondary, UserSecondary } from '../components/step-details/icons'
import { EmptySlot, FreeBanner, PassengerCard, SectionHeader, UndoToast, VehicleCard } from '../components/step-details/Slots'
import { findDeparture } from '../data/departures'
import { cabins, FREE_PER_VEHICLE, peso, savedPassengers, savedVehicles, VEHICLE_FARE, type SavedPassenger as SlotPassenger } from '../data/step-details'

// Figma "Booking Flow (New)" → Book - Fill Up Passenger Details (node 11598:39242) / Passenger Details Filled (node 11598:42946)

type Pax = { id: string; savedId?: string; fullName: string; initials: string; detail: string; fareType: string; cabin: string }
type Veh = { id: string; savedId?: string; plate: string; model: string; type: string }
type Sheet = { kind: 'assign-pax' | 'pax-form' | 'assign-veh' | 'veh-form'; index: number } | null
type Removed = { kind: 'pax'; index: number; pax: Pax } | { kind: 'veh'; index: number; veh: Veh }

const cabinPrice = (cabin: string) => cabins.find((c) => c.name === cabin)?.price ?? cabins[0].price
const initialsOf = (name: string) => {
  const w = name.split(' ').filter((s) => !s.endsWith('.'))
  return `${w[0]?.[0] ?? ''}${w[w.length - 1]?.[0] ?? ''}`.toUpperCase()
}
const resize = <T,>(arr: (T | null)[], n: number) => Array.from({ length: n }, (_, i) => arr[i] ?? null)

/** "Wed, April 8 2026" → "Wed, Apr 8" (banner format, node 11598:39381) */
const shortDate = (date: string) => date.replace(/^(\w+), (\w{3})\w* (\d+).*$/, '$1, $2 $3')

export default function PassengerDetails() {
  const navigate = useNavigate()
  const { booking, update } = useBooking()
  const { user } = useAuth()
  const store = useSaved()
  const realSaved: SlotPassenger[] = store.passengers.map((p) => {
    const age = ageFrom(p.birthDate)
    return {
      id: `sp-${p.id}`,
      initials: initialsFor(p),
      fullName: fullName(p),
      fareType: p.type,
      detail: `${p.type} · ${p.gender === 'male' ? 'Male' : 'Female'} · ${age}y`,
      shortDetail: `${p.type} · ${age}y`,
    }
  })
  const { passengerCount, vehicleCount } = booking

  // Restore what was saved when coming back from Review & pay
  const [pax, setPax] = useState<(Pax | null)[]>(() =>
    resize(
      booking.passengers.map((p) => {
        const saved = savedPassengers.find((s) => s.id === p.id)
        return { id: p.id, savedId: saved?.id, fullName: p.fullName, initials: saved?.initials ?? initialsOf(p.fullName), detail: saved?.detail ?? p.fareType, fareType: p.fareType, cabin: p.cabin }
      }),
      passengerCount,
    ),
  )
  const [vehs, setVehs] = useState<(Veh | null)[]>(() =>
    resize(
      booking.vehicles.map((v) => ({ id: v.id, savedId: savedVehicles.find((s) => s.id === v.id)?.id, plate: v.plate, model: v.model, type: v.type })),
      vehicleCount,
    ),
  )
  const [sheet, setSheet] = useState<Sheet>(null)
  const [emailOpen, setEmailOpen] = useState(false)
  const [emailDone, setEmailDone] = useState(false)
  const [countOpen, setCountOpen] = useState(false)
  const [vtOpen, setVtOpen] = useState(false)
  const [draftCount, setDraftCount] = useState(passengerCount)
  const [draftVeh, setDraftVeh] = useState<PickedVehicleType | null>(null)
  const [removed, setRemoved] = useState<Removed | null>(null)

  useEffect(() => {
    if (!removed) return
    const t = setTimeout(() => setRemoved(null), 4000)
    return () => clearTimeout(t)
  }, [removed])

  const freeCount = vehicleCount > 0 ? FREE_PER_VEHICLE : 0
  const fareOf = (i: number, cabin: string) => (i < freeCount ? null : cabinPrice(cabin))
  const anyFilled = pax.some(Boolean)
  const allFilled = pax.every(Boolean) && vehs.every(Boolean)
  const total = pax.reduce((sum, p, i) => sum + (p ? (fareOf(i, p.cabin) ?? 0) : 0), 0) + vehs.filter(Boolean).length * VEHICLE_FARE

  const departure = findDeparture(booking.departureId)
  const [dateLabel, operatorLabel] = departure ? [shortDate(booking.date), departure.operator] : ['Wed, Apr 1', 'MV Lite Ferry 18']

  const setPaxAt = (i: number, p: Pax | null) => setPax((arr) => arr.map((x, j) => (j === i ? p : x)))
  const setVehAt = (i: number, v: Veh | null) => setVehs((arr) => arr.map((x, j) => (j === i ? v : x)))

  const openCount = () => {
    setDraftCount(passengerCount)
    setDraftVeh(vehicleCount > 0 ? DEFAULT_VEHICLE_TYPE : null)
    setCountOpen(true)
  }
  const applyCount = () => {
    const vc = draftVeh ? 1 : 0
    update({ passengerCount: draftCount, vehicleCount: vc })
    setPax((arr) => resize(arr, draftCount))
    setVehs((arr) => resize(arr, vc))
    setCountOpen(false)
  }
  const vehiclesAllowed = departure?.vesselType !== 'Fast Craft'
  const autofill = () => {
    setPax((arr) =>
      arr.map((x, i) => {
        const s = savedPassengers[i]
        return s ? { id: s.id, savedId: s.id, fullName: s.fullName, initials: s.initials, detail: s.detail, fareType: s.fareType, cabin: x?.cabin ?? 'Economy' } : x
      }),
    )
    setEmailDone(true)
    setEmailOpen(false)
  }
  const tapSlot = (i: number) => {
    if (user && realSaved.length > 0) setSheet({ kind: 'assign-pax', index: i })
    else setSheet({ kind: 'pax-form', index: i })
  }

  const undo = () => {
    if (removed?.kind === 'pax') setPaxAt(removed.index, removed.pax)
    if (removed?.kind === 'veh') setVehAt(removed.index, removed.veh)
    setRemoved(null)
  }

  const next = () => {
    const passengers: PassengerDetail[] = pax.flatMap((p, i) => (p ? [{ id: p.id, fullName: p.fullName, fareType: p.fareType, cabin: p.cabin, fare: fareOf(i, p.cabin) }] : []))
    const vehicles: VehicleDetail[] = vehs.flatMap((v) => (v ? [{ id: v.id, plate: v.plate, model: v.model, type: v.type, fare: VEHICLE_FARE }] : []))
    update({ passengers, vehicles })
    navigate('/book/review', { replace: true })
  }

  const passengerSlots = pax.map((p, i) =>
    p ? (
      <PassengerCard
        key={i}
        initials={p.initials}
        name={p.fullName}
        detail={p.detail}
        cabin={p.cabin}
        fare={fareOf(i, p.cabin)}
        onCabinChange={(cabin) => setPaxAt(i, { ...p, cabin })}
        onEdit={() => tapSlot(i)}
        onDelete={() => {
          setPaxAt(i, null)
          setRemoved({ kind: 'pax', index: i, pax: p })
        }}
      />
    ) : (
      <EmptySlot
        key={i}
        kind="passenger"
        title={`Passenger ${i + 1}${i < freeCount ? ' (free)' : ''} - tap to fill`}
        subtitle="Add the details needed for boarding"
        onClick={() => tapSlot(i)}
      />
    ),
  )

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <BookingHeader title="Passenger Details" screen="details" />
      <RouteBanner variant="details" />

      <div className="flex flex-1 flex-col gap-[8px] px-[16px] pt-[8px] pb-[16px]">
        <p className="text-[16px] leading-[24px] font-medium text-text-secondary">
          <span className="text-[14px] text-text-primary">{dateLabel}</span> <span className="text-[14px]">·</span> {operatorLabel}
        </p>
        {!user && !emailDone && (
          <div className="mt-[8px] flex items-center justify-between gap-[12px] rounded-16 bg-[#f6f6f6] p-[16px]">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-[20px] font-bold text-text-primary">Booked with us before?</p>
              <p className="text-[12px] leading-[16px] text-text-secondary">Use your email to bring back your saved passengers.</p>
            </div>
            <button type="button" onClick={() => setEmailOpen(true)} className="h-[40px] shrink-0 rounded-full bg-[#f97316] px-[20px] text-[14px] leading-[20px] font-medium whitespace-nowrap text-white">
              Use my email
            </button>
          </div>
        )}
        {anyFilled ? (
          // Filled layout (node 11598:42951): header → free banner → cards
          <section className="flex flex-col">
            <SectionHeader icon={<UserSecondary />}>Passenger · {passengerCount}</SectionHeader>
            {booking.flow === 'another' && (
              <p className="mt-[6px] text-[11px] leading-[16.5px] text-[#8e8e93]">Passengers from your previous booking are pre-filled. Add or remove as needed.</p>
            )}
            {freeCount > 0 && (
              <div className="mt-[8px]">
                <FreeBanner />
              </div>
            )}
            <div className="mt-[12.4px] flex flex-col gap-[6px]">{passengerSlots}</div>
            <ChangeCount onClick={openCount} />
          </section>
        ) : (
          // Empty layout (node 11598:39246): free banner → header → hint → slots
          <>
            {freeCount > 0 && <FreeBanner />}
            <section className="flex flex-col">
              <SectionHeader icon={<UserSecondary />}>Passenger · {passengerCount}</SectionHeader>
              <div className="mt-[6px] flex flex-col gap-[8px]">
                <p className="mb-[15px] text-[11px] leading-[16.5px] text-[#8e8e93]">
                  {freeCount > 0 ? 'First 2 passengers ride free · Tap cabin class to split them into different classes' : 'Tap cabin class on each passenger to split them into different classes'}
                </p>
                {passengerSlots}
                <ChangeCount onClick={openCount} />
              </div>
            </section>
          </>
        )}

        {vehicleCount > 0 && (
          <section className={`flex flex-col gap-[11.988px] ${anyFilled ? 'mt-[8px]' : ''}`}>
            <SectionHeader icon={<CarSecondary />}>Vehicle details · {vehicleCount}</SectionHeader>
            <div className="flex flex-col gap-[6px]">
              {vehs.map((v, i) =>
                v ? (
                  <VehicleCard
                    key={i}
                    title={`${v.plate} ${v.model}`}
                    type={v.type.replace(' / ', '/')}
                    fare={VEHICLE_FARE}
                    onEdit={() => setSheet({ kind: 'assign-veh', index: i })}
                    onDelete={() => {
                      setVehAt(i, null)
                      setRemoved({ kind: 'veh', index: i, veh: v })
                    }}
                  />
                ) : (
                  <EmptySlot key={i} kind="vehicle" title={`Vehicle ${i + 1} — tap to fill`} subtitle="Plate number & vehicle type required" onClick={() => setSheet({ kind: 'assign-veh', index: i })} />
                ),
              )}
            </div>
                      </section>
        )}
      </div>

      <StepFooter
        disabled={!allFilled}
        onClick={next}
        note={
          allFilled ? (
            // node 11598:43198
            <div className="mb-[8px] flex items-center justify-between px-[4px]">
              <span className="type-caption-sm text-[#8e8e93]">Estimated total</span>
              <span className="text-[14px] leading-[21px] font-bold text-primary-default">~{peso(total)}</span>
            </div>
          ) : (
            // node 11598:39403
            <p className="mb-[8px] text-center text-[14px] leading-[18px] text-primary-default">Fill in all passenger details to continue</p>
          )
        }
      >
        Next: Review & Pay
      </StepFooter>

      {removed && <UndoToast message={`${removed.kind === 'pax' ? removed.pax.fullName.split(' ')[0] : removed.veh.plate} removed`} onUndo={undo} />}

      <SheetPresence open={sheet?.kind === 'assign-pax'}>
        {sheet?.kind === 'assign-pax' && (
          <AssignPassengerSheet
            saved={realSaved}
            takenIds={pax.flatMap((p, j) => (p?.savedId && j !== sheet.index ? [p.savedId] : []))}
            onClose={() => setSheet(null)}
            onManual={() => setSheet({ kind: 'pax-form', index: sheet.index })}
            onPick={(s) => {
              setPaxAt(sheet.index, { id: s.id, savedId: s.id, fullName: s.fullName, initials: s.initials, detail: s.detail, fareType: s.fareType, cabin: pax[sheet.index]?.cabin ?? 'Economy' })
              setSheet(null)
            }}
          />
        )}
      </SheetPresence>
      <SheetPresence open={sheet?.kind === 'pax-form'}>
        {sheet?.kind === 'pax-form' && (
          <BookingPassengerSheet
            onClose={() => setSheet(null)}
            onSubmit={(p) => {
              setPaxAt(sheet.index, { id: `pax-${Date.now()}`, ...p, cabin: pax[sheet.index]?.cabin ?? 'Economy' })
              setSheet(null)
            }}
          />
        )}
      </SheetPresence>
      <SheetPresence open={sheet?.kind === 'assign-veh'}>
        {sheet?.kind === 'assign-veh' && (
          <AssignVehicleSheet
            title={`Vehicle ${sheet.index + 1}`}
            takenIds={vehs.flatMap((v, j) => (v?.savedId && j !== sheet.index ? [v.savedId] : []))}
            onClose={() => setSheet(null)}
            onManual={() => setSheet({ kind: 'veh-form', index: sheet.index })}
            onPick={(s) => {
              setVehAt(sheet.index, { id: s.id, savedId: s.id, plate: s.plate, model: s.model, type: s.type })
              setSheet(null)
            }}
          />
        )}
      </SheetPresence>
      <SheetPresence open={sheet?.kind === 'veh-form'}>
        {sheet?.kind === 'veh-form' && (
          <VehicleFormSheet
            onClose={() => setSheet(null)}
            onSubmit={(v) => {
              setVehAt(sheet.index, { id: `veh-${Date.now()}`, ...v })
              setSheet(null)
            }}
          />
        )}
      </SheetPresence>
      <EmailSheet open={emailOpen} onClose={() => setEmailOpen(false)} onVerified={autofill} />
      <CountSheet
        open={countOpen}
        count={draftCount}
        vehicleType={draftVeh}
        vehiclesAllowed={vehiclesAllowed}
        onCount={setDraftCount}
        onAddVehicle={() => setVtOpen(true)}
        onRemoveVehicle={() => setDraftVeh(null)}
        onCancel={() => setCountOpen(false)}
        onDone={applyCount}
      />
      <VehicleTypeSheet
        open={vtOpen}
        onClose={() => setVtOpen(false)}
        onSelect={(t) => {
          setDraftVeh(t)
          setVtOpen(false)
        }}
      />
    </div>
  )
}

/** "Change passenger count" link (node 12519:3945) */
function ChangeCount({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-[14px] self-center text-[12px] leading-[18px] font-medium text-primary-default">
      Change passenger count
    </button>
  )
}
