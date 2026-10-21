import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FORM_ENDPOINT, SITE } from '../config/site.js'
import { useEnquiry } from '../context/EnquiryContext.jsx'
import { formatPrice, getProduct, productTitle } from '../lib/catalogue.js'
import { EnquiryLines } from '../components/EnquiryDrawer.jsx'
import { CheckIcon } from '../components/Icons.jsx'
import './Contact.css'

const ROLES = ['Homeowner', 'Dealer / Retailer', 'Architect / Interior designer', 'Builder / Contractor', 'Other']

function itemsAsText(items) {
  return items
    .map((i, n) => {
      const p = getProduct(i.id)
      const opts = [i.finish, i.size].filter(Boolean).join(', ')
      const price = i.price != null ? ` @ ${formatPrice(i.price)}` : ''
      return `${n + 1}. ${p ? productTitle(p) : i.id}${opts ? ` (${opts})` : ''} x ${i.qty}${price}`
    })
    .join('\n')
}

export default function Contact() {
  const { items, clear } = useEnquiry()
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    if (form.get('_honey')) return // bot filled the hidden field
    const data = Object.fromEntries(form)
    const payload = {
      ...data,
      products: items.length ? itemsAsText(items) : 'None selected',
      _subject: `Pulli website enquiry from ${data.name}`,
      _template: 'table',
    }
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(res.statusText)
      setStatus('sent')
      clear()
      e.target.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact-page">
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <span className="eyebrow">Contact</span>
          <h1>Let’s talk about your space.</h1>
          <p>
            Share what you are looking for and our team will get back to you with availability, quotes and dealer
            details.
          </p>

          <div className="contact-card">
            <span className="option-label">Marketed by</span>
            <strong>{SITE.marketedBy}</strong>
            <span>{SITE.address}</span>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            {SITE.phone && <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>}
          </div>

          <div className="contact-list">
            <div className="contact-list-head">
              <span className="option-label">Products in your enquiry</span>
              {items.length > 0 && (
                <button className="link-reset" onClick={clear}>
                  Clear
                </button>
              )}
            </div>
            {items.length ? (
              <EnquiryLines compact />
            ) : (
              <p className="contact-list-empty">
                No products added yet. <Link to="/collections">Browse the collection</Link> and use “Add to enquiry”,
                or just describe what you need in the form.
              </p>
            )}
          </div>
        </div>

        <div className="contact-form-wrap">
          {status === 'sent' ? (
            <div className="contact-success">
              <span className="success-icon">
                <CheckIcon />
              </span>
              <h2>Thank you, we have your enquiry.</h2>
              <p>Our team will reply to the email address you shared.</p>
              <button className="btn btn-ghost" onClick={() => setStatus('idle')}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={onSubmit}>
              <h2>Send an enquiry</h2>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="c-name">Full name *</label>
                  <input id="c-name" name="name" required autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="c-company">Company / firm</label>
                  <input id="c-company" name="company" autoComplete="organization" />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="c-email">Email *</label>
                  <input id="c-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="field">
                  <label htmlFor="c-phone">Phone *</label>
                  <input id="c-phone" name="phone" type="tel" required autoComplete="tel" pattern="[0-9+\s\-]{8,15}" title="8 to 15 digits" />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="c-city">City</label>
                  <input id="c-city" name="city" autoComplete="address-level2" />
                </div>
                <div className="field">
                  <label htmlFor="c-role">I am a</label>
                  <select id="c-role" name="role" defaultValue={ROLES[0]}>
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-message">Message *</label>
                <textarea
                  id="c-message"
                  name="message"
                  required
                  placeholder="Tell us about your project, quantities or the products you are interested in."
                />
              </div>
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />
              {items.length > 0 && (
                <p className="form-note">
                  {items.length} product line{items.length === 1 ? '' : 's'} from your enquiry list will be included.
                </p>
              )}
              {status === 'error' && (
                <p className="form-error" role="alert">
                  We could not send your enquiry. Please try again, or email us directly at{' '}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                </p>
              )}
              <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
