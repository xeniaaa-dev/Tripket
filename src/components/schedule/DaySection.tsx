import { useEffect, useMemo, useState } from 'react'
import arrowDown from '../../assets/live/schedule/arrow-down.svg'
import chevronDown from '../../assets/live/schedule/chevron-down-slate500.svg'
import chevronRight from '../../assets/live/schedule/chevron-right-slate400.svg'
import { departuresFor, filterDepartures, LOAD_MS, PAGE_SIZE, type DayKey, type DayOption, type ScheduleFilter } from '../../data/schedule'
import DepartureCard from './DepartureCard'
import EmptyPage from './EmptyPage'
import { Spinner, TicketSkeletonList } from './Loading'

type Props = {
  day: DayOption
  filter: ScheduleFilter
  expanded: boolean
  onToggle: () => void
  onTotal: (key: DayKey, total: number) => void
}

// One collapsible day group (live: "Nov 10  Today ⌄"). Like live, each day "fetches" whether expanded or not
// (so the header can show the selected day's total), 10 per page, and expanding/collapsing has no animation.
export default function DaySection({ day, filter, expanded, onToggle, onTotal }: Props) {
  const filterKey = `${filter.origin?.id}-${filter.vesselType}-${filter.operatorId}`
  const all = useMemo(() => filterDepartures(departuresFor(day.key), filter), [day.key, filter])

  // simulated request: a new filter = a new query → skeleton until the first page arrives
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const loading = loadedKey !== filterKey
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoadedKey(filterKey), LOAD_MS)
    return () => clearTimeout(t)
  }, [loading, filterKey])

  const [pages, setPages] = useState({ key: filterKey, n: 1 })
  const pageCount = pages.key === filterKey ? pages.n : 1
  const [loadingMore, setLoadingMore] = useState(false)
  const loadMore = () => {
    if (loadingMore) return
    setLoadingMore(true)
    setTimeout(() => {
      setPages({ key: filterKey, n: pageCount + 1 })
      setLoadingMore(false)
    }, LOAD_MS)
  }

  const total = loading ? 0 : all.length
  useEffect(() => onTotal(day.key, total), [day.key, total, onTotal])

  const shown = loading ? [] : all.slice(0, pageCount * PAGE_SIZE)
  const hasNext = shown.length < all.length

  return (
    <div className="overflow-hidden">
      <button type="button" onClick={onToggle} className="flex w-full cursor-pointer items-center justify-between py-[8px] text-left transition-colors">
        <div className="flex items-baseline gap-[8px]">
          <span className={`text-[14px] leading-[20px] font-semibold ${expanded ? 'text-[#1c1917]' : 'text-[#a1a1a1]'}`}>{day.sub}</span>
          <span className="text-[14px] leading-[20px] font-semibold text-[#a1a1a1]">{day.label}</span>
        </div>
        <div className="flex items-center gap-[8px]">
          {loading && <Spinner />}
          <img alt="" src={expanded ? chevronDown : chevronRight} className="size-[18px]" />
        </div>
      </button>

      {expanded && (
        <div className="space-y-[12px] pt-[4px] pb-[16px]">
          {loading && <TicketSkeletonList count={2} />}
          {!loading && shown.length > 0 && (
            <div className="space-y-[12px]">
              {shown.map((d) => (
                <DepartureCard key={d.id} d={d} />
              ))}
              {hasNext && (
                <div className="flex justify-center pt-[8px]">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[16px] bg-transparent px-[16px] text-[12px] leading-[16px] font-bold text-[#f54a00] transition-[background-color,transform] duration-100 hover:bg-[#fff7ed] active:scale-[0.97]"
                  >
                    {loadingMore ? (
                      <Spinner />
                    ) : (
                      <div className="flex items-center justify-center gap-[6px]">
                        <span>Show more departure</span>
                        <img alt="" src={arrowDown} className="size-[20px]" />
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          {!loading && shown.length === 0 && (
            <EmptyPage title="No trips available" description={`There are no scheduled sailings for ${day.label.toLowerCase()}.`} />
          )}
        </div>
      )}
    </div>
  )
}
