import { Link } from 'react-router-dom'
import { Icon } from './Icons'

export default function CategoryCard({ category }) {
  const { id, name, icon, count, blurb } = category
  return (
    <Link
      to={`/shop?category=${id}`}
      className="category-card"
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '30px 28px',
        minHeight: 200,
        overflow: 'hidden',
        transition: 'all 0.4s var(--ease)',
      }}
    >
      <div className="category-card__icon" style={{
        width: 54, height: 54, borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg3)', border: '1px solid var(--border)',
        color: 'var(--text)', marginBottom: 24,
        transition: 'all 0.4s var(--ease)',
      }}>
        <Icon name={icon} size={26} />
      </div>

      <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 8, color: 'var(--text)' }}>
        {name}
      </h3>
      <p style={{ fontSize: 13.5, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 'auto' }}>{blurb}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
        <span className="caption" style={{ fontSize: 11 }}>{count} parts</span>
        <span className="category-card__arrow" style={{
          color: 'var(--text2)', display: 'inline-flex',
          transition: 'transform 0.35s var(--ease), color 0.35s var(--ease)',
        }}>
          <Icon name="arrowUpRight" size={18} />
        </span>
      </div>
    </Link>
  )
}
