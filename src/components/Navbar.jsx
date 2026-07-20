import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LanguageContext'
import { useScrollY } from '../hooks/useScrollAnimation'
import { Icon } from './Icons'
import LanguageSwitcher from './LanguageSwitcher'

const navLinks = [
  { path: '/', key: 'home' },
  { path: '/catalog', key: 'catalog' },
  { path: '/products', key: 'products' },
  { path: '/contact', key: 'contact' },
]

function Logo() {
  const { isDark } = useTheme()
  const { t } = useLang()
  return (
    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10, overflow: 'hidden',
        background: '#fff', border: '1px solid var(--border)', flexShrink: 0,
        boxShadow: isDark ? '0 0 22px var(--glow)' : 'none',
      }}>
        <img src="/logo.jpg" alt="GlobalAutoBusiness" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ lineHeight: 1.05 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.4px' }}>
          GlobalAuto<span style={{ color: 'var(--text3)' }}>Business</span>
        </div>
        <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '2.4px', textTransform: 'uppercase', marginTop: 2 }}>
          {t('nav.tagline')}
        </div>
      </div>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isDark, toggle } = useTheme()
  const { t } = useLang()
  const location = useLocation()
  const scrollY = useScrollY()
  const scrolled = scrollY > 40

  useEffect(() => { setOpen(false) }, [location])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
          background: scrolled ? 'var(--navbar-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 70 }}>
          <Logo />
          <div style={{ flex: 1 }} />

          {/* Desktop nav */}
          <nav className="desk-nav" style={{ display: 'flex', alignItems: 'center', gap: 2, marginRight: 18 }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                style={({ isActive }) => ({
                  padding: '8px 15px', borderRadius: 9, fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text)' : 'var(--text3)',
                  background: isActive ? 'var(--bg3)' : 'transparent',
                  transition: 'all 0.2s ease',
                })}
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="desk-lang"><LanguageSwitcher /></div>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              style={{
                width: 39, height: 39, borderRadius: 10,
                background: 'var(--bg3)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text)', transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <Icon name={isDark ? 'sun' : 'moon'} size={17} />
            </button>

            <Link to="/products" className="btn btn-primary desk-cta" style={{ padding: '10px 20px', fontSize: 13.5, borderRadius: 9 }}>
              {t('nav.browse')}
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="ham-btn"
              aria-label="Menu"
              style={{
                width: 39, height: 39, borderRadius: 10,
                background: 'var(--bg3)', border: '1px solid var(--border)',
                display: 'none', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 5, padding: 8,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  display: 'block', width: open ? (i === 1 ? 0 : 20) : 20, height: 1.5,
                  background: 'var(--text)', borderRadius: 1, transition: 'all 0.3s ease',
                  transformOrigin: 'center',
                  transform: open
                    ? i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                    : i === 2 ? 'rotate(-45deg) translate(4px, -4px)' : 'scaleX(0)'
                    : 'none',
                  opacity: open && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'var(--bg)', paddingTop: 90, paddingLeft: 24, paddingRight: 24 }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    style={({ isActive }) => ({
                      display: 'block', padding: '16px 20px', borderRadius: 12,
                      fontSize: 26, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
                      color: isActive ? 'var(--text)' : 'var(--text2)',
                      background: isActive ? 'var(--bg3)' : 'transparent', letterSpacing: '-0.5px',
                    })}
                  >
                    {t(`nav.${link.key}`)}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ position: 'absolute', bottom: 44, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}
            >
              <LanguageSwitcher size="lg" />
              <Link to="/products" className="btn btn-primary btn-lg btn-block" onClick={() => setOpen(false)}>
                {t('nav.browseAll')} <Icon name="arrow" size={17} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 820px) {
          .desk-nav  { display: none !important; }
          .ham-btn   { display: flex !important; }
          .desk-cta  { display: none !important; }
          .desk-lang { display: none !important; }
        }
      `}</style>
    </>
  )
}
