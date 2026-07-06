import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/Icons'
import { useApi } from '../hooks/useApi'
import { getCategories, getProducts } from '../api/client'

const sorts = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
]

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

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')

  const { data: categories } = useApi(() => getCategories())
  const { data: products, loading } = useApi(
    () => getProducts({ category: activeCategory, q: query }),
    [activeCategory, query]
  )

  const setCategory = (id) => {
    const next = new URLSearchParams(searchParams)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setSearchParams(next, { replace: true })
  }

  const sorted = useMemo(() => {
    const list = [...(products ?? [])]
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price)
      case 'price-desc': return list.sort((a, b) => b.price - a.price)
      case 'rating': return list.sort((a, b) => b.rating - a.rating)
      default: return list.sort((a, b) => Number(b.featured) - Number(a.featured))
    }
  }, [products, sort])

  const chips = [{ id: 'all', name: 'All Parts' }, ...(categories ?? [])]
  const activeName = chips.find((c) => c.id === activeCategory)?.name ?? 'All Parts'

  return (
    <PageWrapper>
      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 40, borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="container">
          <span className="caption">Catalog</span>
          <h1 className="heading-xl" style={{ margin: '14px 0 16px' }}>{activeName}</h1>
          <p className="body-lg" style={{ maxWidth: 560 }}>
            Browse certified spare parts for trucks and heavy vehicles. Use the filters to narrow by system, search, or sort.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 380 }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', display: 'flex' }}>
                <Icon name="search" size={17} />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, SKU or brand…"
                style={{
                  width: '100%', padding: '13px 16px 13px 44px',
                  background: 'var(--bg2)', border: '1px solid var(--border2)',
                  borderRadius: 10, fontSize: 14, color: 'var(--text)',
                }}
              />
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="caption" style={{ fontSize: 11 }}>Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  padding: '12px 16px', background: 'var(--bg2)',
                  border: '1px solid var(--border2)', borderRadius: 10,
                  fontSize: 14, color: 'var(--text)', cursor: 'pointer',
                }}
              >
                {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Category chips */}
          <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginBottom: 40 }}>
            {chips.map((c) => {
              const active = c.id === activeCategory
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  style={{
                    flexShrink: 0, padding: '9px 18px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                    background: active ? 'var(--accent)' : 'var(--bg2)',
                    color: active ? 'var(--accent-fg)' : 'var(--text2)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}`,
                    transition: 'all 0.2s var(--ease)',
                  }}
                >
                  {c.name}
                </button>
              )
            })}
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
              <div style={{ display: 'inline-flex', marginBottom: 16, color: 'var(--text3)' }}><Icon name="search" size={40} strokeWidth={1.2} /></div>
              <h3 className="heading-md" style={{ color: 'var(--text)', marginBottom: 8 }}>No parts found</h3>
              <p>Try a different search term or category.</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text3)', fontSize: 13.5, marginBottom: 20 }}>{sorted.length} parts</p>
              <div className="grid-4">
                {sorted.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 4) * 60}><ProductCard product={p} /></Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageWrapper>
  )
}
