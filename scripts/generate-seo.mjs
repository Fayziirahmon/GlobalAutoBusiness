/*
 * ─────────────────────────────────────────────────────────────
 *  SEO GENERATOR — `vite build` dan keyin ishlaydi
 *
 *  1) sitemap.xml — barcha sahifalar (bosh, katalog, 20 kategoriya,
 *     36 mahsulot, aloqa) hreflang bilan
 *  2) PRERENDER — har bir yo'l uchun tayyor HTML fayl, ichida to'g'ri
 *     <title>, description, canonical, Open Graph va JSON-LD.
 *
 *  Nega kerak: sayt — React SPA. Google JS'ni bir amallab o'qiydi,
 *  lekin YANDEX yomon o'qiydi. MDH bozorida bu hal qiluvchi.
 *  Prerender qilingach, qidiruv roboti sahifani JS'siz ham to'liq
 *  meta bilan ko'radi.
 * ─────────────────────────────────────────────────────────────
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { products } from '../src/data/products.js'
import { categories, catName } from '../src/data/categories.js'
import { SITE_URL, SITE_NAME, OG_IMAGE, ORG } from '../src/seo/seo.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, '..', 'dist')
const LANGS = ['ru', 'en', 'uz']

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const ru = (field) => (typeof field === 'string' ? field : field?.ru ?? field?.en ?? '')

/* ── 1. Sahifalar ro'yxati ────────────────────────────────── */

function buildRoutes() {
  const routes = [
    {
      path: '/',
      priority: '1.0',
      changefreq: 'weekly',
      title: 'GlobalAutoBusiness — Запчасти для грузовиков и спецтехники',
      description:
        'Оригинальные запчасти и фильтры для грузовиков, экскаваторов и спецтехники: Perkins, CAT, Komatsu, Doosan, Hyundai, ZF, Hengst, Donaldson. В наличии, доставка по СНГ, поддержка 24/7.',
    },
    {
      path: '/catalog',
      priority: '0.9',
      changefreq: 'weekly',
      title: 'Каталог запчастей и фильтров — GlobalAutoBusiness',
      description:
        'Каталог по категориям: двигатели, топливные системы, фильтры, гидравлика самосвалов, тормозные системы, электрика и запчасти для спецтехники.',
    },
    {
      path: '/products',
      priority: '0.9',
      changefreq: 'daily',
      title: 'Все товары — каталог запчастей | GlobalAutoBusiness',
      description:
        `${products.length} позиций в наличии: масляные, топливные и гидравлические фильтры для грузовиков и спецтехники. Оригинал и качественные аналоги.`,
    },
    {
      path: '/contact',
      priority: '0.6',
      changefreq: 'monthly',
      title: 'Контакты — GlobalAutoBusiness',
      description:
        'Свяжитесь с нами: подбор запчастей по артикулу, оптовые заказы, поддержка 24/7. Телефон +998 90 371 66 66, +998 98 361 88 84.',
    },
  ]

  // Kategoriya landing sahifalari — SEO uchun eng qimmatlisi
  for (const cat of categories) {
    const name = catName(cat.id, 'ru')
    const items = products.filter((p) => p.category === cat.id)
    const brands = [...new Set(items.map((p) => p.brand))].filter((b) => b && b !== 'GAB')
    routes.push({
      path: `/catalog/${cat.id}`,
      priority: items.length ? '0.8' : '0.5',
      changefreq: 'weekly',
      title: `${name} — купить запчасти для спецтехники | ${SITE_NAME}`,
      description: items.length
        ? `${name}: ${brands.slice(0, 6).join(', ')} — ${items.length} позиций в наличии. Оригинальные и аналоговые запчасти, доставка по СНГ.`
        : `${name} для грузовиков и спецтехники. Подберём по артикулу, доставка по СНГ, поддержка 24/7.`,
      jsonLd: items.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name,
            url: `${SITE_URL}/catalog/${cat.id}`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: items.length,
              itemListElement: items.slice(0, 30).map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${SITE_URL}/product/${p.id}`,
                name: ru(p.name),
              })),
            },
          }
        : null,
    })
  }

  // Mahsulot sahifalari
  for (const p of products) {
    const name = ru(p.name)
    const sku = p.sku !== '—' ? p.sku : ''
    const cross = p.cross?.length ? ` Кросс-номера: ${p.cross.join(', ')}.` : ''
    const catRu = catName(p.category, 'ru')

    routes.push({
      path: `/product/${p.id}`,
      priority: '0.7',
      changefreq: 'weekly',
      ogType: 'product',
      image: p.image?.startsWith('http') ? p.image : `${SITE_URL}${p.image}`,
      // Artikul nomda bor bo'lsa takrorlamaymiz
      title: `${name}${sku && !name.toLowerCase().includes(sku.toLowerCase()) ? ` ${sku}` : ''} купить — ${SITE_NAME}`.replace(/\s+/g, ' '),
      description: `${name}${sku ? `, артикул ${sku}` : ''}. ${p.brand}.${cross} В наличии, доставка по СНГ. ${ru(p.desc)}`.slice(0, 300),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name,
          image: (p.images || [p.image]).map((u) => (u.startsWith('http') ? u : `${SITE_URL}${u}`)),
          description: ru(p.desc),
          sku: sku || undefined,
          mpn: sku || undefined,
          category: catRu,
          brand: { '@type': 'Brand', name: p.brand },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'UZS',
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/product/${p.id}`,
            seller: { '@type': 'Organization', name: SITE_NAME },
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Все товары', item: `${SITE_URL}/products` },
            { '@type': 'ListItem', position: 3, name: catRu, item: `${SITE_URL}/catalog/${p.category}` },
            { '@type': 'ListItem', position: 4, name, item: `${SITE_URL}/product/${p.id}` },
          ],
        },
      ],
    })
  }

  return routes
}

