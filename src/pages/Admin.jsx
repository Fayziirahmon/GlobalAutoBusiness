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

const fmt = (n) => (n ?? 0).toLocaleString('ru-RU')
const shortDate = (iso) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
const fullDate = (iso) => new Date(iso).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })

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
    border: `1px solid ${error ? '#e5484d' : 'var(--border2)'}`, borderRadius: 12, fontSize: 15, color: 'var(--text)',
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: 'var(--bg2)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)' }}>
            <img src="/logo.jpg" alt="GlobalAutoBusiness" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 19, letterSpacing: '-0.4px' }}>
            GlobalAuto<span style={{ color: 'var(--text3)' }}>Business</span>
          </div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', marginBottom: 12, color: 'var(--accent)' }}><Icon name="shield" size={30} /></div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>Панель администратора</h1>
            <p style={{ fontSize: 13.5, color: 'var(--text3)', marginTop: 6 }}>Войдите, чтобы продолжить</p>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input autoFocus placeholder="Логин" value={username} onChange={(e) => { setUsername(e.target.value); setError(false) }} style={field} />
            <input type="password" placeholder="Пароль" value={password} onChange={(e) => { setPassword(e.target.value); setError(false) }} style={field} />
            {error && (
              <div style={{ fontSize: 13, color: '#e5484d', display: 'flex', alignItems: 'center', gap: 7 }}>
                <Icon name="shield" size={15} /> Неверный логин или пароль
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 4 }}>
              Войти <Icon name="arrow" size={17} />
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--text3)' }}>← На сайт</Link>
        </div>
      </div>
    </div>
  )
}

/* ── Stat card ────────────────────────────────────────────── */
function Stat({ icon, label, value, sub, tone = 'var(--accent)' }) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="caption" style={{ fontSize: 10.5 }}>{label}</span>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: `color-mix(in srgb, ${tone} 14%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tone }}>
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
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>Просмотры — последние 14 дней</h3>
        <span className="caption" style={{ fontSize: 10.5 }}>{fmt(days.reduce((s, d) => s + d.count, 0))} всего</span>
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
            <span style={{ fontSize: 9.5, color: 'var(--text3)' }}>{shortDate(d.date).split(' ')[0]}</span>
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
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Сообщений пока нет</h3>
        <p style={{ fontSize: 13.5, color: 'var(--text3)' }}>Заявки со страницы «Контакты» появятся здесь.</p>
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
          <div key={m.id} className="card" style={{ padding: 0, overflow: 'hidden', border: !m.read ? '1px solid color-mix(in srgb, var(--accent) 40%, var(--border))' : undefined }}>
            <button onClick={() => toggle(m)} style={{ width: '100%', background: 'transparent', textAlign: 'left', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              {!m.read
                ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                : <span style={{ width: 8, flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: m.read ? 500 : 700, fontSize: 14.5, color: 'var(--text)' }}>{m.name || 'Аноним'}</span>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>· {m.subject}</span>
                  {m.replies?.length > 0 && (
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text3)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Icon name="mail" size={12} />{m.replies.length}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.message}
                </div>
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--text3)', flexShrink: 0 }}>{shortDate(m.createdAt ?? m.date)}</span>
              <span style={{ color: 'var(--text3)', flexShrink: 0, display: 'inline-flex', transform: open ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }}>
                <Icon name="arrow" size={15} />
              </span>
            </button>

            {open && (
              <div style={{ padding: '4px 20px 20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, margin: '16px 0' }}>
                  <Detail label="E-mail" value={<a href={`mailto:${m.email}`} style={{ color: 'var(--text)' }}>{m.email}</a>} />
                  {m.company && <Detail label="Компания" value={m.company} />}
                  {m.phone && <Detail label="Телефон" value={<a href={`tel:${m.phone}`} style={{ color: 'var(--text)' }}>{m.phone}</a>} />}
                  <Detail label="Тема" value={m.subject} />
                  <Detail label="Получено" value={fullDate(m.createdAt ?? m.date)} />
                </div>
                <div className="caption" style={{ fontSize: 10, marginBottom: 6 }}>Сообщение</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text2)', whiteSpace: 'pre-wrap' }}>{m.message}</p>

                {/* Oldingi javoblar */}
                {m.replies?.length > 0 && (
                  <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="caption" style={{ fontSize: 10 }}>Ваши ответы</div>
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
                  <div className="caption" style={{ fontSize: 10, marginBottom: 8 }}>Ответить клиенту</div>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    placeholder="Ответ появится у клиента в разделе «Почта» на сайте…"
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
                      <Icon name="mail" size={15} /> {sending ? 'Отправка…' : 'Отправить'}
                    </button>
                    {m.email && (
                      <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || '')}`} className="btn btn-outline" style={{ padding: '9px 16px', fontSize: 13 }}>
                        E-mail
                      </a>
                    )}
                    <button onClick={async () => { if (confirm('Удалить сообщение?')) { await deleteMessage(m.id); onChange() } }} className="btn btn-outline" style={{ padding: '9px 16px', fontSize: 13, marginLeft: 'auto' }}>
                      Удалить
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

