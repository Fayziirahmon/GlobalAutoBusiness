import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import Reveal from '../components/Reveal'
import { Icon } from '../components/Icons'

const channels = [
  { icon: 'phone', label: 'Call us', value: '+1 (800) 555-0199', href: 'tel:+18005550199' },
  { icon: 'mail',  label: 'Email',   value: 'parts@globalautobusiness.com', href: 'mailto:parts@globalautobusiness.com' },
  { icon: 'pin',   label: 'Warehouse', value: 'Dallas, TX · Global Distribution', href: null },
  { icon: 'support', label: 'Support', value: 'Available 24 / 7', href: null },
]

const subjects = ['General inquiry', 'Find a specific part', 'Bulk / fleet order', 'Warranty & returns', 'Shipping question']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: subjects[0], message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // Placeholder endpoint — developer wires the real backend later.
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).catch(() => {}) // swallow network error in demo mode
    } finally {
      setTimeout(() => setStatus('sent'), 600)
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 50, borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="container">
          <Reveal>
            <span className="badge"><span className="dot" /> Contact</span>
            <h1 className="heading-xl" style={{ margin: '20px 0 16px', maxWidth: 720 }}>Let&apos;s find your part.</h1>
            <p className="body-lg" style={{ maxWidth: 560 }}>
              Tell us the make, model and part number — or describe what you need. Our specialists reply fast, any hour of the day.
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
                  const inner = (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 22 }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                        background: 'var(--bg3)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)',
                      }}>
                        <Icon name={c.icon} size={20} />
                      </div>
                      <div>
                        <div className="caption" style={{ fontSize: 10.5, marginBottom: 3 }}>{c.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{c.value}</div>
                      </div>
                    </div>
                  )
                  return c.href
                    ? <a key={c.label} href={c.href}>{inner}</a>
                    : <div key={c.label}>{inner}</div>
                })}

                <div style={{
                  marginTop: 8, padding: 22, borderRadius: 'var(--radius-lg)',
                  background: 'var(--accent)', color: 'var(--accent-fg)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Icon name="globe" size={20} />
                    <strong style={{ fontSize: 15 }}>Global supply network</strong>
                  </div>
                  <p style={{ fontSize: 13.5, opacity: 0.75, lineHeight: 1.6 }}>
                    Shipping to 60+ countries with express options for urgent fleet downtime.
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
                    <h3 className="heading-md" style={{ marginBottom: 10 }}>Message received</h3>
                    <p className="body-md" style={{ marginBottom: 26 }}>Thanks, {form.name || 'there'}. Our parts team will get back to you shortly.</p>
                    <button className="btn btn-outline" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', company: '', subject: subjects[0], message: '' }) }}>
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                      <Field label="Full name" required value={form.name} onChange={set('name')} placeholder="John Carter" />
                      <Field label="Email" type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" />
                    </div>
                    <Field label="Company (optional)" value={form.company} onChange={set('company')} placeholder="Fleet Co." />

                    <div>
                      <Label>Subject</Label>
                      <select value={form.subject} onChange={set('subject')} style={inputStyle}>
                        {subjects.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <Label>Message</Label>
                      <textarea
                        required value={form.message} onChange={set('message')} rows={5}
                        placeholder="Include vehicle make, model, year and any part numbers…"
                        style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={status === 'sending'} style={{ marginTop: 4 }}>
                      {status === 'sending' ? 'Sending…' : <>Send Message <Icon name="arrow" size={17} /></>}
                    </button>
                    <p style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
                      We typically respond within a few hours.
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
