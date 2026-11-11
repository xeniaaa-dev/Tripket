import { useSyncExternalStore } from 'react'
import { VEHICLE_TYPES, type VehicleType } from './step-passengers'

// Saved passenger & vehicle profiles (live: book.tripket.ph/passengers, stored server-side per account).
// Prototype: in-memory only, starting empty like the live guest experience.

export const PASSENGER_TYPES = ['Regular', 'Student', 'Senior Citizen', 'PWD', 'Child (2-11)', 'Infant (under 2)'] as const
export type PassengerType = (typeof PASSENGER_TYPES)[number]

export const ID_TYPES = ['PhilID', 'Senior Citizen ID', 'PWD ID', 'Student ID', 'Passport', "Driver's License", 'UMID', 'Birth Certificate', "Voter's ID", 'Other'] as const

export type Gender = 'male' | 'female'
/** A picked file (prototype keeps it in memory as an object URL). */
export type FileRef = { name: string; url: string } | null

export interface SavedPassenger {
  id: number
  type: PassengerType
  firstName: string
  middleName: string
  lastName: string
  city: string // "MANITO, ALBAY"
  birthDate: string // YYYY-MM-DD
  gender: Gender
  nationality: string
  idType: string
  idNumber: string
  idFront: FileRef
  idBack: FileRef
}

export interface SavedVehicle {
  id: number
  type: VehicleType
  plate: string
  year: string
  make: string
  model: string
  photo: FileRef
  or: FileRef
  cr: FileRef
}

export { VEHICLE_TYPES }
export type { VehicleType }
/** Live default (class 1 = Motorcycle). */
export const DEFAULT_VEHICLE_TYPE: VehicleType = 'Motorcycle'

type State = { passengers: SavedPassenger[]; vehicles: SavedVehicle[] }
let state: State = { passengers: [], vehicles: [] }
let nextId = 1
const listeners = new Set<() => void>()
const set = (next: State) => {
  state = next
  listeners.forEach((l) => l())
}
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useSaved() {
  return useSyncExternalStore(subscribe, () => state)
}

export const savePassenger = (p: Omit<SavedPassenger, 'id'> & { id?: number }) =>
  set({
    ...state,
    passengers: p.id ? state.passengers.map((x) => (x.id === p.id ? { ...p, id: x.id } : x)) : [...state.passengers, { ...p, id: nextId++ }],
  })
export const saveVehicle = (v: Omit<SavedVehicle, 'id'> & { id?: number }) =>
  set({
    ...state,
    vehicles: v.id ? state.vehicles.map((x) => (x.id === v.id ? { ...v, id: x.id } : x)) : [...state.vehicles, { ...v, id: nextId++ }],
  })
export const removePassenger = (id: number) => set({ ...state, passengers: state.passengers.filter((p) => p.id !== id) })
export const removeVehicle = (id: number) => set({ ...state, vehicles: state.vehicles.filter((v) => v.id !== id) })

/** "Juan S. Dela Cruz" — live shows the middle name as an initial. */
export const fullName = (p: Pick<SavedPassenger, 'firstName' | 'middleName' | 'lastName'>) =>
  [p.firstName, p.middleName ? `${p.middleName[0].toUpperCase()}.` : '', p.lastName].filter(Boolean).join(' ')

export const initials = (p: Pick<SavedPassenger, 'firstName' | 'lastName'>) => `${p.firstName[0] ?? ''}${p.lastName[0] ?? ''}`.toUpperCase()

export function ageFrom(birthDate: string) {
  const b = new Date(birthDate)
  if (Number.isNaN(b.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--
  return age
}

// City/Municipality search (live queries the API; prototype uses a local sample of PH municipalities).
export const CITIES: { name: string; province: string }[] = [
  ['ANGELES CITY', 'PAMPANGA'], ['BACOLOD CITY', 'NEGROS OCCIDENTAL'], ['BAGUIO CITY', 'BENGUET'], ['BATANGAS CITY', 'BATANGAS'],
  ['BOHOL - TAGBILARAN CITY', 'BOHOL'], ['BORONGAN CITY', 'EASTERN SAMAR'], ['BUTUAN CITY', 'AGUSAN DEL NORTE'], ['CABANATUAN CITY', 'NUEVA ECIJA'],
  ['CAGAYAN DE ORO CITY', 'MISAMIS ORIENTAL'], ['CALAPAN CITY', 'ORIENTAL MINDORO'], ['CALBAYOG CITY', 'SAMAR'], ['CATICLAN - MALAY', 'AKLAN'],
  ['CEBU CITY', 'CEBU'], ['CORON', 'PALAWAN'], ['DAGUPAN CITY', 'PANGASINAN'], ['DAVAO CITY', 'DAVAO DEL SUR'], ['DUMAGUETE CITY', 'NEGROS ORIENTAL'],
  ['GENERAL SANTOS CITY', 'SOUTH COTABATO'], ['ILOILO CITY', 'ILOILO'], ['LAPU-LAPU CITY', 'CEBU'], ['LEGAZPI CITY', 'ALBAY'], ['LUCENA CITY', 'QUEZON'],
  ['MAKATI CITY', 'NCR'], ['MANDAUE CITY', 'CEBU'], ['MANILA', 'NCR'], ['MANITO', 'ALBAY'], ['MASBATE CITY', 'MASBATE'], ['MATNOG', 'SORSOGON'],
  ['NAGA CITY', 'CAMARINES SUR'], ['ORMOC CITY', 'LEYTE'], ['OZAMIZ CITY', 'MISAMIS OCCIDENTAL'], ['PASIG CITY', 'NCR'], ['PUERTO PRINCESA CITY', 'PALAWAN'],
  ['QUEZON CITY', 'NCR'], ['ROXAS CITY', 'CAPIZ'], ['SAN JOSE', 'OCCIDENTAL MINDORO'], ['SORSOGON CITY', 'SORSOGON'], ['SURIGAO CITY', 'SURIGAO DEL NORTE'],
  ['TACLOBAN CITY', 'LEYTE'], ['TAGUIG CITY', 'NCR'], ['ZAMBOANGA CITY', 'ZAMBOANGA DEL SUR'],
].map(([name, province]) => ({ name, province }))

// Nationality list as on live (alphabetical, demonyms); default "Filipino".
export const NATIONALITIES = [
  'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani',
  'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian',
  'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean',
  'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish',
  'Djibouti', 'Dominican', 'Dutch', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian',
  'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean',
  'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian',
  'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese',
  'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese',
  'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican',
  'Namibian', 'Nauruan', 'Nepalese', 'New Zealander', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani',
  'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian',
  'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean',
  'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi',
  'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan',
  'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean',
]
