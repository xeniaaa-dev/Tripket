import { useState, type ReactNode } from 'react'
import chevron from '../../assets/live/tickets/chevron-down-orange.svg'
import { peso, pesoTotal } from '../../data/step-review'
import { bookingRef, LINES, lineOf, moneyOf, refundOf, seatOf, ticketNo, type TicketView } from '../../data/tickets'
import { ItemRow, UserIcon } from '../confirmation/OrderSummary'
import { PriceRows } from '../step-review/ReviewSections'
import { VanIcon } from '../step-review/icons'
import Qr from './Qr'

// Per-shipping-line pieces shared by the confirmation screens and the boarding pass sheet
// (Figma "Confirmation Screens OCEAN JET / MAAYO SHIPPING / HS" and "Boarding Pass" 11598:57458):
// OceanJet = ticket number only, Maayo = QR per passenger / vehicle, HS Marine = seat chip + "HS STAR MARINE TICKET NO.".

const Chip = ({ children, tone = 'grey' }: { children: string; tone?: 'grey' | 'orange' | 'green' | 'red' }) => (
  <span
    className={`rounded-[20px] px-[8px] py-[2px] text-[9px] font-semibold whitespace-nowrap ${
      { grey: 'bg-[#ececec] text-[#8e8e93]', orange: 'bg-[#fff7ed] text-[#f97316]', green: 'bg-[#d7ffe1] text-[#34c759]', red: 'bg-[#ffe4e6] text-[#dc2626]' }[tone]
    }`}
  >
    {children}
  </span>
)

const TicketNumber = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center gap-[2px] border-t border-[#ececf0] px-[12px] py-[8px]">
    <p className="text-[8px] tracking-[0.8px] text-[#b4b4b4]">{label}</p>
    <p className="font-mono text-[13px] font-bold tracking-[-0.2px] text-[#1c1917]">{value}</p>
  </div>
)

/** Booking reference pill (HS Marine: "BOOKING REFERENCE  MUM3MFM4X") */
export const BookingReference = ({ ticket, className = '' }: { ticket: TicketView; className?: string }) => (
  <div className={`flex flex-col items-center gap-[2px] ${className}`}>
    <p className="text-[8px] tracking-[0.8px] text-[#8e8e93]">BOOKING REFERENCE</p>
    <p className="font-mono text-[13px] font-bold text-[#1c1917]">{bookingRef(ticket.reference)}</p>
  </div>
)

/** One passenger / vehicle ticket per line. Cancelled passengers get the red "Cancelled" treatment. */
export function TicketBlocks({ ticket }: { ticket: TicketView }) {
  const { booking } = ticket
  const line = lineOf(booking)
  const L = LINES[line]
  const free = (i: number) => booking.passengers[i].fare === null
  // Maayo: passengers riding free with a vehicle are listed inside the vehicle's QR block
  const inVehicle = L.qr && booking.vehicles.length > 0
  const isCancelled = (id: string) => ticket.cancelledPassengerIds.includes(id) || ticket.status === 'for_refund' || ticket.status === 'refunded'

  const blocks: ReactNode[] = []

  if (inVehicle) {
    booking.vehicles.forEach((v, vi) => {
      blocks.push(
        <div
          key={v.id}
          className={`relative flex flex-col items-center gap-[6px] rounded-[12px] border p-[12px] ${ticket.status === 'for_refund' || ticket.status === 'refunded' ? 'border-[#dc2626] bg-red-50/50' : 'border-[#ececf0] bg-white'}`}
        >
          {(ticket.status === 'for_refund' || ticket.status === 'refunded') && <span className="absolute top-[8px] right-[8px] text-[9px] text-[#dc2626]">Cancelled</span>}
          <Qr value={`${ticket.reference}-V${vi}`} size={96} />
          <p className="font-mono text-[11px] font-bold text-[#1c1917]">{`${bookingRef(ticket.reference)}-V0${vi + 1}`}</p>
          <p className="text-[12px] text-[#1c1917]">
            <span className="font-bold">{v.plate}</span> {v.model}
          </p>
          <p className="text-[10px] text-[#8e8e93]">{v.type}</p>
          {booking.passengers.map(
            (p, i) =>
              free(i) && (
                <div key={p.id} className="flex w-full flex-col items-center gap-[4px] rounded-[8px] border border-[#ececf0] px-[8px] py-[8px]">
                  <p className="text-[12px] font-medium text-[#1c1917]">{p.fullName}</p>
                  <span className="flex gap-[4px]">
                    <Chip tone="green">Free</Chip>
                    <Chip>{p.fareType}</Chip>
                    <Chip tone="orange">{p.cabin}</Chip>
                  </span>
                </div>
              ),
          )}
        </div>,
      )
    })
  }

  booking.passengers.forEach((p, i) => {
    if (inVehicle && free(i)) return
    const cancelled = isCancelled(p.id)
    blocks.push(
      <div
        key={p.id}
        className={`flex flex-col overflow-hidden rounded-[12px] border bg-white ${cancelled ? 'border-[#dc2626] bg-red-50/50' : 'border-[#ececf0]'}`}
      >
        {L.qr && (
          <div className="flex justify-center pt-[12px]">
            <Qr value={`${ticket.reference}-${i}`} size={96} />
          </div>
        )}
        <div className="flex flex-col items-center gap-[4px] px-[12px] py-[10px]">
          <p className="text-center text-[13px] leading-[15px] font-medium text-[#1c1917]">{p.fullName}</p>
          <span className="flex flex-wrap justify-center gap-[4px]">
            <Chip>{p.fareType}</Chip>
            <Chip tone="orange">{p.cabin}</Chip>
            {L.seats && <Chip tone="orange">{`Seat: ${seatOf(i)}`}</Chip>}
            {cancelled && <Chip tone="red">Cancelled</Chip>}
          </span>
        </div>
        <TicketNumber label={L.ticketLabel} value={ticketNo(line, ticket.reference, i)} />
      </div>,
    )
  })

  return <div className="flex flex-col gap-[8px]">{blocks}</div>
}

