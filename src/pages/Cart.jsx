import { Link, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { Icon } from '../components/Icons'
import { useLang } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { catName } from '../data/categories'

export default function Cart() {
  const { t, tl, lang } = useLang()
  const { items, remove, setQty, clear, count } = useCart()
  const navigate = useNavigate()

  /* So'rov matnini tuzib, Aloqa formasiga uzatamiz */
  const sendRequest = () => {
    const lines = items.map(
      (it, i) =>
        `${i + 1}. ${tl(it.name)}${it.sku && it.sku !== '—' ? ` (${t('pd.sku')}: ${it.sku})` : ''} — ${it.qty} ${t('cart.pcs')}`
    )
    const message = `${t('cart.requestIntro')}\n\n${lines.join('\n')}`
    navigate('/contact', { state: { message, subjectIdx: 1 } })
  }

  const qtyBtn = {
    width: 34, height: 38, background: 'var(--bg2)', color: 'var(--text)',
    fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  return (
    <PageWrapper>
      <Seo title={`${t('cart.title')} — GlobalAutoBusiness`} description={t('cart.subtitle')} noindex canonicalPath="/cart" />

      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 40, borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="container">
          <span className="badge"><span className="dot" /> {t('cart.badge')}</span>
          <h1 className="heading-xl" style={{ margin: '18px 0 14px' }}>{t('cart.title')}</h1>
          <p className="body-lg" style={{ maxWidth: 560 }}>{t('cart.subtitle')}</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          {items.length === 0 ? (
            /* ── Bo'sh savat ── */
            <div style={{ textAlign: 'center', padding: '70px 0', color: 'var(--text3)' }}>
              <div style={{ display: 'inline-flex', marginBottom: 18 }}><Icon name="cart" size={44} strokeWidth={1.2} /></div>
              <h2 className="heading-md" style={{ color: 'var(--text)', marginBottom: 10 }}>{t('cart.empty')}</h2>
              <p style={{ marginBottom: 28 }}>{t('cart.emptySub')}</p>
              <Link to="/products" className="btn btn-primary btn-lg">
                {t('nav.products')} <Icon name="arrow" size={17} />
              </Link>
            </div>
          ) : (
            <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
              {/* ── Ro'yxat ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {items.map((it, i) => (
                  <Reveal key={it.id} delay={i * 40}>
                    <div className="card" style={{ display: 'flex', gap: 16, padding: 14, alignItems: 'center' }}>
                      <Link
                        to={`/product/${it.id}`}
                        style={{
                          width: 86, height: 86, flexShrink: 0, borderRadius: 10, overflow: 'hidden',
                          background: '#fff', border: '1px solid var(--border)',
                        }}
                      >
                        <img src={it.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                      </Link>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="caption" style={{ fontSize: 10, marginBottom: 4 }}>
                          {it.brand} · {catName(it.category, lang)}
                        </div>
                        <Link to={`/product/${it.id}`} style={{ display: 'block', fontSize: 14.5, fontWeight: 600, color: 'var(--text)', lineHeight: 1.35 }}>
                          {tl(it.name)}
                        </Link>
                        {it.sku && it.sku !== '—' && (
                          <div style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 4 }}>
                            {t('pd.sku')}: {it.sku}
                          </div>
                        )}
                      </div>

                      {/* Miqdor */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border2)', borderRadius: 9, overflow: 'hidden', flexShrink: 0 }}>
                        <button onClick={() => setQty(it.id, it.qty - 1)} style={qtyBtn} aria-label="−">−</button>
                        <span style={{ width: 38, textAlign: 'center', fontWeight: 600, fontSize: 14 }}>{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} style={qtyBtn} aria-label="+">+</button>
                      </div>

                      <button
                        onClick={() => remove(it.id)}
                        aria-label={t('cart.remove')}
                        title={t('cart.remove')}
                        style={{
                          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                          background: 'transparent', border: '1px solid var(--border)',
                          color: 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s var(--ease)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#e5484d'; e.currentTarget.style.borderColor = '#e5484d' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                      >
                        ✕
                      </button>
                    </div>
                  </Reveal>
                ))}

                <button onClick={clear} className="btn btn-ghost" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                  {t('cart.clear')}
                </button>
              </div>

              {/* ── Xulosa ── */}
              <Reveal delay={80}>
                <div className="card" style={{ padding: 24, position: 'sticky', top: 100 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '-0.4px', marginBottom: 18 }}>
                    {t('cart.summary')}
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, fontSize: 14 }}>
                    <span style={{ color: 'var(--text3)' }}>{t('cart.positions')}</span>
                    <span style={{ fontWeight: 600 }}>{items.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    <span style={{ color: 'var(--text3)' }}>{t('cart.totalQty')}</span>
                    <span style={{ fontWeight: 600 }}>{count} {t('cart.pcs')}</span>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, margin: '16px 0 20px' }}>
                    {t('cart.priceNote')}
                  </p>

                  <button onClick={sendRequest} className="btn btn-primary btn-lg btn-block">
                    {t('cart.send')} <Icon name="arrow" size={17} />
                  </button>

                  <Link to="/products" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
                    {t('cart.continue')}
                  </Link>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      <style>{`@media (max-width: 900px){ .cart-grid { grid-template-columns: 1fr !important; } }`}</style>
    </PageWrapper>
  )
}
