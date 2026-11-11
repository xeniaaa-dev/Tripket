import { Outlet, useLocation } from 'react-router'
import { useBooking } from '../booking/BookingContext'
import Navigation from './Navigation'
import PendingPaymentLayer from './tickets/PendingPaymentLayer'

// Bottom tab bar on the tab roots (/, /passengers, /schedule, /tickets) and Settings (/account), as on the live app.
// Sub-pages (e.g. /passengers/new) hide it. Pages keep ~120px bottom padding so content clears the bar.
const WITH_BAR = ['/', '/passengers', '/schedule', '/tickets', '/account']

export default function TabsLayout() {
  const { tickets } = useBooking()
  const { pathname } = useLocation()
  return (
    <>
      <Outlet />
      {WITH_BAR.includes(pathname.replace(/\/$/, '') || '/') && (
        <>
          <PendingPaymentLayer />
          <div className="fixed bottom-[8px] left-1/2 z-30 w-full max-w-[512px] -translate-x-1/2">
            <Navigation ticketCount={tickets.length} />
          </div>
        </>
      )}
    </>
  )
}
