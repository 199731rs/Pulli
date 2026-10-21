import { Link, useParams } from 'react-router-dom'
import { ALL_PRODUCTS, BATH, HARDWARE, getCategory, plural } from '../lib/catalogue.js'
import PageHero from '../components/PageHero.jsx'
import ProductBrowser from '../components/ProductBrowser.jsx'
import NotFound from './NotFound.jsx'
import './Collections.css'

export default function Category() {
  const { line, slug } = useParams()
  const cat = getCategory(slug)
  if (!cat || cat.line !== line) return <NotFound />

  const products = ALL_PRODUCTS.filter((p) => p.category === slug)
  const siblings = (line === 'bath' ? BATH : HARDWARE).filter((c) => c.slug !== slug)
  const lineName = line === 'bath' ? 'Bath collection' : 'Architectural hardware'

  return (
    <>
      <PageHero
        crumbs={
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden>/</span>
            <Link to={`/collections#${line}`}>{lineName}</Link>
            <span aria-hidden>/</span>
            <span>{cat.name}</span>
          </nav>
        }
        eyebrow={plural(products.length, 'product')}
        title={cat.name}
        text={cat.blurb}
        image={cat.hero}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ProductBrowser key={slug} products={products} />
        </div>
      </section>
      {siblings.length > 0 && (
        <section className="section collections-group" style={{ background: 'var(--white)' }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">Keep exploring</span>
                <h2>More from {lineName.toLowerCase()}</h2>
              </div>
            </div>
            <div className="collection-grid">
              {siblings.slice(0, 3).map((c) => (
                <Link key={c.slug} to={c.path} className="collection-card">
                  <div className="collection-card-media">
                    <img src={c.hero} alt="" loading="lazy" />
                  </div>
                  <div className="collection-card-body">
                    <h3>{c.name}</h3>
                    <p>{c.blurb}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
