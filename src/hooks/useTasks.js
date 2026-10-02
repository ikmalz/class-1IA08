import { useState, useEffect, useCallback } from 'react'
import { fetchTasks } from '../lib/tasks'

export function useTasks({ limit, mataKuliahId } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: result, error: err } = await fetchTasks({ limit, mataKuliahId })

    if (err) {
      setError(err)
      setData(null)
    } else {
      setData(result)
    }

    setLoading(false)
  }, [limit, mataKuliahId])

  useEffect(() => {
    let ignore = false

    async function startFetching() {
      const { data: result, error: err } = await fetchTasks({ limit, mataKuliahId })
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
  }, [limit, mataKuliahId])

  return { data, loading, error, refetch: loadData }
}
