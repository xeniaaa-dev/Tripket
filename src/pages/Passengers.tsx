import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import emptyPassengers from '../assets/live/passengers/empty-passengers.svg'
import emptyVehicles from '../assets/live/passengers/empty-vehicles.svg'
import { useAuth } from '../auth/AuthContext'
import { SheetPresence } from '../components/Drawer'
import { PlusIcon } from '../components/passengers/icons'
import PassengerForm from '../components/passengers/PassengerForm'
import { PassengerRow, VehicleRow } from '../components/passengers/ProfileRows'
import { ActionSheet, ConfirmDeleteSheet } from '../components/passengers/Sheets'
import { Toaster, showSuccess } from '../components/passengers/Toast'
import VehicleForm from '../components/passengers/VehicleForm'
import { fullName, removePassenger, removeVehicle, useSaved } from '../data/passengers'

// Passengers tab (live: book.tripket.ph/passengers) — "Saved profiles & vehicles", People | Vehicles tabs (?tab=vehicles),
// empty states, add/edit sheets, ⋮ action sheet (Edit / Remove) and a delete confirmation (Delete / Keep) before removal + toast.
// Live sends guests to /login/email on "Add"; the prototype behaves like a signed-in account (in-memory store).

type Tab = 'people' | 'vehicles'
type Sheet = { kind: 'passenger-form' | 'vehicle-form'; id: number | null } | { kind: 'actions' | 'confirm'; type: 'passenger' | 'vehicle'; id: number }

const TAB_EASE = '250ms cubic-bezier(0.32,0.72,0,1)'

