import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap" style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
        <span className="eyebrow">404</span>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300 }}>This page has moved on.</h1>
        <p style={{ color: 'var(--muted)' }}>The product or page you are looking for is not available.</p>
        <Link to="/collections" className="btn btn-primary">
          Browse collections
        </Link>
      </div>
    </section>
  )
}
