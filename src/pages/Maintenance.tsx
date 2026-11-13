import repair from '../assets/figma/utility/repair.svg'
import { setProtoFlag } from '../proto/flags'

// Figma "Maintenance Screen" (11598:45732). Shown for the whole app while maintenance mode is on (Prototype controls → Conditions).
// "Refresh" re-checks the service; in the prototype that ends maintenance without losing the in-memory trips.
export default function Maintenance() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-[36px] text-center">
      <img alt="" src={repair} className="size-[74px]" />
      <h1 className="mt-[24px] text-[22px] leading-[27px] font-extrabold text-[#1c1917]">We'll be back shortly</h1>
      <p className="mt-[10px] max-w-[321px] text-[15px] leading-[1.5] text-[#8e8e93]">We're performing scheduled maintenance to improve your experience. We'll be back shortly.</p>
      <button type="button" onClick={() => setProtoFlag('maintenance', false)} className="mt-[36px] h-[54px] w-[142px] rounded-[16px] bg-[#f97316] text-[15px] font-bold text-white transition-transform active:scale-[0.98]">
        Refresh
      </button>
    </div>
  )
}
