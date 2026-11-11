import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FAQS } from '../../data/settings'
import FadeIn from './FadeIn'
import { BackArrow, ChevronDown } from './icons'

// Live: full-screen overlay (fixed inset-0 bg-slate-50), passengers/partners tabs, independent accordions.
// Answer enters with fade + 4px slide-down over 150ms; chevron rotates 180deg over 200ms.
function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-[16px] p-[16px] text-left transition-colors duration-150 hover:bg-slate-50">
        <span className="text-[14px] leading-[19.25px] font-semibold text-[#1e293b]">{q}</span>
        <ChevronDown className={`shrink-0 text-[#94a3b8] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          ref={(el) => {
            el?.animate([{ opacity: 0, translate: '0 -4px' }, { opacity: 1, translate: '0 0' }], { duration: 150, easing: 'ease-out' })
          }}
          className="px-[16px] pb-[16px] text-[12px] leading-[19.5px] text-[#64748b]"
        >
          {a}
        </div>
      )}
    </div>
  )
}

export default function Faqs() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'passengers' | 'partners'>('passengers')
  return (
    <FadeIn className="flex h-[calc(var(--screen-vh)*100)] flex-col overflow-hidden bg-[#f8fafc]">
      <header className="flex shrink-0 items-center gap-[12px] border-b border-[#f1f5f9] bg-white p-[16px]">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)} className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-[#334155] transition-transform active:scale-95">
          <BackArrow />
        </button>
        <h2 className="text-[16px] leading-[20px] font-extrabold text-[#1e293b]">FAQs</h2>
      </header>
      <div className="shrink-0 border-b border-[#f1f5f9] bg-white px-[20px] pt-[16px] pb-[8px]">
        <div className="flex gap-[4px] rounded-16 bg-[#f1f5f9] p-[4px]">
          {([['passengers', 'For Passengers'], ['partners', 'For Shipping Line Partners']] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`flex-1 rounded-12 py-[8px] text-[12px] leading-[16px] font-bold transition-all ${tab === k ? 'bg-white text-[#f97316] shadow-sm' : 'text-[#64748b] hover:text-[#1e293b]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-[20px] pb-[48px] [scrollbar-width:none]">
        {FAQS[tab].map((s) => (
          <div key={s.title} className="mb-[24px]">
            <h4 className="mb-[10px] pl-[4px] text-[10px] leading-[15px] font-bold tracking-[1px] text-[#94a3b8] uppercase">{s.title}</h4>
            <div className="divide-y divide-[#f1f5f9] overflow-hidden rounded-[24px] border border-[#f1f5f9] bg-white shadow-sm">
              {s.items.map((i) => (
                <Item key={i.q} q={i.q} a={i.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  )
}
