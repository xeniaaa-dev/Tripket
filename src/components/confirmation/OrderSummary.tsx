import type { ReactNode } from 'react'
import call02 from '../../assets/figma/confirmation/call-02.svg'
import logoWave from '../../assets/figma/confirmation/logo-wave.svg'
import user1 from '../../assets/figma/confirmation/user-1.svg'
import user2 from '../../assets/figma/confirmation/user-2.svg'
import type { PassengerDetail, VehicleDetail } from '../../booking/BookingContext'
import { peso, type Trip } from '../../data/step-review'
import { Pieces } from '../icons'
import { PriceRows } from '../step-review/ReviewSections'
import { VanIcon } from '../step-review/icons'

/** user icon (node 11598:52612), #5e5d5f */
export const UserIcon = () => (
  <Pieces
    size={13.995}
    pieces={[
      { src: user1, at: '14.58% 29.17% 43.75% 29.17%', pad: '-7.5%' },
      { src: user2, at: '56.25% 20.83% 14.58% 20.84%', pad: '-10.71% -5.36%' },
    ]}
  />
)

export const Chip = ({ children, orange }: { children: string; orange?: boolean }) => (
  <span
    className={`overflow-clip rounded-[20px] px-[8px] py-[2px] text-[9px] font-semibold whitespace-nowrap ${orange ? 'w-[63.25px] bg-[#fff7ed] text-[#f97316]' : 'bg-[#ececec] text-[#8e8e93]'}`}
  >
    {children}
  </span>
)

/** One passenger / vehicle row (node 11598:52617) */
export function ItemRow({ title, chips, fare }: { title: string; chips: [string, string?]; fare: number | null }) {
  return (
    <div className="flex w-full items-center justify-between rounded-[8px] border-[0.5px] border-[#b4b4b4] px-[10.5px] py-[8.5px]">
      <div className="flex min-h-[34.5px] flex-col gap-[4px]">
        <p className="h-[15.25px] text-[14px] whitespace-nowrap text-[#1c1917]">{title}</p>
        <div className="flex items-center gap-[4px]">
          <Chip>{chips[0]}</Chip>
          {chips[1] && <Chip orange>{chips[1]}</Chip>}
        </div>
      </div>
      {fare === null ? (
        <span className="rounded-[20.593px] bg-[#d7ffe1] px-[8.237px] py-[2.059px] text-[11px] leading-[16.5px] font-semibold text-[#34c759]">Free</span>
      ) : (
        <p className="text-[14px] leading-[21px] whitespace-nowrap text-black">{peso(fare)}</p>
      )}
    </div>
  )
}

type Props = {
  trip: Trip
  from: { code: string; city: string }
  to: { code: string; city: string }
  departDate: string
  arriveDate: string
  passengers: PassengerDetail[]
  vehicles: VehicleDetail[]
  subtotal: number
  serviceFee: number
  total: number
  /** "Total amount paid" (default) / "Total amount due" … */
  totalLabel?: string
  /** replaces the passengers / vehicles / price sections (per-line ticket blocks, refund details, …) */
  children?: ReactNode
}

