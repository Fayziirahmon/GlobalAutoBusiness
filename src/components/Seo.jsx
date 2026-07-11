import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { SITE_URL, SITE_NAME, OG_IMAGE, TWITTER_HANDLE, LOCALE_MAP } from '../seo/seo.config'

/*
 * Per-page SEO: title, meta description, canonical, hreflang alternates,
 * Open Graph, Twitter Card, and optional JSON-LD structured data.
 * Localized via the active language.
 *
 * Props:
 *   title, description  — page-specific (already localized)
 *   image               — absolute OG image URL (defaults to OG_IMAGE)
 *   type                — og:type ('website' | 'product' | 'article')
 *   canonicalPath       — override path (defaults to current pathname)
 *   noindex             — add noindex,nofollow
 *   jsonLd              — object or array of JSON-LD structured data
 */
export default function Seo({ title, description, image, type = 'website', canonicalPath, noindex = false, jsonLd }) {
  const { lang } = useLang()
  const { pathname } = useLocation()

  const path = canonicalPath ?? pathname
  const url = `${SITE_URL}${path}`
  const ogImage = image || OG_IMAGE
  const fullTitle = title || SITE_NAME
  const locale = LOCALE_MAP[lang] || 'ru_RU'
  const altLocales = Object.entries(LOCALE_MAP).filter(([code]) => code !== lang)
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet htmlAttributes={{ lang }} prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
      <link rel="canonical" href={url} />

      {/* hreflang alternates (same URL, language switch is client-side) */}
      <link rel="alternate" hrefLang={lang} href={url} />
      {Object.keys(LOCALE_MAP).map((code) => (
        <link key={code} rel="alternate" hrefLang={code} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${path}`} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={locale} />
      {altLocales.map(([, loc]) => (
        <meta key={loc} property="og:locale:alternate" content={loc} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(block)}</script>
      ))}
    </Helmet>
  )
}
