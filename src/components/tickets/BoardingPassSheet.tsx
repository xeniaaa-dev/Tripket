import { useEffect, useState } from 'react'
import call from '../../assets/live/tickets/call.svg'
import car from '../../assets/live/tickets/car.svg'
import close from '../../assets/live/tickets/close.svg'
import download from '../../assets/live/tickets/download.svg'
import user from '../../assets/live/tickets/user.svg'
import { lineOf, tripOf, type TicketView } from '../../data/tickets'
import { useSheetMotion } from '../Drawer'
import { VesselHeader } from './TicketCard'
import { BookingReference, FareDetails, TicketBlocks } from './TicketBlocks'

// Live: BOARDING_PASS_SHEET (book.tripket.ph, opened by "View boarding pass" on a confirmed ticket).
// Structure/classes from the live sheet source. Per shipping line, as in Figma "Boarding Pass" (11598:57458):
//  OceanJet (Frame 342): passenger blocks with OJ- ticket numbers, no QR · Maayo (Frame 343): QR per vehicle + passenger,
//  "MAAYO TICKET NO." · HS Marine (Frame 344): booking reference on top, seat chips, "HS STAR MARINE TICKET NO.", no QR.
// Sheet motion = the shared live drawer animation.

export default function BoardingPassSheet({ ticket, onClose }: { ticket: TicketView; onClose: () => void }) {
  const motion = useSheetMotion()
  const [saving, setSaving] = useState(false)
  const trip = tripOf(ticket)
  const { booking } = ticket
  const line = lineOf(booking)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  useEffect(() => {
    if (!saving) return
    const t = setTimeout(() => setSaving(false), 900)
    return () => clearTimeout(t)
  }, [saving])

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/50" style={motion.backdrop} />
      <div className="pointer-events-none absolute inset-0 flex items-end">
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Sheet dialog"
          className="pointer-events-auto relative mx-auto flex max-h-[calc(var(--screen-vh)*95)] w-full max-w-[512px] flex-col rounded-t-3xl bg-white p-4"
          style={motion.panel}
        >
          {saving && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-t-3xl bg-white/50 backdrop-blur-lg">
              <p className="mt-1 animate-pulse text-sm font-normal text-neutral-500">Preparing your boarding pass...</p>
            </div>
          )}
          <div className="mx-auto mb-2 h-1 w-9 shrink-0 rounded-full bg-neutral-200" />
          <button type="button" aria-label="Close" onClick={onClose} className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-neutral-100">
            <img alt="" src={close} className="size-4" />
          </button>
          <header className="flex flex-row items-center justify-between pb-4">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-800">Boarding Pass</h2>
          </header>

          <div className="-mx-4 overflow-y-auto px-0 pt-0 pb-14">
            <div className="mx-4 mb-4 flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-left">
              {line === 'hsmarine' && (
                <div className="mx-4 mt-2 rounded-t-2xl bg-slate-100 py-2">
                  <BookingReference ticket={ticket} />
                </div>
              )}
              <div className="flex w-full flex-col gap-2 pb-4">
                <div className="mt-4 px-4">
                  <VesselHeader trip={trip} logoClass="size-12 rounded-xl" />
                </div>
                <div className="mx-4 pb-1">
                  <div className="flex w-full items-center justify-between py-2">
                    <span className="text-xs font-normal text-neutral-500">{trip.departDate}</span>
                    {!trip.sameDay && <span className="text-right text-xs font-normal text-[#f97316]">{trip.arriveDate}</span>}
                  </div>
                  {/* live RouteInfo, BOARDING variant */}
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <p className="max-w-3/10 grow text-xl font-normal whitespace-nowrap">{trip.departTime}</p>
                      <div className="relative flex max-w-4/10 flex-1 grow flex-col items-center gap-y-1 px-2">
                        <div className="absolute bottom-1 text-[10px] font-normal whitespace-nowrap text-neutral-400">{trip.duration}</div>
                        <div className="relative h-[2px] w-full bg-neutral-300">
                          <div className="absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full bg-orange-500" />
                          <div className="absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full bg-neutral-400" />
                        </div>
                      </div>
                      <p className="max-w-3/10 grow text-right text-xl font-normal whitespace-nowrap">{trip.arriveTime}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="mt-0.5 text-[11px] font-normal text-[#8e8e93]">
                        <span className="font-bold">{booking.from.code}</span> {booking.from.city}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] font-normal text-neutral-400">
                        <span className="font-bold">{booking.to.code}</span> {booking.to.city}
                      </p>
                    </div>
                  </div>
                </div>
                {/* ManifestPill */}
                <div className="flex items-center gap-4 px-4 text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <img alt="" src={user} className="size-3.5" />
                    {booking.passengers.length} passenger{booking.passengers.length === 1 ? '' : 's'}
                  </span>
                  {booking.vehicles.length > 0 && (
                    <span className="flex items-center gap-1">
                      <img alt="" src={car} className="size-3.5" />
                      {booking.vehicles.length} vehicle{booking.vehicles.length === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col px-4 text-xs">
                <button type="button" className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-100 bg-[#f8f8fa] p-2 font-normal">
                  <img alt="" src={call} className="size-4" />
                  <p className="text-sm text-[#1c1917]">Contact {trip.operator}</p>
                </button>
              </div>

              <div className="mt-3 px-4">
                <TicketBlocks ticket={ticket} />
              </div>

              <div className="mt-3 px-4 pb-4">
                <FareDetails ticket={ticket} defaultOpen={false} />
              </div>
            </div>

            <div className="flex w-full justify-center px-4">
              <button
                type="button"
                onClick={() => setSaving(true)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#f97316] text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-transform active:scale-[0.96]"
              >
                <img alt="" src={download} className="size-4" />
                {saving ? 'Saving Pass...' : 'Save Boarding Pass'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
