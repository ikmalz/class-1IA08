import { useState, useEffect, useCallback } from 'react'
import { fetchTaskById } from '../lib/tasks'

export function useTaskDetail(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)

    const { data: result, error: err } = await fetchTaskById(id)

    if (err) {
      setError(err)
      setData(null)
    } else {
      setData(result)
    }

    setLoading(false)
  }, [id])

  useEffect(() => {
    let ignore = false

    async function startFetching() {
      if (!id) {
        setLoading(false)
        return
      }

      setLoading(true)
      const { data: result, error: err } = await fetchTaskById(id)
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
  }, [id])

  return { data, loading, error, refetch: loadData }
}
