import { PlusSign } from './icons'

const MIN_PASSENGERS = 1

// Live app: "Passenger" card — 68px, 16px padding, circular 36px −/+ buttons (+ filled orange), count in between.
export default function PassengerCounter({ count, onChange }: { count: number; onChange: (count: number) => void }) {
  const canDecrease = count > MIN_PASSENGERS
  return (
    <div className="flex h-[68px] items-center justify-between rounded-16 border border-[#f2f2f2] bg-white px-[16px]">
      <p className="text-[16px] leading-[24px] text-[#262626]">Passenger</p>
      <div className="flex items-center">
        <button
          type="button"
          aria-label="Decrease passenger count"
          disabled={!canDecrease}
          onClick={() => onChange(count - 1)}
          className="flex size-[36px] items-center justify-center rounded-full border border-[#f2f2f2] bg-white disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 8h9" stroke="#8e8e93" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
        <p aria-live="polite" className="w-[37px] text-center text-[14px] leading-[20px] font-medium text-[#0f172a]">
          {count}
        </p>
        <button
          type="button"
          aria-label="Increase passenger count"
          onClick={() => onChange(count + 1)}
          className="flex size-[36px] items-center justify-center rounded-full bg-[#f97316]"
        >
          <PlusSign />
        </button>
      </div>
    </div>
  )
}
