import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Icon } from '../components/Icons'
import Seo from '../components/Seo'
import { login, logout, isAuthed } from '../admin/auth'
import { getStats } from '../admin/store'
import { listMessages, replyToMessage, markRead, deleteMessage, backendOnline } from '../api/messages'
import { products } from '../data/products'
import { categories } from '../data/categories'

const fmt = (n) => (n ?? 0).toLocaleString()
const shortDate = (iso) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const fullDate = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

/* ── Login screen ─────────────────────────────────────────── */
function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (login(username.trim(), password)) onSuccess()
    else { setError(true); setPassword('') }
  }

  const field = {
    width: '100%', padding: '13px 16px', background: 'var(--bg2)',
    border: '1px solid var(--border2)', borderRadius: 10, fontSize: 15, color: 'var(--text)',
  }

  return (
    <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ width: 46, height: 46, borderRadius: 11, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)' }}>
            <img src="/logo.jpg" alt="GlobalAutoBusiness" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 19, letterSpacing: '-0.4px' }}>
            GlobalAuto<span style={{ color: 'var(--text3)' }}>Business</span>
          </div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', marginBottom: 12, color: 'var(--text2)' }}><Icon name="shield" size={30} /></div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>Admin Panel</h1>
            <p style={{ fontSize: 13.5, color: 'var(--text3)', marginTop: 6 }}>Sign in to continue</p>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input autoFocus placeholder="Login" value={username} onChange={(e) => { setUsername(e.target.value); setError(false) }} style={field} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false) }} style={field} />
            {error && (
              <div style={{ fontSize: 13, color: '#e5484d', display: 'flex', alignItems: 'center', gap: 7 }}>
                <Icon name="shield" size={15} /> Invalid login or password
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 4 }}>
              Sign In <Icon name="arrow" size={17} />
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--text3)' }}>← Back to site</Link>
        </div>
      </div>
    </div>
  )
}

