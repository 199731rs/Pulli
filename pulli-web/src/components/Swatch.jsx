import { getFamily } from '../lib/catalogue.js'

export default function Swatch({ family, size = 16, title }) {
  const f = typeof family === 'string' ? getFamily(family) : family
  if (!f) return null
  const conic = f.swatch === 'conic'
  return (
    <span
      className={`swatch ${conic ? 'conic' : ''}`}
      style={{ '--size': `${size}px`, background: conic ? undefined : f.swatch }}
      title={title || f.name}
    />
  )
}
