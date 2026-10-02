import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Megaphone,
  BookOpen,
  ClipboardList,
  Paperclip,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import { fetchDashboardMetrics } from '@/lib/admin/dashboard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { formatDateCompact } from '@/lib/announcements'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    async function loadData() {
      const result = await fetchDashboardMetrics()
      if (!ignore) {
        if (result.error) {
          setError(result.error)
        } else {
          setData(result)
        }
        setLoading(false)
      }
    }

    loadData()

    return () => {
      ignore = true
    }
  }, [reloadKey])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setReloadKey((k) => k + 1)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="font-semibold text-destructive">Gagal memuat ringkasan dashboard.</p>
        <p className="mt-1 text-sm text-muted-foreground">Silakan periksa koneksi dan coba lagi.</p>
        <Button onClick={handleRetry} variant="outline" size="sm" className="mt-4 gap-2">
          <RotateCcw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  const { stats, recentAnnouncements, recentTasks } = data || {}

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan konten perkuliahan dan aktivitas akademik Class 1IA08.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pengumuman Aktif */}
        <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pengumuman
            </span>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Megaphone className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats?.activeAnnouncements ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">
              / {stats?.totalAnnouncements ?? 0} total
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Pengumuman aktif ditampilkan di publik
          </p>
        </div>

        {/* Metric 2: Mata Kuliah Aktif */}
        <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mata Kuliah
            </span>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats?.activeCourses ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">
              / {stats?.totalCourses ?? 0} total
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Mata kuliah aktif semester berjalan
          </p>
        </div>

        {/* Metric 3: Total Tugas */}
        <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Tugas
            </span>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats?.totalTasks ?? 0}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Tugas terdata dalam database
          </p>
        </div>

        {/* Metric 4: Lampiran File */}
        <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lampiran
            </span>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Paperclip className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats?.totalAttachments ?? 0}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Berkas & foto terhubung dengan tugas
          </p>
        </div>
      </div>

      {/* Recent Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Pengumuman Terbaru
            </h2>
            <Link
              to="/admin/pengumuman"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <span>Kelola</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!recentAnnouncements || recentAnnouncements.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              Belum ada pengumuman tersimpan.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {recentAnnouncements.map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.judul}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDateCompact(item.tanggal)}
                    </p>
                  </div>
                  <Badge variant={item.aktif ? 'success' : 'secondary'} className="shrink-0 text-[10px]">
                    {item.aktif ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Tugas Terbaru
            </h2>
            <Link
              to="/admin/tugas"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <span>Kelola</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!recentTasks || recentTasks.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              Belum ada data tugas.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {recentTasks.map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.mata_kuliah?.nama || 'Mata Kuliah'}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.catatan || 'Tanpa catatan tambahan'}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {formatDateCompact(item.tanggal_tugas)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard