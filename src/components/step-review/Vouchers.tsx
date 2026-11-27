import { useEffect, useRef, useState, type ReactNode } from 'react'
import infoNote from '../../assets/figma/confirmation/info-note.svg'
import { VOUCHERS, type VoucherCheck } from '../../data/policy'
import { pesoTotal, SERVICE_FEE } from '../../data/step-review'
import { voucherDemo } from '../../proto/flags'
import { DISSOLVE, dustFly, landing } from './couponDust'
import { PriceRows, type PriceProps } from './ReviewSections'

// Review & pay totals + Vouchers card (user's design): orange ticket cards; tapping one turns it to dust that gathers under
// the Total as a mini ticket (total rolls down, "You save ₱X"). The mini ticket / × sends it back to its slot the same way.

/** ms until the dust lands (0 when nothing is flying) */
const untilLanded = () => Math.max(0, landing.until - performance.now())

/** Mounts hidden and pops in once the dust has landed */
function Appear({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [delay] = useState(untilLanded)
  return (
    <span style={delay ? { animationDelay: `${Math.max(0, delay - 220)}ms` } : undefined} className={`${className} ${delay ? 'animate-[tag-form_560ms_cubic-bezier(.22,1,.36,1)_both]' : ''}`}>
      {children}
    </span>
  )
}

/** Opens room for the mini ticket in the bottom bar (only when it arrives by dust, not on page load) */
function SlotOpen({ children }: { children: ReactNode }) {
  const [animate] = useState(() => untilLanded() > 0)
  return <span className={`block ${animate ? 'animate-[tag-slot_500ms_cubic-bezier(.22,1,.36,1)_both]' : ''}`}>{children}</span>
}

/** Total that rolls to its new value once the dust has landed */
function AnimatedAmount({ value, className, id }: { value: number; className: string; id?: string }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const start = from.current
    if (start === value) return
    let raf = 0
    const t0 = performance.now() + untilLanded()
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / 900))
      const v = start + (value - start) * (1 - (1 - k) ** 4)
      from.current = v
      setShown(k >= 1 ? value : Math.round(v * 100) / 100)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return (
    <span id={id} className={`tabular-nums ${className}`}>
      {pesoTotal(shown)}
    </span>
  )
}

/** "10%" / "₱150" on the ticket stub */
function stub(code: string) {
  const v = VOUCHERS[code]
  if (!v || v.off === 'fee') return 'FREE'
  return v.pct ? `${v.pct}%` : `₱${v.off}`
}

const STUB_W = 58
/** notches cut into the top and bottom edge where the stub starts */
const notch = `radial-gradient(circle 6px at calc(100% - ${STUB_W}px) 0, transparent 97%, #000 100%), radial-gradient(circle 6px at calc(100% - ${STUB_W}px) 100%, transparent 97%, #000 100%)`

/** Orange voucher ticket: TRIPKET / code on the left, "10% OFF" stub on the right (176×58; `small` = the mini ticket by the total).
 *  `muted` = can't be used on this booking: grey, no glow. */
export function Ticket({ code, small, muted }: { code: string; small?: boolean; muted?: boolean }) {
  const ticket = (
    <span className={`block ${muted ? '' : '[filter:drop-shadow(0_6px_12px_rgba(240,106,37,0.35))]'}`}>
      <span
        className={`relative flex h-[58px] w-[176px] overflow-hidden rounded-[11px] ${muted ? 'text-[#a1a1aa]' : 'text-white'}`}
        style={{
          background: muted ? 'linear-gradient(100deg, #f1f1f3 0%, #e6e6ea 100%)' : 'linear-gradient(100deg, #f9a46d 0%, #f27a3a 55%, #ee6a26 100%)',
          WebkitMaskImage: notch,
          maskImage: notch,
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        {!muted && <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0)_60%)]" />}
        <span className="relative flex min-w-0 flex-1 flex-col items-start justify-center pl-[14px] text-left">
          <span className="text-[8px] leading-[10px] font-semibold tracking-[1.6px] opacity-75">TRIPKET</span>
          <span className="mt-[5px] truncate text-[14px] leading-[17px] font-bold tracking-[0.2px]">{code}</span>
        </span>
        <span className={`relative flex shrink-0 flex-col items-center justify-center ${muted ? 'bg-[#dcdce0]' : 'bg-[linear-gradient(100deg,#e86428,#c8481b)]'}`} style={{ width: STUB_W }}>
          <span className={`absolute top-[8px] bottom-[8px] left-0 border-l border-dashed ${muted ? 'border-[#c4c4c8]' : 'border-white/60'}`} />
          <span className="text-[18px] leading-[20px] font-extrabold tracking-[-0.3px]">{stub(code)}</span>
          <span className="mt-[2px] text-[7.5px] leading-[9px] font-semibold tracking-[1.6px] opacity-85">{VOUCHERS[code]?.off === 'fee' ? 'FEE' : 'OFF'}</span>
        </span>
      </span>
    </span>
  )
  if (!small) return ticket
  return (
    <span className="relative block h-[25px] w-[76px]">
      <span className="absolute top-0 left-0 origin-top-left scale-[0.432]">{ticket}</span>
    </span>
  )
}

