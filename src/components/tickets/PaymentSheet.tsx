import { useEffect, useRef, useState } from 'react'
import Drawer from '../Drawer'
import close from '../../assets/live/tickets/close.svg'
import { pesoTotal } from '../../data/step-review'
import { protoFlags, setProtoFlag } from '../../proto/flags'
import { PAY_LABEL, type PayMethod } from '../step-review/ReviewSections'
import type { ShippingLine } from '../../data/tickets'

// PROTOTYPE payment step (not in Figma or reachable on live: the real app hands over to a payment gateway).
// "Pay" on Review & pay opens this; paying completes payment, closing it (×, backdrop, Esc) leaves the booking
// unpaid → PENDING PAYMENT with a 15:00 window (Figma "Pending Payment Flow", 11598:56447).
// Uses the live drawer chrome; the loading copy "Processing Payment..." is the live app's payment loader text.

type Props = { open: boolean; method?: PayMethod; total: number; line?: ShippingLine; onPaid: () => void; onFailed?: () => void; onClose: () => void }

const Field = ({ label, value, className = '' }: { label: string; value: string; className?: string }) => (
  <div className={`flex flex-col gap-[2px] rounded-12 border border-border-default px-[12px] py-[8px] ${className}`}>
    <span className="text-[11px] text-text-muted">{label}</span>
    <span className="text-[14px] font-medium text-text-primary">{value}</span>
  </div>
)

// Decorative QR-like pattern (deterministic); not a scannable code.
function FakeQr() {
  const n = 25
  const on = (x: number, y: number) => {
    const finder = (fx: number, fy: number) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7
    for (const [fx, fy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      if (finder(fx, fy)) {
        const dx = x - fx, dy = y - fy
        return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
      }
    }
    return ((x * 7 + y * 13 + x * y) % 5) < 2
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="size-[168px]" shapeRendering="crispEdges" role="img" aria-label="QR Ph code">
      <rect width={n} height={n} fill="#fff" />
      {Array.from({ length: n * n }, (_, i) => [i % n, Math.floor(i / n)]).map(([x, y]) => on(x, y) && <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#111827" />)}
    </svg>
  )
}

export default function PaymentSheet({ open, method = 'card', total, line, onPaid, onFailed, onClose }: Props) {
  const [paying, setPaying] = useState(false)
  const [decline, setDecline] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const pay = () => {
    setPaying(true)
    timer.current = setTimeout(() => {
      setPaying(false)
      // "Next payment fails" from the Prototype controls behaves like the checkbox below (Maayo only), then switches itself off
      const forced = line === 'maayo' && protoFlags().declineNext
      if (forced) setProtoFlag('declineNext', false)
      if ((decline || forced) && onFailed) onFailed()
      else onPaid()
    }, 1200)
  }

  return (
    <Drawer open={open} onClose={() => !paying && onClose()} label={`${PAY_LABEL[method]} payment`}>
      <div className="flex items-center justify-between pb-[16px]">
        <h2 className="text-[18px] font-bold tracking-[-0.3px] text-text-primary">{method === 'card' ? 'Card payment' : `Pay with ${PAY_LABEL[method]}`}</h2>
        <button type="button" aria-label="Close payment" onClick={() => !paying && onClose()} className="flex size-8 items-center justify-center rounded-full bg-neutral-100">
          <img alt="" src={close} className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center justify-between rounded-16 bg-[#f8f8fa] px-[16px] py-[12px]">
          <span className="text-[13px] text-text-secondary">Amount due</span>
          <span className="text-[20px] font-bold text-[#f97316]">{pesoTotal(total)}</span>
        </div>
        {method === 'card' && (
          <>
            <Field label="Card number" value="4242 4242 4242 4242" />
            <div className="flex gap-[12px]">
              <Field label="Expiry" value="12 / 28" className="flex-1" />
              <Field label="CVC" value="•••" className="flex-1" />
            </div>
          </>
        )}
        {(method === 'gcash' || method === 'maya') && (
          <>
            <Field label={`${PAY_LABEL[method]} mobile number`} value="0917 123 4567" />
            <p className="text-[12px] leading-[18px] text-text-secondary">You'll approve this payment in the {PAY_LABEL[method]} app. A one-time PIN may be required.</p>
          </>
        )}
        {method === 'qrph' && (
          <div className="flex flex-col items-center gap-[8px] rounded-16 border border-border-default p-[16px]">
            <FakeQr />
            <span className="text-[13px] font-semibold text-text-primary">Scan to pay with QR Ph</span>
            <span className="text-center text-[12px] text-text-secondary">Open any banking or e-wallet app, scan this code, then tap the button below.</span>
          </div>
        )}
        <p className="text-[11px] text-text-muted">Prototype payment — nothing is charged. Close this sheet to leave the payment unfinished.</p>
        {line === 'maayo' && (
          // PROTOTYPE-ONLY: only Maayo has a "Payment Failed" screen in Figma; nothing in Figma says how it is reached
          <label className="flex items-center gap-[8px] rounded-12 border border-dashed border-[#b4b4b4] px-[12px] py-[8px] text-[12px] text-text-secondary">
            <input type="checkbox" checked={decline} onChange={(e) => setDecline(e.target.checked)} />
            Simulate a declined payment (prototype only)
          </label>
        )}
        <button
          type="button"
          disabled={paying}
          onClick={pay}
          className="flex h-[56px] w-full items-center justify-center rounded-16 bg-[#f97316] text-[15px] font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-80"
        >
          {paying ? 'Processing Payment...' : method === 'qrph' ? `I've paid ${pesoTotal(total)}` : `Pay ${pesoTotal(total)}`}
        </button>
      </div>
    </Drawer>
  )
}
