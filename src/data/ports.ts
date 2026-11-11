// Ports copied verbatim from Figma "Select Origin" / "Select Destination" sheets
// (PortPicker, nodes 11598:33602 and 12173:1672). Codes follow Figma where it shows them
// (DGT, CEB, TAG, CAT); the rest are 3-letter codes made up for the prototype.
import type { Port as BookingPort } from '../booking/BookingContext'

export type Port = BookingPort & { terminal: string; province: string }

export const ports: Port[] = [
  { code: 'BCD', city: 'Bacolod', terminal: 'BREDCO Port', province: 'Negros Occidental' },
  { code: 'BTG', city: 'Batangas City', terminal: 'Grand Terminal', province: 'Batangas' },
  { code: 'CGY', city: 'Cagayan de Oro', terminal: 'Macabalan Port', province: 'Misamis Oriental' },
  { code: 'CLP', city: 'Calapan', terminal: 'Calapan Port', province: 'Oriental Mindoro' },
  { code: 'CAT', city: 'Caticlan', terminal: 'Jetty Port', province: 'Aklan' },
  { code: 'CEB', city: 'Cebu City', terminal: 'Pier 1', province: 'Cebu' },
  { code: 'DPT', city: 'Dapitan', terminal: 'Dapitan Port', province: 'Zamboanga del Norte' },
  { code: 'DGT', city: 'Dumaguete', terminal: 'Dumaguete Port', province: 'Negros Oriental' },
  { code: 'ILO', city: 'Iloilo City', terminal: 'Fastcraft Terminal', province: 'Iloilo' },
  { code: 'LRN', city: 'Larena', terminal: 'Larena Port', province: 'Siquijor' },
  { code: 'LLN', city: 'Liloan', terminal: 'Liloan Port', province: 'Southern Leyte' },
  { code: 'NSP', city: 'Nasipit', terminal: 'Nasipit Port', province: 'Agusan del Norte' },
  { code: 'OMC', city: 'Ormoc', terminal: 'Ormoc Port', province: 'Leyte' },
  { code: 'OZC', city: 'Ozamiz', terminal: 'Ozamiz Port', province: 'Misamis Occidental' },
  { code: 'SBL', city: 'Sibulan', terminal: 'Sibulan Port', province: 'Negros Oriental' },
  { code: 'SUG', city: 'Surigao City', terminal: 'Surigao Port', province: 'Surigao del Norte' },
  { code: 'TAG', city: 'Tagbilaran', terminal: 'Tagbilaran Port', province: 'Bohol' },
  { code: 'TBN', city: 'Tubigon', terminal: 'Tubigon Port', province: 'Bohol' },
]

export const portByCity = (city: string) => ports.find((p) => p.city === city) ?? ports[0]

const pick = (...codes: string[]) => codes.map((c) => ports.find((p) => p.code === c)!)

/** "Recent Ports" section (Figma 12173:1123 / 12173:1297) */
export const recentPorts = pick('CAT', 'BCD', 'CEB')

/** "All Ports" in Select Destination — Figma lists only these five (12173:1721) */
export const destinationPorts = pick('BCD', 'CLP', 'CAT', 'CEB', 'DGT')

/** Count pills on the right of a row, per sheet, exactly as Figma shows them (meaning not labelled in Figma). */
export const originCounts: Record<string, number> = { LRN: 2, LLN: 1, NSP: 1, OMC: 3, OZC: 1, SBL: 1, SUG: 1, TAG: 2, TBN: 1 }
export const destinationCounts: Record<string, number> = { CEB: 2, DGT: 3 }