// Figma: "OrderSummary" (node 11598:52550) inside the OJ - PROCESSING card
export default function OrderSummary({ trip, from, to, departDate, arriveDate, passengers, vehicles, subtotal, serviceFee, total, totalLabel = 'Total amount paid', children }: Props) {
  return (
    <div className="flex flex-col px-[16px] pt-[8px] pb-[16px]">
      {/* UpcomingCard (node 11598:52551) */}
      <div className="flex flex-col gap-[8px] px-[8px]">
        <div className="flex items-start gap-[12px]">
          {trip.logo ? (
            <img alt={trip.operator} src={trip.logo} className="size-[37.995px] shrink-0 rounded-[8px] object-contain" />
          ) : (
            <div
              className="relative size-[37.995px] shrink-0 overflow-clip rounded-[8px] shadow-[0px_1px_3px_0px_rgba(46,125,50,0.25)]"
              style={{ backgroundImage: 'linear-gradient(145deg, rgb(46, 125, 50) 6.1733%, rgb(27, 94, 32) 93.827%)' }}
            >
              <img alt="" src={logoWave} className="absolute top-[33.01px] left-0 h-[4.985px] w-[37.995px]" />
              <p className="absolute top-[12.3px] left-[11.26px] text-[13px] leading-[13px] font-extrabold tracking-[0.26px] text-white">LF</p>
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.15)]" />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-[3.991px]">
            <div className="flex h-[19.494px] items-center gap-[8px]">
              <p className="text-[13px] leading-[19.5px] font-medium whitespace-nowrap text-[#6c6c70]">{trip.vessel}</p>
              <span className="flex h-[18.98px] items-center rounded-full bg-[rgba(36,138,61,0.07)] px-[8px] text-[10px] leading-[15px] font-semibold text-[#248a3d]">
                {trip.vesselType}
              </span>
            </div>
            <p className="text-[12px] leading-[18px] whitespace-nowrap text-[#5e5d5f]">{trip.operator}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] leading-[16.5px] whitespace-nowrap">
          <p className="text-[#1c1917]">{departDate}</p>
          <p className="text-[#f97316]">{arriveDate}</p>
        </div>

        <div className="relative flex items-center gap-[6px]">
          <div className="flex flex-col gap-[4px]">
            <p className="w-[81px] text-[20px] leading-[20px] tracking-[-0.5px] whitespace-nowrap text-[#1c1917]">{trip.departTime}</p>
            <p className="h-[29.995px] text-[30px] leading-[30px] font-extrabold tracking-[-0.6px] text-[#1c1917]">{from.code}</p>
            <p className="text-[12px] leading-[18px] whitespace-nowrap text-[#5e5d5f]">{from.city}</p>
          </div>
          <div className="relative flex h-[27px] min-w-px flex-1 items-center">
            {/* duration sits centred above the line (Figma: "13H 30M", node 11598:52597) */}
            <p className="absolute top-[-8px] left-1/2 -translate-x-1/2 text-[11px] leading-[16.5px] font-medium whitespace-nowrap text-[#5e5d5f]">{trip.duration}</p>
            <span className="size-[7.992px] shrink-0 rounded-full bg-[#f97316]" />
            <span className="h-[1.483px] flex-1 bg-[rgba(142,142,147,0.25)]" />
            <span className="size-[7.992px] shrink-0 rounded-full bg-[#5e5d5f]" />
          </div>
          <div className="flex flex-col items-end gap-[4px]">
            <p className="w-[78px] text-right text-[20px] leading-[20px] tracking-[-0.5px] whitespace-nowrap text-[#1c1917]">{trip.arriveTime}</p>
            <p className="h-[29.995px] text-right text-[30px] leading-[30px] font-extrabold tracking-[-0.6px] text-[#1c1917]">{to.code}</p>
            <p className="text-right text-[12px] leading-[18px] whitespace-nowrap text-[#5e5d5f]">{to.city}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[12px] pt-[32px]">
        <a
          href="#"
          className="flex w-full items-center justify-center gap-[4px] overflow-clip rounded-[12.356px] border-[1.03px] border-[#f2f2f2] bg-[#f8f8fa] px-[12px] py-[8px]"
        >
          <span className="relative size-[16px] shrink-0">
            <img alt="" src={call02} className="absolute inset-[0_0_0_-0.48%] block size-full max-w-none" />
          </span>
          <span className="text-[14.415px] leading-[21.623px] font-medium tracking-[-0.5766px] whitespace-pre text-[#0b0b0b]">{`Contact  ${trip.operator}`}</span>
        </a>

        {children ?? (
        <div className="flex flex-col gap-[8px]">
          <section className="flex flex-col gap-[7.992px]">
            <div className="flex h-[20.993px] items-center gap-[7.992px]">
              <UserIcon />
              <p className="text-[13px] leading-[19.5px] font-medium whitespace-nowrap text-[#5e5d5f]">Passengers ({passengers.length})</p>
            </div>
            {passengers.map((p) => (
              <ItemRow key={p.id} title={p.fullName} chips={[p.fareType, p.cabin]} fare={p.fare} />
            ))}
          </section>
          {vehicles.length > 0 && (
            // not in the OJ frame: added so the paid total matches the listed items
            <section className="flex flex-col gap-[7.992px]">
              <div className="flex h-[20.993px] items-center gap-[7.992px]">
                <VanIcon />
                <p className="text-[13px] leading-[19.5px] font-medium whitespace-nowrap text-[#5e5d5f]">Vehicles ({vehicles.length})</p>
              </div>
              {vehicles.map((v) => (
                <ItemRow key={v.id} title={`${v.plate} ${v.model}`} chips={[v.type]} fare={v.fare} />
              ))}
            </section>
          )}
          <section className="flex flex-col items-center gap-[11.988px]">
            <PriceRows subtotal={subtotal} serviceFee={serviceFee} total={total} totalLabel={totalLabel} />
          </section>
        </div>
        )}
      </div>
    </div>
  )
}
