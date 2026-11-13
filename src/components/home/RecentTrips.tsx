import { Link } from 'react-router'
import car from '../../assets/figma/home/recent/car.svg'
import clock from '../../assets/figma/home/recent/clock.svg'
import chevron from '../../assets/figma/home/recent/greater-than.svg'
import line from '../../assets/figma/home/recent/line.svg'
import refresh from '../../assets/figma/home/recent/refresh.svg'
import users from '../../assets/figma/home/recent/user-multiple.svg'
import { parseBookingDate } from '../../booking/date'
import { findDeparture } from '../../data/departures'
import type { TicketView } from '../../data/tickets'

const short = (d: Date) => `${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}`
const LABEL: Partial<Record<TicketView['status'], string>> = { expired: 'Expired', refunded: 'Refunded', for_refund: 'For refund' }
const peso = (n: number) => `₱${n.toLocaleString('en-PH', { maximumFractionDigits: 2 })}`

const Stat = ({ icon, children }: { icon: string; children: string }) => (
  <div className="flex shrink-0 items-center gap-[4px]">
    <img alt="" src={icon} className="size-[12px]" />
    <p className="text-[11px] font-medium whitespace-nowrap text-[#8e8e93]">{children}</p>
  </div>
)

// Figma "Recent Trips" (Home, node 12328:9388 …) — copied: 12px radius, 1px #e5e5ea border, 16px padding, 9px gaps.
export default function RecentTrips({ trips, onRebook }: { trips: TicketView[]; onRebook: (t: TicketView) => void }) {
  return (
    <section className="space-y-[10px] pt-[12px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold tracking-[-0.4px] text-black">Recent Trips</h2>
        <Link to="/tickets" className="text-[13px] font-semibold tracking-[0.33px] text-[#f97316]">
          View all
        </Link>
      </div>
      <div className="flex flex-col gap-[8px]">
        {trips.map((t) => {
          const dep = findDeparture(t.booking.departureId)
          const { passengerCount: pax, vehicleCount: veh } = t.booking
          return (
            <div key={t.id} className="flex w-full flex-col items-start justify-center gap-[9px] overflow-clip rounded-[12px] border border-solid border-[#e5e5ea] p-[16px]">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-[9px]">
                  {dep && <img alt="" src={dep.logo} className="h-[20px] w-[19px] shrink-0 rounded-[4px] object-cover" />}
                  <p className="text-[13px] font-semibold tracking-[0.33px] whitespace-nowrap text-[#8e8e93]">{dep?.operator}</p>
                </div>
                <p className="text-[12px] font-medium whitespace-nowrap text-[#8e8e93]">{LABEL[t.status] ?? `Departed ${short(parseBookingDate(t.booking.date))}`}</p>
              </div>

              <div className="flex w-full items-center justify-between">
                <p className="text-[16px] font-bold tracking-[-0.4px] whitespace-nowrap text-[#1c1917]">
                  {t.booking.from.city} to {t.booking.to.city}
                </p>
                <button type="button" onClick={() => onRebook(t)} className="flex items-center justify-center gap-[2px] overflow-clip rounded-full bg-[#fff6eb] px-[8px] py-[4px]">
                  <img alt="" src={refresh} className="size-[10px]" />
                  <span className="text-[12px] font-medium text-[#f97316]">Rebook</span>
                </button>
              </div>

              {dep && (
                <div className="flex w-full items-center gap-[9px] text-[14px]">
                  <div className="flex items-center gap-[4px] whitespace-nowrap">
                    <p className="font-semibold text-[#1c1917]">{t.booking.from.code}</p>
                    <p className="font-medium text-[#8e8e93]">{dep.departTime}</p>
                  </div>
                  <img alt="" src={chevron} className="size-[12px] shrink-0" />
                  <div className="flex items-center gap-[4px] whitespace-nowrap">
                    <p className="font-semibold text-[#1c1917]">{t.booking.to.code}</p>
                    <p className="font-medium text-[#8e8e93]">{dep.arriveTime}</p>
                  </div>
                </div>
              )}

              <img alt="" src={line} className="block h-px w-full" />

              <div className="flex w-full items-center justify-between">
                <div className="flex items-start gap-[9px]">
                  <Stat icon={users}>{`${pax} passenger${pax === 1 ? '' : 's'}`}</Stat>
                  {veh > 0 && <Stat icon={car}>{`${veh} vehicle${veh === 1 ? '' : 's'}`}</Stat>}
                  {dep && <Stat icon={clock}>{dep.duration}</Stat>}
                </div>
                <p className="text-[12px] font-semibold whitespace-nowrap text-[#1c1917]">{peso(t.total)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
