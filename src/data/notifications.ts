import { useSyncExternalStore } from 'react'

// Sample notifications (no design or backend yet): the bell badge on Home and the /notifications page share this list.
export type NotificationKind = 'confirmed' | 'reminder' | 'payment' | 'delay' | 'refund' | 'promo'
/** what tapping the notification does (see Notifications page): label shows as the row's link */
export type NotificationAction = { label: string; do: 'pay' | 'ticket' | 'schedule' | 'voucher' }
export type AppNotification = { id: string; kind: NotificationKind; title: string; body: string; minutesAgo: number; read: boolean; action?: NotificationAction }

// Bodies match the sample bookings the actions open (buildTicket: Dumaguete → Cebu City, first sailing of the line).
const SAMPLE: AppNotification[] = [
  { id: 'n1', kind: 'payment', title: 'Complete your payment', body: 'Your Maayo Shipping booking, Dumaguete to Cebu City, is on hold. Pay within 15 minutes to keep your seats.', minutesAgo: 3, read: false, action: { label: 'Continue payment', do: 'pay' } },
  { id: 'n2', kind: 'reminder', title: 'Your trip is tomorrow', body: 'OceanJet · Dumaguete to Cebu City, 11:00 AM. Be at the port 1 hour before departure.', minutesAgo: 25, read: false, action: { label: 'View boarding pass', do: 'ticket' } },
  { id: 'n3', kind: 'delay', title: 'Sailing delayed', body: 'HS Marine 5:15 PM to Cebu now leaves at 5:45 PM due to weather.', minutesAgo: 90, read: false, action: { label: 'View schedule', do: 'schedule' } },
  { id: 'n4', kind: 'confirmed', title: 'Booking confirmed', body: 'Your boarding pass for HS Marine, Dumaguete to Cebu City, is ready.', minutesAgo: 60 * 26, read: true, action: { label: 'View booking', do: 'ticket' } },
  { id: 'n5', kind: 'refund', title: 'Refund processed', body: 'Your cancelled OceanJet booking was refunded to your GCash account.', minutesAgo: 60 * 50, read: true, action: { label: 'View refund', do: 'ticket' } },
  { id: 'n6', kind: 'promo', title: 'Save ₱200 on your next trip', body: 'Use code SAVE200 at checkout. Valid until Dec 31.', minutesAgo: 60 * 24 * 4, read: true, action: { label: 'Book a trip', do: 'voucher' } },
]

let list = SAMPLE
const subs = new Set<() => void>()
const set = (next: AppNotification[]) => ((list = next), subs.forEach((f) => f()))
const subscribe = (f: () => void) => (subs.add(f), () => subs.delete(f))

export const useNotifications = () => useSyncExternalStore(subscribe, () => list)
export const markRead = (id: string) => set(list.map((n) => (n.id === id ? { ...n, read: true } : n)))
export const markAllRead = () => set(list.map((n) => ({ ...n, read: true })))
/** prototype controls: put the sample list back, or empty it */
export const resetNotifications = (empty = false) => set(empty ? [] : SAMPLE)

export function ago(min: number) {
  if (min < 60) return `${min}m ago`
  if (min < 60 * 24) return `${Math.floor(min / 60)}h ago`
  const d = Math.floor(min / 60 / 24)
  return d === 1 ? 'Yesterday' : `${d}d ago`
}
