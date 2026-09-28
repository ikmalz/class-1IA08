import { Search, CalendarDays } from 'lucide-react'

const dummyTasks = [
  {
    id: 1,
    subject: 'Pemrograman Web',
    title: 'Membuat REST API',
    deadline: '30 September 2026',
  },
  {
    id: 2,
    subject: 'Basis Data',
    title: 'Normalisasi Database',
    deadline: '2 Oktober 2026',
  },
  {
    id: 3,
    subject: 'UI/UX',
    title: 'Membuat Prototype Figma',
    deadline: '4 Oktober 2026',
  },
]

function Tasks() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div>
          <p className="text-sm font-semibold text-blue-600">
            CLASS HUB
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Daftar Tugas
          </h1>

          <p className="mt-2 text-slate-500">
            Semua tugas yang diberikan untuk kelas.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8">
          <div className="relative max-w-xl">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Cari tugas atau mata kuliah..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        {/* Tasks */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dummyTasks.map((task) => (
            <article
              key={task.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {task.subject}
                </span>
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {task.title}
              </h2>

              <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={17} />
                Deadline: {task.deadline}
              </div>

              <a
                href={`/tugas/${task.id}`}
                className="mt-5 block text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Lihat detail →
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Tasks