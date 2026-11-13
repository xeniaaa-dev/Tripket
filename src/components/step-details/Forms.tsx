import { useState, type ReactNode } from 'react'
import imageUpload from '../../assets/figma/step-details/image-upload.svg'
import { idTypes, nationalities, passengerTypes, vehicleTypes, type VehicleType } from '../../data/step-details'
import { SheetPresence } from '../Drawer'
import BottomSheet, { UnsavedChangesSheet } from './BottomSheet'
import { SaveCar, SelectChevron, VehicleChipIcon } from './icons'

const label = 'text-[12px] leading-[18px] font-medium text-text-secondary'
const box = 'h-[52.728px] w-full rounded-16 border-[0.5px] border-border-default bg-white outline-none focus-within:border-primary-default'
const input = 'h-full w-full bg-transparent px-[12.988px] text-[15px] text-text-primary outline-none placeholder:text-text-secondary'

function Field({ name, hint, children }: { name: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex w-full flex-col gap-[7px]">
      <span className={label}>{name}</span>
      {hint ? (
        <span className="flex flex-col gap-[4px]">
          {children}
          <span className="text-[10px] leading-[18px] tracking-[-0.4px] text-text-secondary">{hint}</span>
        </span>
      ) : (
        children
      )}
    </label>
  )
}

