/*
 * ─────────────────────────────────────────────────────────────
 *  GlobalAutoBusiness — REAL CATALOG
 *
 *  Har bir mahsulot public/images/ dagi HAQIQIY suratdan olingan.
 *  Nom, brend va artikullar rasmdagi yozuvlardan o'qilgan (o'ylab
 *  topilmagan). 97 ta surat = 36 ta mahsulot (har biriga 1-6 rakurs:
 *  quti oldi/orqasi, filtrning o'zi, yuqoridan ko'rinish).
 *
 *  `images` — galereya, `image` — bosh surat (galereyaning birinchisi).
 *  Narx yo'q (price: 0) → sayt "So'rov bo'yicha" deb ko'rsatadi.
 * ─────────────────────────────────────────────────────────────
 */

// public/images/photo_N_2026-07-15_14-17-36.jpg  (N <= 50)
// public/images/photo_N_2026-07-15_14-17-37.jpg  (N >= 51)
const img = (n) => `/images/photo_${n}_2026-07-15_14-17-${n <= 50 ? '36' : '37'}.jpg`
const gallery = (...nums) => nums.map(img)

const P = [
  // ── Сепараторы топлива / Fuel-water separators ───────────────
  {
    id: 'perkins-4415122-fuel-water-separator',
    sku: '4415122',
    brand: 'Perkins',
    category: 'fuel-systems',
    cross: [],
    photos: [1, 2, 3, 4],
    featured: true,
    name: {
      ru: 'Сепаратор топливный Perkins Powerpart 4415122',
      en: 'Perkins Powerpart Fuel/Water Separator 4415122',
      uz: 'Perkins Powerpart yoqilg‘i/suv separatori 4415122',
    },
  },
  {
    id: 'doosan-fuel-filter-water-bowl-7007291',
    sku: '400-921 / 7007291',
    brand: 'Doosan',
    category: 'fuel-systems',
    cross: ['7007291'],
    photos: [48, 49, 50],
    featured: false,
    name: {
      ru: 'Фильтр топливный Doosan с водосборником (bowl)',
      en: 'Doosan Fuel Filter with Water Collection Bowl',
      uz: 'Doosan yoqilg‘i filtri suv yig‘gich bilan',
    },
  },
  {
    id: 'lantu-fs1098-fuel-water-separator-5319680',
    sku: 'FS1098',
    brand: 'LANTU',
    category: 'fuel-systems',
    cross: ['5319680'],
    photos: [78, 79],
    featured: true,
    name: {
      ru: 'Сепаратор топливный LANTU FS1098 (5319680)',
      en: 'LANTU FS1098 Fuel/Water Separator (5319680)',
      uz: 'LANTU FS1098 yoqilg‘i/suv separatori (5319680)',
    },
  },
  {
    id: 'fleetguard-fs19732-fuel-water-separator',
    sku: 'FS19732',
    brand: 'Fleetguard',
    category: 'fuel-systems',
    cross: ['3973233'],
    photos: [84],
    featured: true,
    name: {
      ru: 'Сепаратор топливный Fleetguard FS19732 (Cummins 3973233)',
      en: 'Fleetguard FS19732 Fuel/Water Separator (Cummins 3973233)',
      uz: 'Fleetguard FS19732 yoqilg‘i/suv separatori (Cummins 3973233)',
    },
  },

  // ── Топливные фильтры / Fuel filters ─────────────────────────
  {
    id: 'lantu-wk962-7-fuel-filter-vg1560080012',
    sku: 'WK962/7',
    brand: 'LANTU',
    category: 'fuel-systems',
    cross: ['VG1560080012', '20805349'],
    photos: [16, 17, 18],
    featured: true,
    name: {
      ru: 'Фильтр топливный LANTU WK962/7 (VG1560080012) HOWO',
      en: 'LANTU WK962/7 Fuel Filter (VG1560080012) HOWO',
      uz: 'LANTU WK962/7 yoqilg‘i filtri (VG1560080012) HOWO',
    },
  },
  {
    id: 'biao-meng-cx0706l-fuel-filter',
    sku: 'CX0706L',
    brand: 'BIAO MENG',
    category: 'fuel-systems',
    cross: ['8-94448984-1'],
    photos: [19, 20, 21, 22],
    featured: false,
    name: {
      ru: 'Фильтр топливный BIAO MENG CX0706L (Isuzu 8-94448984-1)',
      en: 'BIAO MENG CX0706L Fuel Filter (Isuzu 8-94448984-1)',
      uz: 'BIAO MENG CX0706L yoqilg‘i filtri (Isuzu 8-94448984-1)',
    },
  },
  {
    id: 'hengst-e422kp-d98-fuel-filter',
    sku: 'E422KP D98',
    brand: 'Hengst',
    category: 'fuel-systems',
    cross: ['0168 250 000', 'P785378', 'FF8899', 'KX 191/1D', 'PU 1058 x'],
    photos: [23, 24, 25, 26, 29],
    featured: true,
    name: {
      ru: 'Фильтр топливный Hengst E422KP D98 (картридж)',
      en: 'Hengst E422KP D98 Fuel Filter (cartridge)',
      uz: 'Hengst E422KP D98 yoqilg‘i filtri (kartrij)',
    },
  },
  {
    id: 'hyundai-11e1-70240se-fuel-filter',
    sku: '11E1-70240SE',
    brand: 'Hyundai',
    category: 'fuel-systems',
    cross: ['SE17 W07A17A1'],
    photos: [31],
    featured: false,
    name: {
      ru: 'Фильтр топливный Hyundai 11E1-70240SE',
      en: 'Hyundai 11E1-70240SE Fuel Filter',
      uz: 'Hyundai 11E1-70240SE yoqilg‘i filtri',
    },
  },
  {
    id: 'hyundai-11e1-70210se-fuel-filter',
    sku: '11E1-70210SE',
    brand: 'Hyundai',
    category: 'fuel-systems',
    cross: [],
    photos: [32, 33],
    featured: true,
    name: {
      ru: 'Фильтр топливный Hyundai 11E1-70210SE (с отстойником)',
      en: 'Hyundai 11E1-70210SE Fuel Filter (with water trap)',
      uz: 'Hyundai 11E1-70210SE yoqilg‘i filtri (suv tortgichli)',
    },
  },
  {
    id: 'lantu-fs1000-fuel-filter-3329289',
    sku: 'FS1000',
    brand: 'LANTU',
    category: 'fuel-systems',
    cross: ['3329289'],
    photos: [37, 38, 39],
    featured: false,
    name: {
      ru: 'Фильтр топливный LANTU FS1000 (3329289)',
      en: 'LANTU FS1000 Fuel Filter (3329289)',
      uz: 'LANTU FS1000 yoqilg‘i filtri (3329289)',
    },
  },
  {
    id: 'komatsu-600-311-8321-fuel-filter',
    sku: '600-311-8321',
    brand: 'Komatsu',
    category: 'fuel-systems',
    cross: [],
    photos: [40, 41],
    featured: true,
    name: {
      ru: 'Фильтр топливный Komatsu 600-311-8321',
      en: 'Komatsu 600-311-8321 Fuel Filter',
      uz: 'Komatsu 600-311-8321 yoqilg‘i filtri',
    },
  },
  {
    id: 'lantudongli-l6500-1105240-fuel-filter',
    sku: 'L6500-1105240',
    brand: 'LANTUDONGLI',
    category: 'fuel-systems',
    cross: ['FS36235', 'K6000-1105240KSI', 'D5010224734', 'D000-305-02+A', 'S00022297+1'],
    photos: [42],
    featured: false,
    name: {
      ru: 'Фильтр топливный LANTUDONGLI L6500-1105240 (FS36235)',
      en: 'LANTUDONGLI L6500-1105240 Fuel Filter (FS36235)',
      uz: 'LANTUDONGLI L6500-1105240 yoqilg‘i filtri (FS36235)',
    },
  },
  {
    id: 'lantudongli-cx1017-fuel-filter-vg1540080211',
    sku: 'CX1017',
    brand: 'LANTUDONGLI',
    category: 'fuel-systems',
    cross: ['G5800-1105240C', 'VG1540080211', 'L6500-1105350'],
    photos: [43, 44],
    featured: false,
    name: {
      ru: 'Фильтр топливный LANTUDONGLI CX1017 (VG1540080211)',
      en: 'LANTUDONGLI CX1017 Fuel Filter (VG1540080211)',
      uz: 'LANTUDONGLI CX1017 yoqilg‘i filtri (VG1540080211)',
    },
  },
  {
    id: 'isuzu-8983129180-fuel-filter-dual-element',
    sku: '8-98312918-0',
    brand: 'Isuzu',
    category: 'fuel-systems',
    cross: ['8983129180'],
    photos: [75, 76, 77],
    featured: true,
    name: {
      ru: 'Фильтр топливный Isuzu 8-98312918-0 Dual Element',
      en: 'Isuzu 8-98312918-0 Fuel Filter Dual Element',
      uz: 'Isuzu 8-98312918-0 yoqilg‘i filtri Dual Element',
    },
  },
  {
    id: 'sany-d07c4-8-8-1-2-filter',
    sku: 'D07C4.8.8.1-2',
    brand: 'SANY',
    category: 'fuel-systems',
    cross: [],
    photos: [80],
    featured: false,
    name: {
      ru: 'Фильтр SANY D07C4.8.8.1-2',
      en: 'SANY D07C4.8.8.1-2 Filter',
      uz: 'SANY D07C4.8.8.1-2 filtri',
    },
  },
  {
    id: 'sany-60265683-fuel-filter',
    sku: '60265683',
    brand: 'SANY',
    category: 'fuel-systems',
    cross: [],
    photos: [81, 82, 83],
    featured: true,
    name: {
      ru: 'Фильтр топливный SANY 60265683',
      en: 'SANY 60265683 Fuel Filter',
      uz: 'SANY 60265683 yoqilg‘i filtri',
    },
  },
  {
    id: 'lantu-ff5052-fuel-filter',
    sku: 'FF5052',
    brand: 'LANTU',
    category: 'fuel-systems',
    cross: ['6732-71-6110', '1117N-010', '3931063'],
    photos: [85, 86, 87],
    featured: false,
    name: {
      ru: 'Фильтр топливный LANTU FF5052 (Komatsu 6732-71-6110)',
      en: 'LANTU FF5052 Fuel Filter (Komatsu 6732-71-6110)',
      uz: 'LANTU FF5052 yoqilg‘i filtri (Komatsu 6732-71-6110)',
    },
  },
  {
    id: 'lantu-fs36247-fuel-filter',
    sku: 'FS36247',
    brand: 'LANTU',
    category: 'fuel-systems',
    cross: ['FS36275', 'FSP0103', '90FG026', '5301449', 'PL271'],
    photos: [90, 91, 94, 95],
    featured: true,
    name: {
      ru: 'Фильтр топливный LANTU FS36247',
      en: 'LANTU FS36247 Fuel Filter',
      uz: 'LANTU FS36247 yoqilg‘i filtri',
    },
  },

  // ── Масляные фильтры / Oil filters ───────────────────────────
  {
    id: 'hengst-e422h-d86-oil-filter',
    sku: 'E422H D86',
    brand: 'Hengst',
    category: 'filters',
    cross: ['794 130 000', 'P550820', 'LF16244', 'OX 425 D', 'HU 13 125 x', '20IV12503-0061'],
    photos: [8, 9, 10, 30],
    featured: true,
    name: {
      ru: 'Фильтр масляный Hengst E422H D86 ENERGETIC',
      en: 'Hengst E422H D86 ENERGETIC Oil Filter',
      uz: 'Hengst E422H D86 ENERGETIC moy filtri',
    },
  },
  {
    id: 'hengst-201v12503-0051-oil-filter',
    sku: '201V12503-0051',
    brand: 'Hengst / MANN',
    category: 'filters',
    cross: ['91MF2201'],
    photos: [45],
    featured: false,
    name: {
      ru: 'Картридж фильтра Hengst 201V12503-0051 (91MF2201)',
      en: 'Hengst 201V12503-0051 Filter Cartridge (91MF2201)',
      uz: 'Hengst 201V12503-0051 filtr kartriji (91MF2201)',
    },
  },
  {
    id: 'yanmar-119005-35151-oil-filter',
    sku: '119005-35151',
    brand: 'Yanmar',
    category: 'filters',
    cross: [],
    photos: [27, 28],
    featured: false,
    name: {
      ru: 'Фильтр масляный Yanmar 119005-35151',
      en: 'Yanmar 119005-35151 Oil Filter',
      uz: 'Yanmar 119005-35151 moy filtri',
    },
  },
  {
    id: 'zf-0750-131-053-oil-filter',
    sku: '0750 131 053',
    brand: 'ZF',
    category: 'filters',
    cross: [],
    photos: [34, 35, 36],
    featured: true,
    name: {
      ru: 'Фильтр масляный ZF 0750 131 053 (КПП)',
      en: 'ZF 0750 131 053 Oil Filter (transmission)',
      uz: 'ZF 0750 131 053 moy filtri (KPP)',
    },
  },
  {
    id: 'cnhtc-300080079-oil-filter-element',
    sku: '300080079',
    brand: 'CNHTC (Sinotruk)',
    category: 'filters',
    cross: [],
    photos: [55, 56, 57, 58, 59],
    featured: true,
    name: {
      ru: 'Элемент фильтра масляного CNHTC Steyr 300080079 (с прокладкой)',
      en: 'CNHTC Steyr 300080079 Oil Filter Element (with gasket)',
      uz: 'CNHTC Steyr 300080079 moy filtri elementi (prokladka bilan)',
    },
  },
  {
    id: 'stal-st11356-oil-filter',
    sku: 'ST11356',
    brand: 'STAL',
    category: 'filters',
    cross: ['26312-83C10', 'P502444', 'ST1'],
    photos: [60, 61],
    featured: false,
    name: {
      ru: 'Фильтр масляный STAL ST11356 (26312-83C10)',
      en: 'STAL ST11356 Oil Filter (26312-83C10)',
      uz: 'STAL ST11356 moy filtri (26312-83C10)',
    },
  },
  {
    id: 'sdlg-60151839-oil-filter',
    sku: '60151839',
    brand: 'SDLG',
    category: 'filters',
    cross: ['4679981', '4719920'],
    photos: [65, 66, 67],
    featured: false,
    name: {
      ru: 'Фильтр масляный SDLG 60151839 (картридж)',
      en: 'SDLG 60151839 Oil Filter (cartridge)',
      uz: 'SDLG 60151839 moy filtri (kartrij)',
    },
  },
  {
    id: 'yuchai-640-1012210-99-oil-filter',
    sku: '640-1012210-99',
    brand: 'Yuchai',
    category: 'filters',
    cross: ['JX1018B'],
    photos: [69],
    featured: false,
    name: {
      ru: 'Фильтр масляный Yuchai 640-1012210-99 (JX1018B)',
      en: 'Yuchai 640-1012210-99 Oil Filter (JX1018B)',
      uz: 'Yuchai 640-1012210-99 moy filtri (JX1018B)',
    },
  },
  {
    id: 'yuchai-640-1012240-oil-filter',
    sku: '640-1012240',
    brand: 'Yuchai',
    category: 'filters',
    cross: ['937'],
    photos: [70],
    featured: false,
    name: {
      ru: 'Фильтр масляный Yuchai 640-1012240',
      en: 'Yuchai 640-1012240 Oil Filter',
      uz: 'Yuchai 640-1012240 moy filtri',
    },
  },
  {
    id: 'doosan-400508-00082-oil-filter',
    sku: '400508-00082',
    brand: 'Doosan',
    category: 'filters',
    cross: [],
    photos: [71, 72, 73, 74],
    featured: true,
    name: {
      ru: 'Фильтр масляный Doosan 400508-00082',
      en: 'Doosan 400508-00082 Oil Filter',
      uz: 'Doosan 400508-00082 moy filtri',
    },
  },
  {
    id: 'shantui-16y-60-13000-element',
    sku: '16Y-60-13000',
    brand: 'Shantui',
    category: 'filters',
    cross: [],
    photos: [11],
    featured: false,
    name: {
      ru: 'Фильтроэлемент Shantui 16Y-60-13000',
      en: 'Shantui 16Y-60-13000 Filter Element',
      uz: 'Shantui 16Y-60-13000 filtr elementi',
    },
  },
  {
    id: 'spin-on-oil-filter-unmarked',
    sku: '—',
    brand: 'GAB',
    category: 'filters',
    cross: [],
    photos: [51, 52],
    featured: false,
    name: {
      ru: 'Фильтр масляный навинчиваемый (spin-on)',
      en: 'Spin-on Oil Filter',
      uz: 'Spin-on moy filtri',
    },
  },

  // ── Гидравлика / Hydraulic filters ───────────────────────────
  {
    id: 'stal-st30628-hydraulic-oil-filter',
    sku: 'ST30628',
    brand: 'STAL',
    category: 'hydraulics',
    cross: ['31N8-01360', '31E9-0126', '14524170'],
    photos: [5, 6, 7, 62, 63, 64],
    featured: true,
    name: {
      ru: 'Фильтр гидравлический STAL ST30628 (Sumitomo 60/135)',
      en: 'STAL ST30628 Hydraulic Oil Filter (Sumitomo 60/135)',
      uz: 'STAL ST30628 gidravlika moy filtri (Sumitomo 60/135)',
    },
  },
  {
    id: 'cat-093-7521-hydraulic-oil-filter',
    sku: '093-7521',
    brand: 'Caterpillar',
    category: 'hydraulics',
    cross: ['D01M08Y16P476'],
    photos: [13, 14, 15],
    featured: true,
    name: {
      ru: 'Фильтр гидравлический CAT 093-7521 Advanced High Efficiency',
      en: 'CAT 093-7521 Hydraulic Oil Filter, Advanced High Efficiency',
      uz: 'CAT 093-7521 gidravlika moy filtri, Advanced High Efficiency',
    },
  },
  {
    id: 'donaldson-p566272-hydraulic-filter',
    sku: 'P566272',
    brand: 'Donaldson',
    category: 'hydraulics',
    cross: ['P566272-016-140'],
    photos: [88, 89, 92, 93],
    featured: true,
    name: {
      ru: 'Фильтр гидравлический Donaldson P566272 (USA)',
      en: 'Donaldson P566272 Hydraulic Filter (Made in USA)',
      uz: 'Donaldson P566272 gidravlika filtri (USA)',
    },
  },
  {
    id: 'hydraulic-suction-filter-flange',
    sku: '—',
    brand: 'GAB',
    category: 'hydraulics',
    cross: [],
    photos: [46, 47],
    featured: false,
    name: {
      ru: 'Фильтр гидравлический всасывающий с фланцем',
      en: 'Hydraulic Suction Filter with Flange',
      uz: 'Flanetsli gidravlika so‘rish filtri',
    },
  },
  {
    id: 'hydraulic-element-mesh',
    sku: '—',
    brand: 'GAB',
    category: 'hydraulics',
    cross: [],
    photos: [53, 54, 97],
    featured: false,
    name: {
      ru: 'Фильтроэлемент гидравлический сетчатый',
      en: 'Hydraulic Filter Element, Wire Mesh',
      uz: 'To‘rli gidravlika filtr elementi',
    },
  },
  {
    id: 'hydraulic-element-perforated',
    sku: '—',
    brand: 'GAB',
    category: 'hydraulics',
    cross: [],
    photos: [12, 68, 96],
    featured: false,
    name: {
      ru: 'Фильтроэлемент гидравлический в перфорированном корпусе',
      en: 'Hydraulic Filter Element, Perforated Housing',
      uz: 'Perforatsiyali korpusli gidravlika filtr elementi',
    },
  },
]

