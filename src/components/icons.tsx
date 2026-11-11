import type { CSSProperties } from 'react'
import arrowDown01 from '../assets/figma/arrow-down-01.svg'
import arrowRight02 from '../assets/figma/arrow-right-02.svg'
import boat from '../assets/figma/boat.svg?raw'
import chipArrow from '../assets/figma/chip-arrow.svg'
import location01 from '../assets/figma/location-01.svg'
import notification1 from '../assets/figma/notification/1.svg'
import notification2 from '../assets/figma/notification/2.svg'
import logo1 from '../assets/figma/logo/1.svg'
import logo2 from '../assets/figma/logo/2.svg'
import logo3 from '../assets/figma/logo/3.svg'
import logo4 from '../assets/figma/logo/4.svg'
import logo5 from '../assets/figma/logo/5.svg'
import logo6 from '../assets/figma/logo/6.svg'
import logo7 from '../assets/figma/logo/7.svg'
import reload1 from '../assets/figma/reload/1.svg'
import reload2 from '../assets/figma/reload/2.svg'
import reload3 from '../assets/figma/reload/3.svg'
import reload4 from '../assets/figma/reload/4.svg'
import schedule1 from '../assets/figma/schedule/1.svg?raw'
import schedule2 from '../assets/figma/schedule/2.svg?raw'
import schedule3 from '../assets/figma/schedule/3.svg?raw'
import schedule4 from '../assets/figma/schedule/4.svg?raw'
import ticket1 from '../assets/figma/ticket/1.svg?raw'
import ticket2 from '../assets/figma/ticket/2.svg?raw'
import ticket3 from '../assets/figma/ticket/3.svg?raw'
import userGroup from '../assets/figma/user-group.svg?raw'

// Figma exports multi-part icons as separate vectors; each piece keeps the
// box (`at`) and stroke overflow (`pad`) Figma gave it, so the icon renders 1:1.
export type Piece = { src: string; at: string; pad?: string }

export function Pieces({ size, pieces, clip = true }: { size: number | [number, number]; pieces: Piece[]; clip?: boolean }) {
  const [w, h] = typeof size === 'number' ? [size, size] : size
  return (
    <span aria-hidden className={`relative block shrink-0 ${clip ? 'overflow-clip' : ''}`} style={{ width: w, height: h }}>
      {pieces.map((p, i) => (
        <span key={i} className="absolute" style={{ inset: p.at }}>
          <span className="absolute" style={{ inset: p.pad ?? 0 } as CSSProperties}>
            <img alt="" src={p.src} className="block size-full max-w-none" />
          </span>
        </span>
      ))}
    </span>
  )
}

function Img({ src, size }: { src: string; size: number }) {
  return <img alt="" aria-hidden src={src} className="block shrink-0" style={{ width: size, height: size }} />
}

// Tab-bar icons come in three tones (inactive grey, active orange, white on the orange Tickets pill).
// Figma exports one colour per icon, so the other tones are derived from the same SVG source.
export type Tone = 'inactive' | 'active' | 'inverse'
const TONES: Record<Tone, [string, string]> = { inactive: ['#3C3C43', '0.6'], active: ['#F97316', '1'], inverse: ['#FFFFFF', '1'] }
const tinted = new Map<string, string>()
function tint(raw: string, tone: Tone) {
  const key = tone + raw
  if (!tinted.has(key)) {
    const [color, opacity] = TONES[tone]
    const svg = raw
      .replace(/stroke-opacity="[^"]*"/g, '')
      .replace(/stroke="#[0-9a-fA-F]{6}"/g, `stroke="${color}" stroke-opacity="${opacity}"`)
    tinted.set(key, `data:image/svg+xml,${encodeURIComponent(svg)}`)
  }
  return tinted.get(key)!
}

