import { useEffect, useState, type ReactNode } from 'react'
import call02 from '../../assets/figma/confirmation/call-02.svg'
import infoCircle from '../../assets/figma/confirmation/info-circle.svg'
import infoNote from '../../assets/figma/confirmation/info-note.svg'
import arrowLeft from '../../assets/live/tickets/arrow-left.svg'
import OrderSummary from '../confirmation/OrderSummary'
import { reviewData } from '../../data/step-review'
import { LINES, lineOf, mmss, PAYMENT_WINDOW_MS, screenOf, tripOf, type TicketView } from '../../data/tickets'
import Qr from './Qr'
import { BookingReference, FareDetails, FareList, RefundDetails, TicketBlocks } from './TicketBlocks'

// Booking confirmation / booking details for one ticket. The screen depends on the status AND the shipping line:
// Figma "Confirmation Screens OCEAN JET" (11598:51228), "…MAAYO SHIPPING" (11598:52901) and "…HS" (11598:49782) —
// Booking submitted, Under review (OceanJet), Payment received / Generating ticket (Maayo), Booking confirmed,
// Completed, Refund in progress (+ partial), Refund completed, Expired, Payment failed (Maayo).
// Used by /book/confirmed (after Pay) and /tickets/:id (with the live page header + back button).

export type Action = { label: string; onClick: () => void; outline?: boolean }

