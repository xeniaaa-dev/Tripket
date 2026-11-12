// Prototype convenience: one tap fills the form with sample data so nobody has to type while reviewing.
export default function SampleFill({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="self-start rounded-full bg-[#fff7ed] px-[12px] py-[6px] text-[12px] leading-[16px] font-semibold text-[#f97316] transition-transform active:scale-95">
      Fill with sample data
    </button>
  )
}
