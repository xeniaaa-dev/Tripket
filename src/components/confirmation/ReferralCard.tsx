import { useEffect, useState } from 'react'
import { REFERRAL } from '../../data/policy'
import { Glyph } from './IconRows'

// Companion referral ("Give ₱50, get ₱50") on the booking confirmation: headline, the code and a Copy button. Not in Figma yet.

function useCopy() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])
  const copy = async (text = REFERRAL.code) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* clipboard blocked: the code is still on screen */
    }
    setCopied(true)
  }
  return { copied, copy }
}

export default function ReferralCard() {
  const { copied, copy } = useCopy()
  return (
    <section aria-label="Invite a travel buddy" className="mt-[16px] w-full rounded-16 border-[0.5px] border-[#fed7aa] bg-[#fff7ed] p-[14px]">
      <div className="flex items-center gap-[12px]">
        <span className="flex size-[40px] shrink-0 items-center justify-center rounded-12 bg-white text-[#f97316] shadow-[0_1px_2px_rgba(249,115,22,0.12)]">
          <Glyph name="gift" size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] leading-[20px] font-bold text-[#1c1917]">
            Give {REFERRAL.give}, get {REFERRAL.get}
          </p>
          <p className="text-[12px] leading-[17px] text-[#78716c]">You both get {REFERRAL.get} when a friend books their first trip.</p>
        </div>
      </div>
      <div className="mt-[12px] flex gap-[8px]">
        <div className="flex h-[40px] min-w-0 flex-1 items-center rounded-[10px] border border-dashed border-[#fdba74] bg-white px-[12px]">
          <span className="truncate text-[13px] font-bold tracking-[0.5px] text-[#1c1917]">{REFERRAL.code}</span>
        </div>
        <button
          type="button"
          onClick={() => copy()}
          aria-live="polite"
          aria-label={copied ? 'Code copied' : `Copy code ${REFERRAL.code}`}
          className={`flex h-[40px] min-w-[96px] shrink-0 items-center justify-center gap-[6px] rounded-[10px] px-[16px] text-[13px] font-bold transition-colors active:scale-[0.97] ${copied ? 'bg-[#e9f9ee] text-[#16a34a]' : 'bg-[#f97316] text-white'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {copied ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" /></>}
          </svg>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </section>
  )
}
