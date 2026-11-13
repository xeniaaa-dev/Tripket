import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import heroHome from '../assets/live/home/home-hero.jpg'
import nextUnderline from '../assets/live/home/next-underline.svg'
import Button from '../components/Button'
import Header from '../components/Header'
import PopularRouteCard from '../components/PopularRouteCard'
import SelectField from '../components/SelectField'
import SwapButton from '../components/SwapButton'
import { PAGE_LOAD } from '../components/PageLoader'
import DateSheet from '../components/booking/DateSheet'
import PortPicker from '../components/home/PortPicker'
import { useAuth } from '../auth/AuthContext'
import { useBooking } from '../booking/BookingContext'
import { freshPatch, returnPatch } from '../booking/flows'
import RecentTrips from '../components/home/RecentTrips'
import ReturnTripCard from '../components/home/ReturnTripCard'
import { useTicketActions } from '../components/tickets/useTicketActions'
import { toView } from '../data/tickets'
import { formatBookingDate } from '../booking/date'
import { popularRoutes, search, today } from '../data/home'
import { destinationPorts, portByCity, ports, recentPorts, type Port } from '../data/ports'

type Sheet = 'origin' | 'destination' | 'date' | null

// "Tue, Mar 31, 2026" — Home field format (Figma)
const fieldDate = (d: Date) =>
  `${d.toLocaleDateString('en-US', { weekday: 'short' })}, ${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`
const toBookingPort = ({ code, city }: Port) => ({ code, city })

// Figma: "Tripket - Signed in" (Home - With all sections, node 11598:49149)
export default function Home() {
  const navigate = useNavigate()
  const go = (to: string) => navigate(to, { state: PAGE_LOAD }) // live app: route loader, then the page enters
  const { booking, update, tickets } = useBooking()
  const { rebook, paymentSheet } = useTicketActions()
  // Starting a normal booking drops anything a Rebook / Return trip / Book another trip carried over
  const fresh = booking.flow === 'standard' ? {} : freshPatch
  // Figma entry points: "Ready to head back?" after a booked trip, "Recent Trips" for finished ones (hidden until a trip exists, like live)
  const views = [...tickets].reverse().map(toView)
  const lastBooked = views.find((t) => ['confirmed', 'completed', 'under_review', 'generating'].includes(t.status))
  const recent = views.filter((t) => ['completed', 'expired', 'refunded', 'for_refund'].includes(t.status)).slice(0, 3)
  const { user } = useAuth()
  const [route, setRoute] = useState<{ from: Port | null; to: Port | null }>({
    from: search.from ? portByCity(search.from) : null,
    to: search.to ? portByCity(search.to) : null,
  })
  const [date, setDate] = useState(search.date)
  const [sheet, setSheet] = useState<Sheet>(null)
  // First-time user: "Recent Ports" appears once a port has been picked (Figma 12173:949 → 12173:1123)
  const [hasPicked, setHasPicked] = useState(false)
  const close = () => setSheet(null)
  const ready = !!route.from && !!route.to
  // Like the live app, the Home form keeps its route/date when you come back from booking (Back): persist it.
  useEffect(() => {
    search.from = route.from?.city ?? ''
    search.to = route.to?.city ?? ''
    search.date = date
  }, [route, date])

  return (
    <div className="relative min-h-dvh overflow-x-clip pb-24">
      {/* hero photo, fading into white */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-0 h-[450px] overflow-hidden">
        <img alt="" src={heroHome} className="h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
      </div>

      <div className="relative z-10 space-y-4 px-6 pt-3">
        <Header onAccount={() => navigate('/account')} initials={user?.initials} />

        <header className="pt-3 pb-2">
          <h1 className="text-[30px] leading-none font-semibold tracking-[-0.75px] text-slate-900">Where to</h1>
          <div className="relative mt-1">
            <p className="bg-[linear-gradient(180deg,#fb923c_0%,#f97316_40%,#ea580c_100%)] bg-clip-text font-script text-[48px] leading-none tracking-[-1px] text-transparent">
              Next?
            </p>
            <img alt="" src={nextUnderline} className="pointer-events-none z-10 -ml-2 block h-[34px] w-full object-cover object-bottom" />
          </div>
        </header>

        <form
          className="relative z-10 rounded-12 border border-neutral-100 bg-white/15 p-4 backdrop-blur-[12px]"
          onSubmit={(e) => {
            e.preventDefault()
            if (!route.from || !route.to) return
            update({ ...fresh, from: toBookingPort(route.from), to: toBookingPort(route.to), date: formatBookingDate(date) })
            go('/book')
          }}
        >
          <div className="space-y-3">
            <div className="relative space-y-3">
              <SelectField label="From" value={route.from?.city} placeholder="Select Origin" onClick={() => setSheet('origin')} />
              <SwapButton
                className="absolute top-[54.5px] left-1/2 z-20 -translate-x-1/2"
                disabled={!ready}
                onClick={() => setRoute((r) => ({ from: r.to, to: r.from }))}
              />
              <SelectField
                label="To"
                value={route.to?.city}
                placeholder="Select Destination"
                locked={!route.from}
                onClick={() => setSheet('destination')}
              />
            </div>
            <SelectField label="Travel date" value={fieldDate(date)} chevron={false} onClick={() => setSheet('date')} />
            <Button type="submit" disabled={!ready}>
              Book a Trip
            </Button>
          </div>
        </form>

        {lastBooked && (
          <ReturnTripCard
            from={lastBooked.booking.to.code}
            to={lastBooked.booking.from.code}
            onBook={() => {
              update(returnPatch(lastBooked.booking))
              navigate('/book/return')
            }}
          />
        )}
        {recent.length > 0 && <RecentTrips trips={recent} onRebook={rebook} />}

        <div className="space-y-4">
          <h2 className="text-[16px] leading-[24px] font-semibold tracking-[-0.4px] text-text-primary">Popular Routes</h2>
          <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none]">
            {popularRoutes.map((r) => (
              <PopularRouteCard
                key={r.name}
                route={r}
                // live app: tapping a popular route opens booking with that route (keeps the Home date)
                onSelect={() => {
                  const port = (c: string) => ports.find((p) => p.code === c)
                  const from = port(r.fromCode)
                  const to = port(r.toCode)
                  if (!from || !to) return
                  search.from = from.city // live fills the Home form with the tapped route
                  search.to = to.city
                  update({ ...fresh, from: toBookingPort(from), to: toBookingPort(to), date: formatBookingDate(date) })
                  go('/book')
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {paymentSheet}
      {/* live drawer sheets (each handles its own slide-in/out) */}
      <PortPicker
        open={sheet === 'origin'}
        title="Select Origin"
        ports={ports}
        recent={hasPicked ? recentPorts : undefined}
        selected={route.from?.code}
        onClose={close}
        onSelect={(from) => {
          setRoute((r) => ({ ...r, from }))
          setHasPicked(true)
          close() // live: picking an origin just closes the sheet (the destination is picked from the To field)
        }}
      />
      <PortPicker
        open={sheet === 'destination'}
        title="Select Destination"
        ports={destinationPorts}
        recent={hasPicked ? recentPorts : undefined}
        selected={route.to?.code}
        onClose={close}
        onSelect={(to) => {
          setRoute((r) => ({ ...r, to }))
          setHasPicked(true)
          close()
        }}
      />
      <DateSheet
        open={sheet === 'date'}
        value={date}
        today={today}
        onClose={close}
        onSelect={(d) => {
          setDate(d)
          close()
        }}
      />
    </div>
  )
}
