import { useNavigate } from 'react-router'
import hourglass from '../assets/figma/utility/hourglass-off.svg'

// Figma "Session Expired" (11598:63397): hourglass, "Your session has expired", "Sign In" (222px, 16px radius).
export default function SessionExpired() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-[24px] text-center">
      <img alt="" src={hourglass} className="size-[36px]" />
      <h1 className="mt-[12px] text-[18px] leading-[27px] font-semibold text-[#1c1917]">Your session has expired</h1>
      <p className="mt-[4px] text-[14px] leading-[21px] text-[#5e5d5f]">Please sign in again to continue</p>
      <button type="button" onClick={() => navigate('/login', { replace: true })} className="mt-[25px] w-[222px] rounded-[16px] bg-[#f97316] py-[18px] text-[15px] leading-[22.5px] font-semibold text-white transition-transform active:scale-[0.98]">
        Sign In
      </button>
    </div>
  )
}