const Collapsible = ({ title, subtitle, defaultOpen, closedValue, children }: { title: string; subtitle: string; defaultOpen: boolean; closedValue?: string; children: ReactNode }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-[12px] border border-[#ececf0] bg-white">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-[8px] px-[12px] py-[10px] text-left">
        <span className="flex flex-col">
          <span className="text-[12px] font-semibold text-[#1c1917]">{title}</span>
          <span className="text-[9px] text-[#5e5d5f]">{subtitle}</span>
        </span>
        {!open && closedValue && <span className="ml-auto text-[13px] text-[#f97316]">{closedValue}</span>}
        <img alt="" src={chevron} className="size-[20px] shrink-0 transition-[rotate] duration-300" style={{ rotate: open ? '180deg' : '0deg' }} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-[8px] px-[12px] pb-[12px]">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** Passenger / vehicle rows + price rows (the body of "Fare details", also shown plain on the Maayo "Payment received" screen) */
export function FareList({ ticket, totalLabel = 'Total amount paid' }: { ticket: TicketView; totalLabel?: string }) {
  const { passengers, vehicles } = ticket.booking
  const { subtotal, serviceFee, total } = moneyOf(ticket)
  return (
    <>
      <section className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[8px] text-[12px] font-medium text-[#5e5d5f]">
          <UserIcon />
          Passengers ({passengers.length})
        </div>
        {passengers.map((p) => (
          <ItemRow key={p.id} title={p.fullName} chips={[p.fareType, p.cabin]} fare={p.fare} />
        ))}
      </section>
      {vehicles.length > 0 && (
        <section className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[8px] text-[12px] font-medium text-[#5e5d5f]">
            <VanIcon />
            Vehicles ({vehicles.length})
          </div>
          {vehicles.map((v) => (
            <ItemRow key={v.id} title={`${v.plate} ${v.model}`} chips={[v.type]} fare={v.fare} />
          ))}
        </section>
      )}
      <div className="flex flex-col items-center gap-[8px]">
        <PriceRows subtotal={subtotal} serviceFee={serviceFee} total={total} totalLabel={totalLabel} />
      </div>
    </>
  )
}

/** "Fare details — Passengers, vehicle, add-ons" (expandable) */
export function FareDetails({ ticket, defaultOpen = true, totalLabel = 'Total amount paid' }: { ticket: TicketView; defaultOpen?: boolean; totalLabel?: string }) {
  return (
    <Collapsible title="Fare details" subtitle="Passengers, vehicle, add-ons" defaultOpen={defaultOpen} closedValue={pesoTotal(moneyOf(ticket).total)}>
      <FareList ticket={ticket} totalLabel={totalLabel} />
    </Collapsible>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between rounded-[8px] border-[0.5px] border-[#b4b4b4] px-[10px] py-[7px] text-[12px] text-[#1c1917]">
    <span className="text-[#5e5d5f]">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
)

/** Figma "Refund details — Amount, account, date": full refund, or partial (original − refund = total paid) */
export function RefundDetails({ ticket, partial }: { ticket: TicketView; partial: boolean }) {
  const r = refundOf(ticket)
  const sent = ticket.status === 'refunded'
  return (
    <Collapsible title="Refund details" subtitle="Amount, account, date" defaultOpen closedValue={pesoTotal(r.refund)}>
      <p className="text-[12px] font-medium text-[#5e5d5f]">Refund</p>
      {partial ? (
        <>
          <Row label="Original total amount" value={peso(r.original)} />
          <Row label="Refund amount" value={`-${peso(r.refund)}`} />
          <div className="flex items-center justify-between pt-[4px]">
            <span className="text-[13px] font-bold text-[#1c1917]">Total paid</span>
            <span className="text-[20px] font-bold text-[#ea580c]">{pesoTotal(r.remaining)}</span>
          </div>
        </>
      ) : (
        <>
          <Row label="Amount paid" value={peso(r.original)} />
          <Row label="Refund amount" value={peso(r.refund)} />
          <Row label="Refund method" value={r.method} />
          <Row label="Refund reference" value={r.reference} />
          {sent ? <Row label="Sent on" value={r.sent} /> : <Row label="Expected in account" value={r.expected} />}
          <div className="flex items-center justify-between pt-[4px]">
            <span className="text-[13px] font-bold text-[#1c1917]">Refund amount</span>
            <span className="text-[20px] font-bold text-[#ea580c]">{pesoTotal(r.refund)}</span>
          </div>
        </>
      )}
    </Collapsible>
  )
}
