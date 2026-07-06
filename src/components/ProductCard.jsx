import { Link } from 'react-router-dom'
import { Icon } from './Icons'

export default function ProductCard({ product }) {
  const { id, name, price, image, brand, rating, category } = product
  return (
    <Link
      to={`/product/${id}`}
      className="product-card"
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'all 0.35s var(--ease)',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--bg3)' }}>
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="product-card__img"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s var(--ease)' }}
        />
        <span style={{
          position: 'absolute', top: 12, left: 12,
          fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
          padding: '5px 10px', borderRadius: 100,
          background: 'var(--navbar-bg)', backdropFilter: 'blur(10px)',
          border: '1px solid var(--border)', color: 'var(--text2)',
        }}>{category}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span className="caption" style={{ fontSize: 10.5 }}>{brand}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--text2)', fontWeight: 600 }}>
            <Icon name="star" size={13} strokeWidth={1.4} /> {rating}
          </span>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px', lineHeight: 1.35, color: 'var(--text)' }}>
          {name}
        </h3>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 8 }}>
          <div>
            <div className="caption" style={{ fontSize: 9.5, marginBottom: 2 }}>Price</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 21, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text)' }}>
              ${price.toLocaleString()}
            </div>
          </div>
          <span className="product-card__cta" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: 'var(--text)',
            transition: 'gap 0.25s var(--ease)',
          }}>
            View details <Icon name="arrow" size={15} />
          </span>
        </div>
      </div>
    </Link>
  )
}
