import { useEffect, useRef, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * Raqamni 0 dan `to` gacha silliq sanaydi (element ekranga kirganda).
 * prefers-reduced-motion yoqilgan bo'lsa — animatsiyasiz, darrov
 * yakuniy qiymat ko'rsatiladi.
 */
export default function CountUp({ to, decimals = 0, suffix = '', duration = 1600, delay = 0 }) {
  const ref = useRef(null)
  // Boshlang'ich qiymat: reduced-motion bo'lsa darrov yakuniy son
  const [value, setValue] = useState(() => (prefersReduced() ? to : 0))

  useEffect(() => {
    if (prefersReduced()) return
    const el = ref.current
    if (!el) return

    let raf = 0
    let started = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return
        started = true
        observer.unobserve(el)

        const start = performance.now() + delay
        const tick = (now) => {
          const t = Math.min(1, Math.max(0, (now - start) / duration))
          // easeOutExpo — tez boshlanib, oxirida sekinlashadi
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
          setValue(to * eased)
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [to, duration, delay])

  return <span ref={ref}>{value.toFixed(decimals)}{suffix}</span>
}
