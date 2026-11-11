import { useEffect, useRef, type ReactNode } from 'react'

// Live overlays (FAQs, Privacy, Terms) use tailwind-animate "fade-in duration-300": opacity 0 → 1 over 300ms.
export default function FadeIn({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease' })
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
