/* oxlint-disable react/only-export-components -- context file: provider + hook + defaults */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { advanceTicket, PAYMENT_WINDOW_MS } from '../data/tickets'
import { formatBookingDate, startOfToday } from './date'

// Shared state for the booking happy path (Home → Passengers & vehicle → Select departure → Passenger details → Review & pay).
// Defaults are the Figma "Booking Flow (New)" values so every step renders on its own (deep link / side-by-side review).
export type Port = { code: string; city: string }

/** One passenger row as shown on Passenger details / Review & pay. fare: null = "Free" */
export type PassengerDetail = { id: string; fullName: string; fareType: string; cabin: string; fare: number | null }
/** One vehicle row, e.g. FAU1995 · Toyota Fortuner · SUV / Pickup */
export type VehicleDetail = { id: string; plate: string; model: string; type: string; fare: number }

export type BookingState = {
  from: Port
  to: Port
  /** Display string, e.g. "Wed, Nov 11, 2026" (see booking/date.ts) */
  date: string
  passengerCount: number
  vehicleCount: number
  /** id of the departure picked on "Select departure" */
  departureId: string | null
  /** Filled on "Passenger details" */
  passengers: PassengerDetail[]
  vehicles: VehicleDetail[]
}

export const defaultBooking: BookingState = {
  from: { code: 'DGT', city: 'Dumaguete' },
  to: { code: 'CEB', city: 'Cebu City' },
  date: formatBookingDate(startOfToday()),
  passengerCount: 1,
  vehicleCount: 0,
  departureId: null,
  passengers: [],
  vehicles: [],
}

/** Stored ticket status (lifecycle in data/tickets.ts). "Departed" is derived from the travel date, not stored. */
export type TicketStatus = 'pending' | 'under_review' | 'generating' | 'confirmed' | 'for_refund' | 'refunded' | 'expired' | 'failed'

/** A booking submitted on "Pay" (snapshot). Shown on My Tickets; `total` in pesos. */
export type Ticket = {
  id: string
  createdAt: number
  booking: BookingState
  total: number
  status: TicketStatus
  /** when `status` last changed (drives the simulated shipping-line / refund timers) */
  statusChangedAt: number
  /** pending only: end of the 15:00 payment window */
  pendingUntil?: number
  /** passengers cancelled from a booked ticket (partial cancellation) */
  cancelledPassengerIds: string[]
}

type Ctx = {
  booking: BookingState
  update: (patch: Partial<BookingState>) => void
  reset: () => void
  /** Bookings paid in this session (in memory, like the rest of the prototype) */
  tickets: Ticket[]
  /** "Pay" → the line's paid status, 'pending' (payment left unfinished) or 'failed' (Maayo only). Returns the new ticket id. */
  addTicket: (total: number, status?: TicketStatus) => string
  updateTicket: (id: string, patch: Partial<Ticket>) => void
}
const BookingContext = createContext<Ctx | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState(defaultBooking)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const update = (patch: Partial<BookingState>) => setBooking((b) => ({ ...b, ...patch }))
  const addTicket = (total: number, status: TicketStatus = 'under_review') => {
    const now = Date.now()
    const id = `TKT-${now.toString(36).toUpperCase()}`
    const pendingUntil = status === 'pending' ? now + PAYMENT_WINDOW_MS : undefined
    setTickets((t) => [...t, { id, createdAt: now, booking, total, status, statusChangedAt: now, pendingUntil, cancelledPassengerIds: [] }])
    return id
  }
  const updateTicket = (id: string, patch: Partial<Ticket>) =>
    setTickets((list) =>
      list.map((t) => (t.id !== id ? t : { ...t, ...patch, statusChangedAt: patch.status && patch.status !== t.status ? Date.now() : t.statusChangedAt })),
    )

  // Simulated backend: timers keep running whatever screen is open (processing → generating → booked, refunds, expiry).
  useEffect(() => {
    const id = setInterval(() => {
      setTickets((list) => {
        const now = Date.now()
        let changed = false
        const next = list.map((t) => {
          const status = advanceTicket(t, now)
          if (status === t.status) return t
          changed = true
          return { ...t, status, statusChangedAt: now }
        })
        return changed ? next : list
      })
    }, 500)
    return () => clearInterval(id)
  }, [])

  return (
    <BookingContext value={{ booking, update, reset: () => setBooking(defaultBooking), tickets, addTicket, updateTicket }}>{children}</BookingContext>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>')
  return ctx
}
