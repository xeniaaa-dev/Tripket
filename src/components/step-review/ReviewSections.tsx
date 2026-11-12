import { useState, type ReactNode } from 'react'
import caretDown from '../../assets/figma/step-review/caret-down.svg'
import line10 from '../../assets/figma/step-review/line-10.svg'
import philippines from '../../assets/figma/step-review/philippines.png'
import infoNote from '../../assets/figma/confirmation/info-note.svg'
import tick01 from '../../assets/figma/step-review/tick-01.svg'
import visaMastercard from '../../assets/figma/step-review/visa-mastercard.svg'
import type { PassengerDetail, VehicleDetail } from '../../booking/BookingContext'
import { peso, pesoTotal, type Trip } from '../../data/step-review'
import { CardIcon, MailIcon, RouteIcon, TickWhiteIcon, UserIcon, VanIcon } from './icons'

/** Section title row: 16px icon + 13px medium label (Trip details / Payment method / Contact details) */
function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-[19.492px] w-full items-center gap-[7.992px]">
      {icon}
      <p className="text-[13px] leading-[19.5px] font-medium whitespace-nowrap text-text-secondary">{children}</p>
    </div>
  )
}

/** List header: "Passengers (3)" / "Vehicles (1)" in #8e8e93 */
function ListTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-[20.993px] items-center gap-[7.992px]">
      {icon}
      <p className="text-[13px] leading-[19.5px] font-medium whitespace-nowrap text-[#8e8e93]">{children}</p>
    </div>
  )
}

/** grey pill: "Regular", "SUV / Pickup" */
export const GreyChip = ({ children }: { children: ReactNode }) => (
  <span className="rounded-[20.593px] bg-[#ececec] px-[8px] py-[2px] text-[11px] leading-[16.5px] font-semibold whitespace-nowrap text-[#8e8e93]">{children}</span>
)

// Figma: "Section" Trip details (node 12348:751)
export function TripDetails({ trip }: { trip: Trip }) {
  return (
    <section className="flex flex-col gap-[4px]">
      <SectionTitle icon={<RouteIcon />}>Trip details</SectionTitle>
      <div className="min-h-[32px] w-full">
        <p className="text-[24px] leading-[27px] font-bold text-[#1c1917]">
          {`${trip.departTime} `}
          <span className="text-[20px] font-medium">→</span>{' '}
          <span className="text-[20px] font-medium text-[#5e5d5f]">{`${trip.arriveTime} `}</span>
          <span className="text-[12px] font-normal text-[#5e5d5f]">({trip.duration})</span>
        </p>
      </div>
      <p className="text-[16px] leading-[24px] text-text-secondary">
        {trip.vessel} · {trip.vesselType}
      </p>
    </section>
  )
}

