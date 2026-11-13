import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking } from '../../booking/BookingContext'
import { anotherPatch, rebookPatch, returnPatch } from '../../booking/flows'
import type { BookingState } from '../../booking/BookingContext'
import { LINES, lineOf, type ShippingLine, type TicketView } from '../../data/tickets'
import PaymentSheet from './PaymentSheet'
import RebookSheet from './RebookSheet'


/**
 * Ticket actions shared by My Tickets, booking details, the confirmation screen and the "Continue to payment" banner.
 * - continuePayment: card payment sheet → paid → PROCESSING (confirmation screen); closing keeps it PENDING
 * - rebook: Figma "Rebook" flow — date sheet → Select departure (same shipping line) → Review & pay
 * - returnTrip: Figma "Return trip" flow — When do you return? → Select departure → Review & pay
 * - anotherTrip: Figma "Book another trip" flow — From = last destination → Select departure → Passenger details → Review & pay
 * Render `paymentSheet` (it also hosts the Rebook date sheet) once in the host.
 */
export function useTicketActions() {
  const navigate = useNavigate()
  const { updateTicket, update } = useBooking()
  const [rebooking, setRebooking] = useState<BookingState | null>(null)
  const [payFor, setPayFor] = useState<{ id: string; total: number; line: ShippingLine } | null>(null)
  const [open, setOpen] = useState(false)

  const continuePayment = (t: TicketView) => {
    setPayFor({ id: t.id, total: t.total, line: lineOf(t.booking) })
    setOpen(true)
  }
  const rebook = (t: TicketView) => setRebooking(t.booking)
  const returnTrip = (t: TicketView) => {
    update(returnPatch(t.booking))
    navigate('/book/return')
  }
  const anotherTrip = (t: TicketView) => {
    update(anotherPatch(t.booking))
    navigate('/book/another')
  }

  const paymentSheet = (
    <>
    <RebookSheet
      booking={rebooking}
      onClose={() => setRebooking(null)}
      onContinue={(d) => {
        if (!rebooking) return
        update(rebookPatch(rebooking, d))
        setRebooking(null)
        navigate('/book/departure')
      }}
    />
    <PaymentSheet
      open={open}
      total={payFor?.total ?? 0}
      line={payFor?.line}
      onClose={() => setOpen(false)}
      onPaid={() => {
        setOpen(false)
        if (!payFor) return
        updateTicket(payFor.id, { status: LINES[payFor.line].paidStatus, pendingUntil: undefined })
        navigate(`/book/confirmed?id=${payFor.id}`)
      }}
      onFailed={() => {
        setOpen(false)
        if (!payFor) return
        updateTicket(payFor.id, { status: 'failed', pendingUntil: undefined })
        navigate(`/book/confirmed?id=${payFor.id}`)
      }}
    />
    </>
  )

  return { continuePayment, rebook, returnTrip, anotherTrip, paymentSheet }
}
