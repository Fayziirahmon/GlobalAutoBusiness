import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/Icons'
import { useApi } from '../hooks/useApi'
import { getProduct } from '../api/client'
import { useLang } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { catName } from '../data/categories'
import Seo from '../components/Seo'
import { SITE_URL, SITE_NAME } from '../seo/seo.config'

function Loading() {
  return (
    <div className="container" style={{ paddingTop: 140, paddingBottom: 120 }}>
      <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
        <div className="skeleton" style={{ aspectRatio: '4 / 3', borderRadius: 'var(--radius-lg)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="skeleton" style={{ height: 14, width: '30%' }} />
          <div className="skeleton" style={{ height: 40, width: '85%' }} />
          <div className="skeleton" style={{ height: 14, width: '60%' }} />
          <div className="skeleton" style={{ height: 90, width: '100%', marginTop: 12 }} />
          <div className="skeleton" style={{ height: 52, width: '100%', marginTop: 12 }} />
        </div>
      </div>
    </div>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const { t, tl, lang } = useLang()
  const { data: product, loading, error } = useApi(() => getProduct(id), [id])
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)
  const { add } = useCart()

  const addToCart = () => {
    add(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <PageWrapper><Loading /></PageWrapper>

  if (error || !product) {
    return (
      <PageWrapper>
        <Seo title={`${t('pd.notFound')} — ${SITE_NAME}`} noindex />
        <div className="container" style={{ paddingTop: 180, paddingBottom: 160, textAlign: 'center' }}>
          <h1 className="heading-lg" style={{ marginBottom: 14 }}>{t('pd.notFound')}</h1>
          <p className="body-md" style={{ marginBottom: 28 }}>{t('pd.notFoundSub')}</p>
          <Link to="/products" className="btn btn-primary">{t('pd.back')} <Icon name="arrow" size={16} /></Link>
        </div>
      </PageWrapper>
    )
  }

  const inStock = product.stock > 0
  const title = tl(product.name)
  const descText = tl(product.desc)
  const catLabel = catName(product.category, lang)
  const imgs = product.images?.length ? product.images : [product.image].filter(Boolean)

  // Meta description: artikul + kross-nomerlar — aynan shular bo'yicha qidiriladi
  const hasSku = product.sku && product.sku !== '—'
  const skuSuffix = hasSku && !title.toLowerCase().includes(product.sku.toLowerCase()) ? ` ${product.sku}` : ''
  const crossLine = product.cross?.length ? ` Кросс-номера: ${product.cross.join(', ')}.` : ''
  const seoDesc = `${title}${hasSku ? `, артикул ${product.sku}` : ''}. ${product.brand}.${crossLine} В наличии, доставка по СНГ. ${descText}`.slice(0, 300)

  // Breadcrumb JSON-LD — Google qidiruvda yo'lakchani ko'rsatadi
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('pd.home'), item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: t('nav.products'), item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: catLabel, item: `${SITE_URL}/catalog/${product.category}` },
      { '@type': 'ListItem', position: 4, name: title, item: `${SITE_URL}/product/${product.id}` },
    ],
  }

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    image: product.image,
    description: descText,
    sku: product.sku,
    category: catLabel,
    brand: { '@type': 'Brand', name: product.brand },
    ...(product.reviews > 0 && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews },
    }),
    ...(product.price > 0 && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.price,
        availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${SITE_URL}/product/${product.id}`,
      },
    }),
  }
  const specs = [
    { k: t('pd.sku'), v: product.sku },
    { k: t('pd.brand'), v: product.brand },
    { k: t('pd.category'), v: catLabel },
    ...(product.cross?.length ? [{ k: t('pd.cross'), v: product.cross.join(', ') }] : []),
    { k: t('pd.availability'), v: inStock ? t('pd.inStockN', { n: product.stock }) : t('pd.outOfStock') },
  ]

  return (
    <PageWrapper>
      <Seo
        title={`${title}${skuSuffix} купить — ${SITE_NAME}`.replace(/\s+/g, ' ')}
        description={seoDesc}
        type="product"
        image={product.image}
        canonicalPath={`/product/${product.id}`}
        jsonLd={[productLd, breadcrumbLd]}
      />
      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: 110, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text3)' }}>
          <Link to="/" style={{ color: 'var(--text3)' }}>{t('pd.home')}</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'var(--text3)' }}>{t('nav.products')}</Link>
          <span>/</span>
          <Link to={`/catalog/${product.category}`} style={{ color: 'var(--text3)' }}>{catLabel}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>{title}</span>
        </div>
      </div>

      {/* Main */}
      <section style={{ paddingTop: 28, paddingBottom: 110 }}>
        <div className="container">
          <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
            {/* Gallery */}
            <Reveal style={{ position: 'sticky', top: 100 }}>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', background: '#fff', aspectRatio: '1 / 1' }}>
                <img src={imgs[activeImg] ?? product.image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              {imgs.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(imgs.length, 5)}, 1fr)`, gap: 10, marginTop: 12 }}>
                  {imgs.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setActiveImg(i)}
                      aria-label={`${title} — ${i + 1}`}
                      style={{
                        aspectRatio: '1', borderRadius: 10, overflow: 'hidden', padding: 0,
                        border: `1.5px solid ${i === activeImg ? 'var(--text)' : 'var(--border)'}`,
                        background: '#fff', cursor: 'pointer', transition: 'border-color 0.2s var(--ease)',
                      }}
                    >
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: i === activeImg ? 1 : 0.6 }} />
                    </button>
                  ))}
                </div>
              )}
            </Reveal>

            {/* Info */}
            <Reveal delay={80}>
              <span className="badge"><span className="dot" /> {catLabel}</span>

              <h1 style={{ fontSize: 'clamp(28px, 3.6vw, 42px)', fontWeight: 700, letterSpacing: '-1.2px', margin: '20px 0 14px', lineHeight: 1.1 }}>
                {title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>
                  <Icon name="star" size={16} /> {product.rating}
                  <span style={{ color: 'var(--text3)', fontWeight: 400 }}>({product.reviews} {t('pd.reviews')})</span>
                </span>
                <span style={{ width: 1, height: 16, background: 'var(--border2)' }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: inStock ? 'var(--text)' : 'var(--text3)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: inStock ? 'var(--text)' : 'var(--text3)' }} />
                  {inStock ? t('pd.inStock') : t('pd.outOfStock')}
                </span>
              </div>

              <p className="body-md" style={{ marginBottom: 28 }}>{tl(product.desc)}</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 28 }}>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 40, fontWeight: 700, letterSpacing: '-1.5px' }}>
                  {product.price > 0 ? `$${product.price.toLocaleString()}` : t('common.onRequest')}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text3)' }}>{t('pd.exclTax')}</span>
              </div>

              {/* Quantity + actions */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border2)', borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}>−</button>
                  <span style={{ width: 44, textAlign: 'center', fontWeight: 600, fontSize: 15 }}>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} style={qtyBtn}>+</button>
                </div>
                <button
                  onClick={addToCart}
                  className="btn btn-primary"
                  disabled={!inStock}
                  style={{ flex: 1, minWidth: 200, opacity: inStock ? 1 : 0.5, cursor: inStock ? 'pointer' : 'not-allowed' }}
                >
                  {added
                    ? <><Icon name="check" size={17} /> {t('cart.added')}</>
                    : <><Icon name="cart" size={17} /> {t('pd.addToOrder')}</>}
                </button>
              </div>
              <Link to="/contact" className="btn btn-outline btn-block">{t('pd.bulkQuote')}</Link>

              {/* Specs */}
              <div style={{ marginTop: 36, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {specs.map((s, i) => (
                  <div key={s.k} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '15px 22px',
                    borderTop: i ? '1px solid var(--border)' : 'none', fontSize: 14,
                  }}>
                    <span style={{ color: 'var(--text3)' }}>{s.k}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>{s.v}</span>
                  </div>
                ))}
              </div>

              {/* Mini guarantees */}
              <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
                {[{ i: 'truck', k: 'g1' }, { i: 'shield', k: 'g2' }, { i: 'support', k: 'g3' }].map((g) => (
                  <div key={g.k} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--text2)' }}>
                    <Icon name={g.i} size={18} /> {t(`pd.${g.k}`)}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Related */}
      {product.related?.length > 0 && (
        <section className="section-sm" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
          <div className="container">
            <Reveal className="section-header" style={{ marginBottom: 44 }}>
              <span className="badge"><span className="dot" /> {t('pd.relBadge')}</span>
              <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 40px)' }}>{t('pd.relTitle')}</h2>
            </Reveal>
            <div className="product-grid">
              {product.related.map((p, i) => (
                <Reveal key={p.id} delay={i * 70}><ProductCard product={p} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`@media (max-width: 880px){ .detail-grid { grid-template-columns: 1fr !important; gap: 32px !important; } .detail-grid > div:first-child { position: static !important; } }`}</style>
    </PageWrapper>
  )
}

const qtyBtn = {
  width: 44, height: 48, background: 'var(--bg2)', color: 'var(--text)',
  fontSize: 20, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
}
