import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking } from '../booking/BookingContext'
import BookingHeader from '../components/booking/BookingHeader'
import StepFooter from '../components/booking/StepFooter'
import PaymentSheet from '../components/tickets/PaymentSheet'
import ReviewRouteBanner from '../components/step-review/ReviewRouteBanner'
import { ContactDetails, PassengersSection, PaymentMethod, type PayMethod, PriceSummary, FooterTerms, TermsNote, TripDetails, VehiclesSection, VoucherField } from '../components/step-review/ReviewSections'
import { pesoTotal, reviewData, SERVICE_FEE, shortDate } from '../data/step-review'
import { LINES, lineOf } from '../data/tickets'
import { checkVoucher, VOUCHERS } from '../data/policy'
import { setProtoFlag, voucherDemo } from '../proto/flags'
import type { TicketStatus } from '../booking/BookingContext'

// Figma: "Book - Review - Single Leg - No terminal Fee" (node 12348:746)
export default function ReviewPay() {
  const navigate = useNavigate()
  const { booking, addTicket, update } = useBooking()
  const { passengers, vehicles, trip, subtotal, serviceFee, discount, voucher, total } = reviewData(booking)
  // Limited voucher all claimed by other users before this one paid (prototype switch) → drop it, back to the full price
  const [gone, setGone] = useState(false)
  const [method, setMethod] = useState<PayMethod>('card')
  const [paying, setPaying] = useState(false)
  // Prototype controls → Voucher states → "No longer available": apply SAVE200, make vouchers run out, open the payment sheet (tapping Pay fails)
  useEffect(() => {
    voucherDemo.gone = () => {
      update({ voucher: 'SAVE200' })
      setProtoFlag('vouchersGone', true)
      setPaying(true)
    }
    return () => void (voucherDemo.gone = undefined)
  }, [update])
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
        <TermsNote line={line} operator={LINES[line].name} />
        <div className="flex w-full flex-col gap-[8px]">
          <PassengersSection passengers={passengers} />
          {vehicles.length > 0 && <VehiclesSection vehicles={vehicles} />}
          <VoucherField
            applied={voucher}
            saved={discount || SERVICE_FEE - serviceFee}
            gone={gone}
            onApply={(code) => {
              const result = checkVoucher(code, { subtotal, line })
              if (result === 'ok') {
                update({ voucher: code })
                setGone(false)
              }
              return result
            }}
            onRemove={() => update({ voucher: undefined })}
          />
          <PriceSummary subtotal={subtotal} serviceFee={serviceFee} discount={discount} voucher={voucher} total={total} />
        </div>
        <PaymentMethod method={method} onChange={setMethod} />
        <ContactDetails onConfirmed={setEmailOk} />
      </div>

      <StepFooter
        note={
          <>
            {!emailOk && <p className="mb-[8px] text-center text-[14px] leading-[20px] text-[#f97316]">Enter and confirm your email to continue</p>}
            <FooterTerms />
          </>
        }
        disabled={!emailOk}
        onClick={() => setPaying(true)}>
        <span className="font-bold whitespace-pre">{`Pay ${pesoTotal(total)}  `}</span>
      </StepFooter>
      <PaymentSheet open={paying} method={method} total={total} line={line} onPaid={() => submit(LINES[line].paidStatus)} onFailed={() => submit('failed')} onClose={() => submit('pending')}
        limitedVoucher={!!voucher && VOUCHERS[voucher]?.limited}
        onVoucherGone={() => {
          update({ voucher: undefined })
          setGone(true)
        }}
        onBack={() => {
          setPaying(false)
          setTimeout(() => {
            const field = document.getElementById('voucher')
            field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            field?.querySelector('input')?.focus({ preventScroll: true })
          }, 300)
        }}
      />
    </div>
  )
}
