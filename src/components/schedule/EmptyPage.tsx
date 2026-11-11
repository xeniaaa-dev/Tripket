import ferry from '../../assets/live/schedule/ferry-boat.svg'

// Live EmptyPage with the FerryBoat icon (28px, neutral-300).
export default function EmptyPage({ title, description, buttonText, onButton }: { title: string; description: string; buttonText?: string; onButton?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-[24px] py-[48px] text-center">
      <img alt="" src={ferry} className="size-[28px]" />
      <div className="mb-[4px] text-[18px] leading-[28px] font-medium text-[#1c1917]">{title}</div>
      <div className="mb-[24px] max-w-[85%] text-[13px] leading-[17.94px] font-light break-normal text-[#8e8e93]">{description}</div>
      {buttonText && (
        <button
          type="button"
          onClick={onButton}
          className="h-[40px] rounded-[12px] bg-[#ff6900] px-[24px] text-[12px] leading-[16px] font-bold text-white shadow-[0_1px_3px_#0000001a,0_1px_2px_-1px_#0000001a] transition-[colors,transform] duration-150 hover:bg-[#f54a00] active:scale-[0.97]"
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}