/* ── Stat card ────────────────────────────────────────────── */
function Stat({ icon, label, value, sub }) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="caption" style={{ fontSize: 10.5 }}>{label}</span>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)' }}>
          <Icon name={icon} size={17} />
        </span>
      </div>
      <div style={{ fontFamily: 'Space Grotesk', fontSize: 30, fontWeight: 700, letterSpacing: '-1px' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

/* ── 14-day bar chart (pure CSS) ──────────────────────────── */
function ViewsChart({ days }) {
  const max = Math.max(1, ...days.map((d) => d.count))
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>Page views — last 14 days</h3>
        <span className="caption" style={{ fontSize: 10.5 }}>{fmt(days.reduce((s, d) => s + d.count, 0))} total</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
        {days.map((d) => (
          <div key={d.date} title={`${d.date}: ${d.count}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{
              width: '100%', borderRadius: 6,
              height: `${Math.max(4, (d.count / max) * 100)}%`,
              background: d.count ? 'var(--accent)' : 'var(--bg3)',
              transition: 'height 0.4s var(--ease)',
            }} />
            <span style={{ fontSize: 9.5, color: 'var(--text3)' }}>{shortDate(d.date).split(' ')[1]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Messages ─────────────────────────────────────────────── */
function Messages({ messages, onChange }) {
  const [openId, setOpenId] = useState(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  if (messages.length === 0) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', marginBottom: 12, color: 'var(--text3)' }}><Icon name="mail" size={34} strokeWidth={1.3} /></div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No messages yet</h3>
        <p style={{ fontSize: 13.5, color: 'var(--text3)' }}>Submissions from the Contact page will appear here.</p>
      </div>
    )
  }

  const toggle = async (m) => {
    const next = openId === m.id ? null : m.id
    setOpenId(next)
    setDraft('')
    if (next && !m.read) { await markRead(m.id, true); onChange() }
  }

  const sendReply = async (m) => {
    const text = draft.trim()
    if (!text) return
    setSending(true)
    await replyToMessage(m.id, text)
    setDraft('')
    setSending(false)
    onChange()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {messages.map((m) => {
        const open = openId === m.id
        return (
          <div key={m.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button onClick={() => toggle(m)} style={{ width: '100%', background: 'transparent', textAlign: 'left', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              {!m.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: m.read ? 500 : 700, fontSize: 14.5, color: 'var(--text)' }}>{m.name || 'Anonymous'}</span>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>· {m.subject}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.message}
                </div>
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--text3)', flexShrink: 0 }}>{shortDate(m.date)}</span>
            </button>

            {open && (
              <div style={{ padding: '4px 20px 20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, margin: '16px 0' }}>
                  <Detail label="Email" value={<a href={`mailto:${m.email}`} style={{ color: 'var(--text)' }}>{m.email}</a>} />
                  {m.company && <Detail label="Company" value={m.company} />}
                  <Detail label="Subject" value={m.subject} />
                  <Detail label="Received" value={fullDate(m.createdAt ?? m.date)} />
                </div>
                <div className="caption" style={{ fontSize: 10, marginBottom: 6 }}>Message</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text2)', whiteSpace: 'pre-wrap' }}>{m.message}</p>

                {/* Oldingi javoblar */}
                {m.replies?.length > 0 && (
                  <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="caption" style={{ fontSize: 10 }}>Your replies</div>
                    {m.replies.map((r, i) => (
                      <div key={i} style={{
                        background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px',
                        borderLeft: '2px solid var(--accent)',
                      }}>
                        <div className="caption" style={{ fontSize: 9, marginBottom: 4 }}>{fullDate(r.createdAt)}</div>
                        <p style={{ fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Javob yozish — mijozning "Pochta" tugmasiga boradi */}
                <div style={{ marginTop: 18 }}>
                  <div className="caption" style={{ fontSize: 10, marginBottom: 8 }}>Reply on site</div>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    placeholder="Ответ клиенту — появится у него в «Почте» на сайте…"
                    style={{
                      width: '100%', padding: '11px 14px', background: 'var(--bg2)',
                      border: '1px solid var(--border2)', borderRadius: 10,
                      fontSize: 14, color: 'var(--text)', resize: 'vertical', minHeight: 80,
                    }}
                  />
                  <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => sendReply(m)}
                      disabled={sending || !draft.trim()}
                      className="btn btn-primary"
                      style={{ padding: '9px 18px', fontSize: 13, opacity: sending || !draft.trim() ? 0.5 : 1 }}
                    >
                      <Icon name="mail" size={15} /> {sending ? 'Sending…' : 'Send reply'}
                    </button>
                    {m.email && (
                      <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || '')}`} className="btn btn-outline" style={{ padding: '9px 16px', fontSize: 13 }}>
                        Email
                      </a>
                    )}
                    <button onClick={async () => { await deleteMessage(m.id); onChange() }} className="btn btn-outline" style={{ padding: '9px 16px', fontSize: 13 }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="caption" style={{ fontSize: 10, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 500, wordBreak: 'break-word' }}>{value}</div>
    </div>
  )
}

/* ── Dashboard ────────────────────────────────────────────── */
function Dashboard({ onLogout }) {
  const { isDark, toggle } = useTheme()
  const [tick, setTick] = useState(0)
  const refresh = () => setTick((t) => t + 1)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stats = useMemo(() => getStats(), [tick])

  // Xabarlar backenddan (yoki lokal zaxiradan) yuklanadi
  const [messages, setMessages] = useState([])
  const [online, setOnline] = useState(false)

  const loadMessages = useCallback(async () => {
    const list = await listMessages()
    setMessages(list)
    setOnline(backendOnline)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- odatiy ma'lumot yuklash (async fetch)
  useEffect(() => { loadMessages() }, [loadMessages, tick])

  const unread = messages.filter((m) => !m.read).length

  // Katalog ma'lumotlari
  const catalogStats = useMemo(() => {
    const byCat = {}
    products.forEach((p) => { byCat[p.category] = (byCat[p.category] || 0) + 1 })
    const brands = new Set(products.map((p) => p.brand).filter((b) => b && b !== 'GAB'))
    const photos = products.reduce((s, p) => s + (p.images?.length || 0), 0)
    return {
      products: products.length,
      categories: categories.length,
      activeCategories: Object.keys(byCat).length,
      brands: brands.size,
      photos,
      byCat,
    }
  }, [])

  const pathLabel = (p) => (p === '/' ? 'Home' : p.replace('/', '').split('?')[0] || p)

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg2)' }}>
      {/* Top bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--navbar-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)' }}>
            <img src="/logo.jpg" alt="GlobalAutoBusiness" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>Admin Dashboard</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>GlobalAutoBusiness</div>
          </div>
          <div style={{ flex: 1 }} />
          {/* Backend holati — yozishma haqiqatan ishlayaptimi */}
          <span
            title={online ? 'Backend ulangan — xabarlar bazada' : 'Backend yo\'q — faqat shu brauzerda'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, marginRight: 6,
              fontSize: 11.5, fontWeight: 600, color: online ? 'var(--text2)' : '#e5484d',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: online ? '#30a46c' : '#e5484d' }} />
            {online ? 'Backend' : 'Локально'}
          </span>
          <button onClick={refresh} title="Refresh" style={iconBtn}><Icon name="support" size={17} /></button>
          <button onClick={toggle} title="Theme" style={iconBtn}><Icon name={isDark ? 'sun' : 'moon'} size={17} /></button>
          <Link to="/" style={{ ...iconBtn, textDecoration: 'none' }} title="View site"><Icon name="globe" size={17} /></Link>
          <button onClick={onLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>Logout</button>
        </div>
      </header>

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
          <Stat icon="globe" label="Total page views" value={fmt(stats.totalViews)} sub={stats.firstVisit ? `since ${shortDate(stats.firstVisit)}` : null} />
          <Stat icon="support" label="Sessions" value={fmt(stats.sessions)} sub="unique visits" />
          <Stat icon="arrowUpRight" label="Views today" value={fmt(stats.today)} />
          <Stat icon="mail" label="Messages" value={fmt(messages.length)} sub={unread ? `${unread} unread` : 'all read'} />
        </div>

        {/* Katalog ma'lumotlari */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
          <Stat icon="box" label="Products" value={fmt(catalogStats.products)} sub={`${catalogStats.photos} photos`} />
          <Stat icon="filters" label="Categories" value={`${catalogStats.activeCategories}/${catalogStats.categories}`} sub="with products" />
          <Stat icon="truck" label="Brands" value={fmt(catalogStats.brands)} sub="in catalog" />
          <Stat icon="cog" label="Site pages" value="60" sub="indexed (sitemap)" />
        </div>

        {/* Chart */}
        <div style={{ marginBottom: 28 }}><ViewsChart days={stats.days} /></div>

        {/* Two columns */}
        <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px' }}>Contact messages</h2>
              {unread > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-fg)', background: 'var(--accent)', padding: '3px 10px', borderRadius: 100 }}>{unread} new</span>}
            </div>
            <Messages messages={messages} onChange={refresh} />
          </div>

          <div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px', marginBottom: 16 }}>Top pages</h2>
            <div className="card" style={{ padding: 20 }}>
              {stats.topPaths.length === 0 ? (
                <p style={{ fontSize: 13.5, color: 'var(--text3)' }}>No data yet.</p>
              ) : (
                stats.topPaths.map((p, i) => (
                  <div key={p.path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderTop: i ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 500, textTransform: 'capitalize' }}>{pathLabel(p.path)}</span>
                    <span style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>{fmt(p.count)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`@media (max-width: 820px){ .admin-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}

const iconBtn = {
  width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)',
}

/* ── Route entry ──────────────────────────────────────────── */
export default function Admin() {
  const [authed, setAuthed] = useState(() => isAuthed())

  return (
    <>
      <Seo title="Admin — GlobalAutoBusiness" noindex canonicalPath="/ravsfayz" />
      {authed
        ? <Dashboard onLogout={() => { logout(); setAuthed(false) }} />
        : <LoginScreen onSuccess={() => setAuthed(true)} />}
    </>
  )
}
