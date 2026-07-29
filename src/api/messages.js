/*
 * ─────────────────────────────────────────────────────────────
 *  XABARLAR API (Contact formasi ↔ Admin panel ↔ Mijoz pochtasi)
 *
 *  ⚠️ MUHIM:
 *  Backend (server/server.ts) ISHLAB TURSA — xabarlar bazaga tushadi va
 *  admin boshqa qurilmadan ham ko'radi, javobi mijozga yetib boradi.
 *
 *  Backend ishlamasa — lokal rejimga (localStorage) tushadi. U holda
 *  xabar faqat O'SHA BRAUZERDA ko'rinadi (demo/test uchun). Haqiqiy
 *  yozishma uchun backendni ishga tushirish SHART.
 * ─────────────────────────────────────────────────────────────
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const LKEY = 'gab-messages'
const CID = 'gab-client-id'

/* ── Tashrifchi identifikatori (login yo'q) ───────────────── */

export function getClientId() {
  try {
    let id = localStorage.getItem(CID)
    if (!id) {
      id = `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem(CID, id)
    }
    return id
  } catch {
    return 'c-anonymous'
  }
}

/* ── Lokal zaxira ─────────────────────────────────────────── */

const lread = () => {
  try {
    const v = JSON.parse(localStorage.getItem(LKEY))
    return Array.isArray(v) ? v : []
  } catch { return [] }
}
const lwrite = (v) => {
  try { localStorage.setItem(LKEY, JSON.stringify(v)) } catch { /* ignore */ }
}

/** Backend javob berayotganini bildiradi (UI ogohlantirish uchun) */
export let backendOnline = false

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  backendOnline = true
  return res.json()
}

const norm = (m) => ({ ...m, id: m.id ?? m._id })

/* ── 1. Xabar yuborish (Contact formasi) ──────────────────── */

export async function sendMessage(data) {
  const payload = { ...data, clientId: getClientId() }
  try {
    return norm(await api('/messages', { method: 'POST', body: JSON.stringify(payload) }))
  } catch {
    backendOnline = false
    const item = {
      id: `m-${Date.now()}`,
      ...payload,
      read: false,
      replyUnread: false,
      replies: [],
      createdAt: new Date().toISOString(),
    }
    lwrite([item, ...lread()])
    return item
  }
}

/* ── 2. Admin: barcha xabarlar ────────────────────────────── */

export async function listMessages() {
  try {
    const list = await api('/messages')
    return list.map(norm)
  } catch {
    backendOnline = false
    return lread()
  }
}

/* ── 3. Mijoz: o'zining yozishmalari (Pochta tugmasi) ─────── */

export async function myThreads() {
  const clientId = getClientId()
  try {
    const list = await api(`/messages?clientId=${encodeURIComponent(clientId)}`)
    return list.map(norm)
  } catch {
    backendOnline = false
    return lread().filter((m) => m.clientId === clientId)
  }
}

/* ── 4. Admin: javob yozish ───────────────────────────────── */

export async function replyToMessage(id, text) {
  try {
    return norm(await api(`/messages/${id}/reply`, { method: 'POST', body: JSON.stringify({ text }) }))
  } catch {
    backendOnline = false
    const list = lread().map((m) =>
      m.id === id
        ? {
            ...m,
            read: true,
            replyUnread: true,
            replies: [...(m.replies || []), { text, createdAt: new Date().toISOString() }],
          }
        : m
    )
    lwrite(list)
    return list.find((m) => m.id === id)
  }
}

/* ── 5. O'qildi deb belgilash ─────────────────────────────── */

export async function markRead(id, byAdmin = true) {
  try {
    return norm(await api(`/messages/${id}/read`, { method: 'PATCH', body: JSON.stringify({ byAdmin }) }))
  } catch {
    backendOnline = false
    const list = lread().map((m) =>
      m.id === id ? { ...m, ...(byAdmin ? { read: true } : { replyUnread: false }) } : m
    )
    lwrite(list)
    return list.find((m) => m.id === id)
  }
}

/* ── 6. Admin: o'chirish ──────────────────────────────────── */

export async function deleteMessage(id) {
  try {
    await api(`/messages/${id}`, { method: 'DELETE' })
  } catch {
    backendOnline = false
    lwrite(lread().filter((m) => m.id !== id))
  }
}

/** Mijozda o'qilmagan javoblar soni */
export function countUnreadReplies(threads) {
  return threads.filter((m) => m.replyUnread && m.replies?.length).length
}
