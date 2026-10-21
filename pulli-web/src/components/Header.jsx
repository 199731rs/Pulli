import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { BATH, HARDWARE, plural } from '../lib/catalogue.js'
import { CloseIcon, MenuIcon, SearchIcon } from './Icons.jsx'
import './Header.css'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mega, setMega] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    setMega(null)
  }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const MegaMenu = ({ id, items, title, all }) => (
    <div className={`mega ${mega === id ? 'is-open' : ''}`}>
      <div className="wrap mega-inner">
        <div className="mega-intro">
          <span className="eyebrow">{title}</span>
          <Link to={all} className="link-arrow">
            View all →
          </Link>
        </div>
        <ul className="mega-grid">
          {items.map((c) => (
            <li key={c.slug}>
              <Link to={c.path} className="mega-item">
                <img src={c.hero} alt="" loading="lazy" />
                <span>
                  <strong>{c.name}</strong>
                  <small>{plural(c.count, 'product')}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`} onMouseLeave={() => setMega(null)}>
      <div className="wrap header-bar">
        <Link to="/" className="header-logo" aria-label="Pulli home">
          <img src="/img/pulli-logo.png" alt="Pulli, Elevating Lifestyles" />
        </Link>

        <nav className={`header-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
          <button className="nav-link" onMouseEnter={() => setMega('hw')} onClick={() => navigate('/collections#hardware')}>
            Hardware
          </button>
          <button className="nav-link" onMouseEnter={() => setMega('bath')} onClick={() => navigate('/collections#bath')}>
            Bath
          </button>
          <NavLink to="/finishes" className="nav-link" onMouseEnter={() => setMega(null)}>
            Finishes
          </NavLink>
          <NavLink to="/about" className="nav-link" onMouseEnter={() => setMega(null)}>
            About
          </NavLink>
          <NavLink to="/contact" className="nav-link" onMouseEnter={() => setMega(null)}>
            Contact
          </NavLink>
          <form className="header-search" onSubmit={submitSearch} role="search">
            <SearchIcon />
            <label htmlFor="site-search" className="visually-hidden">
              Search products
            </label>
            <input id="site-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search code, e.g. CH-103" />
          </form>
        </nav>

        <div className="header-actions">
          <button className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" aria-expanded={menuOpen}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <MegaMenu id="hw" items={HARDWARE} title="Architectural Hardware" all="/collections#hardware" />
      <MegaMenu id="bath" items={BATH} title="Premium Bath Collection" all="/collections#bath" />
    </header>
  )
}