let removing = false
/** the mini ticket (#voucher-tag: under the Total, or in the bottom bar) turns to dust and flies back to its slot in the Vouchers card, then the voucher comes off */
function removeWithDust(voucher: string | undefined, onRemove: () => void) {
  const el = document.getElementById('voucher-tag')
  if (removing) return
  if (!el || !voucher || !document.getElementById(`voucher-slot-${voucher}`)) return onRemove()
  removing = true
  dustFly(el, () => document.getElementById(`voucher-slot-${voucher}`)).then(() => (removing = false))
  setTimeout(onRemove, DISSOLVE)
}

type SummaryProps = PriceProps & { onRemove: () => void; /** bottom-bar version: the voucher lands in the Pay bar instead of under the Total */ bar?: boolean }
/** Subtotal / Service fee / Voucher / Total + the voucher line under the Total + terminal-fee note */
export function PriceSummary({ onRemove, bar, ...props }: SummaryProps) {
  const { voucher, discount = 0, serviceFee } = props
  const saved = discount || (voucher ? SERVICE_FEE - serviceFee : 0)
  const remove = () => removeWithDust(voucher, onRemove)
  return (
    <section className="flex w-full flex-col items-center gap-[14px]">
      <div className="flex w-full flex-col">
        <PriceRows
          {...props}
          large
          totalLabel="Total"
          amount={<AnimatedAmount id="total-amount" value={props.total} className="text-[28px] leading-[34px] font-extrabold tracking-[-0.5px] text-[#ea580c]" />}
          below={
            bar ? undefined : voucher ? (
              <div className="mt-[8px] flex min-h-[28px] items-center justify-between">
                <Appear className="flex items-center gap-[8px]">
                  <button type="button" id="voucher-tag" aria-label={`Remove voucher ${voucher}`} onClick={remove}>
                    <Ticket code={voucher} small />
                  </button>
                  <button type="button" aria-label="Remove voucher" onClick={remove} className="flex size-[22px] items-center justify-center rounded-full bg-[#f2f2f4] text-[#8e8e93]">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                      <path d="M2 2l6 6M8 2 2 8" />
                    </svg>
                  </button>
                </Appear>
                {saved > 0 && <Appear className="text-[15px] leading-[20px] font-semibold text-[#16a34a]">You save {pesoTotal(saved)}</Appear>}
              </div>
            ) : (
              <p id="voucher-tag-slot" className="mt-[8px] flex min-h-[28px] items-center text-[14px] leading-[20px] text-[#a1a1aa]">
                No voucher applied
              </p>
            )
          }
        />
      </div>
      <div className="flex w-full items-start gap-[10px] rounded-16 bg-[#f2f2f7] px-[16px] py-[12px]">
        <img alt="" src={infoNote} className="mt-[2px] size-[15px]" />
        <p className="flex-1 text-[13px] leading-[18px] text-[#8e8e93]">Terminal and port fees are not included. These are collected separately at the port before boarding.</p>
      </div>
    </section>
  )
}

/**
 * Bottom-bar version (user's reference: the coupon flies to the fixed total bar): "Total", mini ticket + amount, "You save ₱X"
 * on the left, Pay on the right. The dust lands here instead of under the Total in the page.
 */
