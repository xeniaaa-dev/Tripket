import { useEffect, useState } from 'react'
import bg from '../../assets/figma/home/recent/return-trip-bg.jpg'
import arrow from '../../assets/figma/home/recent/greater-than-lg.svg'
import { VOUCHER } from '../../data/policy'
import type { TicketView } from '../../data/tickets'
import Drawer from '../Drawer'
import { Glyph } from './IconRows'

// After a booking: a one-time bottom sheet that nudges the return trip
// (with the zero-service-fee voucher) once the booking is confirmed.

/** Voucher strip: green tint row, ticket glyph, code pill on the right. */
function VoucherRow() {
  return (
    <div className="flex items-center gap-[10px] rounded-12 bg-[#e9f9ee] py-[10px] pr-[10px] pl-[12px]">
      <Glyph name="ticket" className="shrink-0 text-[#16a34a]" />
      <p className="flex min-w-0 flex-1 flex-col">
        <span className="text-[13px] leading-[18px] font-bold text-[#166534]">{VOUCHER.title}</span>
        <span className="text-[12px] leading-[16px] text-[#4d7c5a]">{VOUCHER.note}</span>
      </p>
      <span className="shrink-0 rounded-[6px] border border-dashed border-[#86efac] bg-white px-[7px] py-[2px] text-[10px] leading-[14px] font-semibold tracking-[0.8px] text-[#15803d]">{VOUCHER.code}</span>
    </div>
  )
}

// Once per booking, a moment after it's confirmed.
const prompted = new Set<string>()

export function ReturnModal({ ticket, onBook }: { ticket: TicketView; onBook: () => void }) {
  const [open, setOpen] = useState(false)
  const id = ticket.id
  useEffect(() => {
    if (prompted.has(id)) return
    const t = setTimeout(() => {
      prompted.add(id)
      setOpen(true)
    }, 900)
    return () => clearTimeout(t)
  }, [id])
  const { from, to } = ticket.booking
  return (
    <Drawer open={open} onClose={() => setOpen(false)} label="Book your return trip">
      <div className="flex justify-center pb-[8px]">
        <span className="h-[4px] w-[36px] rounded-[2px] bg-[#e4e4e7]" />
      </div>
      {/* same photo + route treatment as the Figma "Ready to head back?" card */}
      <div className="relative mt-[8px] h-[112px] w-full overflow-clip rounded-16">
        <img alt="" src={bg} className="pointer-events-none absolute top-1/2 left-1/2 h-auto w-[max(548px,140%)] max-w-none -translate-x-[63.7%] -translate-y-1/2" />
        <div className="absolute inset-0 flex items-center justify-center gap-[15px] bg-[rgba(46,46,46,0.5)] text-[28px] leading-none font-extrabold tracking-[-0.7px] text-white backdrop-blur-[2px]">
          <span>{to.code}</span>
          <img alt="" src={arrow} className="size-[16px]" />
          <span>{from.code}</span>
        </div>
      </div>
      <h2 className="mt-[16px] text-center text-[20px] leading-[28px] font-bold text-[#171717]">Heading back to {from.city}?</h2>
      <p className="mt-[4px] text-center text-[14px] leading-[20px] text-[#8e8e93]">Your passengers are already filled in. Just pick a date.</p>
      <div className="mt-[16px]">
        <VoucherRow />
      </div>
      <button
        type="button"
        onClick={() => {
          setOpen(false)
          onBook()
        }}
        className="mt-[20px] h-[56px] w-full rounded-16 bg-[#f97316] text-[16px] font-bold text-white transition-transform active:scale-[0.99]"
      >
        Book return trip
      </button>
      <button type="button" onClick={() => setOpen(false)} className="mt-[4px] h-[48px] w-full text-[15px] font-medium text-[#8e8e93]">
        Maybe later
      </button>
    </Drawer>
  )
}
