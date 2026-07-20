import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import BrandMarquee from '../components/BrandMarquee'
import CountUp from '../components/CountUp'
import { Icon } from '../components/Icons'
import { useApi } from '../hooks/useApi'
import { useScrollProgress } from '../hooks/useScrollAnimation'
import { getCategories, getProducts } from '../api/client'
import { useLang } from '../context/LanguageContext'
import Seo from '../components/Seo'

const ease = [0.22, 1, 0.36, 1]

const stats = [
  { to: 12, suffix: 'K+', key: 'inStock' },
  { to: 60, suffix: '+', key: 'countries' },
  { display: '24/7', key: 'support' },
  { to: 99.4, decimals: 1, suffix: '%', key: 'onTime' },
]

const steps = [
  { icon: 'search', t: 's1t', d: 's1d' },
  { icon: 'check', t: 's2t', d: 's2d' },
  { icon: 'truck', t: 's3t', d: 's3d' },
  { icon: 'support', t: 's4t', d: 's4d' },
]

const trust = [
  { icon: 'truck',  tKey: 'd1t', dKey: 'd1d' },
  { icon: 'shield', tKey: 'd2t', dKey: 'd2d' },
  { icon: 'globe',  tKey: 'd3t', dKey: 'd3d' },
  { icon: 'support', tKey: 'd4t', dKey: 'd4d' },
]

