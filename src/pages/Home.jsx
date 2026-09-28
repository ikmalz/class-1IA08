import { ArrowRight, BookOpen, CalendarDays, Clock3 } from 'lucide-react'

function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
              <BookOpen size={16} />
              Class Hub
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Semua tugas kelas,
              <span className="text-blue-600"> dalam satu tempat.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Temukan tugas, deadline, materi informasi, dan pengumuman kelas
              dengan lebih mudah tanpa perlu login.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/tugas"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Lihat Tugas
                <ArrowRight size={18} />
              </a>

              <a
                href="/pengumuman"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Pengumuman
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <BookOpen className="text-blue-600" size={22} />

            <p className="mt-4 text-3xl font-bold text-slate-900">
              0
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Tugas aktif
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <Clock3 className="text-orange-500" size={22} />

            <p className="mt-4 text-3xl font-bold text-slate-900">
              0
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Deadline terdekat
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <CalendarDays className="text-emerald-600" size={22} />

            <p className="mt-4 text-3xl font-bold text-slate-900">
              0
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Pengumuman
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home