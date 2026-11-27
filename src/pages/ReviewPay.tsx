import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useBooking } from '../booking/BookingContext'
import BookingHeader from '../components/booking/BookingHeader'
import StepFooter from '../components/booking/StepFooter'
import PaymentSheet from '../components/tickets/PaymentSheet'
import ReviewRouteBanner from '../components/step-review/ReviewRouteBanner'
import { ContactDetails, PassengersSection, PaymentMethod, type PayMethod, TermsNote, TripDetails, VehiclesSection } from '../components/step-review/ReviewSections'
import { PriceSummary, TotalBar, VoucherCard } from '../components/step-review/Vouchers'
import { pesoTotal, reviewData, SERVICE_FEE, shortDate } from '../data/step-review'
import { LINES, lineOf, type ShippingLine } from '../data/tickets'
import { checkVoucher, VOUCHERS, type VoucherCheck } from '../data/policy'
import { setProtoFlag, useProtoFlags, voucherDemo, type ProtoFlags } from '../proto/flags'
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

  // Vouchers card: usable ones as orange tickets, the rest greyed out with the reason (prototype controls can show none usable / none at all)
  const flags = useProtoFlags()
  const vouchers = voucherLists(subtotal, line, flags.voucherList)
  // prototype controls → Voucher animation: compare the two versions
  const barVersion = flags.voucherAnim === 'bar'
  // the Terms line now sits under the Mobile number (Contact details)
  const footerNote = !emailOk ? <p className="mb-[8px] text-center text-[14px] leading-[20px] text-[#f97316]">Enter and confirm your email to continue</p> : undefined

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
          <VoucherCard
            applied={voucher}
            gone={gone}
            check={(code) => checkVoucher(code, { subtotal, line })}
            suggestions={vouchers.usable}
            unavailable={vouchers.unavailable}
            onApply={(code) => {
              const result = checkVoucher(code, { subtotal, line })
              if (result === 'ok') {
                update({ voucher: code })
                setGone(false)
              }
              return result
            }}
          />
          <PriceSummary subtotal={subtotal} serviceFee={serviceFee} discount={discount} voucher={voucher} total={total} onRemove={() => update({ voucher: undefined })} bar={barVersion} />
        </div>
        <PaymentMethod method={method} onChange={setMethod} />
        <ContactDetails onConfirmed={setEmailOk} />
      </div>

      {barVersion ? (
        <TotalBar
          total={total}
          voucher={voucher}
          saved={discount || SERVICE_FEE - serviceFee}
          onRemove={() => update({ voucher: undefined })}
          note={footerNote}
          disabled={!emailOk}
          onPay={() => setPaying(true)}
        />
      ) : (
        <StepFooter note={footerNote} disabled={!emailOk} onClick={() => setPaying(true)}>
          <span className="font-bold whitespace-pre">{`Pay ${pesoTotal(total)}  `}</span>
        </StepFooter>
      )}
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

/** why a voucher can't be used on this booking (shown under its grey ticket) */
function unavailableReason(code: string, result: VoucherCheck) {
  const v = VOUCHERS[code]
  if (result === 'expired') return 'Expired'
  if (v.line) return `${LINES[v.line].name} only`
  if (v.min) return `For bookings ₱${v.min.toLocaleString('en-US')}+`
  return 'Fully claimed'
}

function voucherLists(subtotal: number, line: ShippingLine, mode: ProtoFlags['voucherList']) {
  if (mode === 'empty') return { usable: [], unavailable: [] }
  const codes = Object.keys(VOUCHERS).filter((c) => VOUCHERS[c].off !== 'fee')
  const usable = mode === 'auto' ? codes.filter((c) => checkVoucher(c, { subtotal, line }) === 'ok') : []
  const unavailable = codes.filter((c) => !usable.includes(c)).map((code) => ({ code, reason: unavailableReason(code, checkVoucher(code, { subtotal, line })) }))
  return { usable, unavailable }
}
