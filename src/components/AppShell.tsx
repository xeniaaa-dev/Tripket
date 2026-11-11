import type { ReactNode } from 'react'

// The app as a web page, like book.tripket.ph on desktop: one centered mobile column (live app: 512px) on a
// white page that scrolls with the browser window. Replaces the old phone-frame mockup.
// --screen-vh = 1% of the window height; sheets and full-screen views use it instead of vh/dvh.
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <div data-screen className="relative mx-auto min-h-dvh w-full max-w-[512px] bg-white" style={{ ['--screen-vh' as string]: '1dvh' }}>
        {children}
      </div>
    </div>
  )
}
