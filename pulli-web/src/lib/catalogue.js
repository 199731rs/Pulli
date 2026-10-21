import products from '../data/products.json'
import catalogue from '../data/catalogue.json'

// Hero photography from the catalogue divider pages, used in place of the
// first product photo where a category has one.
const CATEGORY_HERO = {
  'cabinet-handles': '/img/hero/cabinet.jpg',
  'sliding-handles': '/img/hero/sliding.jpg',
  knobs: '/img/hero/knob-kadi.jpg',
  'door-handles': '/img/hero/main-door.jpg',
  hooks: '/img/hero/khuti.jpg',
  'door-accessories': '/img/hero/door-accessories.jpg',
  rolex: '/img/hero/rolex-antique.jpg',
  'glass-accessories': '/img/hero/glass.jpg',
}

const withLine = (line) => (c) => ({
  ...c,
  line,
  hero: CATEGORY_HERO[c.slug] || c.cover,
  path: `/${line}/${c.slug}`,
})

export const HARDWARE = catalogue.hardware.map(withLine('hardware'))
export const BATH = catalogue.bath.map(withLine('bath'))
export const FAMILIES = catalogue.families
export const ALL_PRODUCTS = products

const CATEGORY_BY_SLUG = Object.fromEntries([...HARDWARE, ...BATH].map((c) => [c.slug, c]))
const PRODUCT_BY_ID = Object.fromEntries(products.map((p) => [p.id, p]))

export const getCategory = (slug) => CATEGORY_BY_SLUG[slug]
export const getProduct = (id) => PRODUCT_BY_ID[id]
export const getFamily = (slug) => FAMILIES.find((f) => f.slug === slug)

export const productTitle = (p) => p.code || p.name
export const productSubtitle = (p) => {
  const cat = getCategory(p.category)
  if (p.line === 'bath') return [p.name, p.finishes[0]].filter(Boolean).join(' · ')
  return p.name && p.name !== p.code ? p.name : cat.name
}

const SINGLE_SIZES = new Set(['Single', 'Standard'])
// Products priced without a size column print one value per finish.
export const hasSizes = (p) => p.sizes.length > 0 && !(p.sizes.length === 1 && SINGLE_SIZES.has(p.sizes[0]))

export const minPrice = (p) => {
  const vals = p.prices.flatMap((r) => r.values).filter((v) => typeof v === 'number')
  return vals.length ? Math.min(...vals) : null
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
export const formatPrice = (v) => (typeof v === 'number' ? inr.format(v) : 'On request')

export const priceLabel = (p) =>
  ({ mrp: 'M.R.P.', pair: 'Rate per pair', piece: 'Rate per piece' })[p.priceBasis]

// Materials are printed in many spellings; group them for filtering.
const MATERIAL_GROUPS = [
  ['zinc', 'Zinc Alloy', /zinc/i],
  ['aluminium', 'Aluminium', /alumin/i],
  ['steel', 'Stainless Steel', /\bss\b|stainless|ss-|ss -/i],
  ['brass', 'Brass', /brass/i],
  ['wood', 'Wood', /wood/i],
]
export const materialGroups = (p) =>
  p.material ? MATERIAL_GROUPS.filter(([, , re]) => re.test(p.material)).map(([k]) => k) : []
export const MATERIALS = MATERIAL_GROUPS.map(([slug, name]) => ({ slug, name }))

export function searchProducts(query, list = products) {
  const q = query.trim().toLowerCase()
  if (!q) return list
  const terms = q.split(/\s+/)
  return list.filter((p) => {
    const hay = [p.code, p.name, p.series, p.material, ...p.finishes, getCategory(p.category).name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return terms.every((t) => hay.includes(t))
  })
}

export const plural = (n, word) => `${n} ${n === 1 ? word : word.replace(/y$/, 'ie') + 's'}`

export const STATS = {
  products: products.length,
  hardwareCategories: HARDWARE.length,
  bathSeries: BATH.length,
  families: FAMILIES.length,
}
