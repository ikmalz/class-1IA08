import { useCallback, useEffect, useState } from 'react'
import { getMateriByCourse } from '@/lib/materi'

export function useMateri(courseId, { month, year } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!courseId) {
      setData([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await getMateriByCourse(courseId, { month, year })
    setData(data)
    setError(error)
    setLoading(false)
  }, [courseId, month, year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}