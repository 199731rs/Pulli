import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEnquiry } from '../context/EnquiryContext.jsx'
import { formatPrice, getProduct, productTitle } from '../lib/catalogue.js'
import { CloseIcon } from './Icons.jsx'
import './EnquiryDrawer.css'

export function EnquiryLines({ compact = false }) {
  const { items, update, remove } = useEnquiry()
  return (
    <ul className={`enquiry-lines ${compact ? 'compact' : ''}`}>
      {items.map((line, i) => {
        const p = getProduct(line.id)
        if (!p) return null
        return (
          <li key={`${line.id}-${line.finish}-${line.size}`}>
            <img src={p.image} alt="" />
            <div className="enquiry-line-info">
              <Link to={`/product/${p.id}`}>
                <strong>{productTitle(p)}</strong>
              </Link>
              <small>{[line.finish, line.size].filter(Boolean).join(' · ')}</small>
              {line.price != null && <small className="enquiry-line-price">{formatPrice(line.price)} each</small>}
            </div>
            <div className="qty">
              <button onClick={() => update(i, line.qty - 1)} aria-label="Decrease quantity">
                −
              </button>
              <input
                value={line.qty}
                inputMode="numeric"
                aria-label="Quantity"
                onChange={(e) => update(i, parseInt(e.target.value, 10) || 1)}
              />
              <button onClick={() => update(i, line.qty + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button className="enquiry-remove" onClick={() => remove(i)} aria-label="Remove">
              <CloseIcon />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function EnquiryDrawer() {
  const { items, open, setOpen } = useEnquiry()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <div className={`drawer-root ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="drawer-scrim" onClick={() => setOpen(false)} />
      <aside className="drawer" role="dialog" aria-label="Enquiry list">
        <div className="drawer-head">
          <h3>Your enquiry list</h3>
          <button onClick={() => setOpen(false)} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Your list is empty.</p>
            <p>Browse the collection and add products with “Add to enquiry” to request a quote for several items at once.</p>
            <Link to="/collections" className="btn btn-primary" onClick={() => setOpen(false)}>
              Browse collections
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              <EnquiryLines />
            </div>
            <div className="drawer-foot">
              <Link to="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
                Send enquiry
              </Link>
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>
                Keep browsing
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
