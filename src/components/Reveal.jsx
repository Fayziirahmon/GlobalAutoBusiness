import { useEffect, useRef, useState } from 'react'

/*
 * Scroll-triggered reveal using the Intersection Observer API.
 * Subtle fade-in + slide-up. Honors prefers-reduced-motion via CSS
 * (.reveal rule in index.css). `delay` staggers grouped items.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', style, className = '', ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