/* ── 2. sitemap.xml ───────────────────────────────────────── */

function writeSitemap(routes) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .map((r) => {
      const loc = `${SITE_URL}${r.path === '/' ? '/' : r.path}`
      const alts = LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(loc)}"/>`
      ).join('\n')
      return `  <url>
    <loc>${esc(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq || 'weekly'}</changefreq>
    <priority>${r.priority || '0.6'}</priority>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(loc)}"/>
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf8')
  return routes.length
}

/* ── 3. Prerender: har bir yo'l uchun HTML ────────────────── */

function applyMeta(html, r) {
  const url = `${SITE_URL}${r.path}`
  const image = r.image || OG_IMAGE
  const title = esc(r.title)
  const desc = esc(r.description)

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${esc(url)}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${esc(image)}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${r.ogType || 'website'}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${esc(image)}$2`)

  // hreflang
  const hreflang = LANGS.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${esc(url)}" />`
  ).join('\n')

  // sahifaga xos JSON-LD
  const blocks = r.jsonLd ? (Array.isArray(r.jsonLd) ? r.jsonLd : [r.jsonLd]) : []
  const ld = blocks
    .filter(Boolean)
    .map((b) => `    <script type="application/ld+json">${JSON.stringify(b)}</script>`)
    .join('\n')

  const inject = `${hreflang}\n    <link rel="alternate" hreflang="x-default" href="${esc(url)}" />\n${ld}\n  </head>`
  out = out.replace('</head>', inject)
  return out
}

function prerender(routes, template) {
  let count = 0
  for (const r of routes) {
    const html = applyMeta(template, r)
    if (r.path === '/') {
      fs.writeFileSync(path.join(DIST, 'index.html'), html, 'utf8')
    } else {
      const dir = path.join(DIST, r.path)
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
    }
    count++
  }
  return count
}

/* ── 3b. SPA fallback ─────────────────────────────────────────
 *  Prerender faqat sitemap'dagi yo'llarni yozadi. Admin (/ravsfayz)
 *  va boshqa "deep-link"lar uchun jismoniy HTML kerak — aks holda
 *  statik hosting to'g'ridan-to'g'ri kirishda 404 beradi.
 *
 *   • dist/404.html            → ko'p hosting noma'lum yo'lda shuni beradi
 *   • dist/ravsfayz/index.html → admin panel to'g'ridan ochilishi uchun
 *   • dist/_redirects          → Netlify uchun SPA rewrite
 *   • dist/vercel.json         → Vercel uchun SPA rewrite
 *  ------------------------------------------------------------- */
function writeSpaFallback(template) {
  // Admin sahifa qidiruvga tushmasin — noindex qo'yamiz.
  const adminShell = template.replace(
    '</head>',
    '    <meta name="robots" content="noindex,nofollow" />\n  </head>'
  )

  // Umumiy 404 — SPA yuklanib, React Router kerakli sahifani ko'rsatadi.
  fs.writeFileSync(path.join(DIST, '404.html'), template, 'utf8')

  // Admin uchun aniq papka.
  const adminDir = path.join(DIST, 'ravsfayz')
  fs.mkdirSync(adminDir, { recursive: true })
  fs.writeFileSync(path.join(adminDir, 'index.html'), adminShell, 'utf8')

  // Netlify SPA rewrite (fayl bo'lmasa index.html qaytaradi).
  fs.writeFileSync(path.join(DIST, '_redirects'), '/*    /index.html   200\n', 'utf8')

  // Vercel SPA rewrite.
  fs.writeFileSync(
    path.join(DIST, 'vercel.json'),
    JSON.stringify({ rewrites: [{ source: '/(.*)', destination: '/index.html' }] }, null, 2),
    'utf8'
  )
}

/* ── 4. robots.txt ────────────────────────────────────────── */

function writeRobots() {
  const txt = `User-agent: *
Allow: /
Disallow: /ravsfayz

User-agent: Yandex
Allow: /
Disallow: /ravsfayz
Clean-param: page&sort&q

Host: ${SITE_URL.replace(/^https?:\/\//, '')}
Sitemap: ${SITE_URL}/sitemap.xml
`
  fs.writeFileSync(path.join(DIST, 'robots.txt'), txt, 'utf8')
}

/* ── Run ──────────────────────────────────────────────────── */

const templatePath = path.join(DIST, 'index.html')
if (!fs.existsSync(templatePath)) {
  console.error('[seo] dist/index.html topilmadi — avval `vite build` ishga tushiring.')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf8')
const routes = buildRoutes()

const sitemapCount = writeSitemap(routes)
const pageCount = prerender(routes, template)
writeSpaFallback(template)
writeRobots()

console.log(`[seo] sitemap.xml     → ${sitemapCount} ta URL`)
console.log(`[seo] prerender       → ${pageCount} ta HTML sahifa`)
console.log(`[seo]   • kategoriya  → ${categories.length}`)
console.log(`[seo]   • mahsulot    → ${products.length}`)
console.log(`[seo] SPA fallback     → 404.html, ravsfayz/index.html, _redirects, vercel.json`)
console.log(`[seo] robots.txt      → yozildi (Yandex Host/Clean-param bilan)`)
console.log(`[seo] ORG telefon     → ${ORG.phone.join(', ')}`)
