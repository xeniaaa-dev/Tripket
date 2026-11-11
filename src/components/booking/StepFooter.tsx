import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  /** optional line above the button (e.g. a validation hint) */
  note?: ReactNode
  /** list-style footer (step 2 on live): no top border, a white fade above it, 24px bottom padding */
  fade?: boolean
}

const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3.5 10.5 8 6 12.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Live app: white bar pinned to the bottom of the column, 16px padding, full-width 56px button (#f97316, 16px radius).
export default function StepFooter({ children, note, fade, className = '', ...props }: Props) {
  return (
    <div
      className={`sticky bottom-0 z-10 bg-white px-[16px] pt-[16px] ${fade ? 'pb-[24px]' : 'border-t border-[#f0f0f0] pb-[16px]'}`}
    >
      {fade && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full h-[24px] bg-gradient-to-t from-white to-transparent" />}
      {note}
      <button
        type="button"
        className={`flex h-[56px] w-full items-center justify-center gap-[8px] rounded-16 bg-[#f97316] disabled:opacity-50 ${className}`}
        {...props}
      >
        <span className="text-[16px] leading-[24px] font-semibold tracking-[-0.2px] text-white">{children}</span>
        <Chevron />
      </button>
    </div>
  )
}
