import Drawer from '../Drawer'

// Figma "Leave booking sheet" (12328:7286): confirms leaving "Book another trip" (the carried-over details are dropped).
export default function LeaveSheet({ open, onKeep, onLeave }: { open: boolean; onKeep: () => void; onLeave: () => void }) {
  return (
    <Drawer open={open} onClose={onKeep} label="Leave without booking another trip?">
      <div className="flex justify-center pb-[8px]">
        <span className="h-[4px] w-[36px] rounded-[2px] bg-[#e4e4e7]" />
      </div>
      <div className="flex flex-col items-center pt-[8px]">
        <span className="flex size-[52px] items-center justify-center rounded-16 bg-[#fff1e6]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M10 6H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5" />
            <path d="M20 12H9" />
            <path d="m12.5 8.5-3.5 3.5 3.5 3.5" />
          </svg>
        </span>
        <h2 className="mt-[16px] max-w-[290px] text-center text-[20px] leading-[28px] font-bold text-[#171717]">Leave without booking another trip?</h2>
        <p className="mt-[8px] text-center text-[14px] leading-[20px] text-[#8e8e93]">Your carried-over trip details will not be saved.</p>
      </div>
      <button type="button" onClick={onKeep} className="mt-[24px] h-[56px] w-full rounded-16 bg-[#f97316] text-[16px] font-bold text-white transition-transform active:scale-[0.99]">
        Keep booking
      </button>
      <button type="button" onClick={onLeave} className="mt-[4px] h-[48px] w-full text-[15px] font-medium text-[#8e8e93]">
        Leave
      </button>
    </Drawer>
  )
}
