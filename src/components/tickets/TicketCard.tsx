import { useEffect, useState, type ReactNode } from 'react'
import clock from '../../assets/live/tickets/clock.svg'
import rebook from '../../assets/live/tickets/rebook.svg'
import receipt from '../../assets/live/tickets/receipt.svg'
import documentIcon from '../../assets/figma/tickets/document.svg'
import scan from '../../assets/live/tickets/scan.svg'
import alertGreen from '../../assets/figma/tickets/alert-green.svg'
import alertGrey from '../../assets/figma/tickets/alert-grey.svg'
import { partialOf, PAYMENT_WINDOW_MS, STATUS, tripOf, type TicketView } from '../../data/tickets'

// Live: My Tickets booking card (book.tripket.ph/tickets, component `k` in chunk 51681). Classes copied from live;
// tag labels (BOOKED / PROCESSING / …) as in Figma "Tickets" (11598:38019).

export function OperatorLogo({ src, alt, className }: { src?: string; alt: string; className: string }) {
  return src ? (
    <img alt={alt} src={src} className={`shrink-0 border border-neutral-100 bg-white object-contain ${className}`} />
  ) : (
    <span className={`flex shrink-0 items-center justify-center bg-neutral-100 text-xs font-bold text-neutral-500 ${className}`}>{alt.slice(0, 2).toUpperCase()}</span>
  )
}

/** Vessel name + type chip + operator (live card header) */
export function VesselHeader({ trip, logoClass = 'size-12 rounded-2xl', big }: { trip: ReturnType<typeof tripOf>; logoClass?: string; big?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <OperatorLogo src={trip.logo} alt={trip.operator} className={logoClass} />
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className={big ? 'text-[15px] leading-[22px] font-medium text-[#5e5d5f]' : 'text-sm leading-none font-bold tracking-tight text-slate-800'}>{trip.vessel}</span>
          {big ? (
            <span
              className={`rounded-full px-[8px] py-[1px] text-[11px] leading-[18px] font-semibold whitespace-nowrap ${
                trip.vesselType === 'Fast Craft' ? 'bg-[rgba(0,122,255,0.08)] text-[#007aff]' : 'bg-[rgba(36,138,61,0.08)] text-[#248a3d]'
              }`}
            >
              {trip.vesselType}
            </span>
          ) : (
            <span className="origin-left scale-90 rounded-full border border-emerald-100/50 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-emerald-700 uppercase">
              {trip.vesselType}
            </span>
          )}
        </div>
        <p className={`font-normal ${big ? 'mt-[2px] text-[14px] leading-[20px] text-[#737373]' : 'mt-1 text-xs text-neutral-400'}`}>{trip.operator}</p>
      </div>
    </div>
  )
}

/** Figma RouteInfo: times over big route codes, dotted line with duration, city names */
export function RouteInfo({ trip, from, to }: { trip: ReturnType<typeof tripOf>; from: { code: string; city: string }; to: { code: string; city: string } }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between text-xl leading-7 font-medium text-neutral-800">
        <p>{trip.departTime}</p>
        <p>{trip.arriveTime}</p>
      </div>
      <div className="flex items-center">
        <p className="text-[32px] leading-10 font-extrabold tracking-tight text-neutral-800">{from.code}</p>
        <div className="relative mx-3 flex-1 self-center">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap text-neutral-500 uppercase">{trip.duration}</span>
          <div className="relative h-0 w-full border-t-2 border-solid border-[#e5e5e5]">
            <div className="absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full bg-orange-500" />
            <div className="absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full bg-neutral-400" />
          </div>
        </div>
        <p className="text-right text-[32px] leading-10 font-extrabold tracking-tight text-neutral-800">{to.code}</p>
      </div>
      <div className="flex justify-between gap-3 text-sm text-neutral-500">
        <p>{from.city}</p>
        <p className="text-right">{to.city}</p>
      </div>
    </div>
  )
}

/** Live PaymentCountdown: "Payment window" + mm:ss + bar (progress = seconds left / 900) */
function PaymentWindow({ until }: { until: number }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const left = Math.max(0, Math.floor((until - now) / 1000))
  if (left === 0)
    return (
      <div className="flex w-full items-center justify-center">
        <p className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-center text-sm font-semibold text-red-500">Payment window expired</p>
      </div>
    )
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-normal text-[#1c1917]">Payment window</span>
        <span className="text-base font-normal text-[#f97316]">{`${mm}:${ss}`}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
        <div className="h-full rounded-full bg-orange-500 transition-all duration-1000 ease-linear" style={{ width: `${Math.min(100, (left / (PAYMENT_WINDOW_MS / 1000)) * 100)}%` }} />
      </div>
    </div>
  )
}

/** Live action row `d`: orange main button (h-12, rounded-2xl) + optional round receipt button */
function Actions({ label, icon, onMain, extraIcon, onExtra }: { label: string; icon?: ReactNode; onMain: () => void; extraIcon?: string; onExtra?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onMain}
        className="flex h-[42px] flex-1 items-center justify-center rounded-[14px] bg-linear-to-b from-[#fb7a1e] to-[#ea580c] px-3 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-250 active:scale-[0.98]"
      >
        <span className="flex items-center gap-2">
          {icon}
          <span className="text-white">{label}</span>
        </span>
      </button>
      {extraIcon && onExtra && (
        <button
          type="button"
          aria-label="View booking details"
          onClick={onExtra}
          className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#efefef] transition-all duration-250 hover:bg-[#e5e5e5] active:scale-[0.98]"
        >
          <img alt="" src={extraIcon} className="size-[20px]" />
        </button>
      )}
    </div>
  )
}

