import { Link } from 'react-router-dom'
import { BATH, HARDWARE } from '../lib/catalogue.js'
import { CATALOGUES, SITE } from '../config/site.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <img src="/img/pulli-logo-white.png" alt="Pulli" />
          <p>
            Architectural hardware and premium bath accessories, designed to elevate the everyday details of
            your home.
          </p>
          <div className="footer-badges">
            <span>ISO 9001:2015</span>
            <span>IAF Member</span>
            <span>Make in India</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Hardware</h4>
          <ul>
            {HARDWARE.map((c) => (
              <li key={c.slug}>
                <Link to={c.path}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Bath</h4>
          <ul>
            {BATH.map((c) => (
              <li key={c.slug}>
                <Link to={c.path}>{c.name}</Link>
              </li>
            ))}
          </ul>
          <h4 className="mt">Catalogues</h4>
          <ul>
            {CATALOGUES.map((c) => (
              <li key={c.href}>
                <a href={c.href} target="_blank" rel="noreferrer">
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Get in touch</h4>
          <address>
            Marketed by
            <br />
            <strong>{SITE.marketedBy}</strong>
            <br />
            {SITE.address}
          </address>
          <ul>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            {SITE.phone && (
              <li>
                <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>
              </li>
            )}
            <li>
              <Link to="/contact">Send an enquiry →</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} {SITE.brand}. {SITE.tagline}.
        </span>
        <span>Prices as per Pulli price list {SITE.priceListYear}. Subject to change without notice.</span>
      </div>
    </footer>
  )
}
