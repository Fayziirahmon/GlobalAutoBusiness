import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { vehicleBrands, brandLogo } from '../data/brands'

/*
 * Cheksiz aylanuvchi marka tasmasi.
 * Har bir element: logo (agar public/brands/<slug>.png bo'lsa) + nomi.
 * Logo fayli topilmasa — faqat nom ko'rsatiladi (sayt buzilmaydi).
 */
function BrandItem({ brand, ariaHidden }) {
  const [hasLogo, setHasLogo] = useState(true)

  return (
    <span className="marquee__item" aria-hidden={ariaHidden}>
      {hasLogo && (
        <img
          src={brandLogo(brand.slug)}
          alt=""
          className="marquee__logo"
          loading="lazy"
          onError={() => setHasLogo(false)}
        />
      )}
      <span>{brand.name}</span>
    </span>
  )
}

export default function BrandMarquee() {
  const { t } = useLang()
  if (vehicleBrands.length === 0) return null

  // Uzluksiz aylanish uchun ro'yxat ikki marta chiziladi.
  const track = [...vehicleBrands, ...vehicleBrands]

  return (
    <section style={{ padding: '54px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div className="container" style={{ marginBottom: 28 }}>
        <p className="caption" style={{ textAlign: 'center', fontSize: 11 }}>{t('brands.title')}</p>
      </div>

      <div className="marquee">
        <div className="marquee__track">
          {track.map((brand, i) => (
            <BrandItem
              key={`${brand.slug}-${i}`}
              brand={brand}
              ariaHidden={i >= vehicleBrands.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
