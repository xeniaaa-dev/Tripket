import { useEffect, useState } from 'react'
import success from '../assets/figma/utility/toast-success.svg'
import warning from '../assets/figma/utility/toast-warning.svg'
import { setProtoFlag, useProtoFlags } from '../proto/flags'

// Figma "Toast" on Home (11623:63754 "Back online" / 11623:63959 "You're offline"): 20px radius glass card, 14px/600 coloured title,
// 13px grey copy. Driven by the browser's online/offline events and by the Prototype controls' "Offline" switch.
export default function ConnectivityToast() {
  const { offline } = useProtoFlags()
  const [restored, setRestored] = useState(false)
  const [wasOffline, setWasOffline] = useState(offline)
  if (offline !== wasOffline) {
    setWasOffline(offline)
    setRestored(wasOffline && !offline) // coming back online shows "Back online" for a moment
  }

  useEffect(() => {
    const on = () => setProtoFlag('offline', false)
    const off = () => setProtoFlag('offline', true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  useEffect(() => {
    if (!restored) return
    const t = setTimeout(() => setRestored(false), 3500)
    return () => clearTimeout(t)
  }, [restored])

  if (!offline && !restored) return null
  const ok = !offline
  return (
    <div
      role="status"
      className="pointer-events-none fixed top-[40px] left-1/2 z-[70] flex w-[min(360px,calc(100%-32px))] -translate-x-1/2 items-start gap-[12px] rounded-[20px] border border-[#d1d1d6] bg-white p-[14px] shadow-[0_8px_20px_rgba(28,25,23,0.12),inset_0_1px_0_rgba(255,255,255,0.64)] backdrop-blur-[9px]"
    >
      <img alt="" src={ok ? success : warning} className="size-[20px] shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className={`text-[14px] leading-[20px] font-semibold ${ok ? 'text-[#34c759]' : 'text-[#ff9f0a]'}`}>{ok ? 'Back online' : 'You’re offline'}</p>
        <p className="text-[13px] leading-[1.38] text-[#5e5d5f]">{ok ? 'Connection restored.' : 'Some actions may not work until you’re back online.'}</p>
      </div>
    </div>
  )
}