const Message = ({ bg, icon, children }: { bg: string; icon?: ReactNode; children: string }) => (
  <div className={`${bg} flex items-start gap-2 rounded-xl border border-black/5 px-3 py-2.5`}>
    {icon && <div className="shrink-0">{icon}</div>}
    <div className="flex flex-col">
      <span className="text-sm leading-5 font-normal text-[#1c1917]">{children}</span>
    </div>
  </div>
)

type Props = {
  ticket: TicketView
  onDetails: () => void
  onBoardingPass: () => void
  onRebook: () => void
  onReturnTrip: () => void
  onPay: () => void
}

/** Figma "Attention - Passenger Cancelled" (11598:49042) / Departed "4 of 5 passengers traveled · 1 cancelled" (11598:49136) */
function PartialBox({ ticket }: { ticket: TicketView }) {
  const p = partialOf(ticket)
  if (!p) return null
  return ticket.status === 'completed' ? (
    <div className="flex items-center gap-[8px] rounded-16 bg-[#f2f2f2] px-[16px] py-[12px]">
      <img alt="" src={alertGrey} className="size-[20px] shrink-0" />
      <p className="text-[13px] leading-[20px] font-medium text-[#5e5d5f]">{`${p.kept} of ${p.total} passengers traveled · ${p.cancelled} cancelled`}</p>
    </div>
  ) : (
    <div className="flex items-start gap-[8px] rounded-16 bg-[rgba(211,255,222,0.6)] px-[16px] py-[14px]">
      <img alt="" src={alertGreen} className="size-[20px] shrink-0" />
      <p className="flex-1 text-[13px] leading-[20px] font-medium text-[#1c1917]">
        {`Partial cancellation: ${p.cancelled} of ${p.total} passengers in this booking has cancelled their trip. A refund for the cancelled passengers ticket is being processed.`}
      </p>
    </div>
  )
}

export default function TicketCard({ ticket, onDetails, onBoardingPass, onRebook, onReturnTrip, onPay }: Props) {
  const { status, booking } = ticket
  const s = STATUS[status]
  const trip = tripOf(ticket)

  return (
    <div className={`rounded-[20px] px-1 pb-1 shadow-lg shadow-slate-400/20 transition-all duration-300 ${s.bg}`}>
      <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold tracking-wide">
        <span className={s.text}>{s.tag}</span>
      </div>
      <div className="flex flex-col gap-3 rounded-[18px] border border-neutral-200 bg-white p-4 shadow-sm">
        <div className={`${status === 'expired' ? 'cursor-not-allowed opacity-50' : ''} flex flex-col gap-3`}>
          <VesselHeader trip={trip} big logoClass="size-10 rounded-[10px]" />
          <div className="flex w-full items-center justify-between">
            <span className="text-xs font-normal text-neutral-800">{trip.departDate}</span>
            {!trip.sameDay && <span className="text-right text-xs font-normal text-[#f97316]">{trip.arriveDate}</span>}
          </div>
          <RouteInfo trip={trip} from={booking.from} to={booking.to} />
          {status === 'pending' && ticket.pendingUntil && (
            <div className="relative w-full">
              <PaymentWindow until={ticket.pendingUntil} />
            </div>
          )}
          {status === 'expired' && <Message bg={s.bg}>Payment was not completed before the payment window ended.</Message>}
          {status === 'failed' && <Message bg={s.bg}>We weren't able to process the payment for your booking.</Message>}
          {status === 'under_review' && (
            <Message bg={s.bg} icon={<img alt="" src={clock} className="size-[18px]" />}>
              Waiting for confirmation from the shipping line. Your boarding pass will be available once confirmed.
            </Message>
          )}
          {status === 'generating' && (
            <Message bg={s.bg} icon={<img alt="" src={clock} className="size-[18px]" />}>
              Please wait. Your ticket is being generated.
            </Message>
          )}
          {status === 'pending' && <Message bg="bg-[#fffbd6]" icon={<img alt="" src={receipt} className="size-5" />}>Your booking was already submitted — complete payment in to confirm your seat.</Message>}
          {(status === 'confirmed' || status === 'completed') && <PartialBox ticket={ticket} />}
        </div>
        <div>
          {status === 'pending' ? (
            <Actions label="Continue Payment" onMain={onPay} extraIcon={documentIcon} onExtra={onDetails} />
          ) : status === 'confirmed' ? (
            <Actions
              label="View boarding pass"
              icon={<img alt="" src={scan} className="size-[22px]" />}
              onMain={onBoardingPass}
              extraIcon={documentIcon}
              onExtra={onDetails}
            />
          ) : status === 'under_review' || status === 'generating' ? (
            <Actions label="View Booking Details" onMain={onDetails} />
          ) : status === 'completed' ? (
            <Actions label="Book Return Trip" icon={<img alt="" src={rebook} className="size-4" />} onMain={onReturnTrip} extraIcon={documentIcon} onExtra={onDetails} />
          ) : (
            <Actions label="Rebook" icon={<img alt="" src={rebook} className="size-4" />} onMain={onRebook} extraIcon={documentIcon} onExtra={onDetails} />
          )}
        </div>
      </div>
    </div>
  )
}
