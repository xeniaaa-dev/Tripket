import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Appointment02, Boat, TicketStar, UserGroup, type Tone } from './icons'

function Tab({ icon, label, active, onClick }: { icon: (tone: Tone) => ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex h-[48.966px] flex-1 flex-col items-center justify-center gap-[1.989px] rounded-full ${active ? 'bg-nav-active' : ''}`}
    >
      {icon(active ? 'active' : 'inactive')}
      <span className={`text-[10px] leading-[10px] ${active ? 'font-semibold text-primary-default' : 'font-medium text-nav-label'}`}>
        {label}
      </span>
    </button>
  )
}

// Figma: bottom navigation ("hR" → "Navigation" + Tickets button), node 11598:32843.
// Tabs route like the live app (/, /passengers, /schedule, /tickets). The Tickets pill turns orange when active,
// fading its background over ~200ms as on book.tripket.ph.
export default function Navigation({ ticketCount }: { ticketCount: number }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const ticketsActive = pathname === '/tickets'
  return (
    <nav className="flex w-full gap-[8px] px-[16px]">
      <div className="relative flex h-[60.937px] flex-[2] items-center rounded-full px-[5.985px] border border-white/90 bg-white/92 backdrop-blur-[20px] backdrop-saturate-150 shadow-[0_-6px_12px_2px_rgba(0,0,0,0.05),0_6px_12px_2px_rgba(0,0,0,0.05)]">
        <Tab icon={(t) => <Boat tone={t} />} label="Book" active={pathname === '/'} onClick={() => navigate('/', { state: { pageEnter: true, noLoader: true } })} />
        <Tab icon={(t) => <UserGroup tone={t} />} label="Passengers" active={pathname === '/passengers'} onClick={() => navigate('/passengers')} />
        <Tab icon={(t) => <Appointment02 tone={t} />} label="Schedule" active={pathname === '/schedule'} onClick={() => navigate('/schedule')} />
      </div>
      <button
        type="button"
        onClick={() => navigate('/tickets')}
        aria-current={ticketsActive ? 'page' : undefined}
        className={`relative flex h-[60.937px] flex-1 items-center justify-center gap-[8px] rounded-full border transition-colors duration-200 ${ticketsActive ? 'border-primary-default bg-primary-default shadow-[0_-6px_12px_2px_rgba(0,0,0,0.05),0_6px_12px_2px_rgba(0,0,0,0.05)]' : 'border border-white/90 bg-white/92 backdrop-blur-[20px] backdrop-saturate-150 shadow-[0_-6px_12px_2px_rgba(0,0,0,0.05),0_6px_12px_2px_rgba(0,0,0,0.05)]'}`}
      >
        <span className="relative">
          <TicketStar tone={ticketsActive ? 'inverse' : 'inactive'} />
          {ticketCount > 0 && (
            <span className={`absolute top-[-6px] left-[11px] flex size-[15.985px] items-center justify-center rounded-full px-[4px] text-[9px] leading-[9px] font-bold transition-colors duration-200 ${ticketsActive ? 'bg-white text-primary-default' : 'bg-primary-default text-white'}`}>
              {ticketCount}
            </span>
          )}
        </span>
        <span className={`text-[13px] leading-[13px] font-medium ${ticketsActive ? 'text-white' : 'text-nav-label'}`}>Tickets</span>
      </button>
    </nav>
  )
}
