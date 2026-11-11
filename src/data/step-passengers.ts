import motorcycle from '../assets/live/vehicle-motorcycle.svg'
import sedan from '../assets/live/vehicle-sedan.svg'
import suv from '../assets/live/vehicle-suv.svg'
import van from '../assets/live/vehicle-van.svg'

// Vehicle types exactly as the live app lists them (book.tripket.ph → Passengers & vehicle → Add vehicle).
export const VEHICLE_TYPES = [
  { label: 'SUV, Pick-up', icon: suv },
  { label: 'Compact / Sedan', icon: sedan },
  { label: 'Motorcycle', icon: motorcycle },
  { label: 'Van, AUV', icon: van },
] as const
export type VehicleType = (typeof VEHICLE_TYPES)[number]['label']

export const vehicleIcon = (type: VehicleType) => VEHICLE_TYPES.find((t) => t.label === type)!.icon

/** Type shown when step 1 opens with a vehicle already counted (e.g. coming back from a later step). */
export const DEFAULT_VEHICLE_TYPE: VehicleType = 'Compact / Sedan'
