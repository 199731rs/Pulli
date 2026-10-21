import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BATH, HARDWARE, plural } from '../lib/catalogue.js'
import PageHero from '../components/PageHero.jsx'
import './Collections.css'

function Group({ id, eyebrow, title, text, items }) {
  return (
    <section id={id} className="section collections-group">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <p>{text}</p>
        </div>
        <div className="collection-grid">
          {items.map((c) => (
            <Link key={c.slug} to={c.path} className="collection-card">
              <div className="collection-card-media">
                <img src={c.hero} alt="" loading="lazy" />
              </div>
              <div className="collection-card-body">
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
                <span>{plural(c.count, 'product')} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Collections() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ block: 'start' })
  }, [hash])

  return (
    <>
      <PageHero
        eyebrow="Collections"
        title="The Pulli range."
        text="Architectural hardware for every door, drawer and cabinet, and a premium bath collection in stainless steel 304."
        image="/img/hero/cabinet.jpg"
      >
        <div className="collections-jump">
          <a href="#hardware" className="btn btn-primary">Architectural hardware</a>
          <a href="#bath" className="btn btn-ghost">Bath collection</a>
        </div>
      </PageHero>
      <Group
        id="hardware"
        eyebrow="Architectural hardware"
        title="Hardware fittings"
        text="Handles, knobs, kadi, sofa legs and door accessories in zinc alloy, aluminium, brass and stainless steel."
        items={HARDWARE}
      />
      <Group
        id="bath"
        eyebrow="Premium bath collection"
        title="Bath accessories"
        text="Coordinated bath series and accessories with matching finishes for a complete bathroom."
        items={BATH}
      />
    </>
  )
}
