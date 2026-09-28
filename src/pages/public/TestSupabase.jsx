import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

function TestSupabase() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSubjects() {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('mata_kuliah')
        .select('id, nama, kode')
        .eq('aktif', true)
        .order('nama')

      if (error) {
        console.error(error)
        setError(error.message)
      } else {
        setSubjects(data ?? [])
      }

      setLoading(false)
    }

    loadSubjects()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">
          Mengambil data...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">
            Gagal mengambil data
          </p>

          <p className="mt-2 text-sm">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900">
          Test Supabase
        </h1>

        <div className="mt-6 space-y-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="font-semibold text-slate-900">
                {subject.nama}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {subject.kode}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default TestSupabase