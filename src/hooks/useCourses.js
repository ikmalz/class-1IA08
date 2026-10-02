import { useState, useEffect, useCallback } from 'react'
import { fetchCourses } from '../lib/courses'

export function useCourses({ limit } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: result, error: err } = await fetchCourses({ limit })

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
      const { data: result, error: err } = await fetchCourses({ limit })
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
