/*
 * ─────────────────────────────────────────────────────────────
 *  API ABSTRACTION LAYER
 *
 *  Every data request in the app goes through this module. It uses
 *  the native fetch() API against placeholder REST endpoints:
 *
 *      GET /api/categories
 *      GET /api/products            ?category=&q=&featured=
 *      GET /api/product/:id
 *
 *  Until the backend exists, requests gracefully fall back to the
 *  local mock data (see mockData.js). When the real API is live,
 *  set VITE_USE_MOCK=false (or remove the fallback) and the same
 *  function signatures keep working — no page changes required.
 * ─────────────────────────────────────────────────────────────
 */

import { products as mockProducts, categories as mockCategories } from './mockData'
import { catalogProducts } from './catalogData'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

// Force mock mode unless an explicit real backend is configured.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const NETWORK_DELAY = 450 // simulate latency so loading states are visible

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

/*
 * The real backend (server/server.ts) stores products as
 * { _id, title, description, price, imageUrl }. The UI components
 * expect { id, name, price, image, ... }. `normalize` bridges the two
 * and is idempotent, so it safely passes mock data through unchanged.
 */
/** Flatten a possibly-multilingual field to a searchable string. */
const asText = (v) => (v == null ? '' : typeof v === 'string' ? v : Object.values(v).join(' '))

function normalize(p = {}) {
  const id = p.id ?? p._id ?? ''
  return {
    id,
    name: p.name ?? p.title ?? 'Untitled part',
    price: Number(p.price) || 0,
    image: p.image ?? p.imageUrl ?? '',
    desc: p.desc ?? p.description ?? '',
    brand: p.brand ?? 'GlobalAuto',
    category: p.category ?? 'parts',
    rating: p.rating ?? 4.8,
    reviews: p.reviews ?? 0,
    stock: p.stock ?? 25,
    sku: p.sku ?? (id ? `GAB-${String(id).slice(-6).toUpperCase()}` : ''),
    featured: p.featured ?? false,
  }
}

/* ── Mock resolvers (used when USE_MOCK or the network fails) ── */

async function mockGetCategories() {
  await wait(NETWORK_DELAY)
  return mockCategories
}

async function mockGetProducts({ category, q, featured, limit } = {}) {
  await wait(NETWORK_DELAY)
  let list = [...mockProducts]
  if (category && category !== 'all') list = list.filter((p) => p.category === category)
  if (featured) list = list.filter((p) => p.featured)
  if (q) {
    const term = q.toLowerCase()
    list = list.filter(
      (p) =>
        asText(p.name).toLowerCase().includes(term) ||
        asText(p.sku).toLowerCase().includes(term) ||
        asText(p.brand).toLowerCase().includes(term)
    )
  }
  if (limit) list = list.slice(0, limit)
  return list
}

async function mockGetProduct(id) {
  await wait(NETWORK_DELAY)
  const product = mockProducts.find((p) => p.id === id)
  if (!product) throw new Error('Product not found')
  const related = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)
  return { ...product, related }
}

/* ── Public API (call these from pages) ──────────────────────── */

export async function getCategories(opts) {
  if (USE_MOCK) return mockGetCategories()
  try {
    return await request('/categories', opts)
  } catch (err) {
    if (err.name === 'AbortError') throw err
    console.warn('[api] categories — falling back to mock:', err.message)
    return mockGetCategories()
  }
}

export async function getProducts(params = {}, opts) {
  if (USE_MOCK) return mockGetProducts(params)
  try {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    ).toString()
    return await request(`/products${query ? `?${query}` : ''}`, opts)
  } catch (err) {
    if (err.name === 'AbortError') throw err
    console.warn('[api] products — falling back to mock:', err.message)
    return mockGetProducts(params)
  }
}

/** Look a product up in the local datasets (curated demo + large catalog). */
function findLocal(id) {
  return mockProducts.find((p) => p.id === id) || catalogProducts.find((p) => p.id === id) || null
}

function withLocalRelated(product) {
  const pool = [...mockProducts, ...catalogProducts]
  const related = pool.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
  return { ...product, related }
}

export async function getProduct(id, opts) {
  // Resolve local ids (demo "p-…" and catalog "gab-…") without the network.
  // Anything else is treated as a real backend Mongo _id.
  const local = findLocal(id)
  if (local) {
    await wait(NETWORK_DELAY)
    return withLocalRelated(local)
  }
  return fetchProductById(id, opts)
}

/* ─────────────────────────────────────────────────────────────
 *  REAL BACKEND — paginated catalog (server/server.ts)
 *
 *  GET /api/products?page=1&limit=50
 *    → { products, currentPage, totalPages, totalProducts, limit }
 *  GET /api/products/:id
 *    → single product
 *
 *  Both always try the live API first (this is the user's own API)
 *  and fall back to paginated mock data so the UI still renders
 *  when the backend isn't running.
 * ───────────────────────────────────────────────────────────── */

/** Paginate the large local catalog — used as an offline fallback. */
function mockPage({ page = 1, limit = 50, q } = {}) {
  let list = [...catalogProducts]
  if (q) {
    const term = q.toLowerCase()
    list = list.filter((p) => asText(p.name).toLowerCase().includes(term) || asText(p.sku).toLowerCase().includes(term))
  }
  const totalProducts = list.length
  const start = (page - 1) * limit
  return {
    products: list.slice(start, start + limit).map(normalize),
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
    totalProducts,
    limit,
  }
}

/** Fetch one page of products (default 50 per page) from the backend. */
export async function fetchProductsPage({ page = 1, limit = 50, q = '' } = {}, opts) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (q) params.set('q', q)
    const data = await request(`/products?${params.toString()}`, opts)

    // Backend already returns the paginated shape; normalize the items.
    return {
      products: (data.products ?? []).map(normalize),
      currentPage: data.currentPage ?? page,
      totalPages: data.totalPages ?? 1,
      totalProducts: data.totalProducts ?? (data.products?.length ?? 0),
      limit: data.limit ?? limit,
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err
    console.warn('[api] products page — falling back to mock:', err.message)
    return mockPage({ page, limit, q })
  }
}

/** Fetch a single backend product (+ a few related items). */
export async function fetchProductById(id, opts) {
  try {
    const raw = await request(`/products/${id}`, opts)
    const product = normalize(raw)
    // Backend has no category grouping, so pull a few others as "related".
    let related = []
    try {
      const first = await request('/products?page=1&limit=4', opts)
      related = (first.products ?? [])
        .map(normalize)
        .filter((p) => p.id !== product.id)
        .slice(0, 3)
    } catch { /* related is optional */ }
    return { ...product, related }
  } catch (err) {
    if (err.name === 'AbortError') throw err
    console.warn('[api] product by id — falling back to mock:', err.message)
    return mockGetProduct(id) // will throw "not found" if truly absent
  }
}
