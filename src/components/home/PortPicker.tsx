import { useEffect, useMemo, useState } from 'react'
import type { Port } from '../../data/ports'
import ScheduleSheet from '../schedule/ScheduleSheet'
import { Time02 } from './icons'

type Props = {
  open: boolean
  title: string
  ports: Port[]
  /** "Recent Ports" section; omitted for a first-time visitor (live shows it from localStorage) */
  recent?: Port[]
  selected?: string
  onSelect: (port: Port) => void
  onClose: () => void
}

// "Select Origin" / "Select Destination" sheet — the live app's drawer (book.tripket.ph): full-height drawer with a grab
// handle and round close button, title, grey rounded search (300ms debounce), "ALL PORTS" and a list of rounded rows.
// Port data is ours (name + terminal · province); live's rows show name + "city · province".
export default function PortPicker({ open, title, ports, recent = [], selected, onSelect, onClose }: Props) {
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
  const pick = (p: Port) => {
    setQuery('')
    setDebounced('')
    onSelect(p)
  }

  const all = useMemo(() => {
    const q = debounced.toLowerCase()
    return q ? ports.filter((p) => [p.city, p.terminal, p.province].some((s) => s.toLowerCase().includes(q))) : ports
  }, [ports, debounced])
  const recents = debounced ? [] : recent

  return (
    <ScheduleSheet open={open} onClose={close} label={title} fullHeight>
      <div className="shrink-0">
        <h2 className="text-[20px] leading-[28px] font-bold text-[#1d293d]">{title}</h2>
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
          {recents.length > 0 && (
            <>
              <div className="mb-[8px] flex items-center gap-[6px] text-[12px] leading-[16px] tracking-[0.6px] text-[#a1a1a1] uppercase">
                <Time02 />
                Recent Ports
              </div>
              {recents.map((p) => (
                <Row key={`recent-${p.code}`} port={p} onClick={() => pick(p)} />
              ))}
              <div className="my-[8px] border-t border-[#f1f5f9]" />
            </>
          )}
          <div className="mb-[8px] text-[12px] leading-[16px] tracking-[0.6px] text-[#a1a1a1] uppercase">All Ports</div>
          {all.map((p) => (
            <Row key={p.code} port={p} selected={p.code === selected} onClick={() => pick(p)} />
          ))}
          {all.length === 0 && <div className="py-[40px] text-center text-[14px] text-[#90a1b9]">{`No ports found for "${query}"`}</div>}
        </div>
      </div>
    </ScheduleSheet>
  )
}

// live port row: 12px padding, 16px radius, name 16/22.88 semibold + 12px grey sub-line; selected = orange tint
function Row({ port, selected, onClick }: { port: Port; selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full cursor-pointer items-center gap-[12px] rounded-[16px] p-[12px] text-left transition-colors duration-150 hover:bg-[#fff7ed] ${
        selected ? 'bg-[#fff7ed]' : 'border border-transparent'
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className={`block text-[16px] leading-[22.88px] font-semibold ${selected ? 'text-[#f97316]' : 'text-[#262626]'}`}>{port.city}</span>
        <span className="block truncate text-[12px] leading-[16px] text-[#a1a1a1]">
          {port.terminal} · {port.province}
        </span>
      </span>
    </button>
  )
}
