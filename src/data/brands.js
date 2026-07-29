/*
 * ─────────────────────────────────────────────────────────────
 *  TEXNIKA MARKALARI — bosh sahifadagi tasma uchun
 *
 *  Bular biz qism yetkazib beradigan yuk mashina va spetstexnika
 *  ishlab chiqaruvchilari (filtr brendlari emas).
 *
 *  LOGO QO'SHISH:
 *    public/brands/  papkasiga fayl tashlang, nomi `slug` bilan bir xil:
 *
 *      public/brands/howo.png
 *      public/brands/shacman.png
 *      public/brands/faw.png      ... va hokazo
 *
 *  Fayl bo'lsa — logo + nom ko'rinadi.
 *  Fayl bo'lmasa — faqat nom (matn) ko'rinadi, sayt buzilmaydi.
 *  PNG (shaffof fon) yoki SVG tavsiya etiladi, balandligi ~80-120px.
 * ─────────────────────────────────────────────────────────────
 */

export const vehicleBrands = [
  { slug: 'howo', name: 'HOWO' },
  { slug: 'shacman', name: 'Shacman' },
  { slug: 'faw', name: 'FAW' },
  { slug: 'dongfeng', name: 'Dongfeng' },
  { slug: 'foton', name: 'Foton' },
  { slug: 'jac', name: 'JAC' },
  { slug: 'xcmg', name: 'XCMG' },
  { slug: 'zoomlion', name: 'Zoomlion' },
  { slug: 'sany', name: 'SANY' },
  { slug: 'camc', name: 'CAMC' },
]

/** Logo yo'li — public/brands/<slug>.png */
export const brandLogo = (slug) => `/brands/${slug}.png`
