function Announcements() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">

        <p className="text-sm font-semibold text-blue-600">
          CLASS HUB
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Pengumuman
        </h1>

        <p className="mt-2 text-slate-500">
          Informasi terbaru untuk seluruh anggota kelas.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-medium text-slate-400">
            28 September 2026
          </p>

          <h2 className="mt-2 text-lg font-bold text-slate-900">
            Selamat datang di Class Hub
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Website ini digunakan untuk memudahkan seluruh anggota kelas
            melihat tugas dan informasi terbaru.
          </p>
        </div>

      </div>
    </main>
  )
}

export default Announcements