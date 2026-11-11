/* oxlint-disable react/only-export-components -- icon module: components + a lookup map */
// Multi-part Hugeicons from the "Passenger details" frames, positioned 1:1 with Figma via `Pieces`.
import arrowDownOrange from '../../assets/figma/step-details/arrow-down-orange.svg'
import arrowRight14 from '../../assets/figma/step-details/arrow-right-14.svg'
import arrowRightFaint14 from '../../assets/figma/step-details/arrow-right-faint-14.svg'
import arrowRightFaint from '../../assets/figma/step-details/arrow-right-faint.svg'
import arrowRightSecB from '../../assets/figma/step-details/arrow-right-sec-b.svg'
import arrowRightSec from '../../assets/figma/step-details/arrow-right-sec.svg'
import carGreen1 from '../../assets/figma/step-details/car-green-1.svg'
import carGreen2 from '../../assets/figma/step-details/car-green-2.svg'
import carGreen3 from '../../assets/figma/step-details/car-green-3.svg'
import carSec1 from '../../assets/figma/step-details/car-sec-1.svg'
import carSec2 from '../../assets/figma/step-details/car-sec-2.svg'
import carSec3 from '../../assets/figma/step-details/car-sec-3.svg'
import car04a1 from '../../assets/figma/step-details/car04-1.svg'
import car04a2 from '../../assets/figma/step-details/car04-2.svg'
import car04a3 from '../../assets/figma/step-details/car04-3.svg'
import car04a4 from '../../assets/figma/step-details/car04-4.svg'
import car04a5 from '../../assets/figma/step-details/car04-5.svg'
import car04s1 from '../../assets/figma/step-details/car04s-1.svg'
import car04s2 from '../../assets/figma/step-details/car04s-2.svg'
import car04s3 from '../../assets/figma/step-details/car04s-3.svg'
import car04s4 from '../../assets/figma/step-details/car04s-4.svg'
import car04s5 from '../../assets/figma/step-details/car04s-5.svg'
import checkOrange from '../../assets/figma/step-details/check-orange.svg'
import chevron18 from '../../assets/figma/step-details/chevron-18.svg'
import closeX from '../../assets/figma/step-details/close-x.svg'
import moto1 from '../../assets/figma/step-details/moto-1.svg'
import moto2 from '../../assets/figma/step-details/moto-2.svg'
import moto3 from '../../assets/figma/step-details/moto-3.svg'
import motoOrange1 from '../../assets/figma/step-details/moto-orange-1.svg'
import motoOrange2 from '../../assets/figma/step-details/moto-orange-2.svg'
import motoOrange3 from '../../assets/figma/step-details/moto-orange-3.svg'
import pencilOrange1 from '../../assets/figma/step-details/pencil-orange-1.svg'
import pencilOrange2 from '../../assets/figma/step-details/pencil-orange-2.svg'
import pickup1 from '../../assets/figma/step-details/pickup-1.svg'
import pickup2 from '../../assets/figma/step-details/pickup-2.svg'
import pickup3 from '../../assets/figma/step-details/pickup-3.svg'
import saveCar1 from '../../assets/figma/step-details/save-car-1.svg'
import saveCar2 from '../../assets/figma/step-details/save-car-2.svg'
import saveCar3 from '../../assets/figma/step-details/save-car-3.svg'
import userOrange1 from '../../assets/figma/step-details/user-orange-1.svg'
import userOrange2 from '../../assets/figma/step-details/user-orange-2.svg'
import userSec1 from '../../assets/figma/step-details/user-sec-1.svg'
import userSec2 from '../../assets/figma/step-details/user-sec-2.svg'
import van1 from '../../assets/figma/step-details/van-1.svg'
import van2 from '../../assets/figma/step-details/van-2.svg'
import van3 from '../../assets/figma/step-details/van-3.svg'
import van4 from '../../assets/figma/step-details/van-4.svg'
import vtCar1 from '../../assets/figma/step-details/vt-car-1.svg'
import vtCar2 from '../../assets/figma/step-details/vt-car-2.svg'
import vtCar3 from '../../assets/figma/step-details/vt-car-3.svg'
import vtCar4 from '../../assets/figma/step-details/vt-car-4.svg'
import vtCar5 from '../../assets/figma/step-details/vt-car-5.svg'
import vtCarGray1 from '../../assets/figma/step-details/vt-car-gray-1.svg'
import vtCarGray2 from '../../assets/figma/step-details/vt-car-gray-2.svg'
import vtCarGray3 from '../../assets/figma/step-details/vt-car-gray-3.svg'
import vtCarGray4 from '../../assets/figma/step-details/vt-car-gray-4.svg'
import vtCarGray5 from '../../assets/figma/step-details/vt-car-gray-5.svg'
import vtMoto1 from '../../assets/figma/step-details/vt-moto-1.svg'
import vtMoto2 from '../../assets/figma/step-details/vt-moto-2.svg'
import vtMoto3 from '../../assets/figma/step-details/vt-moto-3.svg'
import vtPickup1 from '../../assets/figma/step-details/vt-pickup-1.svg'
import vtPickup2 from '../../assets/figma/step-details/vt-pickup-2.svg'
import vtPickup3 from '../../assets/figma/step-details/vt-pickup-3.svg'
import vtTruck1 from '../../assets/figma/step-details/vt-truck-1.svg'
import vtTruck2 from '../../assets/figma/step-details/vt-truck-2.svg'
import vtTruck3 from '../../assets/figma/step-details/vt-truck-3.svg'
import vtVan1 from '../../assets/figma/step-details/vt-van-1.svg'
import vtVan2 from '../../assets/figma/step-details/vt-van-2.svg'
import vtVan3 from '../../assets/figma/step-details/vt-van-3.svg'
import vtVan4 from '../../assets/figma/step-details/vt-van-4.svg'
import type { VehicleType } from '../../data/step-details'
import { Pieces } from '../icons'

