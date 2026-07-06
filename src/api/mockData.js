/*
 * ─────────────────────────────────────────────────────────────
 *  MOCK DATA — placeholder catalog
 *
 *  This is the ONLY place product/category data is defined in the
 *  front-end. Pages never hardcode products; they call the API
 *  layer in `client.js`, which falls back to this data when the
 *  real backend (/api/...) is not yet available.
 *
 *  When the backend is ready, the live endpoints will be used
 *  automatically and this file can be deleted.
 * ─────────────────────────────────────────────────────────────
 */

export const categories = [
  { id: 'engine',       name: 'Engine Parts',  icon: 'engine',       count: 482, blurb: 'Pistons, gaskets, turbochargers & core components.' },
  { id: 'transmission', name: 'Transmission',  icon: 'transmission', count: 263, blurb: 'Clutches, gearboxes, shafts & drivetrain.' },
  { id: 'suspension',   name: 'Suspension',    icon: 'suspension',   count: 311, blurb: 'Air springs, shocks, bushings & control arms.' },
  { id: 'brakes',       name: 'Brakes',        icon: 'brakes',       count: 198, blurb: 'Discs, drums, pads, calipers & ABS modules.' },
  { id: 'electrical',   name: 'Electrical',    icon: 'electrical',   count: 354, blurb: 'Alternators, starters, sensors & wiring.' },
  { id: 'filters',      name: 'Filters',       icon: 'filters',      count: 176, blurb: 'Oil, fuel, air & cabin filtration systems.' },
]

const img = (seed) => `https://picsum.photos/seed/${seed}/800/600?grayscale`

export const products = [
  { id: 'p-1001', name: 'Heavy-Duty Turbocharger HX55', category: 'engine',       price: 1480, sku: 'GAB-ENG-55HX', rating: 4.9, reviews: 128, brand: 'GAB OEM', stock: 24, featured: true,  image: img('turbo'),       desc: 'Precision-balanced turbocharger engineered for long-haul diesel engines, delivering optimal boost and thermal endurance under continuous load.' },
  { id: 'p-1002', name: 'Cylinder Head Gasket Set',     category: 'engine',       price: 240,  sku: 'GAB-ENG-HG12', rating: 4.7, reviews: 86,  brand: 'GAB OEM', stock: 140, featured: false, image: img('gasket'),      desc: 'Multi-layer steel gasket kit with reinforced fire rings for a leak-free, high-compression seal across the cylinder bank.' },
  { id: 'p-1003', name: 'Clutch Kit 430mm Pull-Type',   category: 'transmission', price: 620,  sku: 'GAB-TRN-430P', rating: 4.8, reviews: 64,  brand: 'GAB Pro', stock: 38,  featured: true,  image: img('clutch'),      desc: 'Complete heavy-vehicle clutch assembly with organic facing, pressure plate and release bearing for smooth high-torque engagement.' },
  { id: 'p-1004', name: 'Synchromesh Gearbox Bearing',  category: 'transmission', price: 95,   sku: 'GAB-TRN-BR07', rating: 4.6, reviews: 41,  brand: 'GAB Pro', stock: 210, featured: false, image: img('bearing'),     desc: 'Hardened tapered roller bearing built to withstand sustained drivetrain stress and elevated operating temperatures.' },
  { id: 'p-1005', name: 'Air Suspension Spring Bellow', category: 'suspension',   price: 178,  sku: 'GAB-SUS-AS21', rating: 4.8, reviews: 73,  brand: 'GAB OEM', stock: 96,  featured: true,  image: img('airspring'),   desc: 'Reinforced rubber air spring providing a stable, load-adaptive ride for trailers and heavy axles.' },
  { id: 'p-1006', name: 'Front Shock Absorber Pair',    category: 'suspension',   price: 320,  sku: 'GAB-SUS-SA09', rating: 4.7, reviews: 58,  brand: 'GAB Pro', stock: 64,  featured: false, image: img('shock'),       desc: 'Twin-tube gas shock absorbers tuned for cab comfort and chassis control on rough terrain.' },
  { id: 'p-1007', name: 'Brake Disc Ventilated 430mm',  category: 'brakes',       price: 210,  sku: 'GAB-BRK-D43V', rating: 4.9, reviews: 112, brand: 'GAB OEM', stock: 120, featured: true,  image: img('brakedisc'),   desc: 'Ventilated cast-iron brake disc engineered for rapid heat dissipation and consistent stopping power under heavy braking.' },
  { id: 'p-1008', name: 'Heavy Truck Brake Pad Set',    category: 'brakes',       price: 130,  sku: 'GAB-BRK-PD18', rating: 4.6, reviews: 90,  brand: 'GAB Pro', stock: 300, featured: false, image: img('brakepad'),    desc: 'Low-dust ceramic-composite brake pads delivering quiet, fade-resistant performance and extended service life.' },
  { id: 'p-1009', name: '24V Heavy-Duty Alternator',    category: 'electrical',   price: 410,  sku: 'GAB-ELC-AL24', rating: 4.8, reviews: 77,  brand: 'GAB OEM', stock: 52,  featured: true,  image: img('alternator'),  desc: 'High-output 24V alternator with sealed bearings, designed for reliable charging in demanding commercial duty cycles.' },
  { id: 'p-1010', name: 'Starter Motor 6.5kW',          category: 'electrical',   price: 365,  sku: 'GAB-ELC-ST65', rating: 4.7, reviews: 49,  brand: 'GAB Pro', stock: 70,  featured: false, image: img('starter'),     desc: 'Gear-reduction starter motor providing strong cold-cranking torque for large-displacement diesel engines.' },
  { id: 'p-1011', name: 'Spin-On Oil Filter LF9009',    category: 'filters',      price: 28,   sku: 'GAB-FLT-LF90', rating: 4.9, reviews: 204, brand: 'GAB OEM', stock: 540, featured: true,  image: img('oilfilter'),   desc: 'High-efficiency spin-on oil filter with anti-drain-back valve protecting the engine during cold starts.' },
  { id: 'p-1012', name: 'Fuel/Water Separator Filter',  category: 'filters',      price: 46,   sku: 'GAB-FLT-FS33', rating: 4.8, reviews: 156, brand: 'GAB Pro', stock: 420, featured: false, image: img('fuelfilter'),  desc: 'Two-stage fuel filter with integrated water separation to safeguard injectors and the fuel system.' },
]
