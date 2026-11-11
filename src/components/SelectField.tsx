import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  /** Chosen value; empty shows the placeholder. */
  value?: string
  placeholder?: string
  /** From/To show a chevron; Travel date has none (as on live). */
  chevron?: boolean
  /** Not selectable yet (live: "To" until an origin is chosen). Visual stays the same; clicks are ignored. */
  locked?: boolean
}

// Live Home field: 66.5px tall, radius 12, 1px #f2f2f2 border, white/85 + blur, label 11px #8e8e93, value 16px.
export default function SelectField({ label, value, placeholder, chevron = true, locked, className = '', onClick, ...props }: Props) {
  return (
    <button
      type="button"
      aria-disabled={locked || undefined}
      onClick={locked ? undefined : onClick}
      className={`relative flex w-full flex-col rounded-12 border border-[#f2f2f2] bg-white/85 px-4 py-3 text-left backdrop-blur-[12px] ${
        locked ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      {...props}
    >
      <span className="text-[11px] leading-[16.5px] font-medium text-[#8e8e93]">{label}</span>
      {value ? (
        <span className="text-[16px] leading-[24px] font-medium text-[#262626]">{value}</span>
      ) : (
        <span className="text-[16px] leading-[24px] font-normal text-[#a3a3a3]">{placeholder}</span>
      )}
      {chevron && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="absolute top-1/2 right-4 -translate-y-1/2 text-[#a3a3a3]" aria-hidden>
          <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
