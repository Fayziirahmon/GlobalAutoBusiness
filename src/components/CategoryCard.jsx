import { Link } from 'react-router-dom'
import { Icon } from './Icons'
import { useLang } from '../context/LanguageContext'

export default function CategoryCard({ category }) {
  const { id, name, icon, count } = category
  const { t, tl } = useLang()
  const hasCount = typeof count === 'number'

  return (
    <Link
      to={`/products?category=${id}`}
      className="category-card"
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '26px 24px',
        minHeight: 160,
        overflow: 'hidden',
        transition: 'all 0.4s var(--ease)',
      }}
    >
      <div className="category-card__icon" style={{
        width: 52, height: 52, borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg3)', border: '1px solid var(--border)',
        color: 'var(--text)', marginBottom: 'auto',
        transition: 'all 0.4s var(--ease)',
      }}>
        <Icon name={icon} size={25} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginTop: 22 }}>
        <div>
          <h3 style={{ fontSize: 16.5, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--text)', lineHeight: 1.25 }}>
            {tl(name)}
          </h3>
          {hasCount && (
            <div className="caption" style={{ fontSize: 10.5, marginTop: 6, opacity: count ? 1 : 0.55 }}>
              {count} {t('unit.parts')}
            </div>
          )}
        </div>
        <span className="category-card__arrow" style={{
          color: 'var(--text3)', flexShrink: 0,
          transition: 'transform 0.35s var(--ease), color 0.35s var(--ease)',
        }}>
          <Icon name="arrowUpRight" size={18} />
        </span>
      </div>
    </Link>
  )
}
