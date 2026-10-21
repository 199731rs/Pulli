import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ALL_PRODUCTS,
  formatPrice,
  getCategory,
  getProduct,
  hasSizes,
  priceLabel,
  productSubtitle,
  productTitle,
} from '../lib/catalogue.js'
import { useEnquiry } from '../context/EnquiryContext.jsx'
import { SITE } from '../config/site.js'
import PriceTable, { sizeLabel } from '../components/PriceTable.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Swatch from '../components/Swatch.jsx'
import { CheckIcon } from '../components/Icons.jsx'
import NotFound from './NotFound.jsx'
import './Product.css'

function firstPriced(p) {
  for (let fi = 0; fi < p.prices.length; fi++) {
    const si = p.prices[fi].values.findIndex((v) => v != null)
    if (si >= 0) return [fi, si]
  }
  return [0, 0]
}

function ProductView({ product: p }) {
  const cat = getCategory(p.category)
  const sized = hasSizes(p)
  const [[fi, si], setSel] = useState(() => firstPriced(p))
  const [img, setImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { add, setOpen } = useEnquiry()

  const row = p.prices[fi]
  const price = row?.values[sized ? si : 0]
  const images = p.images?.length ? p.images : [p.image].filter(Boolean)
  const related = ALL_PRODUCTS.filter((x) => x.id !== p.id && (x.category === p.category || x.line === p.line)).slice(0, 4)

  const select = (f, s) => {
    setSel([f, s])
    setAdded(false)
  }

  const addToEnquiry = () => {
    add({
      id: p.id,
      finish: row?.finish || null,
      size: sized ? sizeLabel(p, p.sizes[si]) : null,
      price: price ?? null,
      qty,
    })
    setAdded(true)
  }

  return (
    <>
      <section className="product-page">
        <div className="wrap product-grid-main">
          <div className="product-gallery">
            <div className="product-gallery-main">
              {images[img] && <img src={images[img]} alt={`${productTitle(p)}, ${productSubtitle(p)}`} />}
            </div>
            {images.length > 1 && (
              <div className="product-thumbs">
                {images.map((src, i) => (
                  <button key={src} className={i === img ? 'is-active' : ''} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}>
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden>/</span>
              <Link to={cat.path}>{cat.name}</Link>
            </nav>
            <span className="eyebrow">{p.line === 'bath' ? `${cat.name} collection` : cat.name}</span>
            <h1>{productTitle(p)}</h1>
            <p className="product-sub">{productSubtitle(p)}</p>

            <div className="product-price">
              <strong>{formatPrice(price)}</strong>
              <span>
                {priceLabel(p)}
                {row?.finish && ` · ${row.finish}`}
                {sized && ` · ${sizeLabel(p, p.sizes[si])}`}
              </span>
            </div>

            {p.prices.length > 1 && (
              <div className="option-group">
                <span className="option-label">Finish</span>
                <div className="option-list">
                  {p.prices.map((r, i) => (
                    <button key={r.finish + i} className={`option ${i === fi ? 'is-active' : ''}`} onClick={() => select(i, si)}>
                      {r.finish}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sized && p.sizes.length > 1 && (
              <div className="option-group">
                <span className="option-label">Size</span>
                <div className="option-list">
                  {p.sizes.map((s, i) => (
                    <button
                      key={s}
                      className={`option ${i === si ? 'is-active' : ''}`}
                      disabled={row?.values[i] == null}
                      onClick={() => select(fi, i)}
                    >
                      {sizeLabel(p, s)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-add">
              <div className="qty qty-lg">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <input value={qty} inputMode="numeric" aria-label="Quantity" onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))} />
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
              </div>
              <button className="btn btn-primary" onClick={addToEnquiry}>
                {added ? (
                  <>
                    <CheckIcon /> Added to enquiry
                  </>
                ) : (
                  'Add to enquiry'
                )}
              </button>
              {added && (
                <button className="link-arrow" onClick={() => setOpen(true)}>
                  View list →
                </button>
              )}
            </div>

            <dl className="product-specs">
              {p.material && (
                <div>
                  <dt>Material</dt>
                  <dd>{p.material}</dd>
                </div>
              )}
              <div>
                <dt>Finishes</dt>
                <dd className="spec-swatches">
                  {p.families.map((f) => (
                    <Swatch key={f} family={f} size={18} />
                  ))}
                  <span>{p.prices.length} option{p.prices.length === 1 ? '' : 's'}</span>
                </dd>
              </div>
              {p.code && (
                <div>
                  <dt>Product code</dt>
                  <dd>{p.code}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <section className="section product-prices">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Full price list</span>
              <h2>All finishes and sizes</h2>
            </div>
            <p>
              {priceLabel(p)} in ₹, as per the Pulli {p.line === 'bath' ? 'bath catalogue 2026' : `price list ${SITE.priceListYear}`}.
              Prices may change without notice. Select a price to choose that option.
            </p>
          </div>
          <PriceTable product={p} finishIndex={fi} sizeIndex={si} onSelect={select} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2>Related pieces</h2>
              </div>
            </div>
            <div className="related-grid">
              {related.map((x) => (
                <ProductCard key={x.id} product={x} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default function Product() {
  const { id } = useParams()
  const p = getProduct(id)
  if (!p) return <NotFound />
  // keyed so selection state resets when moving between products
  return <ProductView key={p.id} product={p} />
}
