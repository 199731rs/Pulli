import { useSearchParams } from 'react-router-dom'
import { searchProducts } from '../lib/catalogue.js'
import ProductBrowser from '../components/ProductBrowser.jsx'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const results = searchProducts(q)

  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Search</span>
            <h2>{q ? `Results for “${q}”` : 'All products'}</h2>
          </div>
        </div>
        <ProductBrowser key={q} products={results} emptyText="No products found. Try a product code like CH-252 or a finish like Gold." />
      </div>
    </section>
  )
}
