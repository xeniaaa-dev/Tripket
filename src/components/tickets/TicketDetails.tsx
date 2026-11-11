import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking } from '../../booking/BookingContext'
import { addDays, formatBookingDate, startOfToday } from '../../booking/date'
import type { TicketView } from '../../data/tickets'
import CancelSheet from './CancelSheet'
import ConfirmationView, { type Action } from './ConfirmationView'
import { useTicketActions } from './useTicketActions'

// Booking details (live: "View Booking Details" / receipt button → /book/{reference}; not reachable as a guest).
// Same Figma confirmation layout as /book/confirmed, with the live page header + back button and per-status actions.

export default function TicketDetails({ ticket, onBoardingPass }: { ticket: TicketView; onBoardingPass: () => void }) {
  const navigate = useNavigate()
  const { updateTicket } = useBooking()
  const { continuePayment, rebook, returnTrip, paymentSheet } = useTicketActions()
  const [cancelling, setCancelling] = useState(false)
  const demo = ticket.id.startsWith('TKT-DEMO')
  const active = ticket.booking.passengers.filter((p) => !ticket.cancelledPassengerIds.includes(p.id))

  const cancel = (ids: string[]) => {
    setCancelling(false)
    if (ids.length === 0 || ids.length === active.length) {
      updateTicket(ticket.id, { status: 'for_refund', cancelledPassengerIds: ticket.booking.passengers.map((p) => p.id) })
    } else {
      updateTicket(ticket.id, { cancelledPassengerIds: [...ticket.cancelledPassengerIds, ...ids] })
    }
  }

  const actions: Action[] = {
    pending: [{ label: 'Continue to payment', onClick: () => continuePayment(ticket) }],
    under_review: [],
    generating: [],
    confirmed: [
      { label: 'View boarding pass', onClick: onBoardingPass },
      { label: 'Cancel booking', onClick: () => setCancelling(true), outline: true },
    ],
    completed: [{ label: 'Book Return Trip', onClick: () => returnTrip(ticket) }],
    for_refund: [{ label: 'Rebook', onClick: () => rebook(ticket) }],
    refunded: [{ label: 'Rebook', onClick: () => rebook(ticket) }],
    expired: [{ label: 'Rebook', onClick: () => rebook(ticket) }],
    failed: [{ label: 'Rebook', onClick: () => rebook(ticket) }],
  }[ticket.status]

  const canShift = !demo && ['under_review', 'generating', 'confirmed'].includes(ticket.status)

  return (
    <>
      <ConfirmationView ticket={ticket} onBack={() => navigate('/tickets')} actions={actions}>
        {canShift && (
          // PROTOTYPE-ONLY control: the calendar blocks past dates, so this is how a booked trip becomes "Departed".
          <div className="flex flex-col gap-[8px] rounded-16 border border-dashed border-[#b4b4b4] p-[12px]">
            <p className="text-[11px] font-semibold tracking-[0.6px] text-[#8e8e93]">PROTOTYPE ONLY</p>
            <button
              type="button"
              onClick={() => updateTicket(ticket.id, { booking: { ...ticket.booking, date: formatBookingDate(addDays(startOfToday(), -1)) } })}
              className="h-[40px] rounded-12 bg-[#f2f2f7] text-[13px] font-semibold text-[#1c1917]"
            >
              Move travel date to yesterday
            </button>
          </div>
        )}
      </ConfirmationView>
      <CancelSheet open={cancelling} passengers={active} onClose={() => setCancelling(false)} onConfirm={cancel} />
      {paymentSheet}
    </>
  )
}
