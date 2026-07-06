import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/Icons'
import { useApi } from '../hooks/useApi'
import { getCategories, getProducts } from '../api/client'

const ease = [0.22, 1, 0.36, 1]

const stats = [
  { value: '12K+', label: 'Parts in stock' },
  { value: '60+', label: 'Countries served' },
  { value: '24/7', label: 'Expert support' },
  { value: '99.4%', label: 'On-time dispatch' },
]

const trust = [
  { icon: 'truck',  title: 'Fast Delivery',   desc: 'Express global shipping with real-time tracking on every order, large or small.' },
  { icon: 'shield', title: 'Genuine Parts',   desc: 'OEM-grade and certified components, quality-checked and warranty-backed.' },
  { icon: 'globe',  title: 'Global Supply',   desc: 'A worldwide sourcing network keeps even rare heavy-vehicle parts available.' },
  { icon: 'support', title: 'Support 24/7',   desc: 'Talk to parts specialists any hour to find the exact fit for your fleet.' },
]

/* ── Hero with reserved background-video container ── */
function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Fallback dark background (shown if no video) */}
      <div style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 0 }} />

      {/*
        BACKGROUND VIDEO PLACEHOLDER
        Drop a file at /public/hero.mp4 (and optional /public/hero-poster.jpg).
        Autoplays muted + looped; falls back to the dark background above.
      */}
      <video
        className="hero-video"
        autoPlay muted loop playsInline preload="auto"
        poster="/hero-poster.jpg"
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
            <span className="dot" style={{ background: '#fff' }} /> Premium Heavy-Vehicle Parts
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
          Premium Truck &amp; Heavy Vehicle Spare Parts — engineered, certified, and shipped worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.28 }}
          style={{ display: 'flex', gap: 14, marginTop: 40, flexWrap: 'wrap' }}
        >
          <Link to="/shop" className="btn btn-lg" style={{ background: '#fff', color: '#000' }}>
            Browse Parts <Icon name="arrow" size={17} />
          </Link>
          <Link to="/contact" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(6px)' }}>
            Contact Us
          </Link>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.4 }}
          className="hero-stats"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 'clamp(28px, 6vw, 72px)', marginTop: 72, justifyContent: 'start' }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, letterSpacing: '-1px', color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 4, letterSpacing: '0.3px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
        style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      >
        <span style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Scroll</span>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(rgba(255,255,255,0.6), transparent)' }} />
      </motion.div>

      <style>{`@media (max-width: 640px){ .hero-stats { grid-template-columns: repeat(2, auto) !important; row-gap: 28px !important; } }`}</style>
    </section>
  )
}

function ProductSkeleton() {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--card)' }}>
      <div className="skeleton" style={{ aspectRatio: '4 / 3', borderRadius: 0 }} />
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
        <div className="skeleton" style={{ height: 16, width: '85%' }} />
        <div className="skeleton" style={{ height: 24, width: '50%', marginTop: 6 }} />
      </div>
    </div>
  )
}

export default function Home() {
  const { data: categories } = useApi(() => getCategories())
  const { data: featured, loading: loadingFeatured } = useApi(() => getProducts({ featured: true, limit: 4 }))

  return (
    <PageWrapper>
      <Hero />

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <Reveal className="section-header">
            <span className="badge"><span className="dot" /> Shop by category</span>
            <h2>Every system, one catalog.</h2>
            <p>From engine internals to electrical and filtration — find precision parts for trucks and heavy vehicles, organized the way mechanics think.</p>
          </Reveal>

          <div className="grid-3">
            {(categories ?? Array.from({ length: 6 })).map((cat, i) =>
              cat ? (
                <Reveal key={cat.id} delay={i * 70}>
                  <CategoryCard category={cat} />
                </Reveal>
              ) : (
                <div key={i} className="skeleton" style={{ minHeight: 200, borderRadius: 'var(--radius-lg)' }} />
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 56 }}>
            <div>
              <span className="badge" style={{ marginBottom: 22 }}><span className="dot" /> Featured</span>
              <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 52px)', fontWeight: 700, letterSpacing: '-1.4px' }}>Best-selling parts</h2>
            </div>
            <Link to="/shop" className="btn btn-outline">View all <Icon name="arrow" size={16} /></Link>
          </Reveal>

          <div className="grid-4">
            {loadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : (featured ?? []).map((p, i) => (
                  <Reveal key={p.id} delay={i * 70}><ProductCard product={p} /></Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="section">
        <div className="container">
          <Reveal className="section-header center">
            <span className="badge"><span className="dot" /> Why choose us</span>
            <h2>Built for professionals.</h2>
            <p>Companies and mechanics worldwide rely on GlobalAutoBusiness for parts that arrive fast and fit right the first time.</p>
          </Reveal>

          <div className="grid-4">
            {trust.map((t, i) => (
              <Reveal key={t.title} delay={i * 70}>
                <div className="card" style={{ height: '100%' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 13, marginBottom: 22,
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)',
                  }}>
                    <Icon name={t.icon} size={24} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 10 }}>{t.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.65 }}>{t.desc}</p>
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
                  Can&apos;t find the part you need?
                </h2>
                <p style={{ fontSize: 17, opacity: 0.7, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
                  Send us the make, model and part number — our specialists will source it from our global network.
                </p>
                <Link to="/contact" className="btn btn-lg" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
                  Request a Part <Icon name="arrow" size={17} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  )
}
