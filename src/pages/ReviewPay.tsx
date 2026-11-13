import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking } from '../booking/BookingContext'
import BookingHeader from '../components/booking/BookingHeader'
import StepFooter from '../components/booking/StepFooter'
import PaymentSheet from '../components/tickets/PaymentSheet'
import ReviewRouteBanner from '../components/step-review/ReviewRouteBanner'
import { ContactDetails, PassengersSection, PaymentMethod, type PayMethod, PriceSummary, TermsNote, TripDetails, VehiclesSection } from '../components/step-review/ReviewSections'
import { pesoTotal, reviewData, shortDate } from '../data/step-review'
import { LINES, lineOf } from '../data/tickets'
import type { TicketStatus } from '../booking/BookingContext'

// Figma: "Book - Review - Single Leg - No terminal Fee" (node 12348:746)
export default function ReviewPay() {
  const navigate = useNavigate()
  const { booking, addTicket } = useBooking()
  const { passengers, vehicles, trip, subtotal, serviceFee, total } = reviewData(booking)
  const [method, setMethod] = useState<PayMethod>('card')
  const [paying, setPaying] = useState(false)
  // Email + Confirm email must match before payment
  const [emailOk, setEmailOk] = useState(false)
  // Pay → card payment sheet: paid → the line's first status (OceanJet processing, Maayo generating, HS confirmed);
  // closed unpaid → PENDING PAYMENT (15:00 window); Maayo only: declined → PAYMENT FAILED
  const line = lineOf(booking)
  const submit = (status: TicketStatus) => {
    setPaying(false)
    navigate(`/book/confirmed?id=${addTicket(total, status)}`, { replace: true })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <BookingHeader title="Review & pay" screen="review" />
      <ReviewRouteBanner departs={`Departs ${shortDate(booking.date)}`} arrives={trip.arrivalNote} />

      {/* "StepConfirm" (node 12348:750) */}
      <div className="flex flex-1 flex-col gap-[20px] px-[16px] pt-[16px] pb-[16px]">
        <TripDetails trip={trip} />
        <div className="flex w-full flex-col gap-[8px]">
          <PassengersSection passengers={passengers} />
          {vehicles.length > 0 && <VehiclesSection vehicles={vehicles} />}
          <PriceSummary subtotal={subtotal} serviceFee={serviceFee} total={total} />
        </div>
        <PaymentMethod method={method} onChange={setMethod} />
        <ContactDetails onConfirmed={setEmailOk} />
      </div>

      <StepFooter
        note={
          <>
            {!emailOk && <p className="mb-[8px] text-center text-[14px] leading-[20px] text-[#f97316]">Enter and confirm your email to continue</p>}
            <TermsNote />
          </>
        }
        disabled={!emailOk}
        onClick={() => setPaying(true)}>
        <span className="font-bold whitespace-pre">{`Pay ${pesoTotal(total)}  `}</span>
      </StepFooter>
      <PaymentSheet open={paying} method={method} total={total} line={line} onPaid={() => submit(LINES[line].paidStatus)} onFailed={() => submit('failed')} onClose={() => submit('pending')} />
    </div>
  )
}
