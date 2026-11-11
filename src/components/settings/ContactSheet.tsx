import { useEffect } from 'react'
import { SheetPresence, useSheetMotion } from '../Drawer'
import { ArrowUpRight, CloseIcon, MailIcon, PhoneIcon } from './icons'

// Live: HeroUI modal, centred, 16px side margins, rounded-24, p-24, two link cards (mailto: / tel:).
function Panel({ onClose }: { onClose: () => void }) {
  const m = useSheetMotion()
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  const shown = m.panel.translate === '0 0'
  const card = 'flex w-full gap-[16px] rounded-12 border border-[#f5f5f5] p-[12px]'
  const bubble = 'flex size-[36px] items-center justify-center rounded-full bg-[#f97316]/5 text-[#f97316]'
  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/50" style={m.backdrop} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-[16px]">
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Contact Support"
          className="pointer-events-auto relative w-full max-w-[480px] rounded-[24px] bg-white p-[24px]"
          style={{ opacity: shown ? 1 : 0, scale: shown ? '1' : '0.95', transition: `opacity 250ms ease, scale 250ms ease` }}
        >
          <button type="button" aria-label="Close" onClick={onClose} className="absolute top-[16px] right-[16px] flex size-[24px] items-center justify-center rounded-12 bg-[#ececee] text-[#71717a]">
            <CloseIcon />
          </button>
          <h2 className="text-[16px] leading-[24px] font-medium text-[#09090b]">Contact Support</h2>
          <div className="mt-[20px] flex flex-col gap-[16px] p-[3px]">
            <a href="mailto:support@tripketph.com" className={card}>
              <span className={bubble}><MailIcon /></span>
              <span className="flex-1 text-[14px] leading-[20px]">
                <span className="block font-light text-[#737373]">Email</span>
                <span className="block font-medium text-text-primary">support@tripketph.com</span>
              </span>
              <span className="self-center text-[#737373]"><ArrowUpRight /></span>
            </a>
            <a href="tel:+639609216651" className={card}>
              <span className={bubble}><PhoneIcon /></span>
              <span className="flex-1 text-[14px] leading-[20px]">
                <span className="block font-light text-[#737373]">Phone</span>
                <span className="block font-medium text-text-primary">+639609216651</span>
              </span>
              <span className="self-center text-[#737373]"><ArrowUpRight /></span>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function ContactSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <SheetPresence open={open}>{open && <Panel onClose={onClose} />}</SheetPresence>
}
