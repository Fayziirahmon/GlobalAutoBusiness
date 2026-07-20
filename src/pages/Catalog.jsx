import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import CategoryCard from '../components/CategoryCard'
import Seo from '../components/Seo'
import { useLang } from '../context/LanguageContext'
import { useApi } from '../hooks/useApi'
import { getCategories } from '../api/client'

export default function Catalog() {
  const { t } = useLang()
  const { data: categories } = useApi(() => getCategories())

  return (
    <PageWrapper>
      <Seo title={t('seo.catalog.title')} description={t('seo.catalog.desc')} canonicalPath="/catalog" />

      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 44, borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="container">
          <Reveal>
            <span className="badge"><span className="dot" /> {t('catalogPage.badge')}</span>
            <h1 className="heading-xl" style={{ margin: '18px 0 16px' }}>{t('catalogPage.title')}</h1>
            <p className="body-lg" style={{ maxWidth: 580 }}>{t('catalogPage.subtitle')}</p>
          </Reveal>
        </div>
      </section>

      {/* Category grid */}
      <section className="section-sm">
        <div className="container">
          <div className="category-grid">
            {(categories ?? Array.from({ length: 20 })).map((cat, i) =>
              cat ? (
                <Reveal key={cat.id} delay={(i % 4) * 45}>
                  <CategoryCard category={cat} />
                </Reveal>
              ) : (
                <div key={i} className="skeleton" style={{ minHeight: 160, borderRadius: 'var(--radius-lg)' }} />
              )
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
