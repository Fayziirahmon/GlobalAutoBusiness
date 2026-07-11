/*
 * ─────────────────────────────────────────────────────────────
 *  SEO CONFIG
 *
 *  ⚠️ Set SITE_URL to your real purchased domain (no trailing slash).
 *  It is used for canonical URLs, Open Graph, sitemap and JSON-LD.
 * ─────────────────────────────────────────────────────────────
 */

export const SITE_URL = 'https://globalautobusiness.uz'
export const SITE_NAME = 'GlobalAutoBusiness'

// Social share image (1200×630 recommended). Lives in /public.
export const OG_IMAGE = `${SITE_URL}/og-image.png`

export const TWITTER_HANDLE = '@globalautobiz'

// og:locale value per app language + alternates for hreflang.
export const LOCALE_MAP = { ru: 'ru_RU', en: 'en_US', uz: 'uz_UZ' }

// Contact / brand facts reused in structured data.
export const ORG = {
  phone: ['+998903716666', '+998983618884'],
  email: 'globalautobusiness.uz@gmail.com',
  sameAs: [], // add real social profile URLs here when available
}
