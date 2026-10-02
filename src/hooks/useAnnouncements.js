import { useState, useEffect, useCallback } from 'react'
import { fetchAnnouncements } from '../lib/announcements'

export function useAnnouncements({ limit } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    const { data: result, error: err } = await fetchAnnouncements({ limit })
    
    if (err) {
      setError(err)
      setData(null)
    } else {
      setData(result)
    }
    
    setLoading(false)
  }, [limit])

  useEffect(() => {
    let ignore = false

    async function startFetching() {
      const { data: result, error: err } = await fetchAnnouncements({ limit })
      if (!ignore) {
        if (err) {
          setError(err)
          setData(null)
        } else {
          setData(result)
        }
        setLoading(false)
      }
    }

    startFetching()

    return () => {
      ignore = true
    }
  }, [limit])

  return { data, loading, error, refetch: loadData }
}