/** Figma "Payment window … 14:50" row on the Booking submitted card */
function PaymentWindowRow({ until }: { until: number }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const left = Math.max(0, until - now)
  return (
    <div className="flex w-full flex-col gap-[6px] px-[8px]">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-[#1c1917]">Payment window</span>
        <span className="font-mono font-medium text-[#f97316]">{mmss(left)}</span>
      </div>
      <div className="h-[4px] w-full overflow-hidden rounded-full bg-orange-100">
        <div className="h-full rounded-full bg-[#f97316] transition-all duration-1000 ease-linear" style={{ width: `${(left / PAYMENT_WINDOW_MS) * 100}%` }} />
      </div>
    </div>
  )
}

/** Maayo "Payment received": compact route, contact, Refresh, skeleton QR tickets (Figma "MAAYO- booking…" 2nd frame) */
function GeneratingBody({ ticket, children }: { ticket: TicketView; children: ReactNode }) {
  const [spin, setSpin] = useState(false)
  useEffect(() => {
    if (!spin) return
    const t = setTimeout(() => setSpin(false), 700)
    return () => clearTimeout(t)
  }, [spin])
  const { booking } = ticket
  const t = tripOf(ticket)
  return (
    <div className="flex flex-col gap-[10px] px-[16px] pb-[16px]">
      <div className="flex items-center justify-between rounded-[12px] bg-white px-[14px] py-[10px]">
        <span className="flex items-center gap-[8px] text-[17px] font-extrabold tracking-[-0.4px] text-[#1c1917]">
          {booking.from.code} <span>→</span> {booking.to.code}
        </span>
        <span className="text-[11px] text-[#5e5d5f]">{t.short.replace(' · ', ' - ')}</span>
      </div>
      <div className="flex items-center justify-center gap-[4px] rounded-[12px] border-[1px] border-[#f2f2f2] bg-white px-[12px] py-[8px]">
        <img alt="" src={call02} className="size-[16px]" />
        <span className="text-[14px] font-medium text-[#0b0b0b]">{`Contact ${t.operator}`}</span>
      </div>
      <button
        type="button"
        onClick={() => setSpin(true)}
        className="flex h-[40px] items-center justify-center gap-[6px] rounded-[12px] bg-[#f97316] text-[13px] font-semibold text-white transition-transform active:scale-[0.98]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={spin ? 'animate-spin' : ''}>
          <path d="M20.5 15A9 9 0 1 1 20.3 8.5" />
          <path d="M15 9h5.5V3.5" />
        </svg>
        Refresh
      </button>
      <div className="flex flex-col gap-[8px]">
        {booking.passengers.map((p, i) => (
          <div key={p.id} className="flex flex-col items-center gap-[6px] rounded-[12px] border border-[#ececf0] bg-white px-[12px] pt-[12px] pb-[10px]">
            <Qr value={`${ticket.reference}-${i}`} size={80} skeleton />
            <p className="text-[13px] font-medium text-[#1c1917]">{p.fullName}</p>
            <span className="flex gap-[4px] text-[9px] font-semibold">
              <span className="rounded-[20px] bg-[#ececec] px-[8px] py-[2px] text-[#8e8e93]">{p.fareType}</span>
              <span className="rounded-[20px] bg-[#fff7ed] px-[8px] py-[2px] text-[#f97316]">{p.cabin}</span>
            </span>
            <p className="text-[8px] tracking-[0.8px] text-[#b4b4b4]">{LINES.maayo.ticketLabel}</p>
            <span className="h-[8px] w-[110px] animate-pulse rounded-full bg-[#e5e5ea]" />
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}

type Props = { ticket: TicketView; onBack?: () => void; actions: Action[]; children?: ReactNode }

export default function ConfirmationView({ ticket, onBack, actions, children }: Props) {
  const { booking, status } = ticket
  const line = lineOf(booking)
  const L = LINES[line]
  const sc = screenOf(ticket)
  const { passengers, vehicles, trip, subtotal, serviceFee, total } = reviewData(booking)
  const t = tripOf(ticket)
  const tripNamed = { ...trip, operator: t.operator }
  const showRef = L.reference
  const refAfterNote = status === 'confirmed' && !sc.partial

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="flex items-center gap-[12px] px-[16px] py-[16px]">
        {onBack ? (
          <button
            type="button"
            aria-label="Go Back"
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white transition-all active:scale-95"
          >
            <img alt="" src={arrowLeft} className="size-[18px]" />
          </button>
        ) : (
          <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[18px]" style={{ backgroundColor: sc.iconBg }}>
            <img alt="" src={infoCircle} className="size-[16px]" />
          </span>
        )}
        <div className="flex flex-col">
          <h1 className="text-[17px] leading-[25.5px] font-semibold tracking-[-0.4px] text-black">{sc.label}</h1>
          <p className="text-[12px] leading-[18px] text-[#b4b4b4]">{sc.description}</p>
        </div>
      </div>

      <div className="flex flex-col items-center px-[16px] py-[8px]">
        <div
          className="w-full overflow-clip rounded-[20px] border border-[#f2f2f2] p-px"
          style={{ backgroundImage: `linear-gradient(to bottom, ${sc.from}, white 42.525%)` }}
        >
          <div className="flex flex-col items-center gap-[10px] pt-[20px] pb-[16px]">
            <span className={`flex h-[24px] items-center rounded-full bg-white px-[16px] text-[10px] leading-[15px] font-semibold tracking-[0.6px] ${sc.text}`}>{sc.tag}</span>
            {showRef && !refAfterNote && <BookingReference ticket={ticket} />}
            <p
              className={`w-full px-[8px] text-center leading-[16.8px] ${sc.layout === 'generating' ? 'text-[15px] font-semibold text-[#1c1917]' : `text-[12px] ${status === 'pending' ? 'text-[#1c1917]' : sc.text}`}`}
            >
              {sc.note}
            </p>
            {sc.reason && <p className={`text-[11px] ${sc.text}`}>{sc.reason}</p>}
            {showRef && refAfterNote && <BookingReference ticket={ticket} />}
            {status === 'pending' && ticket.pendingUntil && <PaymentWindowRow until={ticket.pendingUntil} />}
          </div>

          {sc.layout === 'generating' ? (
            <GeneratingBody ticket={ticket}>
              <FareList ticket={ticket} totalLabel={sc.totalLabel} />
            </GeneratingBody>
          ) : (
            <OrderSummary
              trip={tripNamed}
              from={booking.from}
              to={booking.to}
              departDate={t.departDate}
              arriveDate={t.sameDay ? '' : t.arriveDate}
              passengers={passengers}
              vehicles={vehicles}
              subtotal={subtotal}
              serviceFee={serviceFee}
              total={total}
              totalLabel={sc.totalLabel}
            >
              {sc.layout === 'tickets' ? (
                <div className="flex flex-col gap-[8px]">
                  <TicketBlocks ticket={ticket} />
                  <FareDetails ticket={ticket} />
                </div>
              ) : sc.layout === 'cancelled' ? (
                <div className="flex flex-col gap-[8px]">
                  <TicketBlocks ticket={ticket} />
                  <RefundDetails ticket={ticket} partial={sc.partial} />
                </div>
              ) : undefined}
            </OrderSummary>
          )}
        </div>

        <div className="pt-[12px]">
          <div className="flex w-full items-start gap-[10px] rounded-16 bg-[#f8f8fa] px-[16px] py-[12px]">
            <span className="pt-px">
              <img alt="" src={infoNote} className="size-[15px]" />
            </span>
            <p className="flex-1 text-[11px] leading-[15.95px] text-[#5e5d5f]">
              Terminal and port fees are not included. These are collected separately at the port before boarding.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[12px] pt-[12px]">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={`flex h-[56px] w-full items-center justify-center rounded-16 transition-transform active:scale-[0.98] ${a.outline ? 'border-[1.5px] border-[#f97316] bg-white' : 'bg-[#f97316]'}`}
            >
              <span className={`text-[15px] leading-[22.5px] font-bold ${a.outline ? 'text-[#f97316]' : 'text-white'}`}>{a.label}</span>
            </button>
          ))}
          {children}
        </div>
      </div>

      <div className="h-[24px] shrink-0" />
    </div>
  )
}