/* ── Hero with reserved background-video container ── */
function Hero() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const submitSearch = (e) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/products?q=${encodeURIComponent(term)}` : '/products')
  }

  return (
    <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Fallback dark background (shown if no video) */}
      <div style={{ position: 'absolute', inset: 0, background: '#0B1F5B', zIndex: 0 }} />

      {/*
        BACKGROUND VIDEO PLACEHOLDER
        Drop a file at /public/hero.mp4 (and optional /public/hero-poster.jpg).
        Autoplays muted + looped; falls back to the dark background above.
      */}
      <video
        className="hero-video"
        autoPlay muted loop playsInline preload="auto"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Readability gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.92) 100%)',
      }} />
      {/* Subtle grid texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, opacity: 0.5, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 3, paddingTop: 90, paddingBottom: 60, color: '#fff' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(6px)' }}>
            <span className="dot" style={{ background: '#fff' }} /> {t('hero.badge')}
          </span>
        </motion.div>

        <motion.h1
          className="display"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.08 }}
          style={{ color: '#fff', margin: '26px 0 0', maxWidth: 980 }}
        >
          Global Auto<br />Business
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.18 }}
          style={{ color: 'rgba(255,255,255,0.78)', fontSize: 'clamp(17px, 2.2vw, 22px)', lineHeight: 1.6, maxWidth: 560, marginTop: 26 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.28 }}
          style={{ display: 'flex', gap: 14, marginTop: 40, flexWrap: 'wrap' }}
        >
          <Link to="/products" className="btn btn-lg" style={{ background: '#fff', color: '#0B1F5B' }}>
            {t('hero.browse')} <Icon name="arrow" size={17} />
          </Link>
          <Link to="/contact" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(6px)' }}>
            {t('hero.contact')}
          </Link>
        </motion.div>

        {/* Tez qidiruv — artikul bo'yicha */}
        <motion.form
          onSubmit={submitSearch}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.34 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 26,
            maxWidth: 520, padding: 7, borderRadius: 14,
            background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <span style={{ display: 'flex', color: 'rgba(255,255,255,0.65)', paddingLeft: 12 }}>
            <Icon name="search" size={18} />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('hero.searchPh')}
            aria-label={t('hero.searchPh')}
            style={{
              flex: 1, minWidth: 0, background: 'transparent', border: 'none',
              color: '#fff', fontSize: 15, padding: '10px 4px',
            }}
          />
          <button type="submit" className="btn" style={{ background: '#fff', color: '#0B1F5B', padding: '11px 22px', borderRadius: 9, flexShrink: 0 }}>
            {t('hero.searchBtn')}
          </button>
        </motion.form>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.4 }}
          className="hero-stats"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 'clamp(28px, 6vw, 72px)', marginTop: 72, justifyContent: 'start' }}
        >
          {stats.map((s, i) => (
            <div key={s.key}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, letterSpacing: '-1px', color: '#fff' }}>
                {s.display ?? <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} delay={500 + i * 120} />}
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 4, letterSpacing: '0.3px' }}>{t(`stats.${s.key}`)}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
        style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      >
        <span style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{t('hero.scroll')}</span>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(rgba(255,255,255,0.6), transparent)' }} />
      </motion.div>

      <style>{`@media (max-width: 640px){ .hero-stats { grid-template-columns: repeat(2, auto) !important; row-gap: 28px !important; } }`}</style>
    </section>
  )
}

function ProductSkeleton() {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--card)' }}>
      <div className="skeleton" style={{ aspectRatio: '1 / 1', borderRadius: 0 }} />
      <div style={{ padding: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 10, width: '40%' }} />
        <div className="skeleton" style={{ height: 16, width: '85%' }} />
        <div className="skeleton" style={{ height: 24, width: '50%', marginTop: 6 }} />
      </div>
    </div>
  )
}

export default function Home() {
  const { t } = useLang()
  const progress = useScrollProgress()
  const { data: categories } = useApi(() => getCategories())
  const { data: featured, loading: loadingFeatured } = useApi(() => getProducts({ featured: true, limit: 4 }))

  return (
    <PageWrapper>
      <Seo title={t('seo.home.title')} description={t('seo.home.desc')} canonicalPath="/" />

      {/* Sahifa bo'ylab scroll indikatori */}
      <div className="scroll-progress" style={{ width: `${progress * 100}%` }} />

      <Hero />

      {/* Katalogdagi haqiqiy brendlar tasmasi */}
      <BrandMarquee />

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <Reveal className="section-header">
            <span className="badge"><span className="dot" /> {t('catsec.badge')}</span>
            <h2>{t('catsec.title')}</h2>
            <p>{t('catsec.subtitle')}</p>
          </Reveal>

          <div className="category-grid">
            {(categories ? categories.slice(0, 8) : Array.from({ length: 8 })).map((cat, i) =>
              cat ? (
                <Reveal key={cat.id} delay={(i % 4) * 60}>
                  <CategoryCard category={cat} />
                </Reveal>
              ) : (
                <div key={i} className="skeleton" style={{ minHeight: 160, borderRadius: 'var(--radius-lg)' }} />
              )
            )}
          </div>

          <Reveal style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/catalog" className="btn btn-outline btn-lg">{t('catsec.viewAll')} <Icon name="arrow" size={17} /></Link>
          </Reveal>
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 56 }}>
            <div>
              <span className="badge" style={{ marginBottom: 22 }}><span className="dot" /> {t('featured.badge')}</span>
              <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 52px)', fontWeight: 700, letterSpacing: '-1.4px' }}>{t('featured.title')}</h2>
            </div>
            <Link to="/products" className="btn btn-outline">{t('common.viewAll')} <Icon name="arrow" size={16} /></Link>
          </Reveal>

          <div className="product-grid">
            {loadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : (featured ?? []).map((p, i) => (
                  <Reveal key={p.id} delay={i * 70}><ProductCard product={p} /></Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* ── Как мы работаем ── */}
      <section className="section">
        <div className="container">
          <Reveal className="section-header center">
            <span className="badge"><span className="dot" /> {t('how.badge')}</span>
            <h2>{t('how.title')}</h2>
            <p>{t('how.subtitle')}</p>
          </Reveal>

          <div className="grid-4" style={{ position: 'relative' }}>
            {/* Qadamlarni bog'lovchi chiziq (faqat keng ekranda) */}
            <div className="steps-line" style={{
              position: 'absolute', top: 34, left: '12%', right: '12%', height: 1,
              background: 'linear-gradient(90deg, transparent, var(--border2), var(--border2), transparent)',
              pointerEvents: 'none',
            }} />

            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 90}>
                <div className="step-card" style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{
                    width: 68, height: 68, borderRadius: '50%', margin: '0 auto 20px',
                    background: 'var(--bg)', border: '1px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text)', position: 'relative', zIndex: 1,
                  }}>
                    <Icon name={s.icon} size={26} />
                  </div>
                  <div className="step-card__num" style={{ marginBottom: 10 }}>{String(i + 1).padStart(2, '0')}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 9 }}>{t(`how.${s.t}`)}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--text3)', lineHeight: 1.65, maxWidth: 250, margin: '0 auto' }}>
                    {t(`how.${s.d}`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <style>{`@media (max-width: 1024px){ .steps-line { display: none; } }`}</style>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <Reveal className="section-header center">
            <span className="badge"><span className="dot" /> {t('trust.badge')}</span>
            <h2>{t('trust.title')}</h2>
            <p>{t('trust.subtitle')}</p>
          </Reveal>

          <div className="grid-4">
            {trust.map((item, i) => (
              <Reveal key={item.tKey} delay={i * 70}>
                <div className="card" style={{ height: '100%' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 13, marginBottom: 22,
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)',
                  }}>
                    <Icon name={item.icon} size={24} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 10 }}>{t(`trust.${item.tKey}`)}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.65 }}>{t(`trust.${item.dKey}`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="section-sm" style={{ paddingBottom: 130 }}>
        <div className="container">
          <Reveal>
            <div style={{
              position: 'relative', overflow: 'hidden',
              background: 'var(--accent)', color: 'var(--accent-fg)',
              borderRadius: 'var(--radius-lg)', padding: 'clamp(40px, 6vw, 80px)',
              textAlign: 'center',
            }}>
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              <div style={{ position: 'relative' }}>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700, letterSpacing: '-1.2px', marginBottom: 16 }}>
                  {t('cta.title')}
                </h2>
                <p style={{ fontSize: 17, opacity: 0.7, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
                  {t('cta.subtitle')}
                </p>
                <Link to="/contact" className="btn btn-lg" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
                  {t('cta.button')} <Icon name="arrow" size={17} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  )
}
