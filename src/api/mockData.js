/*
 * ─────────────────────────────────────────────────────────────
 *  MOCK DATA — curated demo catalog (Home featured + Shop)
 *
 *  Product `name` and `desc` are multilingual { ru, en, uz } objects,
 *  localized at render time via tl(). This mirrors how the real API
 *  should return translatable fields. Category text is resolved by id
 *  through the i18n dictionary (cat.<id>), so categories below only
 *  need id / icon / count.
 * ─────────────────────────────────────────────────────────────
 */

export const categories = [
  { id: 'engine',       icon: 'engine',       count: 482 },
  { id: 'transmission', icon: 'transmission', count: 263 },
  { id: 'suspension',   icon: 'suspension',   count: 311 },
  { id: 'brakes',       icon: 'brakes',       count: 198 },
  { id: 'electrical',   icon: 'electrical',   count: 354 },
  { id: 'filters',      icon: 'filters',      count: 176 },
]

const img = (seed) => `https://picsum.photos/seed/${seed}/800/800`

// Shared localized descriptions by category (keeps demo data fully translated).
const CAT_DESC = {
  engine:       { ru: 'Надёжный компонент двигателя для грузовиков и тяжёлой техники, рассчитанный на высокие нагрузки и длительную работу.', en: 'Reliable engine component for trucks and heavy vehicles, engineered for high loads and long service life.', uz: 'Yuqori yuklama va uzoq muddatli ishga mo‘ljallangan yuk mashinalar uchun ishonchli dvigatel qismi.' },
  transmission: { ru: 'Прочная деталь трансмиссии для стабильной передачи крутящего момента в тяжёлых условиях.', en: 'Durable transmission part for smooth, high-torque power transfer under demanding conditions.', uz: 'Og‘ir sharoitlarda yuqori momentni uzatish uchun mustahkam transmissiya qismi.' },
  suspension:   { ru: 'Компонент подвески, обеспечивающий устойчивость и комфорт на любой дороге.', en: 'Suspension component delivering stability and ride comfort on any road.', uz: 'Har qanday yo‘lda barqarorlik va qulaylik beruvchi osma qismi.' },
  brakes:       { ru: 'Тормозная деталь с высокой теплоотдачей и стабильным тормозным усилием.', en: 'Braking part with strong heat dissipation and consistent stopping power.', uz: 'Yuqori issiqlik tarqatish va barqaror tormozlash kuchiga ega tormoz qismi.' },
  electrical:   { ru: 'Электрический компонент для надёжной работы в тяжёлых коммерческих циклах.', en: 'Electrical component built for reliable operation in demanding commercial duty cycles.', uz: 'Og‘ir tijorat sharoitlarida ishonchli ishlash uchun elektr qismi.' },
  filters:      { ru: 'Высокоэффективный фильтр, защищающий двигатель и топливную систему.', en: 'High-efficiency filter that protects the engine and fuel system.', uz: 'Dvigatel va yoqilg‘i tizimini himoya qiluvchi yuqori samarali filtr.' },
}

