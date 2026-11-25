import { useEffect, useMemo, useState } from 'react'
import { departuresFor, filterDepartures, LOAD_MS, type DayKey, type DayOption, type Departure, type ScheduleFilter } from '../../data/schedule'
import EmptyPage from './EmptyPage'
import { Spinner, TicketSkeletonList } from './Loading'
import ScheduleRow from './ScheduleRow'

type Props = {
  day: DayOption
  filter: ScheduleFilter
  now: number
  onTotal: (key: DayKey, total: number) => void
  onBook: (d: Departure) => void
  /** the next sailing today (gets nextRef, for the "Next trip" pill) */
  nextId?: string
  nextRef?: (el: HTMLElement | null) => void
}

// One day of sailings ("Jul 24  Today"), as one bordered list with a row per sailing (user's reference design).
// Each day still "fetches" (skeleton for LOAD_MS) on a new filter.
export default function DaySection({ day, filter, now, onTotal, onBook, nextId, nextRef }: Props) {
  const filterKey = `${filter.origin?.id}-${filter.vesselType}-${filter.operatorId}`
  const all = useMemo(() => filterDepartures(departuresFor(day.key), filter).sort((a, b) => a.departure.getTime() - b.departure.getTime()), [day.key, filter])

  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const loading = loadedKey !== filterKey
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoadedKey(filterKey), LOAD_MS)
    return () => clearTimeout(t)
  }, [loading, filterKey])

  const total = loading ? 0 : all.length
  useEffect(() => onTotal(day.key, total), [day.key, total, onTotal])

  return (
    <div>
      <div className="flex items-center justify-between py-[10px]">
        <p className="flex items-baseline gap-[6px] text-[15px] leading-[20px] font-bold text-[#1c1917]">
          {day.sub} <span className="font-semibold text-[#5e5d5f]">{day.label}</span>
        </p>
        {loading && <Spinner />}
      </div>

      <div className="pb-[16px]">
        {loading && <TicketSkeletonList count={2} />}
        {!loading && all.length > 0 && (
          <div className="divide-y divide-[#f2f2f7] overflow-hidden rounded-[16px] border border-[#e5e5ea] bg-white">
            {all.map((d) => (
              <ScheduleRow key={d.id} d={d} now={now} onBook={onBook} rowRef={d.id === nextId ? nextRef : undefined} />
            ))}
          </div>
        )}
        {!loading && all.length === 0 && <EmptyPage title="No trips available" description={`There are no scheduled sailings for ${day.label.toLowerCase()}.`} />}
      </div>
    </div>
  )
}