// Figma: Passengers "Section" (node 12348:958)
export function PassengersSection({ passengers }: { passengers: PassengerDetail[] }) {
  return (
    <section className="flex w-full flex-col gap-[7.992px]">
      <ListTitle icon={<UserIcon />}>Passengers ({passengers.length})</ListTitle>
      {passengers.map((p) => (
        <div key={p.id} className="min-h-[54px] w-full overflow-clip rounded-[8.237px] border-[0.5px] border-[#b4b4b4] bg-white pt-[4px]">
          <div className="flex flex-col justify-center gap-[2px] px-[8.237px] pb-[6.178px]">
            <div className="flex items-center justify-between">
              <p className="text-[14.415px] leading-[17px] whitespace-nowrap text-[#1c1917]">{p.fullName}</p>
              {p.fare === null ? (
                <span className="rounded-[20.593px] bg-[#d7ffe1] px-[8.237px] py-[2.059px] text-[11px] leading-[16.5px] font-semibold text-[#34c759]">Free</span>
              ) : (
                <p className="text-right text-[14px] leading-[21px] text-black">{peso(p.fare)}</p>
              )}
            </div>
            <div className="flex items-center gap-[4px]">
              <GreyChip>{p.fareType}</GreyChip>
              <span className="rounded-[20.593px] bg-[#fff7ed] px-[8.237px] py-[2.059px] text-[11px] leading-[16.5px] font-semibold whitespace-nowrap text-[#f97316]">{p.cabin}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

// Figma: Vehicles "Section" (node 12348:1012)
export function VehiclesSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <section className="flex w-full flex-col gap-[7.992px] py-[8px]">
      <ListTitle icon={<VanIcon />}>Vehicles ({vehicles.length})</ListTitle>
      {vehicles.map((v) => (
        <div key={v.id} className="min-h-[66px] w-full overflow-clip rounded-[8px] border-[0.5px] border-[#c7c7cc] p-[8px]">
          <div className="flex flex-col items-start gap-[2px]">
            <div className="flex w-full items-center justify-between pb-[6px] pl-[8px]">
              <p className="text-[14px] whitespace-nowrap text-[#1c1917]">
                <span className="font-bold">{v.plate} </span>
                {v.model}
              </p>
              <p className="text-right text-[14px] leading-[21px] text-black">{peso(v.fare)}</p>
            </div>
            <GreyChip>{v.type}</GreyChip>
          </div>
        </div>
      ))}
    </section>
  )
}

/** Subtotal / Service Fee / Total rows (shared with the confirmation screen) */
export function PriceRows({ subtotal, serviceFee, total, totalLabel }: { subtotal: number; serviceFee: number; total: number; totalLabel: string }) {
  return (
    <>
      <div className="flex w-full items-center justify-between text-[14px] leading-[21px] whitespace-nowrap">
        <p className="text-[#3c3c43]">Subtotal</p>
        <p className="text-black">{peso(subtotal)}</p>
      </div>
      <div className="flex w-full items-center justify-between text-[14px] leading-[21px] whitespace-nowrap">
        <p className="text-[#3c3c43]">Service Fee</p>
        <p className="text-black">{peso(serviceFee)}</p>
      </div>
      <div className="flex h-[53.084px] w-full items-center justify-between border-t-[0.5px] border-border-default pt-[0.5px] whitespace-nowrap">
        <p className="text-[16px] leading-[24px] font-bold text-text-primary">{totalLabel}</p>
        <p className="text-[24px] leading-[36px] font-bold text-[#ea580c]">{pesoTotal(total)}</p>
      </div>
    </>
  )
}

// Figma: totals "Section" (node 12348:822) incl. the terminal-fee note (a raster screenshot in Figma, node 12348:835)
export function PriceSummary(props: { subtotal: number; serviceFee: number; total: number }) {
  return (
    <section className="flex w-full flex-col items-center gap-[12px]">
      <PriceRows {...props} totalLabel="Total amount due" />
      <div className="flex w-full items-start gap-[10px] rounded-16 bg-[#f8f8fa] px-[16px] py-[12px]">
        <img alt="" src={infoNote} className="mt-px size-[15px]" />
        <p className="flex-1 text-[11px] leading-[15.95px] text-[#5e5d5f]">Terminal and port fees are not included. These are collected separately at the port before boarding.</p>
      </div>
    </section>
  )
}

export type PayMethod = 'card' | 'gcash' | 'maya' | 'qrph'
export const PAY_LABEL: Record<PayMethod, string> = { card: 'Credit / Debit Card', gcash: 'GCash', maya: 'Maya', qrph: 'QR Ph' }

// Brand marks are simple coloured monograms (official logos aren't in the Figma file).
function Mark({ method }: { method: PayMethod }) {
  if (method === 'card') return <img alt="" src={visaMastercard} className="size-[23.994px]" />
  const m = {
    gcash: { bg: '#007cff', fg: '#fff', t: 'G' },
    maya: { bg: '#0b0b0b', fg: '#2ee98a', t: 'm' },
    qrph: { bg: '#1f3a8a', fg: '#fff', t: 'QR' },
  }[method]
  return (
    <span className="flex size-[23.994px] items-center justify-center rounded-[6px] text-[12px] leading-none font-extrabold" style={{ background: m.bg, color: m.fg }}>
      {m.t}
    </span>
  )
}

const METHODS: { id: PayMethod; sub: string; tint: string }[] = [
  { id: 'card', sub: 'Visa, Mastercard, JCB', tint: 'rgba(99,102,241,0.06)' },
  { id: 'gcash', sub: 'Pay with your GCash wallet', tint: 'rgba(0,124,255,0.08)' },
  { id: 'maya', sub: 'Pay with your Maya wallet', tint: 'rgba(46,233,138,0.12)' },
  { id: 'qrph', sub: 'Scan with any banking or e-wallet app', tint: 'rgba(31,58,138,0.08)' },
]

// Figma: Payment method (node 12348:1055) — the Figma card option plus GCash, Maya and QR Ph; one selected at a time
export function PaymentMethod({ method, onChange }: { method: PayMethod; onChange: (m: PayMethod) => void }) {
  return (
    <section className="flex flex-col gap-[12px]">
      <SectionTitle icon={<CardIcon />}>Payment method</SectionTitle>
      <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-[8px]">
        {METHODS.map(({ id, sub, tint }) => {
          const selected = method === id
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(id)}
              className={`flex min-h-[72px] w-full flex-col justify-center rounded-[20px] border-[1.117px] p-[12px] text-left transition-colors duration-150 ${selected ? 'border-[#f97316] bg-[rgba(254,241,232,0.1)]' : 'border-border-default bg-white'}`}
            >
              <div className="flex h-[39.996px] w-full items-center gap-[11.988px]">
                <span className="flex size-[35.983px] shrink-0 items-center justify-center rounded-16" style={{ background: tint }}>
                  <Mark method={id} />
                </span>
                <span className="flex min-w-px flex-1 flex-col gap-[0.995px]">
                  <span className="text-[14px] leading-[21px] font-semibold whitespace-nowrap text-text-primary">{PAY_LABEL[id]}</span>
                  <span className="truncate text-[12px] leading-[18px] text-text-secondary">{sub}</span>
                </span>
                <span className="flex h-[31.986px] w-[53.974px] shrink-0 items-center justify-end">
                  {selected ? (
                    <span className="flex size-[19.998px] items-center justify-center rounded-full bg-[#f97316]">
                      <TickWhiteIcon />
                    </span>
                  ) : (
                    <span className="size-[19.998px] rounded-full border-[1.117px] border-border-default" />
                  )}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// Figma: Contact details (node 12348:874) — Email address (Verified) + Mobile number (PH +63)
export function ContactDetails() {
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  // Figma shows the verified state (green field + tick) with the placeholder; it stays verified while the value is a valid email
  const verified = email === '' || isEmail(email)
  return (
    <section className="flex w-full flex-col gap-[12px]">
      <div className="flex h-[19.492px] w-full items-center">
        <span className="mr-[7.992px]">
          <MailIcon />
        </span>
        <p className="text-[13px] leading-[19.5px] font-medium whitespace-nowrap text-text-secondary">Contact details</p>
        <span className="ml-[6.5px] flex h-[18.969px] items-center rounded-full bg-[rgba(249,115,22,0.1)] px-[7.99px] text-[10px] leading-[15px] font-semibold text-[#f97316]">Required</span>
      </div>

      <div className="flex flex-col rounded-16 border-[0.5px] border-border-default bg-white p-[16px]">
        <div className="flex w-full flex-col gap-[4px]">
          <div className="flex h-[26px] w-full items-center justify-between">
            <label htmlFor="review-email" className="text-[15px] leading-[22.5px] font-semibold text-text-primary">
              Email address
            </label>
            {verified && <span className="text-[11px] font-medium text-[#34c759]">Verified</span>}
          </div>
          <p className="text-[12px] leading-[19.5px] text-text-secondary">Your boarding pass and confirmation will be sent here.</p>
          <div
            className={`flex h-[52.735px] w-full items-center justify-between gap-[8px] overflow-clip rounded-16 border-[0.5px] px-[12.488px] py-[0.5px] ${verified ? 'border-[#34c759] bg-[#fcfffd]' : 'border-border-default bg-white'}`}
          >
            <input
              id="review-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. johndoe@email.com"
              className="min-w-px flex-1 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-secondary"
            />
            {verified && <img alt="" src={tick01} className="size-[24px] shrink-0" />}
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-16 border-[0.5px] border-border-default bg-white p-[16px]">
        <div className="flex w-full flex-col gap-[4px]">
          <div className="flex h-[25.984px] items-center">
            <label htmlFor="review-mobile" className="text-[15px] leading-[22.5px] font-semibold text-text-primary">
              Mobile number
            </label>
          </div>
          <p className="text-[12px] leading-[19.5px] text-text-secondary">Required by the shipping line for check-in verification. We won't use this for marketing.</p>
          <div className="flex h-[52.735px] w-full items-center gap-[8px] overflow-clip rounded-16 border-[0.5px] border-border-default bg-white px-[12.488px] py-[0.5px]">
            <span className="flex w-[35.988px] shrink-0 items-center justify-center gap-[8px]">
              <img alt="Philippines" src={philippines} className="size-[17px] object-cover" />
              <img alt="" src={caretDown} className="h-[4px] w-[7px]" />
            </span>
            <span className="flex h-[53px] w-0 shrink-0 items-center justify-center">
              <img alt="" src={line10} className="h-[0.5px] w-[53px] max-w-none rotate-90" />
            </span>
            <span className="text-[15px] whitespace-nowrap text-text-secondary">+63</span>
            <input
              id="review-mobile"
              type="tel"
              inputMode="numeric"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^\d ]/g, ''))}
              className="min-w-px flex-1 bg-transparent text-[15px] text-text-primary outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Terms line above the Pay button (node 12348:957) */
export const TermsNote = () => (
  <p className="mb-[16px] text-center text-[11.5px] leading-[17px] text-[#6c6c70]">
    By continuing, you agree to our{' '}
    <a href="#" className="font-semibold text-[#f97316] underline">
      Terms of Service
    </a>{' '}
    and
    <br />{' '}
    <a href="#" className="font-semibold text-[#f97316] underline">
      Privacy Policy
    </a>
    .
  </p>
)