const P = [
  { id: 'p-1001', category: 'engine',       price: 1480, brand: 'GAB OEM', rating: 4.9, reviews: 128, stock: 24,  featured: true,  seed: 'turbo',
    name: { ru: 'Турбокомпрессор HX55 (Heavy-Duty)', en: 'Heavy-Duty Turbocharger HX55', uz: 'Turbokompressor HX55 (kuchaytirilgan)' } },
  { id: 'p-1002', category: 'engine',       price: 240,  brand: 'GAB OEM', rating: 4.7, reviews: 86,  stock: 140, featured: false, seed: 'gasket',
    name: { ru: 'Комплект прокладок ГБЦ', en: 'Cylinder Head Gasket Set', uz: 'Silindr kallagi gasket to‘plami' } },
  { id: 'p-1003', category: 'transmission', price: 620,  brand: 'GAB Pro', rating: 4.8, reviews: 64,  stock: 38,  featured: true,  seed: 'clutch',
    name: { ru: 'Комплект сцепления 430мм (нажимной)', en: 'Clutch Kit 430mm Pull-Type', uz: 'Debriaj to‘plami 430mm (tortma)' } },
  { id: 'p-1004', category: 'transmission', price: 95,   brand: 'GAB Pro', rating: 4.6, reviews: 41,  stock: 210, featured: false, seed: 'bearing',
    name: { ru: 'Подшипник КПП (синхромеш)', en: 'Synchromesh Gearbox Bearing', uz: 'Sinxromesh korobka podshipnigi' } },
  { id: 'p-1005', category: 'suspension',   price: 178,  brand: 'GAB OEM', rating: 4.8, reviews: 73,  stock: 96,  featured: true,  seed: 'airspring',
    name: { ru: 'Пневморессора подвески', en: 'Air Suspension Spring Bellow', uz: 'Havo osma prujinasi' } },
  { id: 'p-1006', category: 'suspension',   price: 320,  brand: 'GAB Pro', rating: 4.7, reviews: 58,  stock: 64,  featured: false, seed: 'shock',
    name: { ru: 'Пара передних амортизаторов', en: 'Front Shock Absorber Pair', uz: 'Old amortizatorlar jufti' } },
  { id: 'p-1007', category: 'brakes',       price: 210,  brand: 'GAB OEM', rating: 4.9, reviews: 112, stock: 120, featured: true,  seed: 'brakedisc',
    name: { ru: 'Тормозной диск вентилируемый 430мм', en: 'Brake Disc Ventilated 430mm', uz: 'Ventilyatsiyali tormoz diski 430mm' } },
  { id: 'p-1008', category: 'brakes',       price: 130,  brand: 'GAB Pro', rating: 4.6, reviews: 90,  stock: 300, featured: false, seed: 'brakepad',
    name: { ru: 'Комплект тормозных колодок (грузовой)', en: 'Heavy Truck Brake Pad Set', uz: 'Yuk mashina tormoz kolodkalari to‘plami' } },
  { id: 'p-1009', category: 'electrical',   price: 410,  brand: 'GAB OEM', rating: 4.8, reviews: 77,  stock: 52,  featured: true,  seed: 'alternator',
    name: { ru: 'Генератор 24В (Heavy-Duty)', en: '24V Heavy-Duty Alternator', uz: '24V kuchaytirilgan generator' } },
  { id: 'p-1010', category: 'electrical',   price: 365,  brand: 'GAB Pro', rating: 4.7, reviews: 49,  stock: 70,  featured: false, seed: 'starter',
    name: { ru: 'Стартер 6.5кВт', en: 'Starter Motor 6.5kW', uz: 'Starter 6.5kVt' } },
  { id: 'p-1011', category: 'filters',      price: 28,   brand: 'GAB OEM', rating: 4.9, reviews: 204, stock: 540, featured: true,  seed: 'oilfilter',
    name: { ru: 'Масляный фильтр LF9009', en: 'Spin-On Oil Filter LF9009', uz: 'Moy filtri LF9009' } },
  { id: 'p-1012', category: 'filters',      price: 46,   brand: 'GAB Pro', rating: 4.8, reviews: 156, stock: 420, featured: false, seed: 'fuelfilter',
    name: { ru: 'Фильтр-сепаратор топливо/вода', en: 'Fuel/Water Separator Filter', uz: 'Yoqilg‘i/suv separator filtri' } },
]

export const products = P.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  sku: `GAB-${p.category.slice(0, 3).toUpperCase()}-${p.id.slice(-4)}`,
  rating: p.rating,
  reviews: p.reviews,
  brand: p.brand,
  stock: p.stock,
  featured: p.featured,
  image: img(p.seed),
  desc: CAT_DESC[p.category],
}))
