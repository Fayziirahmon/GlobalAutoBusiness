import { useLang } from '../context/LanguageContext'

/*
 * Segmented RU / EN / UZ switcher. `size="lg"` is used in the mobile menu.
 */
export default function LanguageSwitcher({ size = 'sm' }) {
  const { lang, setLang, langs } = useLang()
  const lg = size === 'lg'

  return (
    <div
      role="group"
      aria-label="Language"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 2,
        padding: 3, borderRadius: lg ? 12 : 10,
        background: 'var(--bg3)', border: '1px solid var(--border)',
      }}
    >
      {langs.map((l) => {
        const active = l.code === lang
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            title={l.name}
            style={{
              padding: lg ? '9px 16px' : '5px 9px',
              borderRadius: lg ? 9 : 7,
              fontSize: lg ? 14 : 12,
              fontWeight: 700, letterSpacing: '0.3px',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'var(--accent-fg)' : 'var(--text3)',
              transition: 'all 0.2s var(--ease)',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--text3)' }}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}
