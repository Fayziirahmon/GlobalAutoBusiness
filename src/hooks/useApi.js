import { useEffect, useState } from 'react'

/*
 * Generic data hook for the API layer. Pass a function that returns
 * a promise (e.g. () => getProducts({ category })). Re-runs whenever
 * an item in `deps` changes and aborts in-flight requests on cleanup.
 *
 * Returns { data, loading, error, reload }.
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetch loading reset
    setLoading(true)
    setError(null)

    Promise.resolve(fetcher({ signal: controller.signal }))
      .then((res) => { if (active) { setData(res); setLoading(false) } })
      .catch((err) => {
        if (err.name === 'AbortError' || !active) return
        setError(err)
        setLoading(false)
      })

    return () => { active = false; controller.abort() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  return { data, loading, error, reload: () => setNonce((n) => n + 1) }
}
