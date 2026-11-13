import bg from '../../assets/figma/home/recent/return-trip-bg.jpg'
import arrow from '../../assets/figma/home/recent/greater-than-lg.svg'

// Figma "Ready to head back?" card, node 12328:9377 — copied from the design: 148px tall, 12px radius, photo
// under a 2px-blur 50% #2e2e2e overlay; 13px label, 28px/800 codes with a 16px ">" between, 311×42 translucent button (12px radius, 1px white border).
export default function ReturnTripCard({ from, to, onBook }: { from: string; to: string; onBook: () => void }) {
  return (
    <div className="relative h-[148px] w-full overflow-clip rounded-[12px] bg-white">
      {/* Figma geometry (node 12328:9378): the 548×259 photo sits 175px left of the 348px card, so the ship (63.7% across the photo) lands on the card's centre.
          Scaled up (never down) so it still covers and stays centred when the column is wider than 348px. */}
      <img alt="" src={bg} className="pointer-events-none absolute top-1/2 left-1/2 h-auto w-[max(548px,140%)] max-w-none -translate-x-[63.7%] -translate-y-1/2" />
      <div className="absolute inset-0 overflow-clip bg-[rgba(46,46,46,0.5)] backdrop-blur-[2px]">
        <p className="absolute top-[15px] w-full text-center text-[13px] font-semibold tracking-[0.33px] whitespace-nowrap text-white">READY TO HEAD BACK?</p>
        <div className="absolute top-[43px] flex w-full items-center justify-center gap-[15px] text-[28px] leading-none font-extrabold tracking-[-0.7px] text-white">
          <span>{from}</span>
          <img alt="" src={arrow} className="size-[16px]" />
          <span>{to}</span>
        </div>
        <button
          type="button"
          onClick={onBook}
          className="absolute top-[87px] left-[18px] h-[42px] w-[calc(100%-37px)] rounded-[12px] border border-solid border-white bg-[rgba(255,255,255,0.2)] text-[14px] font-semibold text-white"
        >
          Book Return Trip
        </button>
      </div>
    </div>
  )
}
