import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Contact from './pages/Contact'

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
        <Route path="/shop" element={<Shop />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Navbar />
            <main>
              <AnimatedRoutes />
            </main>
            <Footer />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
