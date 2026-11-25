import type { ReactNode } from 'react'

// Shared "app list" look for the new cards (operator policy, before you board, referral):
// 36px rounded-12 orange-tint icon tile, 14px semibold title, 12px grey detail, hairline dividers — the same
// vocabulary as the Settings rows and the Leave sheet icon.

const PATHS = {
  calendarX: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M10 13l4 4M14 13l-4 4" />
    </>
  ),
  refund: (
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.6" />
      <path d="M4 4v4h4" />
      <path d="M12 8v8M14.5 9.5c-.4-.9-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2.1-.6-2.5-1.5" />
    </>
  ),
  bag: (
    <>
      <rect x="4" y="7.5" width="16" height="12.5" rx="2.5" />
      <path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M4 12.5h16" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  id: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 15.5c.6-1.3 1.7-2 3-2s2.4.7 3 2M14.5 10h3.5M14.5 13.5h3.5" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 17.5a4 4 0 1 1 .9-7.9A5.5 5.5 0 0 1 18.5 10.5a3.5 3.5 0 0 1-.5 7z" />
      <path d="M12 12v2.5M12 16.8v.2" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="2" />
      <path d="M3 9h18M12 9v11M12 9c-1.5-3.5-5.5-4-5.5-1.5S12 9 12 9zM12 9c1.5-3.5 5.5-4 5.5-1.5S12 9 12 9z" />
    </>
  ),
  ticket: (
    <>
      <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z" />
      <path d="M14 6v12" strokeDasharray="2 2" />
    </>
  ),
} as const

export type IconName = keyof typeof PATHS

export function Glyph({ name, size = 18, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[name]}
    </svg>
  )
}

export function IconTile({ name, tone = 'orange' }: { name: IconName; tone?: 'orange' | 'green' }) {
  return (
    <span className={`flex size-[36px] shrink-0 items-center justify-center rounded-12 ${tone === 'green' ? 'bg-[#e9f9ee] text-[#16a34a]' : 'bg-[#fff1e6] text-[#f97316]'}`}>
      <Glyph name={name} />
    </span>
  )
}

export function IconRow({ icon, title, detail, right }: { icon: IconName; title: ReactNode; detail?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-[12px] py-[12px]">
      <IconTile name={icon} />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-[20px] font-semibold text-[#1c1917]">{title}</p>
        {detail && <p className="mt-[1px] text-[12px] leading-[17px] text-[#8e8e93]">{detail}</p>}
      </div>
      {right}
    </div>
  )
}

/** White 20px-radius card with hairline-divided rows (Review & pay / confirmation card style). */
export function RowCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col divide-y-[0.5px] divide-border-default rounded-[20px] border-[0.5px] border-border-default bg-white px-[16px] ${className}`}>{children}</div>
}

/** Section label above a card: icon + 13px grey label (matches "Payment method" / "Contact details"). */
export function SectionLabel({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <div className="flex h-[19.5px] items-center gap-[8px] text-text-secondary">
      <Glyph name={icon} size={15} />
      <p className="text-[13px] leading-[19.5px] font-medium whitespace-nowrap">{children}</p>
    </div>
  )
}
