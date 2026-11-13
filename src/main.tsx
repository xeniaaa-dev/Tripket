/* oxlint-disable react/only-export-components -- app entry */
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router'
import { AuthProvider } from './auth/AuthContext.tsx'
import { BookingProvider } from './booking/BookingContext.tsx'
import PageLoader, { LOADER_MS } from './components/PageLoader.tsx'
import AppShell from './components/AppShell.tsx'
import './index.css'
import BookingConfirmed from './pages/BookingConfirmed.tsx'
import Legal from './components/settings/Legal.tsx'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import Passengers from './pages/Passengers.tsx'
import Schedule from './pages/Schedule.tsx'
import Settings from './pages/Settings.tsx'
import Tickets from './pages/Tickets.tsx'
import TabsLayout from './components/TabsLayout.tsx'
import PassengerDetails from './pages/PassengerDetails.tsx'
import PassengersVehicle from './pages/PassengersVehicle.tsx'
import ReviewPay from './pages/ReviewPay.tsx'
import PrototypeControls from './components/PrototypeControls'
import ConnectivityToast from './components/ConnectivityToast'
import Maintenance from './pages/Maintenance'
import NotFound from './pages/NotFound'
import SessionExpired from './pages/SessionExpired'
import { useProtoFlags } from './proto/flags'
import AnotherTrip from './pages/AnotherTrip'
import ReturnTrip from './pages/ReturnTrip'
import SelectDeparture from './pages/SelectDeparture.tsx'

// New screen → top of the page.
function LayoutBody() {
  const { pathname, state, key } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Live app route change (navigate with PAGE_LOAD): blank screen + PageLoader, then the page fades in and rises 16px.
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const loading = Boolean(state?.pageEnter) && !state?.noLoader && loadedKey !== key
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoadedKey(key), LOADER_MS)
    return () => clearTimeout(t)
  }, [loading, key])

  if (loading) return <PageLoader />
  return (
    <div key={pathname} className={`min-h-dvh ${state?.pageEnter ? 'animate-page-enter' : ''}`}>
      <Outlet />
    </div>
  )
}

function Layout() {
  const { maintenance } = useProtoFlags()
  return (
    <>
      {maintenance ? <Maintenance /> : <LayoutBody />}
      <ConnectivityToast />
      <PrototypeControls />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <TabsLayout />,
        children: [
          { path: '/', element: <Home /> },
          // each area owns its sub-pages via nested <Routes> inside the page component
          { path: '/passengers/*', element: <Passengers /> },
          { path: '/schedule/*', element: <Schedule /> },
          { path: '/tickets/*', element: <Tickets /> },
          { path: '/account/*', element: <Settings /> },
        ],
      },
      { path: '/login/*', element: <Login /> },
      // live: Privacy Policy and Terms of Service are their own pages (full screen, no tab bar)
      { path: '/privacy', element: <Legal kind="privacy" /> },
      { path: '/terms', element: <Legal kind="terms" /> },
      { path: '/book', element: <PassengersVehicle /> },
      { path: '/book/another', element: <AnotherTrip /> },
      { path: '/book/return', element: <ReturnTrip /> },
      { path: '/book/departure', element: <SelectDeparture /> },
      { path: '/book/details', element: <PassengerDetails /> },
      { path: '/book/review', element: <ReviewPay /> },
      { path: '/book/confirmed', element: <BookingConfirmed /> },
      { path: '/session-expired', element: <SessionExpired /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppShell>
      <AuthProvider>
        <BookingProvider>
          <RouterProvider router={router} />
        </BookingProvider>
      </AuthProvider>
    </AppShell>
  </StrictMode>,
)
