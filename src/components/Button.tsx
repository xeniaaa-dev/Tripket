import type { ButtonHTMLAttributes } from 'react'

// Live Home primary button: 56px, radius 16, orange 3-stop gradient, orange glow; faded + not-allowed when disabled.
export default function Button({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#fb923c_0%,#f97316_50%,#ea580c_100%)] text-[16px] leading-[24px] font-medium tracking-[-0.4px] text-white shadow-lg shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18.5 12L4.99997 12" />
        <path d="M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6" />
      </svg>
    </button>
  )
}
