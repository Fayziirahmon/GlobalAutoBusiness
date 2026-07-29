import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Admin from './pages/Admin'
import { recordPageview } from './admin/store'

const ADMIN_PATH = '/ravsfayz'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname, search])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        {/* Kategoriya landing sahifasi — SEO uchun toza URL */}
        <Route path="/catalog/:slug" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path={ADMIN_PATH} element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  )
}

function Shell() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith(ADMIN_PATH)

  // Record a page view on every route change (admin excluded).
  useEffect(() => {
    if (!isAdmin) recordPageview(pathname)
  }, [pathname, isAdmin])

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main>
        <AnimatedRoutes />
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <BrowserRouter>
              <Shell />
            </BrowserRouter>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
