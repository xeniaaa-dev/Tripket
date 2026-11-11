// Live route chip ("DUM > SIQ"): black/40 blur pill, 10px medium, faint border.
export default function RouteChip({ from, to }: { from: string; to: string }) {
  return (
    <span className="rounded-full border border-slate-50/10 bg-black/40 px-2 py-0.5 text-[10px] leading-[15px] font-medium text-white backdrop-blur-md">
      {from} <span className="mx-0.5 text-[8px] text-white/70">&gt;</span> {to}
    </span>
  )
}