export const LogoMark = () => (
  <Pieces
    size={[39, 23.994]}
    pieces={[
      { src: logo1, at: '0 49.9% 52.15% 23.25%' },
      { src: logo2, at: '1.35% 22.76% 29.81% 17.35%' },
      { src: logo3, at: '14.29% 22.77% 48.23% 60.45%' },
      { src: logo4, at: '50.49% 28.83% 31.64% 59.16%' },
      { src: logo5, at: '50.52% 40.12% 15.93% 20.92%' },
      { src: logo6, at: '72.91% 0.91% 0.5% 0.01%' },
      { src: logo7, at: '88.42% 22.32% 0.22% 22.64%' },
    ]}
  />
)

export const ArrowReloadVertical = () => (
  <Pieces
    size={16}
    pieces={[
      { src: reload1, at: '14.58% 50% 12.5% 22.92%', pad: '-4.29% -11.54%' },
      { src: reload2, at: '12.5% 22.92% 14.58% 50%', pad: '-4.29% -11.54%' },
      { src: reload3, at: '75% 12.5% 14.58% 66.67%', pad: '-30% -15%' },
      { src: reload4, at: '12.5% 66.67% 77.08% 12.5%', pad: '-30% -15%' },
    ]}
  />
)

// Figma "notification-01" (node 11598:49451) — bell for the signed-in Home header
export const Notification01 = () => (
  <Pieces
    size={18}
    pieces={[
      { src: notification1, at: '75% 35.42% 10.42% 35.42%', pad: '-21.43% -10.71%' },
      { src: notification2, at: '10.42% 12.5% 25% 12.5%', pad: '-4.84% -4.17%' },
    ]}
  />
)

export const Appointment02 = ({ tone = 'inactive' }: { tone?: Tone }) => (
  <Pieces
    size={20.993}
    pieces={[
      { src: tint(schedule1, tone), at: '8.33% 33.33% 75% 33.33%', pad: '-18.75% -9.37% -18.75% -9.38%' },
      { src: tint(schedule2, tone), at: '16.67% 12.5% 8.33% 12.5%', pad: '-4.17%' },
      { src: tint(schedule3, tone), at: '41.67% 12.5% 58.33% 12.5%', pad: '-0.66px -4.17%' },
      { src: tint(schedule4, tone), at: '56.25% 33.33% 22.92% 37.5%', pad: '-15% -10.72%' },
    ]}
  />
)

export const TicketStar = ({ tone = 'inactive' }: { tone?: Tone }) => (
  <Pieces
    size={18.986}
    pieces={[
      { src: tint(ticket1, tone), at: '37.5% 27.08% 37.5% 47.92%', pad: '-12.5% -12.53% -12.53% -12.52%' },
      { src: tint(ticket2, tone), at: '70.83% 66.67% 14.58% 33.33%', pad: '-21.43% -0.59px' },
      { src: tint(ticket2, tone), at: '14.58% 66.67% 70.83% 33.33%', pad: '-21.43% -0.59px' },
      { src: tint(ticket3, tone), at: '14.58% 8.33% 14.58% 8.34%', pad: '-4.41% -3.75%' },
    ]}
  />
)

export const ArrowRight02 = () => (
  <Pieces size={15.985} pieces={[{ src: arrowRight02, at: '25% 20.83%', pad: '-6.25% -5.36%' }]} />
)

export const ArrowDown01 = () => (
  <Pieces size={15.985} pieces={[{ src: arrowDown01, at: '37.5% 25%', pad: '-12.5% -6.25%' }]} />
)

export const ChipArrow = () => <Pieces size={[3, 4]} clip={false} pieces={[{ src: chipArrow, at: '0', pad: '-6.25% -8.33%' }]} />

export const Boat = ({ tone = 'active' }: { tone?: Tone }) => <Img src={tint(boat, tone)} size={20.993} />
export const UserGroup = ({ tone = 'inactive' }: { tone?: Tone }) => <Img src={tint(userGroup, tone)} size={20.993} />
export const Location01 = () => <Img src={location01} size={12} />
