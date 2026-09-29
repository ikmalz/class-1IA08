import { useNavigate } from 'react-router-dom'
import { supabase } from '../../src/lib/supabaseClient'

function Dashboard() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              CLASS HUB ADMIN
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Kelola tugas, foto tugas, dan pengumuman kelas.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Tugas
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Mata Kuliah
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Pengumuman
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              0
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard