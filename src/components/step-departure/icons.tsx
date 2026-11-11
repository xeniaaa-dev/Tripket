import arrowRight from '../../assets/figma/step-departure/arrow-right.svg'
import userMultiple1 from '../../assets/figma/step-departure/user-multiple-1.svg'
import userMultiple2 from '../../assets/figma/step-departure/user-multiple-2.svg'
import userMultiple3 from '../../assets/figma/step-departure/user-multiple-3.svg'
import userMultiple4 from '../../assets/figma/step-departure/user-multiple-4.svg'
import van1 from '../../assets/figma/step-departure/van-1.svg'
import van2 from '../../assets/figma/step-departure/van-2.svg'
import van3 from '../../assets/figma/step-departure/van-3.svg'
import van4 from '../../assets/figma/step-departure/van-4.svg'
import { Pieces } from '../icons'

// Figma: HugeIcon "UserMultiple" (node 11598:39420)
export const UserMultiple = () => (
  <Pieces
    size={12}
    pieces={[
      { src: userMultiple1, at: '29.16% 45.84% 37.51% 20.83%', pad: '-9.37% -9.38% -9.38% -9.37%' },
      { src: userMultiple2, at: '12.49% 20.83% 54.17% 45.83%', pad: '-9.37% -9.38% -9.38% -9.37%' },
      { src: userMultiple3, at: '62.48% 37.5% 12.52% 12.5%', pad: '-12.5% -6.25%' },
      { src: userMultiple4, at: '45.83% 12.5% 29.17% 62.5%', pad: '-12.5%' },
    ]}
  />
)

// Figma: HugeIcon "Van" (node 11598:39431) — 16×14 icon box nudged up 0.2px inside a 16px slot
export const Van = () => (
  <span className="block size-[16px] shrink-0">
    <span className="mt-[-0.2px] ml-[0.01px] block">
      <Pieces
        size={[16, 14]}
        pieces={[
          { src: van1, at: '21.75% 16.83% 51.45% 49.84%', pad: '-10.82% -7.61%' },
          { src: van2, at: '21.75% 8.49% 19.3% 8.17%', pad: '-4.92% -3.04%' },
          { src: van3, at: '69.98% 20.99% 8.59% 62.34%', pad: '-13.52% -15.22%' },
          { src: van4, at: '69.98% 62.66% 8.59% 20.67%', pad: '-13.52% -15.22%' },
        ]}
      />
    </span>
  </span>
)

// Figma: HugeIcon "ArrowRight" between depart and arrive time (node 11598:39467)
export const TimeArrow = () => <Pieces size={12} pieces={[{ src: arrowRight, at: '25% 37.5%', pad: '-6.25% -12.5%' }]} />
