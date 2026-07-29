import { createContext, useContext, useEffect, useState } from 'react'

/*
 * ─────────────────────────────────────────────────────────────
 *  SAVAT (korzina)
 *
 *  Saytda narx yo'q ("По запросу"), shuning uchun savat = SO'ROV
 *  RO'YXATI. Foydalanuvchi kerakli qismlarni yig'adi, keyin bitta
 *  so'rov bo'lib Aloqa formasiga o'tadi.
 *
 *  localStorage'da saqlanadi — sahifa yangilansa ham yo'qolmaydi.
 * ─────────────────────────────────────────────────────────────
 */

const CartContext = createContext()
const KEY = 'gab-cart'

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(read)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* privat rejim */ }
  }, [items])

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === product.id)
      if (i !== -1) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      }
      return [
        ...prev,
        {
          id: product.id,
          sku: product.sku,
          name: product.name,     // { ru, en, uz } — tl() bilan ko'rsatiladi
          image: product.image,
          brand: product.brand,
          category: product.category,
          qty,
        },
      ]
    })
  }

  const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id))

  const setQty = (id, qty) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)))

  const clear = () => setItems([])

  const count = items.reduce((sum, x) => sum + x.qty, 0)
  const has = (id) => items.some((x) => x.id === id)

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count, has }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
