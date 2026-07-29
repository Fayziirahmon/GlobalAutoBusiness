import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { useLang } from '../context/LanguageContext'
import { myThreads, markRead, countUnreadReplies } from '../api/messages'

/*
 * Mijoz pochtasi — navbar'dagi tugma.
 * Admin panelda yozilgan javoblar shu yerda ko'rinadi.
 * Har 30 soniyada va oyna fokuslanganda yangilanadi.
 */
export default function Inbox() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [threads, setThreads] = useState([])
  const ref = useRef(null)

  const load = async () => {
    try { setThreads(await myThreads()) } catch { /* jim */ }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- odatiy ma'lumot yuklash (async fetch)
    load()
    const timer = setInterval(load, 30000)
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => { clearInterval(timer); window.removeEventListener('focus', onFocus) }
  }, [])

  // Tashqariga bosilsa yopiladi
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const withReplies = threads.filter((m) => m.replies?.length)
  const unread = countUnreadReplies(threads)

  const openPanel = async () => {
    const next = !open
    setOpen(next)
    if (next && unread > 0) {
      // Ochilganda javoblarni o'qilgan deb belgilaymiz
      await Promise.all(
        threads.filter((m) => m.replyUnread && m.replies?.length).map((m) => markRead(m.id, false))
      )
      load()
    }
  }

  const fmt = (iso) => {
    try { return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) }
    catch { return '' }
  }

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={openPanel}
        aria-label={t('inbox.title')}
        title={t('inbox.title')}
        style={{
          position: 'relative', width: 39, height: 39, borderRadius: 10,
          background: 'var(--bg3)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text)', transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <Icon name="mail" size={17} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6, minWidth: 19, height: 19, padding: '0 5px',
            borderRadius: 100, background: '#e5484d', color: '#fff',
            fontSize: 11, fontWeight: 700, lineHeight: '19px', textAlign: 'center',
            border: '2px solid var(--bg)',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 48, right: 0, width: 340, maxWidth: 'calc(100vw - 32px)',
          maxHeight: 460, overflowY: 'auto', zIndex: 1100,
          background: 'var(--card)', border: '1px solid var(--border2)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong style={{ fontSize: 14, fontFamily: 'Space Grotesk' }}>{t('inbox.title')}</strong>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', color: 'var(--text3)', fontSize: 16 }}>✕</button>
          </div>

          {withReplies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '26px 8px', color: 'var(--text3)' }}>
              <div style={{ display: 'inline-flex', marginBottom: 10 }}><Icon name="mail" size={28} strokeWidth={1.3} /></div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6 }}>{t('inbox.empty')}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {withReplies.map((m) => (
                <div key={m.id} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
                  <div className="caption" style={{ fontSize: 9.5, marginBottom: 6 }}>
                    {m.subject || t('inbox.request')} · {fmt(m.createdAt)}
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text3)', marginBottom: 10, lineHeight: 1.5 }}>
                    {String(m.message).slice(0, 90)}{String(m.message).length > 90 ? '…' : ''}
                  </p>
                  {m.replies.map((r, i) => (
                    <div key={i} style={{
                      background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px',
                      marginTop: 6, borderLeft: '2px solid var(--accent)',
                    }}>
                      <div className="caption" style={{ fontSize: 9, marginBottom: 4 }}>
                        {t('inbox.answer')} · {fmt(r.createdAt)}
                      </div>
                      <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
