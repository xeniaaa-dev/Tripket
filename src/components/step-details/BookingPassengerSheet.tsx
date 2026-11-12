import { ageFrom, PASSENGER_TYPES, type FileRef, type Gender, type PassengerType } from '../../data/passengers'
import { Chip, DateField, GenderToggle, SubmitButton, TextField, UploadField } from '../passengers/Fields'
import { FormSheet } from '../passengers/Sheets'
import SampleFill from '../passengers/SampleFill'
import { MAX_NAME, NAME_RE, SAMPLE_FILE, useForm } from '../passengers/useForm'
import type { NewPassenger } from './Forms'

// Live "Add Passenger" sheet on Passenger details (guest): same fields/validation as the Passengers tab form, minus the profile-only fields.
type Values = { type: PassengerType; firstName: string; middleName: string; lastName: string; birth: [string, string, string]; gender: Gender; idFront: FileRef }
const EMPTY: Values = { type: 'Regular', firstName: '', middleName: '', lastName: '', birth: ['', '', ''], gender: 'male', idFront: null }

const toIso = ([m, d, y]: [string, string, string]) => {
  if (m.length < 2 || d.length < 2 || y.length < 4) return ''
  const date = new Date(`${y}-${m}-${d}T00:00:00`)
  return date.getMonth() + 1 === Number(m) && date.getDate() === Number(d) ? `${y}-${m}-${d}` : 'invalid'
}

function nameError(v: string, label: string, requiredMsg?: string) {
  if (!v.trim()) return requiredMsg
  if (v.length > MAX_NAME) return `Must not exceed ${MAX_NAME} characters`
  if (!NAME_RE.test(v)) return `${label} cannot contain special characters.`
}

function validate(v: Values): Partial<Record<keyof Values, string>> {
  const iso = toIso(v.birth)
  let birth: string | undefined
  if (!iso || iso === 'invalid') birth = 'Birthdate is required'
  else {
    const age = ageFrom(iso)!
    if (new Date(iso) > new Date()) birth = 'Birth date cannot be in the future'
    else if (age > 150) birth = 'Birth date cannot be more than 150 years ago'
    else if (v.type === 'Infant (under 2)' && age >= 2) birth = 'Infant passenger must be under 2 years old'
    else if (v.type === 'Child (2-11)' && (age < 2 || age >= 12)) birth = 'Child passenger must be 2 to 11 years old'
    else if (v.type === 'Senior Citizen' && age < 60) birth = 'Senior passenger must be at least 60 years old'
  }
  return {
    firstName: nameError(v.firstName, 'First name', 'Please enter first name'),
    middleName: nameError(v.middleName, 'Middle name'),
    lastName: nameError(v.lastName, 'Last name', 'Please enter last name'),
    birth,
    idFront: v.idFront ? undefined : 'ID photo (front) is required',
  }
}

export default function BookingPassengerSheet({ onSubmit, onClose }: { onSubmit: (p: NewPassenger) => void; onClose: () => void }) {
  const f = useForm<Values>(EMPTY, validate)
  const { values: v, set, touch, err } = f
  const iso = toIso(v.birth)
  const age = iso && iso !== 'invalid' ? ageFrom(iso) : null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.attempt()) return
    const first = v.firstName.trim()
    const last = v.lastName.trim()
    const mid = v.middleName.trim()
    onSubmit({
      fullName: [first, mid ? `${mid[0].toUpperCase()}.` : '', last].filter(Boolean).join(' '),
      initials: `${first[0]}${last[0]}`.toUpperCase(),
      fareType: v.type,
      detail: `${v.type} · ${v.gender === 'male' ? 'Male' : 'Female'} · ${age}y`,
    })
  }

  return (
    <FormSheet title="Add Passenger" onClose={onClose}>
      <form noValidate onSubmit={submit} className="flex flex-col gap-[16px]">
        <SampleFill onClick={() => f.fill({ type: 'Regular', firstName: 'Juan', middleName: 'Santos', lastName: 'Dela Cruz', birth: ['05', '14', '1995'], gender: 'male', idFront: SAMPLE_FILE('id-front.svg') })} />
        <div className="flex flex-col gap-[6px]">
          <label className="mb-[8px] text-[12px] leading-[16px] text-[#8e8e93]">Passenger Type</label>
          <div className="flex flex-wrap gap-[6px]">
            {PASSENGER_TYPES.map((t) => (
              <Chip key={t} selected={v.type === t} onClick={() => set('type', t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-[8px]">
          <TextField label="First name" required placeholder="e.g. Juan" value={v.firstName} onChange={(x) => set('firstName', x)} onBlur={() => touch('firstName')} error={err('firstName')} />
          <TextField label="Middle name (optional)" placeholder="e.g. Santos" value={v.middleName} onChange={(x) => set('middleName', x)} onBlur={() => touch('middleName')} error={err('middleName')} />
          <TextField label="Last name" required placeholder="e.g. Dela Cruz" value={v.lastName} onChange={(x) => set('lastName', x)} onBlur={() => touch('lastName')} error={err('lastName')} />
        </div>
        <DateField label="Birthdate" parts={v.birth} onChange={(p) => set('birth', p)} onBlur={() => touch('birth')} error={err('birth')} />
        <GenderToggle value={v.gender} onChange={(g) => set('gender', g)} />
        <UploadField label="ID photo (front)" prompt="Tap to upload" value={v.idFront} onChange={(x) => set('idFront', x)} error={err('idFront')} />
        <SubmitButton>Add Passenger</SubmitButton>
      </form>
    </FormSheet>
  )
}
