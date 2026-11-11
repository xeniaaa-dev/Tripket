import card1 from '../../assets/figma/step-review/card-1.svg'
import card2 from '../../assets/figma/step-review/card-2.svg'
import card3 from '../../assets/figma/step-review/card-3.svg'
import card4 from '../../assets/figma/step-review/card-4.svg'
import mail1 from '../../assets/figma/step-review/mail-1.svg'
import mail2 from '../../assets/figma/step-review/mail-2.svg'
import route1 from '../../assets/figma/step-review/route-1.svg'
import route2 from '../../assets/figma/step-review/route-2.svg'
import route3 from '../../assets/figma/step-review/route-3.svg'
import route4 from '../../assets/figma/step-review/route-4.svg'
import tickWhite from '../../assets/figma/step-review/tick-white.svg'
import user1 from '../../assets/figma/step-review/user-1.svg'
import user2 from '../../assets/figma/step-review/user-2.svg'
import van1 from '../../assets/figma/step-review/van-1.svg'
import van2 from '../../assets/figma/step-review/van-2.svg'
import van3 from '../../assets/figma/step-review/van-3.svg'
import van4 from '../../assets/figma/step-review/van-4.svg'
import { Pieces } from '../icons'

// HugeIcons from "Book - Review" (node 12348:746), each piece positioned as in Figma.

/** route-02 (node 12348:756) */
export const RouteIcon = () => (
  <Pieces
    size={15.985}
    pieces={[
      { src: route1, at: '8.33% 8.33% 54.17% 58.33%', pad: '-8.33% -9.38%' },
      { src: route2, at: '25% 24.96% 75% 75%', pad: '-0.67px' },
      { src: route3, at: '66.67% 66.67% 8.33% 8.33%', pad: '-12.5%' },
      { src: route4, at: '29.17% 33.33% 20.83% 25%', pad: '-6.25% -7.5%' },
    ]}
  />
)

/** user (node 12348:965), grey #8e8e93 */
export const UserIcon = () => (
  <Pieces
    size={13.995}
    pieces={[
      { src: user1, at: '14.58% 29.17% 43.75% 29.17%', pad: '-7.5%' },
      { src: user2, at: '56.24% 20.83% 14.59% 20.84%', pad: '-10.71% -5.36%' },
    ]}
  />
)

/** van (node 12348:1019) — 16×12.984 icon inside a 16×16 HugeIcon box */
export const VanIcon = () => (
  <span className="relative block size-[16px] shrink-0">
    <span className="absolute top-[-0.2px] left-[0.01px]">
      <Pieces
        size={[16, 12.984]}
        pieces={[
          { src: van1, at: '25% 16.65% 46.11% 50.01%', pad: '-10.82% -7.61%' },
          { src: van2, at: '25% 8.33% 11.43% 8.34%', pad: '-4.92% -3.04%' },
          { src: van3, at: '77% 20.82% -0.12% 62.51%', pad: '-13.52% -15.22%' },
          { src: van4, at: '77% 62.5% -0.12% 20.84%', pad: '-13.52% -15.22%' },
        ]}
      />
    </span>
  </span>
)

/** credit-card (node 12348:1060) */
export const CardIcon = () => (
  <Pieces
    size={15.985}
    pieces={[
      { src: card1, at: '16.67% 8.33%', pad: '-4.69% -3.75%' },
      { src: card2, at: '66.67% 52.08% 33.33% 41.67%', pad: '-0.5px -50%' },
      { src: card3, at: '66.67% 25% 33.33% 60.42%', pad: '-0.5px -21.43%' },
      { src: card4, at: '37.5% 8.33% 62.5% 8.33%', pad: '-0.5px 0' },
    ]}
  />
)

/** mail-01 (node 12348:879) */
export const MailIcon = () => (
  <Pieces
    size={15.985}
    pieces={[
      { src: mail1, at: '25.01% 8.33% 54.15% 8.33%', pad: '-13.05% -1.85% -15% -1.85%' },
      { src: mail2, at: '14.59% 8.33% 14.58% 8.33%', pad: '-4.41% -3.75%' },
    ]}
  />
)

/** tick-01 white (node 12348:1092) */
export const TickWhiteIcon = () => <Pieces size={10.994} pieces={[{ src: tickWhite, at: '22.92% 16.67% 22.91% 16.66%' }]} />
