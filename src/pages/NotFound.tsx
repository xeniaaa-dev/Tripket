import { useNavigate } from 'react-router'

// Figma "Page Not Found Screen" (11598:45726): 92px/800 gradient "404", 22px/800 title, 15px grey copy, "Back to Home" (142px, 16px radius).
export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-[36px] text-center">
      <p
        className="h-[92px] bg-clip-text text-[92px] leading-[92px] font-extrabold text-transparent"
        style={{ backgroundImage: 'linear-gradient(-73.41deg, rgba(255,255,255,0.6) 1.19%, rgba(142,142,147,0.6) 97.7%)', WebkitBackgroundClip: 'text' }}
      >
        404
      </p>
      <h1 className="mt-[21px] text-[22px] leading-[27px] font-extrabold text-[#1c1917]">Page Not Found</h1>
      <p className="mt-[11px] max-w-[321px] text-[15px] leading-[1.5] text-[#8e8e93]">This page is currently unavailable. It may have been moved or the link may be incorrect.</p>
      <button type="button" onClick={() => navigate('/', { replace: true })} className="mt-[37px] w-[142px] rounded-[16px] bg-[#f97316] py-[18px] text-[15px] font-bold text-white transition-transform active:scale-[0.98]">
        Back to Home
      </button>
    </div>
  )
}