/* ── Local-mode info banner ───────────────────────────────── */
function LocalBanner() {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      background: 'color-mix(in srgb, #d9822b 12%, var(--bg))',
      border: '1px solid color-mix(in srgb, #d9822b 35%, var(--border))',
      borderRadius: 14, padding: '14px 16px', marginBottom: 24,
    }}>
      <span style={{ color: '#d9822b', flexShrink: 0, marginTop: 1 }}><Icon name="shield" size={18} /></span>
      <div style={{ flex: 1, fontSize: 13, lineHeight: 1.55, color: 'var(--text2)' }}>
        <strong style={{ color: 'var(--text)' }}>Локальный режим.</strong>{' '}
        Сервер не подключён — сообщения и статистика хранятся только в этом браузере
        и не видны на других устройствах. Чтобы получать заявки с любого устройства,
        подключите сервер (папка <code style={{ fontSize: 12 }}>server/</code>) с базой MongoDB.
      </div>
      <button onClick={() => setHidden(true)} title="Скрыть" style={{ background: 'transparent', color: 'var(--text3)', flexShrink: 0, padding: 2, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>
        ×
      </button>
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
    }
  }, [])

  const sitePages = 4 + categories.length + catalogStats.products
  const pathLabel = (p) => (p === '/' ? 'Главная' : p.replace('/', '').split('?')[0] || p)

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg2)' }}>
      {/* Top bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--navbar-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)' }}>
            <img src="/logo.jpg" alt="GlobalAutoBusiness" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>Панель управления</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>GlobalAutoBusiness</div>
          </div>
          <div style={{ flex: 1 }} />
          {/* Backend holati */}
          <span
            title={online ? 'Сервер подключён — данные в базе, видны везде' : 'Локальный режим — данные только в этом браузере'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, marginRight: 4,
              fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap',
              padding: '5px 11px', borderRadius: 100,
              color: online ? '#30a46c' : '#d9822b',
              background: online ? 'color-mix(in srgb, #30a46c 12%, transparent)' : 'color-mix(in srgb, #d9822b 12%, transparent)',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: online ? '#30a46c' : '#d9822b' }} />
            {online ? 'Онлайн' : 'Локальный режим'}
          </span>
          <button onClick={refresh} title="Обновить" style={iconBtn}><Icon name="support" size={17} /></button>
          <button onClick={toggle} title="Тема" style={iconBtn}><Icon name={isDark ? 'sun' : 'moon'} size={17} /></button>
          <Link to="/" style={{ ...iconBtn, textDecoration: 'none' }} title="Открыть сайт"><Icon name="globe" size={17} /></Link>
          <button onClick={onLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>Выйти</button>
        </div>
      </header>

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 24px 80px' }}>
        {!online && <LocalBanner />}

        {/* Statistika sayti */}
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--text2)', marginBottom: 14 }}>Статистика сайта</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
          <Stat icon="globe" label="Просмотры страниц" value={fmt(stats.totalViews)} sub={stats.firstVisit ? `с ${shortDate(stats.firstVisit)}` : null} />
          <Stat icon="support" label="Сессии" value={fmt(stats.sessions)} sub="уникальные визиты" tone="#8b5cf6" />
          <Stat icon="arrowUpRight" label="Просмотры сегодня" value={fmt(stats.today)} tone="#30a46c" />
          <Stat icon="mail" label="Сообщения" value={fmt(messages.length)} sub={unread ? `${unread} непрочитанных` : 'все прочитаны'} tone="#d9822b" />
        </div>

        {/* Katalog ma'lumotlari */}
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--text2)', margin: '26px 0 14px' }}>Каталог</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
          <Stat icon="box" label="Товары" value={fmt(catalogStats.products)} sub={`${catalogStats.photos} фото`} />
          <Stat icon="filters" label="Категории" value={`${catalogStats.activeCategories}/${catalogStats.categories}`} sub="с товарами" tone="#8b5cf6" />
          <Stat icon="truck" label="Бренды" value={fmt(catalogStats.brands)} sub="в каталоге" tone="#30a46c" />
          <Stat icon="cog" label="Страницы сайта" value={fmt(sitePages)} sub="в карте сайта" tone="#d9822b" />
        </div>

        {/* Chart */}
        <div style={{ marginBottom: 28 }}><ViewsChart days={stats.days} /></div>

        {/* Two columns */}
        <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px' }}>Сообщения с сайта</h2>
              {unread > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-fg)', background: 'var(--accent)', padding: '3px 10px', borderRadius: 100 }}>{unread} новых</span>}
            </div>
            <Messages messages={messages} onChange={refresh} />
          </div>

          <div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px', marginBottom: 16 }}>Популярные страницы</h2>
            <div className="card" style={{ padding: 20 }}>
              {stats.topPaths.length === 0 ? (
                <p style={{ fontSize: 13.5, color: 'var(--text3)' }}>Пока нет данных.</p>
              ) : (
                stats.topPaths.map((p, i) => (
                  <div key={p.path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderTop: i ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 500 }}>{pathLabel(p.path)}</span>
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
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', cursor: 'pointer',
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
