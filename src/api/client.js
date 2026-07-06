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
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term)
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

export async function getProduct(id, opts) {
  if (USE_MOCK) return mockGetProduct(id)
  try {
    return await request(`/product/${id}`, opts)
  } catch (err) {
    if (err.name === 'AbortError') throw err
    console.warn('[api] product — falling back to mock:', err.message)
    return mockGetProduct(id)
  }
}
