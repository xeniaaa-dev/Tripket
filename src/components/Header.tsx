import logo from '../assets/live/home/logo.svg'
import settingsGear from '../assets/live/settings-gear.svg'
import { Notification01 } from './icons'

// Live (book.tripket.ph) Home header: logo + wordmark (19px semibold), settings gear in a 42px frosted circle.
// Guest = settings gear only. Signed in = notification bell (red unread badge, per the Figma signed-in header) + gradient avatar with initials.
export default function Header({ onAccount, initials, notifications = 3 }: { onAccount?: () => void; initials?: string; notifications?: number }) {
  return (
    <div className="flex items-center justify-between pt-4">
      <div className="relative z-20 flex items-center gap-1 text-text-primary">
        <img alt="" src={logo} className="block h-[23px] w-[40px]" />
        <span className="-ml-1 text-[19px] leading-[28.5px] font-semibold">
          Tripket<span className="ml-1 text-[#ff6b00]">PH</span>
        </span>
      </div>
      {initials ? (
        <div className="flex items-center gap-[8px]">
          {/* shortcut: no notifications screen is designed yet, so the bell has no action */}
          <button
            type="button"
            aria-label={`Notifications, ${notifications} unread`}
            className="relative flex size-[42px] items-center justify-center rounded-full bg-white/80 backdrop-blur-md"
          >
            <Notification01 />
            {notifications > 0 && (
              <span className="absolute -top-[5px] right-[-3px] flex size-[18px] items-center justify-center rounded-full bg-badge-red px-[4px] text-[10px] leading-[10px] font-bold text-white">
                {notifications}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label="Account"
            onClick={onAccount}
            className="bg-primary-gradient flex size-[42px] items-center justify-center rounded-full text-[16px] font-semibold text-white shadow-avatar"
          >
            {initials}
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Settings"
          onClick={onAccount}
          className="flex size-[42px] items-center justify-center rounded-full bg-white/80 backdrop-blur-md"
        >
          <img alt="" src={settingsGear} className="size-[22px]" />
        </button>
      )}
    </div>
  )
}
