import { Megaphone, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
              <BookOpen size={16} />
              Class 1IA08
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Pusat Informasi
              <span className="text-blue-600"> Kelas 1IA08.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Website resmi untuk mahasiswa Kelas 1IA08. Temukan pengumuman,
              informasi akademik, dan aktivitas kelas dalam satu tempat yang rapi.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/pengumuman"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <Megaphone size={18} />
                Lihat Pengumuman
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Preview or Information could go here */}
    </main>
  )
}

export default Home
