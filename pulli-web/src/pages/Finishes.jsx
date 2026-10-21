import { Link, useParams } from 'react-router-dom'
import { ALL_PRODUCTS, FAMILIES, getFamily, plural } from '../lib/catalogue.js'
import PageHero from '../components/PageHero.jsx'
import ProductBrowser from '../components/ProductBrowser.jsx'
import Swatch from '../components/Swatch.jsx'
import NotFound from './NotFound.jsx'
import './Finishes.css'

// Abbreviations as printed in the Pulli price list and bath catalogue.
const GLOSSARY = [
  ['CP', 'Chrome plated. A bright, mirror-like silver finish.'],
  ['SS', 'Stainless steel, polished or brushed.'],
  ['PVD', 'Physical vapour deposition. A hard, long-lasting coating used for gold, rose gold and black.'],
  ['RG', 'Rose gold, a warm pink-gold tone.'],
  ['AB', 'Antique brass, an aged bronze look.'],
  ['TT', 'Two tone. Two finishes combined on one piece.'],
  ['Black Matt / Z-Black', 'Deep black finishes with a low sheen.'],
]

export default function Finishes() {
  const { slug } = useParams()

  if (slug) {
    const fam = getFamily(slug)
    if (!fam) return <NotFound />
    const products = ALL_PRODUCTS.filter((p) => p.families.includes(slug))
    return (
      <>
        <section className="finish-hero">
          <div className="wrap">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden>/</span>
              <Link to="/finishes">Finishes</Link>
            </nav>
            <div className="finish-hero-row">
              <Swatch family={fam} size={96} />
              <div>
                <span className="eyebrow">{plural(products.length, 'product')}</span>
                <h1>{fam.name}</h1>
              </div>
            </div>
            <div className="finish-switch">
              {FAMILIES.map((f) => (
                <Link key={f.slug} to={`/finishes/${f.slug}`} className={`chip ${f.slug === slug ? 'is-active' : ''}`}>
                  <Swatch family={f} size={14} />
                  {f.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <ProductBrowser key={slug} products={products} showFamilies={false} />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Finishes"
        title="Choose the finish first."
        text="Most homes pick one finish and carry it through every room. Browse the Pulli range by finish to match handles, knobs, door fittings and bath accessories."
        image="/img/hero/sliding.jpg"
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap finish-cards">
          {FAMILIES.map((f) => {
            const samples = ALL_PRODUCTS.filter((p) => p.families.includes(f.slug) && p.image).slice(0, 3)
            return (
              <Link key={f.slug} to={`/finishes/${f.slug}`} className="finish-card">
                <div className="finish-card-head">
                  <Swatch family={f} size={52} />
                  <div>
                    <h3>{f.name}</h3>
                    <span>{plural(f.count, 'product')}</span>
                  </div>
                </div>
                <div className="finish-card-samples">
                  {samples.map((p) => (
                    <img key={p.id} src={p.image} alt="" loading="lazy" />
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
      <section className="section glossary">
        <div className="wrap glossary-grid">
          <div>
            <span className="eyebrow">Finish glossary</span>
            <h2>What the codes mean</h2>
            <p>Finish names on product pages follow the Pulli price list, so you can quote them exactly when you enquire.</p>
          </div>
          <dl>
            {GLOSSARY.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
