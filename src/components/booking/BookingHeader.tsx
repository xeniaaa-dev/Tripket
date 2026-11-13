import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking } from '../../booking/BookingContext'
import { FLOW_SCREENS, prevPath, stepOf, type Screen } from '../../booking/flows'

// Live flow (book.tripket.ph) has 4 steps (Figma labels say "of 5" because of a removed Add-ons step); Rebook has 2, Return trip 3.

// Live app (book.tripket.ph): fluid header — 32px back button at y=24, 18px title, 3px progress segments with a "n of 4" label, 1px bottom border.
// Moving forward one step fills the new segment 0 → 100% (500ms, ease-in-out). Entering step 1 or going back doesn't animate.
let lastStep = 0

export default function BookingHeader({ title, screen, onBack }: { title: string; screen: Screen; onBack?: () => void }) {
  const navigate = useNavigate()
  const { flow } = useBooking().booking
  const step = stepOf(flow, screen)
  const total = FLOW_SCREENS[flow].length
  // Live: all booking steps are one page, so browser Back leaves the booking; the header Back steps back one screen
  // (replacing history, not adding to it), and Back on step 1 returns to Home.
  const goBack = () => {
    const prev = prevPath(flow, screen)
    if (prev) navigate(prev, { replace: true })
    else if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate('/', { replace: true })
  }
  const [fillIn] = useState(() => step > 1 && lastStep === step - 1)
  useEffect(() => {
    lastStep = step
  }, [step])
  return (
    <div className="border-b border-[#f0f0f0] bg-white px-[16px] pt-[24px] pb-[12px]">
      <div className="flex items-center gap-[12px]">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack ?? goBack}
          className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-[#e5e5ea] bg-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3.5 5.5 8l4.5 4.5" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[18px] leading-[28px] font-semibold text-[#171717]">{title}</h1>
      </div>
      <div className="mt-[12px] flex h-[15px] items-center gap-[8px]">
        <div className="flex flex-1 items-center gap-[8px]">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-[#e5e5ea]">
              {i < step && (
                <span
                  className="block h-full rounded-full bg-[#f97316]"
                  style={i === step - 1 && fillIn ? { animation: 'progress-fill 500ms cubic-bezier(0.4, 0, 0.2, 1) backwards' } : undefined}
                />
              )}
            </span>
          ))}
        </div>
        <p className="text-[10px] leading-[15px] text-[#8e8e93]">
          {step} of {total}
        </p>
      </div>
    </div>
  )
}
