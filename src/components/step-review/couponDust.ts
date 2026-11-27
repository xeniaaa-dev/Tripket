// "Coupon turns to dust" (reference: x.com/AetherMaker/status/2123480143310078451): the tapped voucher dissolves left → right
// into particles that stream along a curve and gather on the total, where a small voucher tag then forms.
// Plain canvas overlay. Smoothness: each grain rides one cubic curve that starts in its drift direction (no stop-and-go),
// the coupon fades out behind a soft moving edge, grains leave short trails, and the target glides to layout changes.

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#ea580c', '#f59e0b', '#fcd34d', '#c2410c']
export const DISSOLVE = 520 // ms for the coupon to fully break up
const TRAVEL = [820, 1150] // ms per grain on its way

/** when the grains finish landing (AnimatedAmount / the tag wait for it before they change) */
export const landing = { until: 0 }

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

type Grain = { x: number; y: number; dx: number; dy: number; tx: number; ty: number; bow: number; lift: number; release: number; travel: number; r: number; color: string; phase: number }

/** smooth start and end, gentle middle */
const ease = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
const lerp = (a: number, b: number, k: number) => a + (b - a) * k

/** Dissolve `from` and fly it to the element `target()` returns. Resolves once every grain has landed. */
export function dustFly(from: HTMLElement, target: () => HTMLElement | null): Promise<void> {
  if (reduced()) return Promise.resolve()
  const src = from.getBoundingClientRect()
  const count = Math.round(Math.min(420, Math.max(180, (src.width * src.height) / 7)))
  const grains: Grain[] = Array.from({ length: count }, () => {
    const x = src.left + Math.random() * src.width
    const y = src.top + Math.random() * src.height
    const a = Math.random() * Math.PI * 2
    const d = 18 + Math.random() * 30
    return {
      x,
      y,
      dx: Math.cos(a) * d,
      dy: Math.sin(a) * d - 14, // drift a little upward first, like dust lifting off
      tx: 0.15 + Math.random() * 0.7,
      ty: 0.2 + Math.random() * 0.6,
      bow: 60 + Math.random() * 80, // how far the stream swings out to the right
      lift: (Math.random() - 0.5) * 40,
      release: ((x - src.left) / src.width) * DISSOLVE * 0.85 + Math.random() * DISSOLVE * 0.15,
      travel: TRAVEL[0] + Math.random() * (TRAVEL[1] - TRAVEL[0]),
      r: 0.6 + Math.random() * 1.1,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      phase: Math.random() * Math.PI * 2,
    }
  })
  const end = Math.max(...grains.map((g) => g.release + g.travel))
  landing.until = performance.now() + end

  const canvas = document.createElement('canvas')
  const dpr = window.devicePixelRatio || 1
  canvas.width = innerWidth * dpr
  canvas.height = innerHeight * dpr
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: '60' })
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  const fromStyle = from.style
  const setEdge = (p: number) => {
    // soft 14%-wide edge sweeping left → right; what's behind it is gone
    const m = `linear-gradient(90deg, transparent ${p * 114 - 14}%, #000 ${p * 114}%)`
    fromStyle.setProperty('-webkit-mask-image', m)
    fromStyle.setProperty('mask-image', m)
    fromStyle.filter = `blur(${p * 1.5}px)`
  }

  return new Promise((resolve) => {
    const t0 = performance.now()
    const first = target()?.getBoundingClientRect() ?? src
    const tgt = { left: first.left, top: first.top, width: first.width, height: first.height }
    const frame = (now: number) => {
      const t = now - t0
      if (t <= DISSOLVE) setEdge(Math.min(1, t / DISSOLVE))
      // glide toward where the target is now (it can move when the voucher row appears)
      const el = target()
      if (el) {
        const r = el.getBoundingClientRect()
        tgt.left = lerp(tgt.left, r.left, 0.18)
        tgt.top = lerp(tgt.top, r.top, 0.18)
        tgt.width = lerp(tgt.width, r.width, 0.18)
        tgt.height = lerp(tgt.height, r.height, 0.18)
      }
      // fade the last frame a bit instead of clearing it: short soft trails
      ctx.globalCompositeOperation = 'destination-out'
      ctx.globalAlpha = 0.45
      ctx.fillRect(0, 0, innerWidth, innerHeight)
      ctx.globalCompositeOperation = 'source-over'
      for (const g of grains) {
        const age = t - g.release
        if (age < 0) continue
        const u = age / g.travel
        if (u >= 1) continue
        const e = ease(u)
        // cubic curve: leaves along its drift, swings out to the right, settles into the target
        const ex = tgt.left + g.tx * tgt.width
        const ey = tgt.top + g.ty * tgt.height
        const p1x = g.x + g.dx * 3
        const p1y = g.y + g.dy * 3
        const p2x = Math.max(g.x, ex) + g.bow
        const p2y = lerp(g.y, ey, 0.6) + g.lift
        const k = 1 - e
        const x = k * k * k * g.x + 3 * k * k * e * p1x + 3 * k * e * e * p2x + e * e * e * ex
        const y = k * k * k * g.y + 3 * k * k * e * p1y + 3 * k * e * e * p2y + e * e * e * ey
        // fade in as it lifts off, fade out as it lands, gentle shimmer on the way
        const alpha = Math.min(1, u / 0.08) * Math.min(1, (1 - u) / 0.18) * (0.75 + 0.25 * Math.sin(now / 90 + g.phase))
        ctx.globalAlpha = alpha
        ctx.fillStyle = g.color
        ctx.beginPath()
        ctx.arc(x, y, g.r * (1 - 0.4 * e), 0, Math.PI * 2)
        ctx.fill()
      }
      if (t < end + 120) requestAnimationFrame(frame)
      else {
        canvas.remove()
        resolve()
      }
    }
    requestAnimationFrame(frame)
  })
}
