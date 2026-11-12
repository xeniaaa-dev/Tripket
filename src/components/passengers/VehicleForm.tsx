import { DEFAULT_VEHICLE_TYPE, VEHICLE_TYPES, saveVehicle, type FileRef, type SavedVehicle, type VehicleType } from '../../data/passengers'
import { SubmitButton, TextField, UploadField } from './Fields'
import { FormSheet } from './Sheets'
import { showSuccess } from './Toast'
import SampleFill from './SampleFill'
import { MAX_NAME, SAMPLE_FILE, useForm } from './useForm'

// Live SAVED_VEHICLE_FORM_SHEET ("Add Vehicle" / "Edit Vehicle") with its yup schema messages.

type Values = { type: VehicleType; plate: string; year: string; make: string; model: string; photo: FileRef; or: FileRef; cr: FileRef }

const TEXT_RE = /^[a-zA-ZñÑéÉüÜ0-9\s'.-]+$/
const textError = (v: string, label: string, requiredMsg: string) => {
  if (!v.trim()) return requiredMsg
  if (v.length > MAX_NAME) return `Must not exceed ${MAX_NAME} characters`
  if (!TEXT_RE.test(v)) return `${label} cannot contain special characters.`
}

function validate(v: Values): Partial<Record<keyof Values, string>> {
  const y = Number(v.year)
  return {
    plate: textError(v.plate, 'Plate number', 'Plate number is required'),
    year: !v.year.trim() ? 'Year is required' : Number.isNaN(y) ? 'Year must be a valid number' : y < 1980 ? 'Car model year must be 1980 or later' : y > 2027 ? 'Car model year must be 2027 or earlier' : undefined,
    make: textError(v.make, 'Make', 'Make / Brand is required'),
    model: textError(v.model, 'Model', 'Model is required'),
    photo: v.photo ? undefined : 'Vehicle photo is required',
    or: v.or ? undefined : 'Official receipt (OR) is required',
    cr: v.cr ? undefined : 'Certificate of registration (CR) is required',
  }
}

const EMPTY: Values = { type: DEFAULT_VEHICLE_TYPE, plate: '', year: '', make: '', model: '', photo: null, or: null, cr: null }

/** Vehicle type icon drawn with the live SVG as a mask, so it follows the chip's text colour. */
export function VehicleGlyph({ icon, size = 20 }: { icon: string; size?: number }) {
  return <span aria-hidden className="block shrink-0 bg-current" style={{ width: size, height: size, mask: `url("${icon}") center / contain no-repeat`, WebkitMask: `url("${icon}") center / contain no-repeat` }} />
}

export default function VehicleForm({ editing, onClose }: { editing: SavedVehicle | null; onClose: () => void }) {
  const f = useForm<Values>(editing ? { type: editing.type, plate: editing.plate, year: editing.year, make: editing.make, model: editing.model, photo: editing.photo, or: editing.or, cr: editing.cr } : EMPTY, validate)
  const { values: v, set, touch, err } = f

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.attempt()) return
    saveVehicle({ id: editing?.id, type: v.type, plate: v.plate.trim(), year: v.year.trim(), make: v.make.trim(), model: v.model.trim(), photo: v.photo, or: v.or, cr: v.cr })
    showSuccess(editing ? 'Vehicle profile updated successfully' : 'Vehicle profile created successfully')
    onClose()
  }

  return (
    <FormSheet title={editing ? 'Edit Vehicle' : 'Add Vehicle'} onClose={onClose}>
      <form noValidate onSubmit={submit} className="flex flex-col gap-[16px]">
        {!editing && (
          <SampleFill onClick={() => f.fill({ type: DEFAULT_VEHICLE_TYPE, plate: 'ABC 1234', year: '2020', make: 'Toyota', model: 'Vios', photo: SAMPLE_FILE('vehicle.svg'), or: SAMPLE_FILE('or.svg'), cr: SAMPLE_FILE('cr.svg') })} />
        )}
        <div className="flex flex-col gap-[6px]">
          <label className="mb-[8px] text-[12px] leading-[16px] text-[#737373]">Vehicle Type</label>
          <div className="flex flex-wrap gap-[6px]">
            {VEHICLE_TYPES.map((t) => {
              const on = v.type === t.label
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => set('type', t.label)}
                  className={`flex h-[40px] items-center gap-[10px] rounded-full border px-[12px] text-[12px] leading-[16px] font-medium transition-colors duration-150 ${
                    on ? 'border-[#f97316] bg-[#f97316] text-[#f8fafc]' : 'border-[#e5e5e5] text-[#737373] hover:bg-[#f8fafc]'
                  }`}
                >
                  <span className={`flex h-[40px] w-[32px] items-center justify-center p-[6px] ${on ? 'text-white' : 'text-[#8e8e93]'}`}>
                    <VehicleGlyph icon={t.icon} />
                  </span>
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <TextField label="Plate Number" required placeholder="ABC 1234" value={v.plate} onChange={(x) => set('plate', x)} onBlur={() => touch('plate')} error={err('plate')} />

        <div className="grid grid-cols-2 gap-[8px]">
          <TextField label="Year" required inputMode="numeric" placeholder="e.g. 2015" value={v.year} onChange={(x) => set('year', x.replace(/[^\d]/g, '').slice(0, 4))} onBlur={() => touch('year')} error={err('year')} />
          <TextField label="Make / Brand" required placeholder="e.g. Toyota" value={v.make} onChange={(x) => set('make', x)} onBlur={() => touch('make')} error={err('make')} />
        </div>

        <TextField label="Model" required placeholder="e.g. Fortuner, Montero" value={v.model} onChange={(x) => set('model', x)} onBlur={() => touch('model')} error={err('model')} />

        <div className="flex flex-col gap-[8px]">
          <UploadField label="Vehicle Photo" prompt="Upload Vehicle photo" value={v.photo} onChange={(x) => set('photo', x)} error={err('photo')} />
          <UploadField label="Official Receipt (OR)" prompt="Upload OR" value={v.or} onChange={(x) => set('or', x)} error={err('or')} />
          <UploadField label="Certificate of Registration" prompt="Upload CR" value={v.cr} onChange={(x) => set('cr', x)} error={err('cr')} />
        </div>
        <SubmitButton disabled={Boolean(editing) && !f.dirty}>{editing ? 'Save Changes' : 'Add Vehicle'}</SubmitButton>
      </form>
    </FormSheet>
  )
}
