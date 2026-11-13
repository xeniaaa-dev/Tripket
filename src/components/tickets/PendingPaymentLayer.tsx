import { useEffect, useState } from 'react'
import bannerClose from '../../assets/figma/tickets/banner-close.svg'
import clockRed from '../../assets/figma/tickets/clock-red.svg'
import { useBooking } from '../../booking/BookingContext'
import { dismissedBanners, expiredAcked, mmss, toView, tripOf } from '../../data/tickets'
import { OperatorLogo } from './TicketCard'
import { useTicketActions } from './useTicketActions'

// Shown over the tab screens (TabsLayout):
// - "CONTINUE TO PAYMENT" floating banner with countdown while a booking awaits payment (Figma 11598:48968, and the Home
//   frame of "Pending Payment Flow" 11598:56447); tap → payment sheet, × → dismissed for that booking.
// - "Payment Window Expired" modal when a pending booking runs out of time (Pending Payment Flow, 3rd frame).

export default function PendingPaymentLayer() {
  const { tickets } = useBooking()
  const { continuePayment, rebook, paymentSheet } = useTicketActions()
  const [, bump] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  const pending = tickets.filter((t) => t.status === 'pending' && !dismissedBanners.has(t.id)).at(-1)
  const expired = tickets.find((t) => t.status === 'expired' && !expiredAcked.has(t.id))

  useEffect(() => {
    if (!pending) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [pending])

  const ack = (id: string) => {
    expiredAcked.add(id)
    bump((n) => n + 1)
  }

  return (
    <>
      {pending && (
        <div className="fixed bottom-[82px] left-1/2 z-30 w-[min(calc(100vw-32px),480px)] -translate-x-1/2">
          <button
            type="button"
            onClick={() => continuePayment(toView(pending))}
            className="relative block h-[77px] w-full overflow-clip rounded-12 bg-white/90 text-left shadow-[0_0_0_0.5px_rgba(0,0,0,0.04),0_2px_20px_0_rgba(0,0,0,0.05),0_8px_40px_-4px_rgba(0,0,0,0.06)] backdrop-blur-[5px]"
          >
            <span className="absolute top-px left-[-49px] h-[94px] w-[150px] bg-[#e167ff] opacity-12 blur-[80px]" />
            <span className="absolute top-1/2 left-[7px] flex size-[56px] -translate-y-1/2 items-end justify-center overflow-clip rounded-[8px] bg-white p-[4px] shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]">
              <OperatorLogo src={tripOf(pending).logo} alt={tripOf(pending).operator} className="size-[43px] border-0" />
            </span>
            <span className="absolute top-[10.6px] left-[68px] flex w-[168px] flex-col gap-[2px]">
              <span className="h-[17px] text-[14px] font-medium tracking-[-0.28px] text-[#fb923c]">CONTINUE TO PAYMENT</span>
              <span className="flex h-[16px] items-center gap-[4px] text-[16px] leading-none font-extrabold tracking-[-0.6px] whitespace-nowrap text-[#1c1917]">
                {pending.booking.from.code} <span>→</span> {pending.booking.to.code}
              </span>
              <span className="h-[15px] text-[12px] font-medium whitespace-nowrap text-[#5e5d5f]">{tripOf(pending).short}</span>
            </span>
            <span className="absolute top-[calc(50%-8.2px)] right-[16px] font-mono text-[20px] leading-[19.5px] font-medium whitespace-nowrap text-[#ef4444]">
              {mmss((pending.pendingUntil ?? now) - now)}
            </span>
          </button>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => {
              dismissedBanners.add(pending.id)
              bump((n) => n + 1)
            }}
            className="absolute -top-[6px] -right-[4px] flex size-[22px] items-center justify-center"
          >
            <img alt="" src={bannerClose} className="size-[15.27px]" />
          </button>
        </div>
      )}

      {expired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(120,120,120,0.35)] backdrop-blur-[6px]">
          <div role="alertdialog" aria-label="Payment Window Expired" className="flex w-[307px] flex-col items-center rounded-12 bg-white px-[16px] pt-[16px] pb-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
            <span className="flex size-[52px] items-center justify-center rounded-full bg-[#ffe4e6]">
              <img alt="" src={clockRed} className="size-[26px]" />
            </span>
            <h2 className="mt-[16px] text-[17px] font-semibold text-[#1c1917]">Payment Window Expired</h2>
            <p className="mt-[8px] text-center text-[13px] leading-[20px] text-[#5e5d5f]">Your seats were released. Prices or availability may have changed</p>
            <button
              type="button"
              onClick={() => {
                ack(expired.id)
                rebook(toView(expired))
              }}
              className="mt-[24px] flex h-[52px] w-full items-center justify-center rounded-12 bg-[#f97316] text-[15px] font-semibold text-white transition-transform active:scale-[0.98]"
            >
              Rebook trip
            </button>
            <button
              type="button"
              onClick={() => ack(expired.id)}
              className="mt-[12px] flex h-[52px] w-full items-center justify-center rounded-12 border border-[#f97316] bg-white text-[15px] font-semibold text-[#f97316]"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {paymentSheet}
    </>
  )
}