export function TotalBar({ total, voucher, saved, onRemove, note, disabled, onPay }: { total: number; voucher?: string; saved: number; onRemove: () => void; note?: ReactNode; disabled?: boolean; onPay: () => void }) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-[#f0f0f0] bg-white px-[16px] pt-[12px] pb-[16px]">
      {note}
      <div className="flex items-center justify-between gap-[12px]">
        <div className="flex min-w-0 flex-col">
          <span className="text-[13px] leading-[18px] text-[#8e8e93]">Total</span>
          <span className="flex items-center gap-[8px]">
            {voucher && (
              // the space for the ticket opens smoothly (the total slides right) while the dust is on its way
              <SlotOpen>
                <Appear className="block">
                  <button type="button" id="voucher-tag" aria-label={`Remove voucher ${voucher}`} onClick={() => removeWithDust(voucher, onRemove)}>
                    <Ticket code={voucher} small />
                  </button>
                </Appear>
              </SlotOpen>
            )}
            <span id={voucher ? undefined : 'voucher-tag-slot'}>
              <AnimatedAmount value={total} className="text-[22px] leading-[30px] font-extrabold tracking-[-0.4px] text-[#1c1917]" />
            </span>
          </span>
          {voucher && saved > 0 && <Appear className="text-[13px] leading-[18px] font-semibold text-[#16a34a]">You save {pesoTotal(saved)}</Appear>}
        </div>
        <button type="button" disabled={disabled} onClick={onPay} className="flex h-[56px] w-[46%] shrink-0 items-center justify-center gap-[6px] rounded-16 bg-[#f97316] text-[16px] leading-[24px] font-semibold text-white disabled:opacity-50">
          Pay now
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 3.5 10.5 8 6 12.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const VOUCHER_ERROR: Record<Exclude<VoucherCheck, 'ok'>, string> = {
  invalid: 'Invalid voucher code. Please check the code and try again.',
  expired: 'This voucher has expired. Try another voucher or continue without one.',
  ineligible: 'This voucher can’t be used for this booking. Check the voucher terms for eligible routes or minimum amount.',
}

const TicketPercent = ({ color = '#3c3c43' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5V9a3 3 0 0 0 0 6v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5V15a3 3 0 0 0 0-6Z" />
    <path d="m9.5 14.5 5-5" />
    <circle cx="9.7" cy="9.7" r="0.6" fill={color} />
    <circle cx="14.3" cy="14.3" r="0.6" fill={color} />
  </svg>
)

/**
 * Vouchers card on Review & pay: ticket per voucher this booking can use + "Add code" for a typed one.
 * Tap a ticket → it turns to dust and lands under the Total; its slot stays empty and the others fade (one voucher per booking).
 * Typed codes: invalid / expired / not eligible → red field + message. gone (Pay found them all claimed) → amber notice, field open.
 */
export function VoucherCard({
  applied,
  gone,
  onApply,
  check,
  suggestions,
  unavailable = [],
}: {
  applied?: string
  gone?: boolean
  onApply: (code: string) => VoucherCheck
  /** validate without applying (so a good code can turn to dust first) */
  check: (code: string) => VoucherCheck
  suggestions: string[]
  /** vouchers shown greyed out with why they can't be used here (expired, other shipping line, minimum, all claimed) */
  unavailable?: { code: string; reason: string }[]
}) {
  const [adding, setAdding] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<Exclude<VoucherCheck, 'ok'> | null>(null)
  const [flying, setFlying] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (gone) setAdding(true)
  }, [gone])

  const applyCode = (c: string, el: HTMLElement | null) => {
    if (flying) return
    const pre = check(c)
    if (pre !== 'ok' || !el) {
      const result = onApply(c)
      if (result === 'ok') setCode('')
      setError(result === 'ok' ? null : result)
      return
    }
    setFlying(true)
    setError(null)
    dustFly(el, () => document.getElementById('voucher-tag') ?? document.getElementById('voucher-tag-slot')).then(() => setFlying(false))
    setTimeout(() => {
      onApply(c)
      setCode('')
      setAdding(false)
    }, DISSOLVE)
  }

  // Prototype controls → Voucher states: type the code in and press Apply (no animation)
  const tryCode = useRef(onApply)
  useEffect(() => {
    tryCode.current = onApply
  })
  useEffect(() => {
    voucherDemo.apply = (c) => {
      const result = tryCode.current(c)
      setAdding(result !== 'ok')
      setCode(result === 'ok' ? '' : c)
      setError(result === 'ok' ? null : result)
    }
    voucherDemo.clear = () => {
      setCode('')
      setError(null)
    }
    return () => void (voucherDemo.apply = voucherDemo.clear = undefined)
  }, [])

  return (
    <section id="voucher" className="my-[8px] w-full scroll-mt-[96px] rounded-[20px] border border-[#ececec] bg-white px-[16px] pt-[16px] pb-[16px]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-[12px] text-[16px] leading-[22px] font-semibold text-[#1c1917]">
          <TicketPercent />
          Vouchers
        </h2>
        <button type="button" onClick={() => setAdding((a) => !a)} className="text-[15px] leading-[22px] font-semibold text-[#f97316]">
          {adding ? 'Cancel' : 'Add code'}
        </button>
      </div>

      {adding && (
        <div className="mt-[14px] flex flex-col gap-[8px]">
          <form
            ref={formRef}
            className="flex gap-[8px]"
            onSubmit={(e) => {
              e.preventDefault()
              applyCode(code.trim().toUpperCase(), formRef.current)
            }}
          >
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError(null)
              }}
              placeholder="Enter voucher code"
              aria-label="Voucher code"
              aria-invalid={!!error || undefined}
              autoCapitalize="characters"
              autoComplete="off"
              autoFocus={!gone}
              className={`h-[44px] min-w-0 flex-1 rounded-12 border px-[12px] text-[15px] uppercase outline-none transition-colors placeholder:normal-case placeholder:text-text-secondary ${error ? 'border-[#ef4444] bg-[#fdf2f1]' : 'border-border-default bg-white focus:border-[#f97316]'}`}
            />
            <button type="submit" disabled={!code.trim()} className="h-[44px] shrink-0 rounded-12 bg-[#f97316] px-[18px] text-[14px] font-bold text-white transition-opacity disabled:opacity-50">
              Apply
            </button>
          </form>
          {error && (
            <p role="alert" className="text-[13px] leading-[18px] text-[#ef4444]">
              {VOUCHER_ERROR[error]}
            </p>
          )}
        </div>
      )}
      {gone && !applied && (
        <div role="alert" className="mt-[10px] flex items-start gap-[10px] rounded-12 bg-[#fff7ed] px-[12px] py-[10px]">
          <img alt="" src={infoNote} className="mt-[2px] size-[15px]" />
          <p className="flex-1 text-[13px] leading-[18px] text-[#9a3412]">
            <span className="font-semibold">Voucher no longer available.</span> All vouchers were claimed before you completed checkout.
          </p>
        </div>
      )}

      {suggestions.length === 0 && unavailable.length === 0 ? (
        // no vouchers at all
        <div className="flex flex-col items-center px-[8px] pt-[18px] pb-[4px] text-center">
          <span className="flex size-[52px] items-center justify-center rounded-full bg-[#fff7ed]">
            <TicketPercent color="#f97316" />
          </span>
          <p className="mt-[12px] text-[15px] leading-[21px] font-semibold text-[#1c1917]">No vouchers yet</p>
          <p className="mt-[2px] text-[13px] leading-[18px] text-[#8e8e93]">Vouchers you collect will show up here. Have a code? Tap Add code.</p>
        </div>
      ) : (
        <>
          {suggestions.length === 0 && (
            // vouchers exist, but none can be used on this booking
            <div className="mt-[14px] flex items-start gap-[10px] rounded-12 bg-[#f8f8fa] px-[12px] py-[10px]">
              <img alt="" src={infoNote} className="mt-[2px] size-[15px]" />
              <p className="flex-1 text-[13px] leading-[18px] text-[#5e5d5f]">
                <span className="font-semibold text-[#1c1917]">No vouchers available for this booking.</span> Your vouchers below can’t be used on this trip.
              </p>
            </div>
          )}
          <div className="-mx-[16px] mt-[8px] flex gap-[14px] overflow-x-auto px-[16px] pt-[10px] pb-[6px] [scrollbar-width:none]">
          {suggestions.map((c) => {
            const used = applied === c
            return (
              <div key={c} className="flex shrink-0 flex-col">
                {/* the applied voucher's slot stays empty (its ticket sits by the total); the dust flies back here on remove */}
                <span id={`voucher-slot-${c}`} className={used ? 'invisible' : ''}>
                  {!used && (
                    <Appear className="block">
                      <button
                        type="button"
                        disabled={flying || !!applied}
                        aria-label={`Apply voucher ${c}, ${VOUCHERS[c]?.terms}`}
                        onClick={(e) => applyCode(c, e.currentTarget)}
                        className={`block transition-[opacity,transform] duration-300 active:scale-[0.97] ${applied ? 'opacity-40' : ''}`}
                      >
                        <Ticket code={c} />
                      </button>
                    </Appear>
                  )}
                  {used && <span className="block h-[58px] w-[176px]" />}
                </span>
                <span className={`mt-[6px] pl-[4px] text-[13px] leading-[18px] transition-opacity ${used ? 'opacity-0' : applied ? 'text-[#8e8e93] opacity-40' : 'text-[#8e8e93]'}`}>
                  {VOUCHERS[c]?.terms}
                </span>
              </div>
            )
          })}
            {unavailable.map(({ code: c, reason }) => (
              <div key={c} role="group" className="flex shrink-0 flex-col" aria-label={`${c}, not available: ${reason}`}>
                <Ticket code={c} muted />
                <span className="mt-[6px] flex items-center gap-[4px] pl-[4px] text-[13px] leading-[18px] font-medium text-[#8e8e93]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      {suggestions.length > 0 && <p className="mt-[8px] text-[13px] leading-[18px] text-[#a1a1aa]">{applied ? 'Tap the voucher beside your total to remove it' : 'One voucher per booking'}</p>}
    </section>
  )
}
