/*
 * ─────────────────────────────────────────────────────────────
 *  ADMIN DATA STORE
 *
 *  Site analytics (page views / sessions) and contact messages are
 *  kept in localStorage so the admin panel works without a backend.
 *
 *  NOTE: localStorage is per-browser, so "visitors" here means visits
 *  recorded on devices that opened the site in THIS browser. For real,
 *  cross-device analytics and message storage, back these with your API
 *  (e.g. POST /api/analytics/track, GET /api/messages) — the shapes below
 *  are designed to map directly onto such endpoints later.
 * ─────────────────────────────────────────────────────────────
 */

const AKEY = 'gab-analytics'
const MKEY = 'gab-messages'
const SESSION_FLAG = 'gab-session'

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const write = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* quota / privacy mode */ }
}

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10)

const emptyAnalytics = () => ({
  totalViews: 0,
  sessions: 0,
  firstVisit: new Date().toISOString(),
  daily: {},
  paths: {},
  recent: [],
})

/* ── Tracking ─────────────────────────────────────────────── */

export function recordPageview(path) {
  const a = read(AKEY, emptyAnalytics())
  const k = dayKey()
  a.totalViews = (a.totalViews || 0) + 1
  a.daily = a.daily || {}
  a.daily[k] = (a.daily[k] || 0) + 1
  a.paths = a.paths || {}
  a.paths[path] = (a.paths[path] || 0) + 1
  a.recent = [{ path, ts: Date.now() }, ...(a.recent || [])].slice(0, 60)
  if (!a.firstVisit) a.firstVisit = new Date().toISOString()

  // Count one session per browser tab session.
  if (!sessionStorage.getItem(SESSION_FLAG)) {
    sessionStorage.setItem(SESSION_FLAG, '1')
    a.sessions = (a.sessions || 0) + 1
  }
  write(AKEY, a)
}

/* ── Stats for the dashboard ──────────────────────────────── */

export function getStats() {
  const a = read(AKEY, emptyAnalytics())
  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const k = dayKey(d)
    days.push({ date: k, count: a.daily?.[k] || 0 })
  }
  const topPaths = Object.entries(a.paths || {})
    .sort((x, y) => y[1] - x[1])
    .slice(0, 6)
    .map(([path, count]) => ({ path, count }))

  return {
    totalViews: a.totalViews || 0,
    sessions: a.sessions || 0,
    today: a.daily?.[dayKey()] || 0,
    days,
    topPaths,
    firstVisit: a.firstVisit,
    recent: a.recent || [],
  }
}

export function resetAnalytics() {
  write(AKEY, emptyAnalytics())
}

/* ── Contact messages ─────────────────────────────────────── */

export function addMessage(msg) {
  const list = read(MKEY, [])
  const item = { id: `m-${Date.now()}`, date: new Date().toISOString(), read: false, ...msg }
  write(MKEY, [item, ...list])
  return item
}

export function getMessages() {
  return read(MKEY, [])
}

export function markMessageRead(id, isRead = true) {
  write(MKEY, getMessages().map((m) => (m.id === id ? { ...m, read: isRead } : m)))
}

export function deleteMessage(id) {
  write(MKEY, getMessages().filter((m) => m.id !== id))
}

export function clearMessages() {
  write(MKEY, [])
}
