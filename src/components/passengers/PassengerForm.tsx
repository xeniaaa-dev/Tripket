import { CITIES, ID_TYPES, NATIONALITIES, PASSENGER_TYPES, ageFrom, savePassenger, type FileRef, type Gender, type PassengerType, type SavedPassenger } from '../../data/passengers'
import { Chip, ComboBox, DateField, GenderToggle, SelectField, SubmitButton, TextField, UploadField } from './Fields'
import { FormSheet } from './Sheets'
import { showSuccess } from './Toast'
import { MAX_NAME, NAME_RE, useForm } from './useForm'

// Live SAVED_PASSENGER_FORM_SHEET ("Add Passenger" / "Edit Passenger") with its yup schema messages.

type Values = {
  type: PassengerType
  firstName: string
  middleName: string
  lastName: string
  city: string
  birth: [string, string, string] // MM, DD, YYYY
  gender: Gender
  nationality: string
  idType: string
  idNumber: string
  idFront: FileRef
  idBack: FileRef
}

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
  if (!iso) birth = 'Birthdate is required'
  else if (iso === 'invalid') birth = 'Birthdate is required'
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
    city: v.city ? undefined : 'City/Municipality is required',
    birth,
    nationality: v.nationality.trim() ? undefined : 'Nationality is required',
    idNumber:
      v.idType && !v.idNumber.trim()
        ? 'ID number is required'
        : v.idNumber && !/^[A-Za-z0-9\s-]+$/.test(v.idNumber)
          ? 'ID number cannot contain special characters.'
          : v.idNumber.length > MAX_NAME
            ? `Must not exceed ${MAX_NAME} characters`
            : undefined,
    idFront: v.idFront ? undefined : 'ID photo (front) is required',
    idBack: v.idBack ? undefined : 'ID photo (back) is required',
  }
}

const EMPTY: Values = { type: 'Regular', firstName: '', middleName: '', lastName: '', city: '', birth: ['', '', ''], gender: 'male', nationality: 'Filipino', idType: '', idNumber: '', idFront: null, idBack: null }

const fromSaved = (p: SavedPassenger): Values => {
  const [y = '', m = '', d = ''] = p.birthDate.split('-')
  return { type: p.type, firstName: p.firstName, middleName: p.middleName, lastName: p.lastName, city: p.city, birth: [m, d, y], gender: p.gender, nationality: p.nationality, idType: p.idType, idNumber: p.idNumber, idFront: p.idFront, idBack: p.idBack }
}

const CITY_OPTIONS = CITIES.map((c) => ({ value: `${c.name}, ${c.province}`, label: c.name, sub: c.province }))
const NATIONALITY_OPTIONS = NATIONALITIES.map((n) => ({ value: n, label: n }))

export default function PassengerForm({ editing, onClose }: { editing: SavedPassenger | null; onClose: () => void }) {
  const f = useForm<Values>(editing ? fromSaved(editing) : EMPTY, validate)
  const { values: v, set, touch, err } = f
  const iso = toIso(v.birth)
  const age = iso && iso !== 'invalid' ? ageFrom(iso) : null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.attempt()) return
    savePassenger({
      id: editing?.id,
      type: v.type,
      firstName: v.firstName.trim(),
      middleName: v.middleName.trim(),
      lastName: v.lastName.trim(),
      city: v.city,
      birthDate: iso,
      gender: v.gender,
      nationality: v.nationality || 'Filipino',
      idType: v.idType,
      idNumber: v.idNumber.trim(),
      idFront: v.idFront,
      idBack: v.idBack,
    })
    showSuccess(editing ? 'Passenger profile updated successfully' : 'Passenger profile created successfully')
    onClose()
  }

  return (
    <FormSheet title={editing ? 'Edit Passenger' : 'Add Passenger'} onClose={onClose}>
      <form noValidate onSubmit={submit} className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label className="mb-[8px] text-[12px] leading-[16px] text-[#8e8e93]">Passenger Type</label>
          <div className="flex flex-wrap gap-[6px]">
            {PASSENGER_TYPES.map((t) => (
              <Chip
                key={t}
                selected={v.type === t}
                onClick={() => {
                  set('type', t)
                }}
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[8px]">
          <TextField label="First name" required placeholder="e.g. Juan" value={v.firstName} onChange={(x) => set('firstName', x)} onBlur={() => touch('firstName')} error={err('firstName')} />
          <TextField label="Middle name (optional)" placeholder="e.g. Santos" value={v.middleName} onChange={(x) => set('middleName', x)} onBlur={() => touch('middleName')} error={err('middleName')} />
          <TextField label="Last name" required placeholder="e.g. Dela Cruz" value={v.lastName} onChange={(x) => set('lastName', x)} onBlur={() => touch('lastName')} error={err('lastName')} />
          <ComboBox label="City/Municipality" placeholder="Search.." radius={12} value={v.city} onChange={(x) => set('city', x)} onBlur={() => touch('city')} options={CITY_OPTIONS} error={err('city')} />
        </div>

        <DateField label="Birthdate" parts={v.birth} onChange={(p) => set('birth', p)} onBlur={() => touch('birth')} error={err('birth')} />

        <TextField label="Age" required disabled placeholder="0" value={age === null ? '' : String(age)} onChange={() => {}} />

        <GenderToggle value={v.gender} onChange={(g) => set('gender', g)} />

        <ComboBox label="Nationality" placeholder="Select nationality" radius={16} clearable value={v.nationality} onChange={(x) => set('nationality', x)} onBlur={() => touch('nationality')} options={NATIONALITY_OPTIONS} error={err('nationality')} />

        <SelectField label="ID Type" placeholder="Select ID type" value={v.idType} onChange={(x) => set('idType', x)} options={ID_TYPES} />

        <TextField label="ID number" required={Boolean(v.idType)} placeholder="Enter ID Number" value={v.idNumber} onChange={(x) => set('idNumber', x)} onBlur={() => touch('idNumber')} error={err('idNumber')} />

        <div className="grid grid-cols-1 gap-[12px] pt-[4px]">
          <UploadField label="ID photo (front)" prompt="Tap to upload" value={v.idFront} onChange={(x) => set('idFront', x)} error={err('idFront')} />
          <UploadField label="ID photo (back)" prompt="Tap to upload" value={v.idBack} onChange={(x) => set('idBack', x)} error={err('idBack')} />
        </div>
        <SubmitButton disabled={Boolean(editing) && !f.dirty}>{editing ? 'Save Changes' : 'Add Passenger'}</SubmitButton>
      </form>
    </FormSheet>
  )
}
