import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import uploadIcon from '../../assets/live/passengers/image-upload.svg'
import type { FileRef as UploadValue } from '../../data/passengers'
import { ChevronDownIcon, CloseIcon } from './icons'

// Form controls of the live saved-profile sheets (book.tripket.ph), styles from computed values.

const ERROR_TEXT = 'text-[12px] leading-[16px] text-[#fb2c36]'
export const Required = () => <span className="text-[#ff383c]"> *</span>

export function FieldError({ children }: { children?: string | false | null }) {
  return children ? <p className={`mt-[4px] ${ERROR_TEXT}`}>{children}</p> : null
}

/** Text input (live TextInput): 12px grey label with mb-2, 50px white box, 1px slate-100 border, 12px radius, 16px text. */
export function TextField({
  label,
  required,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  inputMode,
  className = '',
}: {
  label: string
  required?: boolean
  placeholder: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  error?: string | false | null
  disabled?: boolean
  inputMode?: 'numeric' | 'text'
  className?: string
}) {
  const id = useId()
  return (
    <div className={`flex flex-col gap-[4px] ${disabled ? 'opacity-50' : ''} ${className}`}>
      <label htmlFor={id} className="mb-[8px] text-[12px] leading-[16px] text-[#8e8e93]">
        {label}
        {required && <Required />}
      </label>
      <div className="rounded-12 border border-[#f1f5f9] bg-white transition-[border-color,box-shadow] duration-150">
        <input
          id={id}
          value={value}
          disabled={disabled}
          inputMode={inputMode}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="h-[48px] w-full bg-transparent px-[12px] py-[8px] text-[16px] leading-[24px] text-[#18181b] outline-none placeholder:text-[#a1a1a1]"
        />
      </div>
      {error && <p className={ERROR_TEXT}>{error}</p>}
    </div>
  )
}

/** Pill chips (Passenger Type): h-10 px-5, 13px/500; selected orange fill + shadow-sm, others #efefef border grey text. */
export function Chip({ selected, onClick, children, className = 'h-[40px] gap-[8px] px-[20px] py-[8px] text-[13px]' }: { selected: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center rounded-full border font-medium transition-colors duration-150 ${className} ${
        selected ? 'border-[#f97316] bg-[#f97316] text-[#fafafa] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]' : 'border-[#efefef] text-[#8e8e93] hover:bg-[#f8fafc]'
      }`}
    >
      {children}
    </button>
  )
}

function useOutside(ref: React.RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && close()
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [ref, open, close])
}

const POPOVER = 'absolute z-20 w-full overflow-y-auto bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06),0_-6px_12px_rgba(0,0,0,0.03),0_14px_28px_rgba(0,0,0,0.08)]'

/**
 * Searchable combobox (City/Municipality, Nationality). Focus/open: orange-300 border + orange/15 ring; clear (×) button when filled.
 * Options popover: white, 24px radius, 12px padding, 16px-radius rows.
 */
export function ComboBox({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  options,
  error,
  radius,
  clearable,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  options: { value: string; label: string; sub?: string }[]
  error?: string | false | null
  radius: 12 | 16
  clearable?: boolean
}) {
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string | null>(null) // null = not typing, show the selected value
  const close = () => {
    if (!open) return
    setOpen(false)
    setQuery(null)
    onBlur?.()
  }
  useOutside(wrap, open, close)
  const selected = options.find((o) => o.value === value)
  const text = query ?? selected?.label ?? ''
  const q = (query ?? '').trim().toLowerCase()
  const shown = options.filter((o) => !q || o.label.toLowerCase().includes(q)).slice(0, 60)
  const pick = (v: string) => {
    onChange(v)
    setOpen(false)
    setQuery(null)
    onBlur?.()
  }
  const border = error ? 'border-[#fb2c36]/50' : open ? 'border-[#ffb86a] ring-2 ring-[#ff6900]/15' : radius === 16 ? 'border-[#f5f5f5]' : 'border-[#f1f5f9]'
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex flex-col gap-[4px]">
        <label htmlFor={id} className="text-[12px] leading-[20px] text-[#737373]">
          {label}
          <Required />
        </label>
        <div ref={wrap} className="relative">
          <input
            id={id}
            role="combobox"
            aria-expanded={open}
            autoComplete="off"
            value={text}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation()
                close()
              }
              if (e.key === 'Enter' && shown[0]) {
                e.preventDefault()
                pick(shown[0].value)
              }
            }}
            className={`h-[48px] w-full border bg-white py-[8px] pr-[56px] pl-[12px] text-[16px] leading-[24px] text-[#18181b] transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-[#a1a1a1] ${radius === 16 ? 'rounded-16' : 'rounded-12'} ${border}`}
          />
          {(clearable ? Boolean(text) : Boolean(query)) && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                onChange('')
                setQuery('')
              }}
              className={`absolute top-[6px] right-[32px] flex size-[36px] items-center justify-center rounded-[24px] p-[4px] text-[#90a1b9] ${open ? 'bg-[#ebebec]' : ''}`}
            >
              <CloseIcon size={12} />
            </button>
          )}
          <button type="button" tabIndex={-1} aria-label="Show options" onClick={() => setOpen((o) => !o)} className="absolute top-0 right-0 flex h-[48px] w-[40px] items-center justify-center px-[12px] text-[#90a1b9]">
            <ChevronDownIcon className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div role="listbox" className={`${POPOVER} top-[56px] max-h-[300px] rounded-[24px] p-[12px]`}>
              {shown.length === 0 && <div className="px-[10px] py-[6px] text-[14px] text-[#a1a1a1]">No results found</div>}
              {shown.map((o) => (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => pick(o.value)}
                  className="flex cursor-pointer items-center justify-between gap-[12px] rounded-16 px-[10px] py-[6px] text-[14px] leading-[20px] text-black hover:bg-[#f5f5f5]"
                >
                  <div>
                    <span className="block">{o.label}</span>
                    {o.sub && <span className="block text-[10px] leading-[14px] text-[#a1a1a1]">{o.sub}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <p className={ERROR_TEXT}>{error}</p>}
    </div>
  )
}

