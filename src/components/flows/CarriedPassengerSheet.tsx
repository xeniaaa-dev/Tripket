import { PASSENGER_TYPES, type PassengerType } from '../../data/passengers'
import { Chip, SubmitButton, TextField } from '../passengers/Fields'
import { FormSheet } from '../passengers/Sheets'
import { MAX_NAME, NAME_RE, useForm } from '../passengers/useForm'

// Edit a carried-over passenger (Return trip): name and passenger type only — IDs and other details stay as booked.
type Values = { type: PassengerType; firstName: string; middleName: string; lastName: string }

const nameError = (v: string, label: string, required?: string) =>
  !v.trim() ? required : v.length > MAX_NAME ? `Must not exceed ${MAX_NAME} characters` : !NAME_RE.test(v) ? `${label} cannot contain special characters.` : undefined

/** "Juan M. Dela Cruz" → first / middle / last */
export function splitName(fullName: string) {
  const w = fullName.split(' ').filter(Boolean)
  const mid = w.slice(1, -1).find((x) => x.endsWith('.'))
  const rest = w.slice(1, -1).filter((x) => x !== mid)
  return { firstName: w[0] ?? '', middleName: mid ? mid.slice(0, -1) : '', lastName: [...rest, ...(w.length > 1 ? [w[w.length - 1]] : [])].join(' ') }
}

export default function CarriedPassengerSheet({ fullName, fareType, onSubmit, onClose }: { fullName: string; fareType: string; onSubmit: (p: { fullName: string; fareType: string }) => void; onClose: () => void }) {
  const f = useForm<Values>({ type: (PASSENGER_TYPES as readonly string[]).includes(fareType) ? (fareType as PassengerType) : 'Regular', ...splitName(fullName) }, (v) => ({
    firstName: nameError(v.firstName, 'First name', 'Please enter first name'),
    middleName: nameError(v.middleName, 'Middle name'),
    lastName: nameError(v.lastName, 'Last name', 'Please enter last name'),
  }))
  const { values: v, set, touch, err } = f
  return (
    <FormSheet title="Edit Passenger" onClose={onClose}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (!f.attempt()) return
          const mid = v.middleName.trim()
          onSubmit({ fullName: [v.firstName.trim(), mid ? `${mid[0].toUpperCase()}.` : '', v.lastName.trim()].filter(Boolean).join(' '), fareType: v.type })
        }}
        className="flex flex-col gap-[16px]"
      >
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
        <TextField label="First name" required placeholder="e.g. Juan" value={v.firstName} onChange={(x) => set('firstName', x)} onBlur={() => touch('firstName')} error={err('firstName')} />
        <TextField label="Middle name (optional)" placeholder="e.g. Santos" value={v.middleName} onChange={(x) => set('middleName', x)} onBlur={() => touch('middleName')} error={err('middleName')} />
        <TextField label="Last name" required placeholder="e.g. Dela Cruz" value={v.lastName} onChange={(x) => set('lastName', x)} onBlur={() => touch('lastName')} error={err('lastName')} />
        <SubmitButton disabled={!f.dirty}>Save Changes</SubmitButton>
      </form>
    </FormSheet>
  )
}
