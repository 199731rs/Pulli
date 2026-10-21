import './PageHero.css'

// Split hero for inner pages: copy on the left, catalogue photo on the right.
export default function PageHero({ eyebrow, title, text, image, crumbs, children }) {
  return (
    <section className="page-hero">
      <div className="wrap page-hero-grid">
        <div className="page-hero-copy">
          {crumbs}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {text && <p>{text}</p>}
          {children}
        </div>
        {image && (
          <div className="page-hero-media">
            <img src={image} alt="" />
          </div>
        )}
      </div>
    </section>
  )
}