type Srcs = [string, string, string]
const user = ([a, b]: string[]) => [
  { src: a, at: '14.58% 29.17% 43.75% 29.17%', pad: '-7.5%' },
  { src: b, at: '56.25% 20.83% 14.58% 20.83%', pad: '-10.71% -5.36%' },
]
const car03 = ([a, b, c]: Srcs) => [
  { src: a, at: '62.5% 62.47% 20.83% 20.86%', pad: '-18.75%' },
  { src: b, at: '62.5% 20.8% 20.83% 62.53%', pad: '-18.75%' },
  { src: c, at: '20.83% 8.33% 29.15% 8.33%', pad: '-6.25% -3.75%' },
]
const motorbike = ([a, b, c]: Srcs) => [
  { src: a, at: '58.33% 8.33% 20.83% 70.84%', pad: '-15%' },
  { src: b, at: '58.33% 70.83% 20.83% 8.33%', pad: '-15%' },
  { src: c, at: '20.83% 8.34% 33.33% 8.33%', pad: '-6.82% -3.75%' },
]
const car04 = (s: string[]) => [
  { src: s[0], at: '18.75% 8.33% 27.08% 8.34%', pad: '-5.77% -3.75%' },
  { src: s[1], at: '64.58% 66.66% 18.75% 16.67%', pad: '-18.75%' },
  { src: s[2], at: '64.58% 16.67% 18.75% 66.67%', pad: '-18.75%' },
  { src: s[3], at: '18.75% 27.08% 58.33% 29.17%', pad: '-13.64% -7.14%' },
  { src: s[4], at: '45.84% 62.5% 54.16% 33.33%', pad: '-0.47px -75%' },
]
const pickup = ([a, b, c]: Srcs) => [
  { src: a, at: '18.75% 8.33% 27.06% 8.33%', pad: '-5.77% -3.75%' },
  { src: b, at: '64.58% 20.83% 18.75% 62.51%', pad: '-18.75% -18.76%' },
  { src: c, at: '64.58% 62.48% 18.75% 20.85%', pad: '-18.75% -18.76%' },
]
const van = (s: string[]) => [
  { src: s[0], at: '25% 16.67% 54.17% 50%', pad: '-15% -9.37% -15% -9.38%' },
  { src: s[1], at: '25% 8.33% 29.17% 8.33%', pad: '-6.82% -3.75%' },
  { src: s[2], at: '62.5% 20.84% 20.84% 62.5%', pad: '-18.75%' },
  { src: s[3], at: '62.5% 62.5% 20.84% 20.83%', pad: '-18.75%' },
]
const truck = ([a, b, c]: Srcs) => [
  { src: a, at: '62.5% 18.75% 16.67% 60.42%', pad: '-15%' },
  { src: b, at: '62.5% 60.42% 16.67% 18.75%', pad: '-15%' },
  { src: c, at: '16.67% 8.33% 27.08% 8.33%', pad: '-5.56% -3.75%' },
]

