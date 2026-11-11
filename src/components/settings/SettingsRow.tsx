import type { ReactNode } from 'react'
import { ChevronRight } from './icons'

// One row of the Settings lists (live: button.h-16 p-4 gap-4, 40px grey icon circle, 14/11px text, chevron).
export default function SettingsRow({ icon, title, subtitle, onClick }: { icon: ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-[64px] w-full items-center gap-[16px] rounded-12 bg-white p-[16px] text-left transition-colors duration-150 hover:bg-[#fafafa]">
      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#dedee3] text-[#7b797b]">{icon}</span>
      <span className="flex-1">
        <span className="block text-[14px] leading-[20px] font-medium text-[#1e293b]">{title}</span>
        <span className="mt-[2px] block text-[11px] leading-[16.5px] text-[#8e8e93]">{subtitle}</span>
      </span>
      <ChevronRight className="text-[#d4d4d4]" />
    </button>
  )
}
