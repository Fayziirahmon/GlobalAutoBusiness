import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LanguageContext'
import { Icon } from './Icons'
import { catName } from '../data/categories'

// Category links use ids from src/data/categories.js (label localized via catName).
const catCol = ['engines', 'fuel-systems', 'filters', 'brakes', 'electrical']
const navCol = [
  { k: 'footer.shopAll', p: '/products' },
  { k: 'nav.catalog', p: '/catalog' },
  { cat: 'gearboxes' },
  { cat: 'wheels-tires' },
  { cat: 'special-machinery' },
]
const supportCol = [
  { k: 'footer.contactUs', p: '/contact' },
  { k: 'footer.shipping', p: '/contact' },
  { k: 'footer.bulk', p: '/contact' },
  { k: 'footer.findPart', p: '/contact' },
]

export default function Footer() {
  const { isDark } = useTheme()
  const { t, lang } = useLang()

  const linkStyle = { color: 'var(--text3)', fontSize: 13.5, transition: 'color 0.2s', display: 'block' }
  const hoverIn = (e) => { e.target.style.color = 'var(--text)' }
  const hoverOut = (e) => { e.target.style.color = 'var(--text3)' }
  const catLink = (id) => ({ label: catName(id, lang), p: `/catalog/${id}` })
  const navLink = (it) => (it.cat ? catLink(it.cat) : { label: t(it.k), p: it.p })
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48, padding: '72px 0 48px' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 20 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, overflow: 'hidden',
                background: '#fff', border: '1px solid var(--border)',
                boxShadow: isDark ? '0 0 22px var(--glow)' : 'none',
              }}>
                <img src="/logo.jpg" alt="GlobalAutoBusiness" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ lineHeight: 1.05 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, letterSpacing: '-0.4px' }}>
                  GlobalAuto<span style={{ color: 'var(--text3)' }}>Business</span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '2.4px', textTransform: 'uppercase', marginTop: 2 }}>{t('nav.tagline')}</div>
              </div>
            </Link>
            <p style={{ color: 'var(--text3)', fontSize: 13.5, lineHeight: 1.75, maxWidth: 260, marginBottom: 22 }}>
              {t('footer.brandDesc')}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['mail', 'phone', 'globe', 'truck'].map((icon) => (
                <div key={icon} style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text2)', cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text2)' }}
                >
                  <Icon name={icon} size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Catalog column (categories) */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1.4px', marginBottom: 20 }}>{t('footer.catalog')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13 }}>
              {catCol.map((id) => {
                const l = catLink(id)
                return (
                  <li key={id}>
                    <Link to={l.p} style={linkStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{l.label}</Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Navigation column */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1.4px', marginBottom: 20 }}>{t('footer.company')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13 }}>
              {navCol.map((it, i) => {
                const l = navLink(it)
                return (
                  <li key={i}>
                    <Link to={l.p} style={linkStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{l.label}</Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1.4px', marginBottom: 20 }}>{t('footer.support')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13 }}>
              {supportCol.map((it, i) => (
                <li key={i}>
                  <Link to={it.p} style={linkStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{t(it.k)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Support banner */}
        <div style={{
          margin: '0 0 32px', padding: '20px 26px',
          background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--accent)', color: 'var(--accent-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="support" size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase' }}>{t('footer.banner')}</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="tel:+998903716666" style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '-0.5px', color: 'var(--text)' }}>
                  +998 90 371 66 66
                </a>
                <a href="tel:+998983618884" style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '-0.5px', color: 'var(--text)' }}>
                  +998 98 361 88 84
                </a>
              </div>
            </div>
          </div>
          <a href="mailto:globalautobusiness.uz@gmail.com" style={{ fontSize: 13.5, color: 'var(--text3)' }}>
            globalautobusiness.uz@gmail.com
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text3)', fontSize: 12.5 }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {[t('footer.privacy'), t('footer.terms'), t('footer.warranty')].map((item) => (
              <span key={item} style={{ color: 'var(--text3)', fontSize: 12.5, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.target.style.color = 'var(--text)' }}
                onMouseLeave={(e) => { e.target.style.color = 'var(--text3)' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; } }
        @media (max-width: 560px)  { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  )
}
