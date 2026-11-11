// Mock data for "Passenger details" (Figma "Booking Flow (New)" → Assign Passenger / Vehicle sheets, node 11598:40484 / 11598:41381).

export type SavedPassenger = {
  id: string
  initials: string
  fullName: string
  /** Passenger type, e.g. "Regular", "Senior Citizen", "Child (3–11)" */
  fareType: string
  /** Detail line exactly as shown under the name, e.g. "Regular · Male · Filipino · 34y" */
  detail: string
  /** Short line used when the row is disabled ("… · Already added"), node 12421:1130 */
  shortDetail: string
}

// Detail lines follow the filled cards (node 11598:42946); Maria/Paolo from the sheets.
export const savedPassengers: SavedPassenger[] = [
  { id: 'sp-juan', initials: 'JD', fullName: 'Juan M. Dela Cruz', fareType: 'Regular', detail: 'Regular · Male · Filipino · 34y', shortDetail: 'Regular · 34y' },
  { id: 'sp-maria', initials: 'MS', fullName: 'Maria C. Santos', fareType: 'Senior Citizen', detail: 'Senior Citizen · Female · Filipino · 62y', shortDetail: 'Senior Citizen · 62y' },
  { id: 'sp-carlos', initials: 'CR', fullName: 'Carlos R. Reyes', fareType: 'Regular', detail: 'Regular · Male · Filipino · 28y', shortDetail: 'Regular · 28y' },
  { id: 'sp-angela', initials: 'AL', fullName: 'Angela D. Lim', fareType: 'Regular', detail: 'Regular · Filipino · 30y', shortDetail: 'Regular · 30y' },
  { id: 'sp-paolo', initials: 'PG', fullName: 'Paolo J. Garcia', fareType: 'Child (3–11)', detail: 'Child (3–11) ·  Male · 8y', shortDetail: 'Child (3–11) · 8y' },
]

export type VehicleType = 'Motorcycle' | 'Car / Sedan' | 'SUV / Pickup' | 'Van / AUV' | 'Truck'

export type SavedVehicle = { id: string; plate: string; model: string; type: VehicleType }

// node 11598:42115
export const savedVehicles: SavedVehicle[] = [
  { id: 'sv-vios', plate: 'ABC 1234', model: '1999 Toyota Vios', type: 'Car / Sedan' },
  { id: 'sv-fortuner', plate: 'XYZ 5678', model: '2020 Toyota Fortuner', type: 'SUV / Pickup' },
  { id: 'sv-click', plate: 'MNL 9900', model: '2015 Honda Click', type: 'Motorcycle' },
  { id: 'sv-hiace', plate: 'TRP 4321', model: '2020 Toyota Hi-Ace', type: 'Van / AUV' },
]

/** Vehicle fare shown on the filled card (node 12173:2018: ₱1,200) */
export const VEHICLE_FARE = 1200

/** Cabin classes + per-passenger fare, from the "Change class" menu (node 12348:1226) */
export const cabins = [
  { name: 'Economy', price: 380 },
  { name: 'Tourist', price: 680 },
  { name: 'Business', price: 780 },
] as const

/** "FREE up to 2 passengers" per vehicle (driver + companion) */
export const FREE_PER_VEHICLE = 2

// Add passenger form (node 11598:40897)
export const passengerTypes = ['Regular', 'Senior Citizen', 'Student', 'PWD', 'Child (3–11)', 'Infant (under 3)'] as const
export const nationalities = ['Filipino', 'American', 'Australian', 'British', 'Chinese', 'Japanese', 'Korean', 'Other']
export const idTypes = ['National ID', 'Passport', 'Driver’s License', 'UMID', 'Postal ID', 'Student ID', 'Senior Citizen ID', 'PWD ID']

// Add vehicle form chips (node 11598:42387) — widths are the Figma chip widths
export const vehicleTypes: { type: VehicleType; width: number }[] = [
  { type: 'Motorcycle', width: 156.195 },
  { type: 'Car / Sedan', width: 159.547 },
  { type: 'SUV / Pickup', width: 172.345 },
  { type: 'Van / AUV', width: 152.322 },
  { type: 'Truck', width: 126.758 },
]

export const peso = (n: number) => `₱${n.toLocaleString('en-US')}`
