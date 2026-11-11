import { useNavigate } from 'react-router'
import { PRIVACY, TERMS, type LegalSection } from '../../data/settings'
import FadeIn from './FadeIn'
import { ChevronLeft } from './icons'

// Live: /privacy and /terms — fixed overlay (bg-slate-50), white header, one white card per section.
export default function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const navigate = useNavigate()
  const sections: LegalSection[] = kind === 'privacy' ? PRIVACY : TERMS
  const ul = kind === 'privacy' ? 'space-y-[8px]' : 'space-y-[4px]'
  return (
    <FadeIn className="flex h-[calc(var(--screen-vh)*100)] flex-col overflow-hidden bg-[#f8fafc]">
      <header className="flex shrink-0 items-center gap-[12px] bg-white p-[16px]">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)} className="flex size-[40px] shrink-0 items-center justify-center rounded-full border border-[#f1f5f9] text-[#334155] transition-transform active:scale-95">
          <ChevronLeft size={16} />
        </button>
        <h1 className="text-[16px] leading-[24px] font-medium text-text-primary">{kind === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-[20px] pb-[48px] [scrollbar-width:none]">
        {sections.map((s) => (
          <div key={s.title} className="mb-[12px] rounded-16 border border-[#f1f5f9] bg-white p-[20px] shadow-sm">
            <h3 className="mb-[8px] text-[12px] leading-[16px] font-bold tracking-[0.6px] text-[#f97316] uppercase">{s.title}</h3>
            {s.blocks.map((b, i) =>
              'p' in b ? (
                <p key={i} className="mb-[8px] text-[14px] leading-[22.75px] text-[#475569] last:mb-0 [&_a]:text-[#f97316] [&_strong]:font-bold [&_strong]:text-[#334155]" dangerouslySetInnerHTML={{ __html: b.p }} />
              ) : (
                <ul
                  key={i}
                  className={`${ul} pl-[20px] text-[14px] text-[#475569] ${b.ul === 'alpha' ? 'list-[lower-alpha]' : 'list-disc'} [&_strong]:font-bold [&_strong]:text-[#334155]`}
                >
                  {b.items.map((it, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
                  ))}
                </ul>
              ),
            )}
          </div>
        ))}
      </div>
    </FadeIn>
  )
}
