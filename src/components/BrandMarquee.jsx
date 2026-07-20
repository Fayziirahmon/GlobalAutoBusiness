import { products } from '../data/products'
import { useLang } from '../context/LanguageContext'

/*
 * Cheksiz aylanuvchi brend tasmasi.
 * Brendlar ro'yxati KATALOGDAN avtomatik olinadi — ya'ni saytda
 * haqiqatan bor tovarlarning brendlari ko'rsatiladi (qo'lda yozilmagan).
 */
const BRANDS = [...new Set(products.map((p) => p.brand))]
  .filter((b) => b && b !== 'GAB') // ichki/generik nom ko'rsatilmaydi
  .sort((a, b) => a.localeCompare(b))

export default function BrandMarquee() {
  const { t } = useLang()
  if (BRANDS.length === 0) return null

  // Uzluksiz aylanish uchun ro'yxat ikki marta chiziladi.
  const track = [...BRANDS, ...BRANDS]

  return (
    <section style={{ padding: '54px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div className="container" style={{ marginBottom: 26 }}>
        <p className="caption" style={{ textAlign: 'center', fontSize: 11 }}>{t('brands.title')}</p>
      </div>

      <div className="marquee">
        <div className="marquee__track">
          {track.map((brand, i) => (
            <span key={`${brand}-${i}`} className="marquee__item" aria-hidden={i >= BRANDS.length}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
