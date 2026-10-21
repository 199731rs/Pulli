import { Link } from 'react-router-dom'
import { CATALOGUES, SITE } from '../config/site.js'
import PageHero from '../components/PageHero.jsx'
import { DownloadIcon } from '../components/Icons.jsx'
import './About.css'

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Pulli"
        title="Elevating lifestyles, one detail at a time."
        text="Pulli brings architectural hardware and bath accessories together under one brand, so every handle, knob and fitting in a home can share the same finish and quality."
        image="/img/hero/packaging.jpg"
      />

      <section className="section about-story">
        <div className="wrap about-story-grid">
          <div className="about-quote">
            <span className="eyebrow">Our idea</span>
            <h2>The small things you touch every day deserve the most care.</h2>
          </div>
          <div className="about-copy">
            <p>
              A door handle, a drawer knob or a towel rail is used thousands of times. Pulli designs these everyday
              pieces to feel solid in the hand and look considered in the room, in materials from zinc alloy and
              aluminium to brass and stainless steel 304.
            </p>
            <p>
              The range covers cabinet and main door handles, knobs and kadi, sliding and profile handles, hooks,
              sofa legs, door accessories and closers, along with a premium bath collection in coordinated finishes.
            </p>
            <p>
              Pulli is marketed by {SITE.marketedBy}, {SITE.address}.
            </p>
          </div>
        </div>
      </section>

      <section className="section about-values">
        <div className="wrap">
          <div className="values-grid">
            <div>
              <h3>Certified quality</h3>
              <p>ISO 9001:2015 certified, and a member of the IAF multilateral recognition arrangement.</p>
            </div>
            <div>
              <h3>Made in India</h3>
              <p>Proudly part of the Make in India movement.</p>
            </div>
            <div>
              <h3>Finish-matched</h3>
              <p>Chrome, satin, black, PVD gold, rose gold, antique and wood tones that carry from room to room.</p>
            </div>
            <div>
              <h3>Open pricing</h3>
              <p>Every product on this site shows its price list rate for each finish and size.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-cta">
          <div>
            <span className="eyebrow">Catalogues</span>
            <h2>Take the full range with you.</h2>
            <p>Download the complete price list and bath catalogue as PDFs.</p>
          </div>
          <div className="about-downloads">
            {CATALOGUES.map((c) => (
              <a key={c.href} href={c.href} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <DownloadIcon /> {c.title}
              </a>
            ))}
            <Link to="/contact" className="btn btn-primary">
              Talk to our team
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
