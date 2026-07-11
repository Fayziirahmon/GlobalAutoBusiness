/*
 * ─────────────────────────────────────────────────────────────
 *  LARGE MOCK CATALOG (1000+ products)
 *
 *  Purpose: let you build & test the paginated Products page
 *  (50 cards per page → 20+ pages) WITHOUT waiting for the real
 *  backend to be running or seeded.
 *
 *  When your API (server/server.ts) is live with 1000+ products,
 *  the Products page automatically uses it instead — this file is
 *  only the offline fallback and can be deleted later.
 *
 *  NOTE on images: the original i.ibb.co links from nodescript.js are
 *  only ~5 KB thumbnails, so they render blurry. For a crisp offline
 *  preview we use high-resolution color photos from picsum.photos
 *  (seeded, so each product keeps a stable image). Your real API's
 *  images are used automatically when the backend is running.
 * ─────────────────────────────────────────────────────────────
 */

// Stable, high-quality placeholder image for a given product index.
const imageFor = (n) => `https://picsum.photos/seed/gab${n}/800/800`

// Localized category label — product name/desc are built in all 3 languages
// so the catalog demonstrates the multilingual data path (title as {ru,en,uz}).
const CAT_I18N = {
  engine:       { ru: 'Двигатель',   en: 'Engine Part',  uz: 'Dvigatel qismi' },
  transmission: { ru: 'Трансмиссия', en: 'Transmission', uz: 'Transmissiya qismi' },
  suspension:   { ru: 'Подвеска',    en: 'Suspension',   uz: 'Osma qismi' },
  brakes:       { ru: 'Тормоза',     en: 'Brake Part',   uz: 'Tormoz qismi' },
  electrical:   { ru: 'Электрика',   en: 'Electrical',   uz: 'Elektr qismi' },
  filters:      { ru: 'Фильтр',      en: 'Filter',       uz: 'Filtr' },
}
const SERIES = { ru: 'Серия', en: 'Series', uz: 'Seriya' }

const BRANDS = ['GAB OEM', 'GAB Pro', 'GAB Heavy', 'GAB Select']
const PRICES = [0, 45, 90, 130, 210, 340, 480, 620, 890, 1240] // includes some 0 → "On request"
const CATS = Object.keys(CAT_I18N)

const TOTAL = 1040 // → 21 pages at 50 per page

export const catalogProducts = Array.from({ length: TOTAL }, (_, i) => {
  const n = i + 1
  const category = CATS[i % CATS.length]
  const c = CAT_I18N[category]
  const code = 1000 + n
  return {
    id: `gab-${String(n).padStart(4, '0')}`,
    // Multilingual fields — localized at render time via tl()
    name: {
      ru: `${c.ru} — ${SERIES.ru} ${code}`,
      en: `${c.en} — ${SERIES.en} ${code}`,
      uz: `${c.uz} — ${SERIES.uz} ${code}`,
    },
    desc: {
      ru: `Сертифицированная запчасть («${c.ru}») для грузовиков и тяжёлой техники. Изготовлено по стандартам OEM для надёжной и долгой работы.`,
      en: `Certified ${c.en.toLowerCase()} for heavy trucks and commercial vehicles. Built to OEM tolerances for reliable, long service life.`,
      uz: `Yuk mashinalar va og‘ir texnika uchun sertifikatlangan ${c.uz.toLowerCase()}. Ishonchli va uzoq xizmat uchun OEM standartlarida ishlab chiqarilgan.`,
    },
    price: PRICES[i % PRICES.length],
    image: imageFor(n),
    category,
    brand: BRANDS[i % BRANDS.length],
    sku: `GAB-${category.slice(0, 3).toUpperCase()}-${String(n).padStart(4, '0')}`,
    rating: Math.round((4.3 + ((i % 7) * 0.1)) * 10) / 10,
    reviews: (i * 7) % 240,
    stock: (i * 13) % 500,
    featured: false,
  }
})
