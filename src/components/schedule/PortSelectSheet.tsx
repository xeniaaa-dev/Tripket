import { useEffect, useMemo, useState } from 'react'
import { schedulePorts, type SchedulePort } from '../../data/schedule'
import ScheduleSheet from './ScheduleSheet'

type Props = {
  open: boolean
  selected: SchedulePort | null
  onClose: () => void
  /** null = the selected port was tapped again (live clears the origin filter) */
  onSelect: (port: SchedulePort | null) => void
}

// Live PORT_SELECT_SHEET opened from "From: All" (field "origin", context "schedule").
// Search is debounced 300ms like live; tapping the selected port again clears it.
// (Live also shows a "Recent Ports" list from localStorage, which is empty for a fresh visitor — not rebuilt.)
export default function PortSelectSheet({ open, selected, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  const close = () => {
    onClose()
    setQuery('')
    setDebounced('')
  }

  const ports = useMemo(() => {
    const q = debounced.toLowerCase()
    return q ? schedulePorts.filter((p) => [p.name, p.city, p.province].some((s) => s.toLowerCase().includes(q))) : schedulePorts
  }, [debounced])

  return (
    <ScheduleSheet open={open} onClose={close} label="Select Origin" fullHeight>
      <div className="shrink-0">
        <h2 className="text-[20px] leading-[28px] font-bold text-[#1d293d]">Select Origin</h2>
        <div className="mt-[20px]">
          <input
            type="search"
            aria-label="search-port"
            placeholder="Search city, port or province"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[48px] w-full rounded-full bg-[#f8f8fa] px-[12px] py-[8px] text-[16px] leading-[24px] text-[#18181b] outline-none placeholder:text-[#a1a1a1] [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
      </div>
      <div className="-mx-[3px] mt-[8px] flex min-h-0 flex-1 flex-col overflow-y-auto p-[3px] pb-[24px] [scrollbar-width:none]">
        <div className="flex flex-col gap-[4px] px-[4px]">
          <div className="mb-[8px] text-[12px] leading-[16px] tracking-[0.6px] text-[#a1a1a1] uppercase">All Ports</div>
          {ports.map((p) => {
            const isSel = p.id === selected?.id
            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  close()
                  onSelect(isSel ? null : p)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    close()
                    onSelect(isSel ? null : p)
                  }
                }}
                className={`flex cursor-pointer items-center gap-[12px] rounded-[16px] p-[12px] transition-colors duration-150 hover:bg-[#fff7ed] ${
                  isSel ? 'bg-[#fff7ed]' : 'border border-transparent'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className={`text-[16px] leading-[22.88px] font-semibold ${isSel ? 'text-[#f97316]' : 'text-[#262626]'}`}>{p.name}</div>
                  <div className="truncate text-[12px] leading-[16px] text-[#a1a1a1]">
                    {p.city} · {p.province}
                  </div>
                </div>
              </div>
            )
          })}
          {ports.length === 0 && <div className="py-[40px] text-center text-[14px] text-[#90a1b9]">{`No ports found for "${query}"`}</div>}
        </div>
      </div>
    </ScheduleSheet>
  )
}
