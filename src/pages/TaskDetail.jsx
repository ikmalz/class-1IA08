import { ArrowLeft, CalendarDays, Clock3 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

function TaskDetail() {
  const { id } = useParams()

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">

        <Link
          to="/tugas"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Kembali ke tugas
        </Link>

        <article className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">

          <div className="p-6 sm:p-8">
            <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Pemrograman Web
            </span>

            <h1 className="mt-5 text-3xl font-bold text-slate-900">
              Membuat REST API
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              Buat sebuah REST API menggunakan Express.js dengan menerapkan
              struktur endpoint yang telah dipelajari di kelas.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays size={17} />
                  Tanggal tugas
                </div>

                <p className="mt-2 font-semibold text-slate-900">
                  28 September 2026
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 size={17} />
                  Deadline
                </div>

                <p className="mt-2 font-semibold text-slate-900">
                  30 September 2026
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 p-6 sm:p-8">
            <h2 className="font-bold text-slate-900">
              Lampiran Tugas
            </h2>

            <div className="mt-4 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
              <p className="text-sm text-slate-400">
                Foto tugas akan muncul di sini.
              </p>
            </div>
          </div>

        </article>

        <p className="mt-4 text-center text-xs text-slate-400">
          Task ID: {id}
        </p>
      </div>
    </main>
  )
}

export default TaskDetail