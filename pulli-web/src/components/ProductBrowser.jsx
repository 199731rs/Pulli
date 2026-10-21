import { useMemo, useState } from 'react'
import { FAMILIES, MATERIALS, materialGroups, minPrice, searchProducts } from '../lib/catalogue.js'
import ProductCard from './ProductCard.jsx'
import Swatch from './Swatch.jsx'
import './ProductBrowser.css'

const PAGE = 24
const SORTS = {
  catalogue: { label: 'Catalogue order', fn: null },
  low: { label: 'Price: low to high', fn: (a, b) => (minPrice(a) ?? 1e9) - (minPrice(b) ?? 1e9) },
  high: { label: 'Price: high to low', fn: (a, b) => (minPrice(b) ?? -1) - (minPrice(a) ?? -1) },
  code: { label: 'Code A to Z', fn: (a, b) => (a.code || a.name).localeCompare(b.code || b.name, 'en', { numeric: true }) },
}

// Filterable product grid used by category, finish and search pages.
export default function ProductBrowser({ products, initialFamily = null, showFamilies = true, emptyText }) {
  const [family, setFamily] = useState(initialFamily)
  const [material, setMaterial] = useState('')
  const [sort, setSort] = useState('catalogue')
  const [q, setQ] = useState('')
  const [shown, setShown] = useState(PAGE)

  const familyOptions = useMemo(
    () => FAMILIES.filter((f) => products.some((p) => p.families.includes(f.slug))),
    [products],
  )
  const materialOptions = useMemo(
    () => MATERIALS.filter((m) => products.some((p) => materialGroups(p).includes(m.slug))),
    [products],
  )

  const results = useMemo(() => {
    let list = searchProducts(q, products)
    if (family) list = list.filter((p) => p.families.includes(family))
    if (material) list = list.filter((p) => materialGroups(p).includes(material))
    if (SORTS[sort].fn) list = [...list].sort(SORTS[sort].fn)
    return list
  }, [products, q, family, material, sort])

  const reset = () => {
    setFamily(null)
    setMaterial('')
    setQ('')
    setShown(PAGE)
  }
  const filtered = family || material || q

  return (
    <div className="browser">
      <div className="browser-bar">
        {showFamilies && familyOptions.length > 1 && (
          <div className="family-chips" role="group" aria-label="Filter by finish">
            <button className={`chip ${!family ? 'is-active' : ''}`} onClick={() => { setFamily(null); setShown(PAGE) }}>
              All finishes
            </button>
            {familyOptions.map((f) => (
              <button
                key={f.slug}
                className={`chip ${family === f.slug ? 'is-active' : ''}`}
                onClick={() => { setFamily(family === f.slug ? null : f.slug); setShown(PAGE) }}
                aria-pressed={family === f.slug}
              >
                <Swatch family={f} size={14} />
                {f.name}
              </button>
            ))}
          </div>
        )}
        <div className="browser-controls">
          <div className="field browser-search">
            <label htmlFor="browser-q" className="visually-hidden">Search within results</label>
            <input id="browser-q" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE) }} placeholder="Search code or finish" />
          </div>
          {materialOptions.length > 1 && (
            <div className="field">
              <label htmlFor="browser-mat" className="visually-hidden">Material</label>
              <select id="browser-mat" value={material} onChange={(e) => { setMaterial(e.target.value); setShown(PAGE) }}>
                <option value="">All materials</option>
                {materialOptions.map((m) => (
                  <option key={m.slug} value={m.slug}>{m.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="field">
            <label htmlFor="browser-sort" className="visually-hidden">Sort</label>
            <select id="browser-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="browser-meta">
        <span>
          {results.length} {results.length === 1 ? 'product' : 'products'}
        </span>
        {filtered && (
          <button className="link-reset" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>

      {results.length ? (
        <>
          <div className="product-grid">
            {results.slice(0, shown).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {shown < results.length && (
            <div className="browser-more">
              <button className="btn btn-ghost" onClick={() => setShown((n) => n + PAGE)}>
                Show more ({results.length - shown} left)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="browser-empty">
          <p>{emptyText || 'No products match these filters.'}</p>
          {filtered && (
            <button className="btn btn-ghost" onClick={reset}>
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
