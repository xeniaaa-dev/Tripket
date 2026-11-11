// DECORATIVE QR codes. Figma uses a raster QR image; the prototype draws a deterministic QR-looking matrix
// from the ticket number (finder squares, noise modules, Tripket orange centre mark). It is not scannable.
const N = 25

function bits(value: string) {
  let h = 2166136261
  for (const c of value) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const next = () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
  const grid: boolean[][] = Array.from({ length: N }, () => Array.from({ length: N }, () => next() > 0.5))
  const finder = (x: number, y: number) => {
    for (let i = -1; i <= 7; i++)
      for (let j = -1; j <= 7; j++) {
        const xx = x + i
        const yy = y + j
        if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue
        const edge = i === 0 || i === 6 || j === 0 || j === 6
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4
        grid[yy][xx] = i >= 0 && i <= 6 && j >= 0 && j <= 6 && (edge || core)
      }
  }
  finder(0, 0)
  finder(N - 7, 0)
  finder(0, N - 7)
  return grid
}

export default function Qr({ value, size = 96, skeleton = false }: { value: string; size?: number; skeleton?: boolean }) {
  const grid = bits(value)
  const c = Math.floor(N / 2)
  return (
    <svg role="img" aria-label={skeleton ? 'QR code loading' : 'QR code'} width={size} height={size} viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">
      <rect width={N} height={N} fill="#fff" />
      {grid.map((row, y) =>
        row.map((on, x) => {
          if (!on || (!skeleton && Math.abs(x - c) <= 2 && Math.abs(y - c) <= 2)) return null
          return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={skeleton ? '#d9d9de' : '#111'} />
        }),
      )}
      {!skeleton && (
        <>
          <rect x={c - 2} y={c - 2} width="5" height="5" fill="#fff" />
          <rect x={c - 1.5} y={c - 1.5} width="4" height="4" rx="0.8" fill="#f97316" />
        </>
      )}
    </svg>
  )
}