function Select({ value, placeholder, options, onChange, className = 'px-[12.988px]' }: { value: string; placeholder: string; options: string[]; onChange: (v: string) => void; className?: string }) {
  return (
    <span className={`relative flex items-center ${box}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-full w-full appearance-none bg-transparent text-[15px] outline-none ${className} ${value ? 'text-text-primary' : 'text-text-secondary'}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-[12px]">
        <SelectChevron />
      </span>
    </span>
  )
}

/** "Tap to upload" drop zone (node 11598:41003) */
function Upload() {
  const [file, setFile] = useState('')
  return (
    <span
      className="relative flex h-[100px] cursor-pointer flex-col items-center justify-center gap-[7.999px] rounded-16 border-[1.617px] border-dashed border-border-default"
      style={{ backgroundImage: 'linear-gradient(163.1deg, #fff 0%, #fdfdfd 33.333%, #fafafc 66.667%, #f8f8fa 100%)' }}
    >
      <img alt="" src={imageUpload} className="size-[31.997px]" />
      <span className="max-w-[90%] truncate text-[13px] leading-[19.5px] font-medium text-text-secondary">{file || 'Tap to upload'}</span>
      <input type="file" accept="image/*,application/pdf" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')} />
    </span>
  )
}

/** Sheet wrapper that asks before discarding edits (node 11598:45677) */
function FormSheet({ title, what, dirty, onClose, children }: { title: string; what: string; dirty: boolean; onClose: () => void; children: ReactNode }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <>
      <BottomSheet title={title} onClose={() => (dirty ? setConfirming(true) : onClose())}>
        {children}
      </BottomSheet>
      <SheetPresence open={confirming}>
        {confirming && <UnsavedChangesSheet what={what} onContinue={() => setConfirming(false)} onDiscard={onClose} />}
      </SheetPresence>
    </>
  )
}

const ageFrom = (birth: string) => {
  const m = birth.match(/^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/)
  if (!m) return null
  const [mm, dd, yyyy] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const now = new Date()
  let age = now.getFullYear() - yyyy
  if (now.getMonth() + 1 < mm || (now.getMonth() + 1 === mm && now.getDate() < dd)) age--
  return age >= 0 && age < 130 ? age : null
}

export type NewPassenger = { fullName: string; initials: string; fareType: string; detail: string }

/** "Add passenger" form (node 11598:40897) */
export function PassengerFormSheet({ onSubmit, onClose }: { onSubmit: (p: NewPassenger) => void; onClose: () => void }) {
  const [type, setType] = useState<string>('Regular')
  const [first, setFirst] = useState('')
  const [middle, setMiddle] = useState('')
  const [last, setLast] = useState('')
  const [birth, setBirth] = useState('')
  const [gender, setGender] = useState<'Male' | 'Female'>('Male')
  const [nationality, setNationality] = useState('')
  const [idType, setIdType] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [nickname, setNickname] = useState('')

  const dirty = type !== 'Regular' || gender !== 'Male' || [first, middle, last, birth, nationality, idType, idNumber, nickname].some(Boolean)
  const valid = first.trim() !== '' && last.trim() !== ''

  const submit = () => {
    const age = ageFrom(birth)
    const fullName = [first.trim(), middle.trim() && `${middle.trim()[0].toUpperCase()}.`, last.trim()].filter(Boolean).join(' ')
    onSubmit({
      fullName,
      initials: `${first.trim()[0]}${last.trim()[0]}`.toUpperCase(),
      fareType: type,
      detail: [type, gender, nationality, age !== null && `${age}y`].filter(Boolean).join(' · '),
    })
  }

  return (
    <FormSheet title="Add passenger" what="passenger" dirty={dirty} onClose={onClose}>
      <div className="flex flex-col px-[16px]">
        <div className="flex w-full flex-col gap-[6.997px]">
          <p className={label}>Passenger type</p>
          <div className="flex flex-wrap gap-[7.999px]">
            {passengerTypes.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={t === type}
                onClick={() => setType(t)}
                className={`h-[39.996px] rounded-full px-[14.533px] text-[13px] leading-[19.5px] font-semibold whitespace-nowrap ${
                  t === type ? 'bg-primary-default text-white' : 'border-[0.539px] border-border-default bg-white text-text-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-[16px] flex flex-col gap-[16px] pl-[7.89px]">
          <Field name="First name">
            <span className={box}>
              <input className={input} placeholder="e.g. Juan" value={first} onChange={(e) => setFirst(e.target.value)} />
            </span>
          </Field>
          <Field name="Middle name (optional)">
            <span className={box}>
              <input className={input} placeholder="e.g. Santos" value={middle} onChange={(e) => setMiddle(e.target.value)} />
            </span>
          </Field>
          <Field name="Last name">
            <span className={box}>
              <input className={input} placeholder="e.g. Dela Cruz" value={last} onChange={(e) => setLast(e.target.value)} />
            </span>
          </Field>
          <Field name="Birthdate" hint="e.g. 04 / 27 / 1998">
            <span className={box}>
              <input className={input} inputMode="numeric" placeholder="MM / DD /YYYY" value={birth} onChange={(e) => setBirth(e.target.value)} />
            </span>
          </Field>

          {/* Gender segmented control (node 11598:40962) */}
          <div className="flex w-full flex-col gap-[6.997px] py-[8px]">
            <p className={label}>Gender</p>
            <div className="flex h-[43px] items-center rounded-[20px] bg-[#f8f8fa] px-[2px]">
              {(['Male', 'Female'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={g === gender}
                  onClick={() => setGender(g)}
                  className={`h-[39px] flex-1 rounded-[16.32px] text-center font-medium ${
                    g === gender ? 'border-[0.5px] border-[#c7c7cc] bg-white text-[13.26px] leading-[19.89px] text-text-primary' : 'text-[13px] leading-[19.5px] text-text-secondary'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <Field name="Nationality">
            <Select value={nationality} placeholder="Select nationality" options={nationalities} onChange={setNationality} />
          </Field>
          <Field name="ID type" hint="National ID, Passport, Driver’s License, etc.">
            <Select value={idType} placeholder="Select ID type" options={idTypes} onChange={setIdType} className="px-[12px]" />
          </Field>
          <Field name="ID number">
            <span className={box}>
              <input className={input} placeholder="Enter ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
            </span>
          </Field>
          <Field name="ID photo (front)">
            <Upload />
          </Field>
          <Field name="ID photo (back)">
            <Upload />
          </Field>
          <Field name="Nickname (optional)">
            <span className={box}>
              <input className={input} placeholder="Enter nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </span>
          </Field>
        </div>
      </div>
      <div className="px-[16px] pt-[34px] pb-[27px]">
        <button
          type="button"
          disabled={!valid}
          onClick={submit}
          className="h-[56px] w-full rounded-16 bg-gradient-to-r from-primary-default to-primary-dark text-[16px] leading-[24px] font-bold text-white drop-shadow-[0_4px_8px_rgba(249,115,22,0.3)] disabled:opacity-50"
        >
          Add passenger
        </button>
      </div>
    </FormSheet>
  )
}

export type NewVehicle = { plate: string; model: string; type: VehicleType }

/** "Add vehicle" form (node 11598:42370) */
export function VehicleFormSheet({ onSubmit, onClose, initial }: { onSubmit: (v: NewVehicle) => void; onClose: () => void; /** editing a carried-over vehicle (Return trip) */ initial?: NewVehicle }) {
  const [type, setType] = useState<VehicleType>(initial?.type ?? 'Car / Sedan')
  const [plate, setPlate] = useState(initial?.plate ?? '')
  const [make, setMake] = useState(initial?.model ?? '')
  const [color, setColor] = useState('')
  const [nickname, setNickname] = useState('')
  const [save, setSave] = useState(true)

  const dirty = !initial && (type !== 'Car / Sedan' || !save || [plate, make, color, nickname].some(Boolean))
  const vInput = 'h-[52.626px] w-full rounded-16 border-[0.5px] border-border-default bg-white px-[12.488px] text-[15px] text-text-primary outline-none placeholder:text-text-secondary focus:border-primary-default'

  return (
    <FormSheet title={initial ? 'Edit vehicle' : 'Add vehicle'} what="vehicle" dirty={dirty} onClose={onClose}>
      <div className="flex flex-col px-[23.998px] pb-[35px]">
        <div className="flex flex-col gap-[5.995px]">
          <p className={label}>Vehicle type</p>
          <div className="flex flex-wrap gap-x-[8px] gap-y-[8.004px]">
            {vehicleTypes.map(({ type: t, width }) => (
              <button
                key={t}
                type="button"
                aria-pressed={t === type}
                onClick={() => setType(t)}
                style={{ minWidth: width }}
                className={`flex h-[39.996px] items-center gap-[7px] rounded-full pr-[14px] pl-[15px] text-[13px] leading-[19.5px] font-semibold whitespace-nowrap ${
                  t === type ? 'bg-primary-default pl-[16px] text-white' : 'border border-border-default bg-white text-text-secondary'
                }`}
              >
                <VehicleChipIcon type={t} selected={t === type} />
                {t}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-[20px] flex flex-col gap-[5.995px]">
          <span className={label}>Plate number</span>
          <input
            className={`${vInput} font-['DM_Mono',ui-monospace,monospace] uppercase`}
            placeholder="ABC 1234"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
          />
        </label>

        <div className="mt-[20px] flex gap-[11.99px]">
          <label className="flex min-w-0 flex-1 flex-col gap-[5.995px]">
            <span className={label}>Make (optional)</span>
            <input className={vInput} placeholder="Fortuner" value={make} onChange={(e) => setMake(e.target.value)} />
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-[5.995px]">
            <span className={label}>Color (optional)</span>
            <input className={vInput} placeholder="Silver" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        </div>

        <label className="mt-[13.6px] flex flex-col gap-[6.4px]">
          <span className={label}>OR/CR Document</span>
          <Upload />
        </label>

        <label className="mt-[7px] flex flex-col gap-[5.995px]">
          <span className={label}>Nickname (optional)</span>
          <input className={vInput} placeholder="e.g. Family Car, Daily Ride" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </label>

        {/* "Save to my vehicles" (node 11598:42470) */}
        <div className="mt-[16.4px] flex h-[86.964px] items-center gap-[12px] rounded-16 bg-[rgba(249,115,22,0.06)] pr-[16px] pl-[16px]">
          <span className="flex size-[35.988px] shrink-0 items-center justify-center rounded-full bg-white">
            <SaveCar />
          </span>
          <span className="flex w-[202.439px] flex-col gap-[1.987px]">
            <span className="text-[14px] leading-[21px] font-medium text-text-primary">Save to my vehicles</span>
            <span className="flex-1 text-[12px] leading-[18px] text-text-secondary">We turned this on for you — toggle off if you prefer</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={save}
            aria-label="Save to my vehicles"
            onClick={() => setSave((s) => !s)}
            className={`ml-auto flex h-[30.986px] w-[50.993px] shrink-0 rounded-full pt-[1.987px] transition-colors ${save ? 'bg-[#34c759] pr-[2.004px] pl-[21.994px]' : 'bg-border-subtle pr-[21.994px] pl-[2.004px]'}`}
          >
            <span className="h-[26.995px] w-full rounded-full bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]" />
          </button>
        </div>

        <button
          type="button"
          disabled={!plate.trim()}
          onClick={() => onSubmit({ plate: plate.trim(), model: [make.trim(), color.trim()].filter(Boolean).join(' '), type })}
          className="mt-[43px] h-[55.995px] w-full rounded-16 bg-primary-default text-[16px] leading-[24px] font-bold text-white disabled:opacity-50"
        >
          {initial ? 'Save changes' : 'Add vehicle'}
        </button>
      </div>
    </FormSheet>
  )
}
