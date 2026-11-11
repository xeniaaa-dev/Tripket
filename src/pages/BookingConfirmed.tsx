import { useNavigate, useSearchParams } from 'react-router'
import infoCircle from '../assets/figma/confirmation/info-circle.svg'
import infoNote from '../assets/figma/confirmation/info-note.svg'
import { useBooking } from '../booking/BookingContext'
import OrderSummary from '../components/confirmation/OrderSummary'
import ConfirmationView, { type Action } from '../components/tickets/ConfirmationView'
import { useTicketActions } from '../components/tickets/useTicketActions'
import { toView } from '../data/tickets'
import { arrivalDayDate, dayDate, reviewData } from '../data/step-review'

// Figma: "OJ - PROCESSING" (node 11598:52529) — Booking under review: payment posted, waiting for admin confirmation
export default function BookingConfirmed() {
  const navigate = useNavigate()
  const { booking, reset, tickets } = useBooking()
  const { passengers, vehicles, trip, subtotal, serviceFee, total } = reviewData(booking)
  const leave = (to: string) => {
    reset()
    navigate(to)
  }

  // ?id= → the submitted ticket: the screen follows its live status (Figma confirmation screens 11598:51228)
  const [params] = useSearchParams()
  const stored = tickets.find((t) => t.id === params.get('id'))
  const { continuePayment, rebook, paymentSheet } = useTicketActions()
  if (stored) {
    const ticket = toView(stored)
    const myTickets: Action = { label: 'View My Tickets', onClick: () => leave('/tickets') }
    const another: Action = { label: 'Book another trip', onClick: () => leave('/') }
    const actions: Action[] =
      ticket.status === 'pending'
        ? [{ label: 'Continue to payment', onClick: () => continuePayment(ticket) }, { ...myTickets, outline: true }]
        : ticket.status === 'confirmed' || ticket.status === 'generating' || ticket.status === 'failed'
          ? [another, { ...myTickets, outline: true }]
          : ticket.status === 'expired' || ticket.status === 'completed'
            ? [{ label: 'Book again', onClick: () => {
                    reset()
                    rebook(ticket)
                  } }, { ...myTickets, outline: true }]
            : [myTickets, { ...another, outline: true }]
    return (
      <>
        <ConfirmationView ticket={ticket} actions={actions} />
        {paymentSheet}
      </>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="flex items-center gap-[12px] px-[16px] py-[16px]">
        <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[18px] bg-[#e0edff]">
          <img alt="" src={infoCircle} className="size-[16px]" />
        </span>
        <div className="flex flex-col">
          <h1 className="text-[17px] leading-[25.5px] font-semibold tracking-[-0.4px] text-black">Booking under review</h1>
          <p className="text-[12px] leading-[18px] text-[#b4b4b4]">Payment posted, waiting for admin confirmation</p>
        </div>
      </div>

      <div className="flex flex-col items-center px-[16px] py-[8px]">
        <div className="w-full overflow-clip rounded-[20px] border border-[#f2f2f2] bg-gradient-to-b from-[rgba(199,232,255,0.5)] to-white to-[42.525%] p-px">
          <div className="flex flex-col items-center gap-[10px] pt-[20px] pb-[16px]">
            <span className="flex h-[24px] items-center rounded-full bg-white px-[16px] text-[10px] leading-[15px] font-semibold tracking-[0.6px] text-[#2563eb]">PROCESSING</span>
            <p className="w-full px-[8px] text-center text-[12px] leading-[16.8px] text-[#2563eb]">
              Payment posted. Review the booking before releasing boarding details.
            </p>
          </div>
          <OrderSummary
            trip={trip}
            from={booking.from}
            to={booking.to}
            departDate={dayDate(booking.date)}
            arriveDate={arrivalDayDate(trip.arrivalNote, booking.date)}
            passengers={passengers}
            vehicles={vehicles}
            subtotal={subtotal}
            serviceFee={serviceFee}
            total={total}
          />
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
          <button type="button" onClick={() => leave('/tickets')} className="flex h-[56px] w-full items-center justify-center rounded-16 bg-[#f97316]">
            <span className="text-[15px] leading-[22.5px] font-bold text-white">View My Tickets</span>
          </button>
          <button type="button" onClick={() => leave('/')} className="flex h-[56px] w-full items-center justify-center rounded-16 border-[1.5px] border-[#f97316] bg-white">
            <span className="text-[15px] leading-[22.5px] font-bold text-[#f97316]">Book another trip</span>
          </button>
        </div>
      </div>

      <div className="h-[24px] shrink-0" />
    </div>
  )
}
