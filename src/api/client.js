/*
 * ─────────────────────────────────────────────────────────────
 *  API ABSTRACTION LAYER
 *
 *  Barcha ma'lumot so'rovlari shu moduldan o'tadi. Placeholder REST
 *  endpointlar:
 *
 *      GET /api/categories
 *      GET /api/products            ?page=&limit=&category=&q=&sort=
 *      GET /api/product/:id
 *
 *  Backend tayyor bo'lmaguncha REAL katalogdan (src/data/products.js —
 *  public/images dagi suratlardan tuzilgan) o'qiydi. Backend ishga
 *  tushsa, VITE_USE_MOCK=false qo'ying — funksiya imzolari o'zgarmaydi.
 * ─────────────────────────────────────────────────────────────
 */

import { products as catalog } from '../data/products'
import { categories as siteCategories } from '../data/categories'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

// Haqiqiy backend aniq sozlanmaguncha lokal katalogdan o'qiymiz.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const NETWORK_DELAY = 250 // loading holatini ko'rsatish uchun

const wait = (ms) => new Promise((res) => setTimeout(res, ms))

/** Low-level fetch wrapper with JSON parsing + error normalization. */
async function request(path, { signal } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  return res.json()
}

/** Ko'p tilli maydonni qidiriladigan matnga aylantiradi. */
const asText = (v) => (v == null ? '' : typeof v === 'string' ? v : Object.values(v).join(' '))

/*
 * Backend (server/server.ts) mahsulotni { _id, title, description, price,
 * imageUrl } ko'rinishida saqlaydi. UI esa { id, name, image, ... } kutadi.
 * `normalize` shu ikkisini bog'laydi; lokal katalogga ta'sir qilmaydi.
 */
function normalize(p = {}) {
  const id = p.id ?? p._id ?? ''
  const images = p.images ?? (p.image || p.imageUrl ? [p.image ?? p.imageUrl] : [])
  return {
    id,
    name: p.name ?? p.title ?? 'Untitled part',
    price: Number(p.price) || 0,
    image: p.image ?? p.imageUrl ?? images[0] ?? '',
    images,
    desc: p.desc ?? p.description ?? '',
    brand: p.brand ?? 'GlobalAutoBusiness',
    category: p.category ?? 'special-machinery',
    cross: p.cross ?? [],
    rating: p.rating ?? 4.8,
    reviews: p.reviews ?? 0,
    stock: p.stock ?? 10,
    sku: p.sku ?? (id ? `GAB-${String(id).slice(-6).toUpperCase()}` : ''),
    featured: p.featured ?? false,
  }
}

/* ── Lokal katalog ustida filtr / saralash ─────────────────── */

function filterLocal({ category, q, featured } = {}) {
  let list = [...catalog]
  if (category && category !== 'all') list = list.filter((p) => p.category === category)
  if (featured) list = list.filter((p) => p.featured)
  if (q) {
    const term = q.toLowerCase()
    list = list.filter(
      (p) =>
        (p.search || '').includes(term) ||
        asText(p.name).toLowerCase().includes(term) ||
        asText(p.sku).toLowerCase().includes(term)
    )
  }
  return list
}

function sortLocal(list, sort) {
  switch (sort) {
    case 'price-asc':  return [...list].sort((a, b) => a.price - b.price)
    case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
    case 'rating':     return [...list].sort((a, b) => b.rating - a.rating)
    case 'featured':   return [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    default:           return list
  }
}

/* ── Kategoriyalar (mahsulot soni bilan) ──────────────────── */

function categoriesWithCounts() {
  const counts = catalog.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})
  return siteCategories.map((c) => ({ ...c, count: counts[c.id] || 0 }))
}

export async function getCategories(opts) {
  if (USE_MOCK) {
    await wait(NETWORK_DELAY)
    return categoriesWithCounts()
  }
  try {
    return await request('/categories', opts)
  } catch (err) {
    if (err.name === 'AbortError') throw err
    console.warn('[api] categories — lokal katalogga qaytildi:', err.message)
    return categoriesWithCounts()
  }
}

/* ── Mahsulotlar ro'yxati (Home "featured" va h.k.) ────────── */

export async function getProducts(params = {}, opts) {
  if (USE_MOCK) {
    await wait(NETWORK_DELAY)
    let list = filterLocal(params)
    if (params.limit) list = list.slice(0, params.limit)
    return list
  }
  try {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    ).toString()
    const data = await request(`/products${query ? `?${query}` : ''}`, opts)
    return (Array.isArray(data) ? data : data.products ?? []).map(normalize)
  } catch (err) {
    if (err.name === 'AbortError') throw err
    console.warn('[api] products — lokal katalogga qaytildi:', err.message)
    let list = filterLocal(params)
    if (params.limit) list = list.slice(0, params.limit)
    return list
  }
}

/* ── Bitta mahsulot ────────────────────────────────────────── */

const findLocal = (id) => catalog.find((p) => p.id === id) || null

function withRelated(product) {
  const related = catalog
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)
  return { ...product, related }
}

export async function getProduct(id, opts) {
  const local = findLocal(id)
  if (local) {
    await wait(NETWORK_DELAY)
    return withRelated(local)
  }
  return fetchProductById(id, opts)
}

/* ── Sahifalangan katalog (Barcha mahsulotlar sahifasi) ────── */

function localPage({ page = 1, limit = 50, q, category, sort } = {}) {
  const list = sortLocal(filterLocal({ category, q }), sort)
  const totalProducts = list.length
  const start = (page - 1) * limit
  return {
    products: list.slice(start, start + limit),
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
    totalProducts,
    limit,
  }
}

/** Bir sahifa mahsulot (default 50 ta). */
export async function fetchProductsPage({ page = 1, limit = 50, q = '', category = '', sort = '' } = {}, opts) {
  if (USE_MOCK) {
    await wait(NETWORK_DELAY)
    return localPage({ page, limit, q, category, sort })
  }
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (q) params.set('q', q)
    if (category && category !== 'all') params.set('category', category)
    if (sort) params.set('sort', sort)
    const data = await request(`/products?${params.toString()}`, opts)
    return {
      products: (data.products ?? []).map(normalize),
      currentPage: data.currentPage ?? page,
      totalPages: data.totalPages ?? 1,
      totalProducts: data.totalProducts ?? (data.products?.length ?? 0),
      limit: data.limit ?? limit,
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err
    console.warn('[api] products page — lokal katalogga qaytildi:', err.message)
    return localPage({ page, limit, q, category, sort })
  }
}

/** Backenddan bitta mahsulot (Mongo _id bo'yicha). */
export async function fetchProductById(id, opts) {
  try {
    const raw = await request(`/products/${id}`, opts)
    const product = normalize(raw)
    let related = []
    try {
      const first = await request('/products?page=1&limit=4', opts)
      related = (first.products ?? [])
        .map(normalize)
        .filter((p) => p.id !== product.id)
        .slice(0, 3)
    } catch { /* related ixtiyoriy */ }
    return { ...product, related }
  } catch (err) {
    if (err.name === 'AbortError') throw err
    console.warn('[api] product by id — topilmadi:', err.message)
    throw err
  }
}
