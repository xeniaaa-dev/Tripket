import { useState } from 'react'
import type { PassengerDetail } from '../../booking/BookingContext'
import Drawer from '../Drawer'

// INVENTED (no cancel entry point in Figma or reachable on live): cancel a booked ticket from Booking details.
// Styled like the Figma confirmation screens (passenger rows of "OrderSummary", 56px orange / outlined buttons).
// All passengers selected → whole booking cancelled (FOR REFUND → REFUNDED); some → partial cancellation (stays BOOKED).

type Props = { open: boolean; passengers: PassengerDetail[]; onClose: () => void; onConfirm: (ids: string[]) => void }

export default function CancelSheet({ open, passengers, onClose, onConfirm }: Props) {
  const [picked, setPicked] = useState<string[]>(() => passengers.map((p) => p.id))
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setPicked(passengers.map((p) => p.id))
  }
  const all = picked.length === passengers.length
  const toggle = (id: string) => setPicked((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

  return (
    <Drawer open={open} onClose={onClose} label="Cancel booking">
      <h2 className="text-[18px] font-bold tracking-[-0.3px] text-text-primary">Cancel booking</h2>
      <p className="mt-[4px] text-[13px] leading-[18px] text-text-secondary">Choose who is no longer traveling. The refund goes back to your original payment method.</p>
      <div className="mt-[16px] flex max-h-[280px] flex-col gap-[8px] overflow-y-auto">
        {passengers.map((p) => {
          const on = picked.includes(p.id)
          return (
            <button
              key={p.id}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => toggle(p.id)}
              className={`flex w-full items-center justify-between rounded-[8px] border px-[12px] py-[10px] text-left ${on ? 'border-[#f97316] bg-[#fff7ed]' : 'border-[#b4b4b4]'}`}
            >
              <span className="flex flex-col gap-[4px]">
                <span className="text-[14px] text-[#1c1917]">{p.fullName}</span>
                <span className="flex gap-[4px]">
                  <span className="rounded-[20px] bg-[#ececec] px-[8px] py-[2px] text-[9px] font-semibold text-[#8e8e93]">{p.fareType}</span>
                  <span className="rounded-[20px] bg-[#fff7ed] px-[8px] py-[2px] text-[9px] font-semibold text-[#f97316]">{p.cabin}</span>
                </span>
              </span>
              <span className={`flex size-[20px] items-center justify-center rounded-full border-[1.5px] ${on ? 'border-[#f97316] bg-[#f97316]' : 'border-border-default'}`}>
                {on && <span className="size-[8px] rounded-full bg-white" />}
              </span>
            </button>
          )
        })}
      </div>
      <div className="mt-[16px] flex flex-col gap-[12px]">
        <button
          type="button"
          disabled={picked.length === 0 && passengers.length > 0}
          onClick={() => onConfirm(passengers.length === 0 ? [] : picked)}
          className="flex h-[56px] w-full items-center justify-center rounded-16 bg-[#ff3b30] text-[15px] font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          {all || passengers.length === 0 ? 'Cancel entire booking' : `Cancel ${picked.length} passenger${picked.length === 1 ? '' : 's'}`}
        </button>
        <button type="button" onClick={onClose} className="flex h-[56px] w-full items-center justify-center rounded-16 border-[1.5px] border-[#f97316] bg-white text-[15px] font-bold text-[#f97316]">
          Keep booking
        </button>
      </div>
    </Drawer>
  )
}
