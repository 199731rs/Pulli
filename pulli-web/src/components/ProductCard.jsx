import { Link } from 'react-router-dom'
import { formatPrice, minPrice, productSubtitle, productTitle } from '../lib/catalogue.js'
import Swatch from './Swatch.jsx'
import './ProductCard.css'

export default function ProductCard({ product: p }) {
  const from = minPrice(p)
  const multi = p.prices.length > 1 || p.sizes.length > 1
  return (
    <Link to={`/product/${p.id}`} className="product-card">
      <div className="product-card-media">
        {p.image ? <img src={p.image} alt={`${productTitle(p)} ${productSubtitle(p)}`} loading="lazy" /> : <span className="no-img">Pulli</span>}
      </div>
      <div className="product-card-body">
        <div className="product-card-row">
          <h3>{productTitle(p)}</h3>
          <div className="product-card-swatches" aria-label="Finishes">
            {p.families.slice(0, 5).map((f) => (
              <Swatch key={f} family={f} size={13} />
            ))}
          </div>
        </div>
        <p className="product-card-sub">{productSubtitle(p)}</p>
        <p className="product-card-price">
          {from != null ? (
            <>
              {multi && <span>from </span>}
              {formatPrice(from)}
            </>
          ) : (
            'Price on request'
          )}
        </p>
      </div>
    </Link>
  )
}
