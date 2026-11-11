import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking } from '../../booking/BookingContext'
import { parseBookingDate, startOfToday } from '../../booking/date'
import { LINES, lineOf, prefillHome, type ShippingLine, type TicketView } from '../../data/tickets'
import PaymentSheet from './PaymentSheet'

const HOME = { state: { pageEnter: true, noLoader: true } }

/**
 * Ticket actions shared by My Tickets, booking details, the confirmation screen and the "Continue to payment" banner.
 * - continuePayment: card payment sheet → paid → PROCESSING (confirmation screen); closing keeps it PENDING
 * - rebook (For refund / Refunded / Expired): Home with the ticket's route + date prefilled
 * - returnTrip (Departed): Home with the route reversed
 * Render `paymentSheet` once in the host.
 */
export function useTicketActions() {
  const navigate = useNavigate()
  const { updateTicket } = useBooking()
  const [payFor, setPayFor] = useState<{ id: string; total: number; line: ShippingLine } | null>(null)
  const [open, setOpen] = useState(false)

  const continuePayment = (t: TicketView) => {
    setPayFor({ id: t.id, total: t.total, line: lineOf(t.booking) })
    setOpen(true)
  }
  const rebook = (t: TicketView) => {
    prefillHome(t.booking.from.city, t.booking.to.city, parseBookingDate(t.booking.date))
    navigate('/', HOME)
  }
  const returnTrip = (t: TicketView) => {
    prefillHome(t.booking.to.city, t.booking.from.city, startOfToday())
    navigate('/', HOME)
  }

  const paymentSheet = (
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
  )

  return { continuePayment, rebook, returnTrip, paymentSheet }
}