// Section headers (node 12519:3878 / 11598:39333)
export const UserSecondary = () => <Pieces size={15.985} pieces={user([userSec1, userSec2])} />
export const CarSecondary = () => <Pieces size={15.985} pieces={car03([carSec1, carSec2, carSec3])} />
// "FREE up to 2 passengers" banner (node 11598:39248)
export const CarGreen = () => <Pieces size={15.985} pieces={car03([carGreen1, carGreen2, carGreen3])} />
// Empty slots (node 12519:3891 / 11598:39345)
export const UserOrange = () => <Pieces size={14.99} pieces={user([userOrange1, userOrange2])} />
export const MotorbikeOrange = () => <Pieces size={14.99} pieces={motorbike([motoOrange1, motoOrange2, motoOrange3])} />
// Filled vehicle card avatar (node 12173:1990)
export const CarFilled = () => <Pieces size={14.997} pieces={car04([car04a1, car04a2, car04a3, car04a4, car04a5])} />
// "Save to my vehicles" (node 11598:42472)
export const SaveCar = () => <Pieces size={14.988} pieces={car03([saveCar1, saveCar2, saveCar3])} />

/** Saved-vehicle row icons (node 11598:42118 …) */
export function VehicleRowIcon({ type }: { type: VehicleType }) {
  const pieces = {
    Motorcycle: motorbike([moto1, moto2, moto3]),
    'Car / Sedan': car04([car04s1, car04s2, car04s3, car04s4, car04s5]),
    'SUV / Pickup': pickup([pickup1, pickup2, pickup3]),
    'Van / AUV': van([van1, van2, van3, van4]),
    Truck: truck([vtTruck1, vtTruck2, vtTruck3]),
  }[type]
  return <Pieces size={14.99} pieces={pieces} />
}

/** Vehicle-type chip icons (node 11598:42389 …). Selected chip icons are white. */
export function VehicleChipIcon({ type, selected }: { type: VehicleType; selected: boolean }) {
  const pieces = {
    Motorcycle: motorbike([vtMoto1, vtMoto2, vtMoto3]),
    'Car / Sedan': car04(selected ? [vtCar1, vtCar2, vtCar3, vtCar4, vtCar5] : [vtCarGray1, vtCarGray2, vtCarGray3, vtCarGray4, vtCarGray5]),
    'SUV / Pickup': pickup([vtPickup1, vtPickup2, vtPickup3]),
    'Van / AUV': van([vtVan1, vtVan2, vtVan3, vtVan4]),
    Truck: truck([vtTruck1, vtTruck2, vtTruck3]),
  }[type]
  // Figma only ships the white variant for the selected (Car / Sedan) chip; other types are tinted white with a filter.
  const tint = selected && type !== 'Car / Sedan' ? 'brightness-0 invert' : ''
  return (
    <span className={tint}>
      <Pieces size={12.984} pieces={pieces} />
    </span>
  )
}

export const PencilOrange = () => (
  <Pieces
    size={17.991}
    pieces={[
      { src: pencilOrange1, at: '16.66% 16.66% 16.67% 16.67%', pad: '-4.69%' },
      { src: pencilOrange2, at: '83.33% 29.17% 16.67% 45.83%', pad: '-0.56px -12.5%' },
    ]}
  />
)

export const CloseX = () => <Pieces size={14.99} pieces={[{ src: closeX, at: '19.79%' }]} />

const arrow = (src: string, size: number, pad = '-6.25% -12.5%') => <Pieces size={size} pieces={[{ src, at: '25% 37.5%', pad }]} />
export const ArrowSlot = () => arrow(arrowRightFaint, 11.988)
export const ArrowRow = ({ muted = false }: { muted?: boolean }) => arrow(muted ? arrowRightSecB : arrowRightSec, 11.988)
export const ArrowManual = () => arrow(arrowRight14, 13.995)
export const ArrowManualFaint = () => arrow(arrowRightFaint14, 13.995, '-5.35% -10.71%')
export const ArrowDownOrange = () => <Pieces size={9.999} pieces={[{ src: arrowDownOrange, at: '37.5% 25%', pad: '-12.5% -6.25%' }]} />

/** Dropdown chevron in form selects (node 11598:40980) — arrow-right rotated 90° */
export const SelectChevron = () => (
  <span className="block rotate-90">
    <Pieces size={18} pieces={[{ src: chevron18, at: '25% 37.5%', pad: '-5.56% -11.11%' }]} />
  </span>
)

/** Check mark in the cabin menu (node 12348:1236) */
export const CheckOrange = () => <Pieces size={[9.333, 7.333]} clip={false} pieces={[{ src: checkOrange, at: '0', pad: '-10.23% -8.04%' }]} />
