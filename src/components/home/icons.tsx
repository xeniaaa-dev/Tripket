import time1 from '../../assets/figma/home/time-02-1.svg'
import time2 from '../../assets/figma/home/time-02-2.svg'
import { Pieces } from '../icons'

// Figma: "Time" next to "Recent Ports" (12173:1689)
export const Time02 = () => (
  <Pieces
    size={11}
    pieces={[
      { src: time1, at: '8.33%', pad: '-3.75%' },
      { src: time2, at: '29.16% 37.44% 37.42% 43.78%', pad: '-9.35% -16.64%' },
    ]}
  />
)
