import { Link } from 'react-router-dom'
import { ALL_PRODUCTS, BATH, FAMILIES, HARDWARE, STATS, getProduct, plural } from '../lib/catalogue.js'
import { CATALOGUES } from '../config/site.js'
import ProductCard from '../components/ProductCard.jsx'
import Swatch from '../components/Swatch.jsx'
import { ArrowIcon, DownloadIcon } from '../components/Icons.jsx'
import './Home.css'

// One piece from each world, so the spotlight mixes hardware and bath.
const SIGNATURE = ['gd-350', 'cog-006-pvd-gold', 'ch-252', 'nlr-001-pvd-rose-gold']
const signature = SIGNATURE.map(getProduct).filter(Boolean)
const spotlight = signature.length >= 4 ? signature : ALL_PRODUCTS.slice(0, 4)

// Bento is 4 columns with one 2x2 tile; widen the last tiles so rows end flush.
const BENTO_WIDE = Math.min((4 - ((HARDWARE.length + 3) % 4)) % 4, HARDWARE.length - 1)

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="home-hero">
        <div className="wrap home-hero-grid">
          <div className="home-hero-copy">
            <span className="eyebrow">Price list 2026-27</span>
            <h1>
              Details that <em>elevate</em> every space.
            </h1>
            <p>
              Architectural hardware and premium bath accessories by Pulli. Handles, knobs, door fittings and SS 304
              bath collections, crafted in finishes made to match.
            </p>
            <div className="home-hero-actions">
              <Link to="/collections#hardware" className="btn btn-primary">
                Explore hardware <ArrowIcon />
              </Link>
              <Link to="/collections#bath" className="btn btn-ghost">
                Bath collection
              </Link>
            </div>
            <dl className="home-stats">
              <div>
                <dt>{STATS.hardwareCategories}</dt>
                <dd>Hardware categories</dd>
              </div>
              <div>
                <dt>{STATS.bathSeries}</dt>
                <dd>Bath collections</dd>
              </div>
              <div>
                <dt>{STATS.families}</dt>
                <dd>Finish families</dd>
              </div>
            </dl>
          </div>
          <div className="home-hero-collage">
            <figure className="c1">
              <img src="/img/hero/main-door.jpg" alt="Pulli elephant main door handle in gold" />
            </figure>
            <figure className="c2">
              <img src="/img/hero/sliding.jpg" alt="Pulli sliding handles in four finishes" />
            </figure>
            <figure className="c3">
              <img src="/img/hero/rolex-antique.jpg" alt="Pulli Rolex antique bath accessories" />
            </figure>
            <div className="home-hero-badge">
              <strong>ISO 9001:2015</strong>
              <span>Certified company</span>
            </div>
          </div>
        </div>
      </section>

      {/* ticker */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {[...HARDWARE, ...BATH].map((c) => (
                <span key={c.slug}>
                  {c.name}
                  <i>◆</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* two worlds */}
      <section className="section">
        <div className="wrap worlds">
          <Link to="/collections#hardware" className="world">
            <img src="/img/hero/cabinet.jpg" alt="" />
            <div className="world-copy">
              <span className="eyebrow light">{plural(HARDWARE.length, 'category')}</span>
              <h2>Architectural Hardware</h2>
              <p>Cabinet and main door handles, knobs, kadi, sofa legs, door accessories and closers.</p>
              <span className="world-cta">
                Explore <ArrowIcon />
              </span>
            </div>
          </Link>
          <Link to="/collections#bath" className="world">
            <img src="/img/hero/glass.jpg" alt="" />
            <div className="world-copy">
              <span className="eyebrow light">{plural(BATH.length, 'collection')}</span>
              <h2>Premium Bath Collection</h2>
              <p>Coordinated SS 304 bath accessories in CP, Black Matt, PVD Gold, Rose Gold and Antique.</p>
              <span className="world-cta">
                Explore <ArrowIcon />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* hardware categories */}
      <section className="section section-tight">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Architectural hardware</span>
              <h2>Every fitting, from door to drawer.</h2>
            </div>
            <p>
              Product families in zinc alloy, aluminium, brass and stainless steel, each available in a range of
              finishes and sizes.
            </p>
          </div>
          <div className="cat-bento">
            {HARDWARE.map((c, i) => (
              <Link key={c.slug} to={c.path} className={`cat-tile ${i === 0 ? 'is-large' : ''} ${i >= HARDWARE.length - BENTO_WIDE ? 'is-wide' : ''}`}>
                <img src={c.hero} alt="" loading="lazy" />
                <div className="cat-tile-copy">
                  <h3>{c.name}</h3>
                  <span>{c.blurb}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* finishes */}
      <section className="section finish-band">
        <div className="wrap">
          <div className="section-head on-dark">
            <div>
              <span className="eyebrow light">Shop by finish</span>
              <h2>Choose the finish. Match everything else.</h2>
            </div>
            <p>
              Pick a finish once and find handles, knobs, door fittings and bath accessories that match it across the
              whole range.
            </p>
          </div>
          <ul className="finish-row">
            {FAMILIES.map((f) => (
              <li key={f.slug}>
                <Link to={`/finishes/${f.slug}`} className="finish-pill">
                  <Swatch family={f} size={64} />
                  <strong>{f.name}</strong>
                  <span>{plural(f.count, 'product')}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* bath */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Premium bath collection</span>
              <h2>Elegance meets affordability.</h2>
            </div>
            <Link to="/collections#bath" className="link-arrow">
              All bath collections →
            </Link>
          </div>
          <div className="bath-rail">
            {BATH.map((c) => (
              <Link key={c.slug} to={c.path} className="bath-card">
                <div className="bath-card-media">
                  <img src={c.hero} alt="" loading="lazy" />
                </div>
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bath-banner">
        <img src="/img/hero/bath-room.jpg" alt="" loading="lazy" />
        <div className="wrap bath-banner-copy">
          <span className="eyebrow light">Stainless steel 304</span>
          <h2>Built for the bathroom. Finished for the eye.</h2>
          <Link to="/bath/costa" className="btn btn-light">
            Discover Costa
          </Link>
        </div>
      </section>

      {/* spotlight */}
      <section className="section">
        <div className="wrap spotlight">
          <div className="spotlight-media">
            <img src="/img/hero/main-door.jpg" alt="" loading="lazy" />
          </div>
          <div className="spotlight-copy">
            <span className="eyebrow">Signature pieces</span>
            <h2>First impressions, made to last.</h2>
            <p>From the main door to the bathroom wall, a few favourites from across the Pulli range.</p>
            <div className="spotlight-grid">
              {spotlight.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Link to="/collections" className="link-arrow">
              View all collections →
            </Link>
          </div>
        </div>
      </section>

      {/* why */}
      <section className="section why">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Why Pulli</span>
              <h2>Quality you can see, prices you can check.</h2>
            </div>
          </div>
          <div className="why-grid">
            <div>
              <span className="why-num">01</span>
              <h3>ISO 9001:2015 certified</h3>
              <p>A certified quality management system and a member of the IAF multilateral recognition arrangement.</p>
            </div>
            <div>
              <span className="why-num">02</span>
              <h3>SS 304 bath range</h3>
              <p>Bath series built in stainless steel 304 and brass for everyday use in wet spaces.</p>
            </div>
            <div>
              <span className="why-num">03</span>
              <h3>Finishes made to match</h3>
              <p>From chrome and satin to PVD gold, rose gold, black, antique and wood combinations.</p>
            </div>
            <div>
              <span className="why-num">04</span>
              <h3>Transparent pricing</h3>
              <p>The complete 2026-27 price list is online. Every size and finish, priced per piece.</p>
            </div>
          </div>
        </div>
      </section>

      {/* catalogues */}
      <section className="section section-tight">
        <div className="wrap catalogues">
          {CATALOGUES.map((c) => (
            <a key={c.href} href={c.href} target="_blank" rel="noreferrer" className="catalogue-card">
              <img src={c.image} alt="" loading="lazy" />
              <div>
                <span className="eyebrow">Download catalogue</span>
                <h3>{c.title}</h3>
                <small>{c.meta}</small>
              </div>
              <span className="catalogue-icon">
                <DownloadIcon />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="cta-band">
        <div className="wrap cta-band-inner">
          <div>
            <h2>Planning a project or stocking a store?</h2>
            <p>Build your enquiry list from the catalogue and our team will get back to you with availability and quotes.</p>
          </div>
          <Link to="/contact" className="btn btn-light">
            Send an enquiry <ArrowIcon />
          </Link>
        </div>
      </section>
    </>
  )
}