/** ID Type select (HeroUI Select): 48px, 16px radius, neutral-100 border; popover list of 36px rows with 12px radius. */
export function SelectField({ label, placeholder, value, onChange, options }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  useOutside(wrap, open, () => setOpen(false))
  return (
    <div className="flex flex-col gap-[4px]">
      <span className="text-[12px] leading-[20px] text-[#737373]">{label}</span>
      <div ref={wrap} className="relative flex w-full items-center">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`flex min-h-[48px] w-full items-center justify-between rounded-16 border bg-white py-[8px] pr-[40px] pl-[16px] text-left text-[14px] transition-[border-color,box-shadow] duration-150 ${open ? 'border-[#ffb86a] ring-2 ring-[#ff6900]/15' : 'border-[#f5f5f5]'}`}
        >
          {value ? <span className="text-[14px] text-[#262626]">{value}</span> : <span className="text-[16px] font-light text-[#a1a1a1]">{placeholder}</span>}
          <ChevronDownIcon className={`absolute right-[9px] text-[#71717a] transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </button>
        {value && (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={() => onChange('')}
            className="absolute right-[36px] z-10 flex size-[32px] items-center justify-center rounded-full text-[#90a1b9] hover:bg-[#f1f5f9] hover:text-[#45556c]"
          >
            <CloseIcon />
          </button>
        )}
        {open && (
          <div role="listbox" className={`${POPOVER} top-[56px] max-h-[420px] rounded-16 border border-[#e5e5e5] p-[4px] shadow-lg`}>
            {options.map((o) => (
              <div
                key={o}
                role="option"
                aria-selected={o === value}
                onClick={() => {
                  onChange(o)
                  setOpen(false)
                }}
                className="flex h-[36px] cursor-pointer items-center justify-between rounded-12 p-[8px] text-[14px] leading-[20px] text-black hover:bg-[#f5f5f5]"
              >
                {o}
                {o === value && <span className="size-[6px] rounded-full bg-[#18181b]" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Birthdate (React Aria DateField look): MM / DD / YYYY segments in a 48px box; hint below. Value: "YYYY-MM-DD" when complete, else partial parts. */
export function DateField({
  label,
  parts,
  onChange,
  onBlur,
  error,
}: {
  label: string
  parts: [string, string, string]
  onChange: (p: [string, string, string]) => void
  onBlur: () => void
  error?: string | false | null
}) {
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const seg = [
    { ph: 'MM', len: 2, w: 'w-[29px]' },
    { ph: 'DD', len: 2, w: 'w-[24px]' },
    { ph: 'YYYY', len: 4, w: 'w-[42px]' },
  ]
  const group = useRef<HTMLDivElement>(null)
  // Typed or pasted digits fill this segment, overflow spills into the next ones (like the live DateField auto-advance).
  const set = (i: number, raw: string) => {
    let digits = raw.replace(/\D/g, '')
    const next = [...parts] as [string, string, string]
    let j = i
    next[j] = digits.slice(0, seg[j].len)
    digits = digits.slice(seg[j].len)
    while (digits && j < 2) {
      j++
      next[j] = digits.slice(0, seg[j].len)
      digits = digits.slice(seg[j].len)
    }
    onChange(next)
    if (next[j].length === seg[j].len && j < 2) refs[j + 1].current?.focus()
    else refs[j].current?.focus()
  }
  return (
    <div className="flex flex-col gap-[4px]">
      <div>
        <p className="text-[12px] leading-[16px] text-[#737373]">
          {label}
          <Required />
        </p>
        <div className="mt-[8px] flex flex-col gap-[4px]">
          <div
            ref={group}
            role="group"
            onBlur={(e) => !group.current?.contains(e.relatedTarget as Node) && onBlur()}
            onClick={(e) => e.target === e.currentTarget && refs[parts.findIndex((p, i) => p.length < seg[i].len) === -1 ? 2 : parts.findIndex((p, i) => p.length < seg[i].len)].current?.focus()}
            className={`flex h-[48px] items-center gap-[1px] rounded-12 border bg-white px-[12px] py-[8px] transition-[border-color,box-shadow] duration-150 focus-within:border-[#ffb86a] focus-within:ring-2 focus-within:ring-[#ff6900]/15 ${error ? 'border-[#fb2c36]/50' : 'border-[#f1f5f9]'}`}
          >
            {seg.map((s, i) => (
              <span key={s.ph} className="flex items-center">
                {i > 0 && <span className="px-[2px] text-[16px] leading-[24px] text-[#1d293d]">/</span>}
                <input
                  ref={refs[i]}
                  inputMode="numeric"
                  aria-label={s.ph}
                  value={parts[i]}
                  placeholder={s.ph}
                  onChange={(e) => set(i, e.target.value)}
                  onKeyDown={(e) => e.key === 'Backspace' && !parts[i] && i > 0 && refs[i - 1].current?.focus()}
                  className={`${s.w} rounded-4 bg-transparent p-[2px] text-center text-[16px] leading-[20px] text-[#18181b] outline-none placeholder:text-[14px] placeholder:text-[#a1a1a1] focus:bg-[#fff7ed]`}
                />
              </span>
            ))}
          </div>
          {error && <p className={ERROR_TEXT}>{error}</p>}
        </div>
      </div>
      <span className="px-[4px] text-[10px] leading-[14.3px] text-[#a1a1a1]">e.g. 04/27/1998</span>
    </div>
  )
}

/** Male / Female segmented toggle: neutral-100 track, 16px radius, 56px white selected pill. */
export function GenderToggle({ value, onChange }: { value: string; onChange: (v: 'male' | 'female') => void }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="mb-[8px] text-[12px] leading-[16px] text-[#737373]">
        Gender <span className="text-[#ff383c]">*</span>
      </label>
      <div className="flex gap-[4px] rounded-16 bg-[#f5f5f5] p-[4px]">
        {(['male', 'female'] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            className={`h-[56px] flex-1 rounded-12 py-[10px] text-[14px] leading-[20px] capitalize transition-all duration-150 ${
              value === g ? 'bg-white font-medium text-[#262626] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]' : 'font-normal text-[#a1a1a1] hover:text-[#525252]'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}


/** Dashed upload tile: slate-50 fill, 2px dashed slate-300 border, 8px radius; red-50 / red-300 when invalid. */
export function UploadField({ label, prompt, value, onChange, error }: { label: string; prompt: string; value: UploadValue; onChange: (v: UploadValue) => void; error?: string | false | null }) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <div>
      <label className="block pb-[8px] text-[12px] leading-[16px] text-[#737373]">
        {label} <span className="text-[#fb2c36]">*</span>
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
        className={`relative cursor-pointer overflow-hidden rounded-[8px] border-2 border-dashed p-[20px] text-center ${error ? 'border-[#ffa2a2] bg-[#fef2f2]' : 'border-[#cad5e2] bg-[#f8fafc]'}`}
      >
        <div className="py-[8px]">
          {value?.url ? (
            <img alt="" src={value.url} className="mx-auto mb-[8px] h-[30px] w-[30px] rounded-[4px] object-cover" />
          ) : (
            <img alt="" src={uploadIcon} className="mx-auto mb-[8px] size-[30px]" />
          )}
          <p className="truncate text-[12px] leading-[16px] font-medium text-[#1d293d]">{value ? value.name : prompt}</p>
          <p className="mt-[4px] text-[11px] leading-[15.73px] text-[#8e8e93]">{value ? 'Tap to replace' : 'JPEG, JPG, PNG, HEIC, PDF (max 5MB)'}</p>
        </div>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onChange({ name: f.name, url: f.type.startsWith('image/') ? URL.createObjectURL(f) : '' })
          }}
        />
      </div>
      {error && <p className="text-[14px] leading-[20px] text-[#fb2c36]">{error}</p>}
    </div>
  )
}

/** Orange 56px submit button at the end of the form (font-extrabold, orange/25 shadow, 0.98 press); 16px above it comes from the form gap. */
export function SubmitButton({ disabled, children }: { disabled?: boolean; children: ReactNode }) {
  return (
    <div>
      <button
        type="submit"
        disabled={disabled}
        className="h-[56px] w-full rounded-16 bg-[#f97316] px-[16px] text-[14px] leading-[20px] font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(255,105,0,0.25),0_4px_6px_-4px_rgba(255,105,0,0.25)] transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {children}
      </button>
    </div>
  )
}
