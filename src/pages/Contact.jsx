import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import { Icon } from '../components/Icons'
import { useLang } from '../context/LanguageContext'
import Seo from '../components/Seo'
import { sendMessage } from '../api/messages'

const channels = [
  {
    icon: 'phone', labelKey: 'contact.callUs',
    lines: [
      { text: '+998 90 371 66 66', href: 'tel:+998903716666' },
      { text: '+998 98 361 88 84', href: 'tel:+998983618884' },
    ],
  },
  { icon: 'mail',    labelKey: 'contact.email',    value: 'globalautobusiness.uz@gmail.com', href: 'mailto:globalautobusiness.uz@gmail.com' },
  { icon: 'pin',     labelKey: 'contact.location', valueKey: 'contact.viewMaps', href: 'https://maps.app.goo.gl/rffS65bLksDa9RqV8?g_st=it', external: true },
  { icon: 'support', labelKey: 'contact.support',  valueKey: 'contact.available', href: null },
]

export default function Contact() {
  const { t } = useLang()
  const subjects = t('contact.subjects')
  // Savatdan "So'rov yuborish" bosilganda ro'yxat shu yerga tushadi
  const { state } = useLocation()
  const [form, setForm] = useState({
    name: '', email: '', company: '',
    subjectIdx: state?.subjectIdx ?? 0,
    message: state?.message ?? '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    // Backend ishlasa bazaga tushadi (admin boshqa qurilmadan ham ko'radi),
    // ishlamasa lokal saqlanadi — sendMessage o'zi hal qiladi.
    await sendMessage({
      name: form.name,
      email: form.email,
      company: form.company,
      subject: subjects[form.subjectIdx],
      message: form.message,
    })
    setStatus('sent')
  }

  return (
    <PageWrapper>
      <Seo title={t('seo.contact.title')} description={t('seo.contact.desc')} canonicalPath="/contact" />
      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 50, borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="container">
          <Reveal>
            <span className="badge"><span className="dot" /> {t('contact.badge')}</span>
            <h1 className="heading-xl" style={{ margin: '20px 0 16px', maxWidth: 720 }}>{t('contact.title')}</h1>
            <p className="body-lg" style={{ maxWidth: 560 }}>
              {t('contact.subtitle')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 56, alignItems: 'start' }}>
            {/* Channels */}
            <Reveal>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {channels.map((c) => {
                  const iconBox = (
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: 'var(--bg3)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)',
                    }}>
                      <Icon name={c.icon} size={20} />
                    </div>
                  )
                  const label = t(c.labelKey)

                  // Multi-line card (e.g. two phone numbers)
                  if (c.lines) {
                    return (
                      <div key={c.labelKey} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 22 }}>
                        {iconBox}
                        <div>
                          <div className="caption" style={{ fontSize: 10.5, marginBottom: 5 }}>{label}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {c.lines.map((l) => (
                              <a key={l.href} href={l.href} style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{l.text}</a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  }

                  const inner = (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 22 }}>
                      {iconBox}
                      <div>
                        <div className="caption" style={{ fontSize: 10.5, marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{c.valueKey ? t(c.valueKey) : c.value}</div>
                      </div>
                    </div>
                  )
                  if (!c.href) return <div key={c.labelKey}>{inner}</div>
                  const ext = c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
                  return <a key={c.labelKey} href={c.href} {...ext}>{inner}</a>
                })}

                <div style={{
                  marginTop: 8, padding: 22, borderRadius: 'var(--radius-lg)',
                  background: 'var(--accent)', color: 'var(--accent-fg)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Icon name="globe" size={20} />
                    <strong style={{ fontSize: 15 }}>{t('contact.globalNet')}</strong>
                  </div>
                  <p style={{ fontSize: 13.5, opacity: 0.75, lineHeight: 1.6 }}>
                    {t('contact.globalNetDesc')}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={80}>
              <div className="card" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
                {status === 'sent' ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%', margin: '0 auto 22px',
                      background: 'var(--accent)', color: 'var(--accent-fg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name="check" size={30} />
                    </div>
                    <h3 className="heading-md" style={{ marginBottom: 10 }}>{t('contact.sentTitle')}</h3>
                    <p className="body-md" style={{ marginBottom: 26 }}>{t('contact.sentDesc', { name: form.name || '' })}</p>
                    <button className="btn btn-outline" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', company: '', subjectIdx: 0, message: '' }) }}>
                      {t('contact.sendAnother')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                      <Field label={t('contact.fullName')} required value={form.name} onChange={set('name')} placeholder={t('contact.namePh')} />
                      <Field label={t('contact.emailLabel')} type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" />
                    </div>
                    <Field label={t('contact.company')} value={form.company} onChange={set('company')} placeholder={t('contact.companyPh')} />

                    <div>
                      <Label>{t('contact.subject')}</Label>
                      <select value={form.subjectIdx} onChange={set('subjectIdx')} style={inputStyle}>
                        {subjects.map((s, i) => <option key={i} value={i}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <Label>{t('contact.message')}</Label>
                      <textarea
                        required value={form.message} onChange={set('message')} rows={5}
                        placeholder={t('contact.messagePh')}
                        style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={status === 'sending'} style={{ marginTop: 4 }}>
                      {status === 'sending' ? t('contact.sending') : <>{t('contact.send')} <Icon name="arrow" size={17} /></>}
                    </button>
                    <p style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
                      {t('contact.note')}
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 880px){
          .contact-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 520px){
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageWrapper>
  )
}

const inputStyle = {
  width: '100%', padding: '13px 16px', background: 'var(--bg2)',
  border: '1px solid var(--border2)', borderRadius: 10, fontSize: 14.5, color: 'var(--text)',
}

function Label({ children }) {
  return <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8, letterSpacing: '0.2px' }}>{children}</label>
}

function Field({ label, ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <input {...props} style={inputStyle} />
    </div>
  )
}
