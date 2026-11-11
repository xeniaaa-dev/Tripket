import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft } from '../icons'

// Shared frame of the email / verification steps (Figma 01, 01b, 02, 03): back button, title, content, CTA pinned to the bottom, terms line.
export default function Step({ title, cta, enabled, onSubmit, children }: { title: string; cta: string; enabled: boolean; onSubmit: () => void; children: ReactNode }) {
  const navigate = useNavigate()
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (enabled) onSubmit()
      }}
      className="animate-page-enter flex min-h-[calc(var(--screen-vh)*100)] flex-col bg-white px-[24px] pt-[34px] pb-[46px]"
    >
      <button type="button" aria-label="Back" onClick={() => navigate(-1)} className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-border-default text-text-primary">
        <ChevronLeft size={24} />
      </button>
      <h1 className="mt-[38px] text-[28px] leading-[36px] font-medium text-text-primary">{title}</h1>
      <div className="min-h-0 flex-1">{children}</div>
      <button
        type="submit"
        aria-disabled={!enabled}
        className={`h-[52px] w-full shrink-0 rounded-12 bg-[#f97316] text-[15px] leading-[22px] font-semibold text-white transition-opacity duration-150 ${enabled ? 'active:scale-[0.99]' : 'opacity-50'}`}
      >
        {cta}
      </button>
      <p className="mx-auto mt-[18px] w-[301px] shrink-0 text-center text-[12px] leading-[16px] text-text-secondary">By continuing, you agree to our Terms of Service and Privacy Policy</p>
    </form>
  )
}
