import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/Icons'
import { useApi } from '../hooks/useApi'
import { getProduct } from '../api/client'

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
  const { data: product, loading, error } = useApi(() => getProduct(id), [id])
  const [qty, setQty] = useState(1)

  if (loading) return <PageWrapper><Loading /></PageWrapper>

  if (error || !product) {
    return (
      <PageWrapper>
        <div className="container" style={{ paddingTop: 180, paddingBottom: 160, textAlign: 'center' }}>
          <h1 className="heading-lg" style={{ marginBottom: 14 }}>Part not found</h1>
          <p className="body-md" style={{ marginBottom: 28 }}>The part you&apos;re looking for may have been moved or is out of catalog.</p>
          <Link to="/shop" className="btn btn-primary">Back to Shop <Icon name="arrow" size={16} /></Link>
        </div>
      </PageWrapper>
    )
  }

  const inStock = product.stock > 0
  const specs = [
    { k: 'SKU', v: product.sku },
    { k: 'Brand', v: product.brand },
    { k: 'Category', v: product.category },
    { k: 'Availability', v: inStock ? `${product.stock} in stock` : 'Out of stock' },
  ]

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: 110, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text3)' }}>
          <Link to="/" style={{ color: 'var(--text3)' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'var(--text3)' }}>Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} style={{ color: 'var(--text3)', textTransform: 'capitalize' }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </div>
      </div>

      {/* Main */}
      <section style={{ paddingTop: 28, paddingBottom: 110 }}>
        <div className="container">
          <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
            {/* Gallery */}
            <Reveal style={{ position: 'sticky', top: 100 }}>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg3)', aspectRatio: '4 / 3' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{
                    aspectRatio: '1', borderRadius: 12, overflow: 'hidden',
                    border: `1px solid ${i === 0 ? 'var(--text)' : 'var(--border)'}`, background: 'var(--bg3)', cursor: 'pointer',
                  }}>
                    <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: i === 0 ? 1 : 0.55 }} />
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Info */}
            <Reveal delay={80}>
              <span className="badge" style={{ textTransform: 'capitalize' }}><span className="dot" /> {product.category}</span>

              <h1 style={{ fontSize: 'clamp(28px, 3.6vw, 42px)', fontWeight: 700, letterSpacing: '-1.2px', margin: '20px 0 14px', lineHeight: 1.1 }}>
                {product.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>
                  <Icon name="star" size={16} /> {product.rating}
                  <span style={{ color: 'var(--text3)', fontWeight: 400 }}>({product.reviews} reviews)</span>
                </span>
                <span style={{ width: 1, height: 16, background: 'var(--border2)' }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: inStock ? 'var(--text)' : 'var(--text3)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: inStock ? 'var(--text)' : 'var(--text3)' }} />
                  {inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>

              <p className="body-md" style={{ marginBottom: 28 }}>{product.desc}</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 28 }}>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 40, fontWeight: 700, letterSpacing: '-1.5px' }}>
                  ${product.price.toLocaleString()}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text3)' }}>excl. tax &amp; shipping</span>
              </div>

              {/* Quantity + actions */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border2)', borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}>−</button>
                  <span style={{ width: 44, textAlign: 'center', fontWeight: 600, fontSize: 15 }}>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} style={qtyBtn}>+</button>
                </div>
                <button className="btn btn-primary" disabled={!inStock} style={{ flex: 1, minWidth: 200, opacity: inStock ? 1 : 0.5, cursor: inStock ? 'pointer' : 'not-allowed' }}>
                  <Icon name="cart" size={17} /> Add to Order
                </button>
              </div>
              <Link to="/contact" className="btn btn-outline btn-block">Request a Bulk Quote</Link>

              {/* Specs */}
              <div style={{ marginTop: 36, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {specs.map((s, i) => (
                  <div key={s.k} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '15px 22px',
                    borderTop: i ? '1px solid var(--border)' : 'none', fontSize: 14,
                  }}>
                    <span style={{ color: 'var(--text3)' }}>{s.k}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600, textTransform: s.k === 'Category' ? 'capitalize' : 'none' }}>{s.v}</span>
                  </div>
                ))}
              </div>

              {/* Mini guarantees */}
              <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
                {[{ i: 'truck', t: 'Fast global shipping' }, { i: 'shield', t: 'Genuine, warranty-backed' }, { i: 'support', t: '24/7 part support' }].map((g) => (
                  <div key={g.t} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--text2)' }}>
                    <Icon name={g.i} size={18} /> {g.t}
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
              <span className="badge"><span className="dot" /> Related parts</span>
              <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 40px)' }}>You may also need</h2>
            </Reveal>
            <div className="grid-3">
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