const CAT_DESC = {
  'fuel-systems': {
    ru: 'Топливный фильтр для дизельной техники. Защищает ТНВД и форсунки от воды и механических примесей.',
    en: 'Fuel filter for diesel machinery. Protects the injection pump and injectors from water and contaminants.',
    uz: 'Dizel texnika uchun yoqilg‘i filtri. TNVD va forsunkalarni suv va aralashmalardan himoya qiladi.',
  },
  filters: {
    ru: 'Масляный фильтр для двигателей спецтехники и грузовиков. Обеспечивает чистоту масла и ресурс двигателя.',
    en: 'Oil filter for heavy-equipment and truck engines. Keeps oil clean and extends engine life.',
    uz: 'Maxsus texnika va yuk mashina dvigatellari uchun moy filtri. Moy tozaligi va dvigatel resursini ta’minlaydi.',
  },
  hydraulics: {
    ru: 'Гидравлический фильтр для экскаваторов, погрузчиков и самосвалов. Защищает насосы и гидрораспределители.',
    en: 'Hydraulic filter for excavators, loaders and dump trucks. Protects pumps and control valves.',
    uz: 'Ekskavator, pogruzchik va samosvallar uchun gidravlika filtri. Nasos va gidrotaqsimlagichlarni himoya qiladi.',
  },
}

export const products = P.map((p) => {
  const images = gallery(...p.photos)
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    brand: p.brand,
    category: p.category,
    cross: p.cross,
    image: images[0],
    images,
    price: 0, // narx yo'q → saytda "So'rov bo'yicha"
    stock: 100, // saytda "100+ в наличии" ko'rinadi
    rating: 4.8,
    reviews: 0,
    featured: p.featured,
    desc: CAT_DESC[p.category],
    search: [p.sku, p.brand, p.name.ru, p.name.en, p.name.uz, ...(p.cross || [])]
      .join(' ')
      .toLowerCase(),
  }
})

export default products