function EmptyState({ icon, title, description, button, onAdd }: { icon: string; title: string; description: string; button: string; onAdd: () => void }) {
  return (
    <div className="flex min-h-[calc(var(--screen-vh)*60)] items-center justify-center">
      <div className="flex flex-col items-center px-[24px] py-[48px] text-center">
        <img alt="" src={icon} className="size-[32px]" />
        <div className="text-[18px] leading-[28px] font-medium text-[#1c1917]">{title}</div>
        <div className="mt-[4px] max-w-[252px] text-[13px] leading-[17.94px] font-light text-[#8e8e93]">{description}</div>
        <div className="mt-[24px] flex gap-[8px]">
          <button
            type="button"
            onClick={onAdd}
            className="flex h-[40px] items-center gap-[8px] rounded-12 bg-[#ff6900] px-[24px] py-[10px] text-[12px] leading-[16px] font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition-transform active:scale-[0.97]"
          >
            {button}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Passengers() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const tab: Tab = params.get('tab') === 'vehicles' ? 'vehicles' : 'people'
  const { passengers, vehicles } = useSaved()
  const { user } = useAuth()
  const [sheet, setSheet] = useState<Sheet | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const count = tab === 'people' ? passengers.length : vehicles.length
  // live: a guest is sent to the login flow instead of the add sheet
  const add = () => (!user ? navigate('/login/email', { state: { from: '/passengers' } }) : setSheet({ kind: tab === 'people' ? 'passenger-form' : 'vehicle-form', id: null }))
  const close = () => setSheet(null)

  const action = sheet?.kind === 'actions' ? sheet : null
  const confirm = sheet?.kind === 'confirm' ? sheet : null
  const target = action ?? confirm
  const actionPassenger = target?.type === 'passenger' ? passengers.find((p) => p.id === target.id) : undefined
  const actionVehicle = target?.type === 'vehicle' ? vehicles.find((v) => v.id === target.id) : undefined
  const caption = actionPassenger ? fullName(actionPassenger) : actionVehicle ? `${actionVehicle.make} ${actionVehicle.model} (${actionVehicle.plate})` : ''

  const edit = () => {
    if (!action) return
    const next: Sheet = { kind: action.type === 'passenger' ? 'passenger-form' : 'vehicle-form', id: action.id }
    close()
    // live: closeSheet() then opens the form sheet 200ms later
    timer.current = setTimeout(() => setSheet(next), 200)
  }
  // "Remove …" opens the delete confirmation (action sheet slides out, then the confirmation slides in)
  const askRemove = () => {
    if (!action) return
    const next: Sheet = { kind: 'confirm', type: action.type, id: action.id }
    close()
    timer.current = setTimeout(() => setSheet(next), 200)
  }
  const remove = () => {
    if (!confirm) return
    if (confirm.type === 'passenger') {
      removePassenger(confirm.id)
      showSuccess('Passenger deleted successfully')
    } else {
      removeVehicle(confirm.id)
      showSuccess('Vehicle deleted successfully')
    }
    close()
  }

  const passengerForm = sheet?.kind === 'passenger-form' ? sheet : null
  const vehicleForm = sheet?.kind === 'vehicle-form' ? sheet : null

  return (
    <div className="relative mx-auto min-h-dvh max-w-lg bg-white px-[24px] pt-[16px] pb-[120px] select-none">
      <h1 className="sr-only">Saved Passengers and Vehicles Profiles</h1>
      <header className="relative mt-[8px] flex items-center gap-[8px] pb-[8px]">
        <div>
          <h2 className="text-[28px] leading-[32.2px] font-medium tracking-[-0.7px] text-[#1c1917]">Passengers</h2>
          <p className="mt-[4px] text-[14px] leading-[20px] text-[#737373]">Saved profiles &amp; vehicles</p>
        </div>
        <div className="absolute right-0">
          {count > 0 && (
            <button
              type="button"
              aria-label="Add"
              onClick={add}
              className="flex size-[44px] items-center justify-center rounded-full bg-[#ff6900] text-white shadow-[0_4px_6px_-1px_rgba(255,105,0,0.2),0_2px_4px_-2px_rgba(255,105,0,0.2)] transition-all hover:bg-[#f54900] active:scale-95"
            >
              <PlusIcon size={20} />
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-[8px]">
        <div className="rounded-[20px] bg-[#f2f2f7]">
          <div role="tablist" aria-label="Saved profiles" className="relative grid grid-cols-2 p-[4px]">
            <div
              aria-hidden
              className="absolute top-[4px] bottom-[4px] left-[4px] w-[calc(50%-4px)] rounded-16 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.06)]"
              style={{ translate: tab === 'vehicles' ? '100% 0' : '0 0', transition: `translate ${TAB_EASE}` }}
            />
            {(['people', 'vehicles'] as const).map((t) => {
              const n = t === 'people' ? passengers.length : vehicles.length
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => tab !== t && navigate(`/passengers?tab=${t}`)}
                  className={`relative flex min-h-[40px] w-full items-center justify-center rounded-[24px] px-[16px] text-[14px] leading-[20px] font-medium transition-colors duration-150 ${tab === t ? 'text-[#18181b]' : 'text-[#71717a]'}`}
                >
                  {t === 'people' ? 'People' : 'Vehicles'} {n > 0 && `(${n})`}
                </button>
              )
            })}
          </div>
        </div>

        <div role="tabpanel">
          <div className="flex flex-col gap-[8px] pb-[48px]">
            {tab === 'people'
              ? passengers.map((p) => <PassengerRow key={p.id} p={p} onMore={() => setSheet({ kind: 'actions', type: 'passenger', id: p.id })} />)
              : vehicles.map((v) => <VehicleRow key={v.id} v={v} onMore={() => setSheet({ kind: 'actions', type: 'vehicle', id: v.id })} />)}
          </div>
          {tab === 'people' && passengers.length === 0 && (
            <EmptyState icon={emptyPassengers} title="No saved passengers" description="Save passenger details here for quick booking next time" button="Add first passenger" onAdd={add} />
          )}
          {tab === 'vehicles' && vehicles.length === 0 && (
            <EmptyState icon={emptyVehicles} title="No saved vehicles" description="Save vehicle details here for quick booking next time" button="Add first vehicle" onAdd={add} />
          )}
        </div>
      </div>

      <SheetPresence open={Boolean(passengerForm)}>
        {passengerForm && <PassengerForm key={passengerForm.id ?? 'new'} editing={passengers.find((p) => p.id === passengerForm.id) ?? null} onClose={close} />}
      </SheetPresence>
      <SheetPresence open={Boolean(vehicleForm)}>
        {vehicleForm && <VehicleForm key={vehicleForm.id ?? 'new'} editing={vehicles.find((v) => v.id === vehicleForm.id) ?? null} onClose={close} />}
      </SheetPresence>
      <SheetPresence open={Boolean(action)}>
        {action && <ActionSheet title={caption} noun={action.type === 'passenger' ? 'Passenger' : 'Vehicle'} onClose={close} onEdit={edit} onRemove={askRemove} />}
      </SheetPresence>
      <SheetPresence open={Boolean(confirm)}>
        {confirm && (
          <ConfirmDeleteSheet
            title={`Delete ${caption}?`}
            note={confirm.type === 'passenger' ? 'Their saved details will be removed from your account. You can add them again anytime.' : 'Its saved details will be removed from your account. You can add it again anytime.'}
            keepLabel={confirm.type === 'passenger' ? 'Keep Passenger' : 'Keep Vehicle'}
            onDelete={remove}
            onKeep={close}
          />
        )}
      </SheetPresence>
      <Toaster />
    </div>
  )
}
