import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/Icons'
import { useApi } from '../hooks/useApi'
import { fetchProductsPage } from '../api/client'
import { useLang } from '../context/LanguageContext'
import { catName } from '../data/categories'
import Seo from '../components/Seo'

const PER_PAGE = 50 // har sahifada 50 ta card

const SORTS = [
  { id: 'featured', key: 'featured' },
  { id: 'price-asc', key: 'priceAsc' },
  { id: 'price-desc', key: 'priceDesc' },
  { id: 'rating', key: 'rating' },
]

function ProductSkeleton() {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--card)' }}>
      <div className="skeleton" style={{ aspectRatio: '1 / 1', borderRadius: 0 }} />
      <div style={{ padding: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 10, width: '40%' }} />
        <div className="skeleton" style={{ height: 13, width: '85%' }} />
        <div className="skeleton" style={{ height: 20, width: '50%', marginTop: 4 }} />
      </div>
    </div>
  )
}

/* Build a windowed list of page tokens: 1 … 4 [5] 6 … 12 */
function pageWindow(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

function Pagination({ current, total, onGo }) {
  if (total <= 1) return null
  const tokens = pageWindow(current, total)
  const btn = (active) => ({
    minWidth: 42, height: 42, padding: '0 12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: active ? 'var(--accent)' : 'var(--bg2)',
    color: active ? 'var(--accent-fg)' : 'var(--text2)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}`,
    transition: 'all 0.2s var(--ease)',
  })
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginTop: 56 }}>
      <button onClick={() => onGo(current - 1)} disabled={current <= 1}
        style={{ ...btn(false), opacity: current <= 1 ? 0.4 : 1, cursor: current <= 1 ? 'not-allowed' : 'pointer' }}>
        <Icon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
      </button>

      {tokens.map((t, i) =>
        t === '…' ? (
          <span key={`e${i}`} style={{ color: 'var(--text3)', padding: '0 4px' }}>…</span>
        ) : (
          <button key={t} onClick={() => onGo(t)} style={btn(t === current)}>{t}</button>
        )
      )}

      <button onClick={() => onGo(current + 1)} disabled={current >= total}
        style={{ ...btn(false), opacity: current >= total ? 0.4 : 1, cursor: current >= total ? 'not-allowed' : 'pointer' }}>
        <Icon name="arrow" size={16} />
      </button>
    </nav>
  )
}

export default function Products() {
  const { t, lang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, parseInt(searchParams.get('page')) || 1)
  const category = searchParams.get('category') || ''

  // Bosh sahifadagi tez qidiruv /products?q=... ga yuboradi
  const [query, setQuery] = useState(() => searchParams.get('q') || '')
  const [sort, setSort] = useState('featured')

  const { data, loading, error } = useApi(
    ({ signal }) => fetchProductsPage({ page, limit: PER_PAGE, category, q: query, sort }, { signal }),
    [page, category, query, sort]
  )

  // Filtering/sorting should return to page 1.
  const resetPage = () => {
    if (searchParams.has('page')) {
      const next = new URLSearchParams(searchParams)
      next.delete('page')
      setSearchParams(next, { replace: true })
    }
  }

  const goTo = (p) => {
    const next = new URLSearchParams(searchParams)
    if (p <= 1) next.delete('page')
    else next.set('page', String(p))
    setSearchParams(next) // ScrollToTop (App.jsx) scrolls up on search change
  }

  const totalPages = data?.totalPages ?? 1
  const total = data?.totalProducts ?? 0
  const products = data?.products ?? []

  const rangeLabel = useMemo(() => {
    if (!total) return ''
    const start = (page - 1) * PER_PAGE + 1
    const end = Math.min(page * PER_PAGE, total)
    return t('products.range', { a: start, b: end, total })
  }, [page, total, t])

  const heading = category ? catName(category, lang) : t('products.title')

  return (
    <PageWrapper>
      <Seo
        title={category ? `${heading} — GlobalAutoBusiness` : t('seo.products.title')}
        description={t('seo.products.desc')}
        canonicalPath={category ? `/products?category=${category}` : (page > 1 ? `/products?page=${page}` : '/products')}
      />
      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 44, borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="container">
          <span className="badge"><span className="dot" /> {t('products.badge')}</span>
          <h1 className="heading-xl" style={{ margin: '18px 0 16px' }}>{heading}</h1>
          {category ? (
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>
              <Icon name="arrow" size={15} style={{ transform: 'rotate(180deg)' }} /> {t('products.allProducts')}
            </Link>
          ) : (
            <p className="body-lg" style={{ maxWidth: 560 }}>{t('products.subtitle')}</p>
          )}
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          {/* Search + sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 22 }}>
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 420 }}>
              <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', display: 'flex' }}>
                <Icon name="search" size={17} />
              </span>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); resetPage() }}
                placeholder={t('shop.search')}
                style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, fontSize: 14, color: 'var(--text)' }}
              />
              {query && (
                <button onClick={() => { setQuery(''); resetPage() }} aria-label="Clear"
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: 8, background: 'transparent', color: 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
              <span className="caption" style={{ fontSize: 11 }}>{t('shop.sort')}</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); resetPage() }}
                style={{ padding: '11px 14px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, fontSize: 14, color: 'var(--text)', cursor: 'pointer' }}
              >
                {SORTS.map((s) => <option key={s.id} value={s.id}>{t(`sorts.${s.key}`)}</option>)}
              </select>
            </div>
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            <p style={{ color: 'var(--text3)', fontSize: 13.5 }}>
              {loading ? t('common.loading') : rangeLabel}
            </p>
            {totalPages > 1 && (
              <p style={{ color: 'var(--text3)', fontSize: 13.5 }}>{t('products.pageOf', { p: page, t: totalPages })}</p>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
              <h3 className="heading-md" style={{ color: 'var(--text)', marginBottom: 8 }}>{t('products.error')}</h3>
              <p>{t('products.errorSub')}</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
              <div style={{ display: 'inline-flex', marginBottom: 16 }}><Icon name="box" size={40} strokeWidth={1.2} /></div>
              <h3 className="heading-md" style={{ color: 'var(--text)', marginBottom: 8 }}>{t('products.empty')}</h3>
              <p>{t('products.emptySub')}</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 4) * 55}><ProductCard product={p} /></Reveal>
                ))}
              </div>
              <Pagination current={page} total={totalPages} onGo={goTo} />
            </>
          )}
        </div>
      </section>
    </PageWrapper>
  )
}
