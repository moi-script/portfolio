import { CanvasTexture, SRGBColorSpace } from 'three'

function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

/**
 * Draws a warm parchment texture: base fill + soft blotches + subtle grain.
 * Returned texture is ready to use as a material map.
 */
export function makeParchmentTexture(size = 1024): CanvasTexture {
  const base = cssVar('--parchment', '#e9d6ad')
  const edge = cssVar('--parchment-edge', '#cdb488')

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!

  // base
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  // soft blotches
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = size * (0.05 + Math.random() * 0.12)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `${edge}22`)
    g.addColorStop(1, '#00000000')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // fine grain
  const grain = ctx.getImageData(0, 0, size, size)
  const d = grain.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 14
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n
  }
  ctx.putImageData(grain, 0, 0)

  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/**
 * Shared, lazily-created parchment texture. All pages reuse this single
 * texture instead of each allocating its own — one 512² texture instead of N,
 * which drastically cuts GPU memory (a common cause of context-loss on
 * integrated GPUs).
 */
let sharedParchment: CanvasTexture | null = null
export function getParchmentTexture(): CanvasTexture {
  if (!sharedParchment) sharedParchment = makeParchmentTexture(512)
  return sharedParchment
}
