import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/Icons'
import { useApi } from '../hooks/useApi'
import { fetchProductsPage } from '../api/client'
import { useLang } from '../context/LanguageContext'

const PER_PAGE = 50 // har sahifada 50 ta card

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
  const { t } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, parseInt(searchParams.get('page')) || 1)

  const { data, loading, error } = useApi(
    ({ signal }) => fetchProductsPage({ page, limit: PER_PAGE }, { signal }),
    [page]
  )

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

  return (
    <PageWrapper>
      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 44, borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="container">
          <span className="badge"><span className="dot" /> {t('products.badge')}</span>
          <h1 className="heading-xl" style={{ margin: '18px 0 16px' }}>{t('products.title')}</h1>
          <p className="body-lg" style={{ maxWidth: 560 }}>
            {t('products.subtitle')}
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
            <p style={{ color: 'var(--text3)', fontSize: 13.5 }}>
              {loading ? t('common.loading') : rangeLabel}
            </p>
            {totalPages > 1 && (
              <p style={{ color: 'var(--text3)', fontSize: 13.5 }}>{t('products.pageOf', { p: page, t: totalPages })}</p>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid-4">
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
              <div className="grid-4">
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
