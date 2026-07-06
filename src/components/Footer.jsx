import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Icon } from './Icons'

const cols = {
  Catalog: [
    { l: 'Engine Parts', p: '/shop?category=engine' },
    { l: 'Transmission', p: '/shop?category=transmission' },
    { l: 'Suspension', p: '/shop?category=suspension' },
    { l: 'Brakes', p: '/shop?category=brakes' },
  ],
  Company: [
    { l: 'Shop All Parts', p: '/shop' },
    { l: 'Featured', p: '/shop' },
    { l: 'Electrical', p: '/shop?category=electrical' },
    { l: 'Filters', p: '/shop?category=filters' },
  ],
  Support: [
    { l: 'Contact Us', p: '/contact' },
    { l: 'Shipping & Returns', p: '/contact' },
    { l: 'Bulk Orders', p: '/contact' },
    { l: 'Find a Part', p: '/contact' },
  ],
}

export default function Footer() {
  const { isDark } = useTheme()
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48, padding: '72px 0 48px' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'var(--accent)', color: 'var(--accent-fg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isDark ? '0 0 22px var(--glow)' : 'none',
              }}>
                <Icon name="box" size={19} />
              </div>
              <div style={{ lineHeight: 1.05 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, letterSpacing: '-0.4px' }}>
                  GlobalAuto<span style={{ color: 'var(--text3)' }}>Business</span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '2.4px', textTransform: 'uppercase', marginTop: 2 }}>Truck Spare Parts</div>
              </div>
            </Link>
            <p style={{ color: 'var(--text3)', fontSize: 13.5, lineHeight: 1.75, maxWidth: 260, marginBottom: 22 }}>
              Premium spare parts for trucks and heavy vehicles. Genuine quality, global supply, trusted by professionals worldwide.
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

          {Object.entries(cols).map(([title, items]) => (
            <div key={title}>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1.4px', marginBottom: 20 }}>{title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13 }}>
                {items.map((item, i) => (
                  <li key={item.l + i}>
                    <Link to={item.p} style={{ color: 'var(--text3)', fontSize: 13.5, transition: 'color 0.2s', display: 'block' }}
                      onMouseEnter={(e) => { e.target.style.color = 'var(--text)' }}
                      onMouseLeave={(e) => { e.target.style.color = 'var(--text3)' }}>
                      {item.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase' }}>24/7 Parts Support</div>
              <a href="tel:+18005550199" style={{ fontSize: 19, fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '-0.5px', color: 'var(--text)' }}>
                +1 (800) 555-0199
              </a>
            </div>
          </div>
          <a href="mailto:parts@globalautobusiness.com" style={{ fontSize: 13.5, color: 'var(--text3)' }}>
            parts@globalautobusiness.com
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text3)', fontSize: 12.5 }}>
            © {new Date().getFullYear()} GlobalAutoBusiness — Premium Truck & Heavy Vehicle Spare Parts
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Warranty'].map((item) => (
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
