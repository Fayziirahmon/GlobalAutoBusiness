/*
 * ─────────────────────────────────────────────────────────────
 *  CATEGORIES — single source of truth (20 categories, 3 languages)
 *
 *  Used by: the Catalog page, category cards, product cards, and the
 *  product-name localization in the mock catalog. `id` is the slug used
 *  in URLs (/products?category=<id>) and stored on each product.
 * ─────────────────────────────────────────────────────────────
 */

export const categories = [
  { id: 'engines',            icon: 'engine',       name: { ru: 'Двигатели',                 en: 'Engines',                 uz: 'Dvigatellar' } },
  { id: 'fuel-systems',       icon: 'fuel',         name: { ru: 'Топливные системы',         en: 'Fuel systems',            uz: 'Yoqilg‘i tizimlari' } },
  { id: 'filters',            icon: 'filters',      name: { ru: 'Фильтры',                   en: 'Filters',                 uz: 'Filtrlar' } },
  { id: 'exhaust-scr',        icon: 'exhaust',      name: { ru: 'Системы выхлопа и SCR',     en: 'Exhaust & SCR systems',   uz: 'Chiqindi va SCR tizimlari' } },
  { id: 'gearboxes',          icon: 'transmission', name: { ru: 'Коробки передач',           en: 'Gearboxes',               uz: 'Uzatmalar qutilari' } },
  { id: 'clutches',           icon: 'cog',          name: { ru: 'Сцепления',                 en: 'Clutches',                uz: 'Debriajlar' } },
  { id: 'axles-reducers',     icon: 'axle',         name: { ru: 'Мосты и редукторы',         en: 'Axles & reducers',        uz: 'Ko‘priklar va reduktorlar' } },
  { id: 'driveshafts',        icon: 'driveshaft',   name: { ru: 'Карданные передачи',        en: 'Driveshafts',             uz: 'Kardan uzatmalari' } },
  { id: 'chassis-suspension', icon: 'suspension',   name: { ru: 'Ходовые части и подвески',  en: 'Chassis & suspension',    uz: 'Yurish qismi va osma' } },
  { id: 'brakes',             icon: 'brakes',       name: { ru: 'Тормозные системы',         en: 'Brake systems',           uz: 'Tormoz tizimlari' } },
  { id: 'pneumatic',          icon: 'gauge',        name: { ru: 'Пневмосистемы',             en: 'Pneumatic systems',       uz: 'Pnevmo tizimlar' } },
  { id: 'steering',           icon: 'steering',     name: { ru: 'Рулевые управления',        en: 'Steering',                uz: 'Rul boshqaruvi' } },
  { id: 'cabs-bodies',        icon: 'truck',        name: { ru: 'Кабины и кузова',           en: 'Cabs & bodies',           uz: 'Kabinalar va kuzovlar' } },
  { id: 'electrical',         icon: 'electrical',   name: { ru: 'Электрика',                 en: 'Electrical',              uz: 'Elektr qismlari' } },
  { id: 'hydraulics',         icon: 'fuel',         name: { ru: 'Гидравлика самосвалов',     en: 'Dump-truck hydraulics',   uz: 'Samosval gidravlikasi' } },
  { id: 'wheels-tires',       icon: 'wheel',        name: { ru: 'Колёса и шины',             en: 'Wheels & tires',          uz: 'G‘ildiraklar va shinalar' } },
  { id: 'bearings-seals',     icon: 'bearing',      name: { ru: 'Подшипники, сальники и РТИ', en: 'Bearings, seals & rubber', uz: 'Podshipnik, salnik va RTI' } },
  { id: 'fasteners',          icon: 'bolt',         name: { ru: 'Крепёж и метизы',           en: 'Fasteners & hardware',    uz: 'Mahkamlagichlar va metiz' } },
  { id: 'consumables',        icon: 'wrench',       name: { ru: 'Расходники и ТО',           en: 'Consumables & maintenance', uz: 'Sarf materiallar va TX' } },
  { id: 'special-machinery',  icon: 'box',          name: { ru: 'Запчасти для спецтехники',  en: 'Special-machinery parts', uz: 'Maxsus texnika qismlari' } },
]

export const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]))

/** Localized category name by id (falls back to the raw id). */
export function catName(id, lang = 'ru') {
  const c = categoriesById[id]
  return c ? (c.name[lang] ?? c.name.en ?? c.name.ru) : id
}
