import type { ButtonHTMLAttributes } from 'react'

// Live Home: 44px white circle, 1px #f8fafc border, 18px orange swap icon.
export default function SwapButton({ className = '', disabled, onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label="Swap origin and destination"
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={`flex size-[44px] items-center justify-center rounded-full border border-[#f8fafc] bg-white shadow-swap ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      {...props}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5.5 3.5L5.5 14.5C5.5 18.2133 8.18503 21 12 21" />
        <path d="M18.5 20.5L18.5 9.5C18.5 5.78672 15.815 3 12 3" />
        <path d="M21 18C21 18 19.1588 20.5 18.5 20.5C17.8412 20.5 16 18 16 18" />
        <path d="M8 5.50022C8 5.50022 6.15878 3.00025 5.49998 3.00024C4.84118 3.00024 3 5.50024 3 5.50024" />
      </svg>
    </button>
  )
}
