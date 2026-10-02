import { supabase } from '@/lib/supabaseClient'

export async function fetchDashboardMetrics() {
  try {
    const [
      announcementsRes,
      coursesRes,
      tasksRes,
      attachmentsRes,
      recentAnnouncementsRes,
      recentTasksRes,
    ] = await Promise.all([
      supabase.from('pengumuman').select('id, aktif', { count: 'exact' }),
      supabase.from('mata_kuliah').select('id, aktif', { count: 'exact' }),
      supabase.from('tugas').select('id', { count: 'exact' }),
      supabase.from('tugas_foto').select('id', { count: 'exact' }),
      supabase
        .from('pengumuman')
        .select('id, judul, tanggal, aktif, created_at')
        .order('tanggal', { ascending: false })
        .limit(3),
      supabase
        .from('tugas')
        .select(`
          id,
          tanggal_tugas,
          catatan,
          mata_kuliah (
            id,
            nama,
            kode
          )
        `)
        .order('tanggal_tugas', { ascending: false })
        .limit(3),
    ])

    const totalAnnouncements = announcementsRes.count ?? announcementsRes.data?.length ?? 0
    const activeAnnouncements = (announcementsRes.data ?? []).filter((a) => a.aktif).length

    const totalCourses = coursesRes.count ?? coursesRes.data?.length ?? 0
    const activeCourses = (coursesRes.data ?? []).filter((c) => c.aktif).length

    const totalTasks = tasksRes.count ?? tasksRes.data?.length ?? 0
    const totalAttachments = attachmentsRes.count ?? attachmentsRes.data?.length ?? 0

    return {
      stats: {
        totalAnnouncements,
        activeAnnouncements,
        totalCourses,
        activeCourses,
        totalTasks,
        totalAttachments,
      },
      recentAnnouncements: recentAnnouncementsRes.data ?? [],
      recentTasks: recentTasksRes.data ?? [],
      error: null,
    }
  } catch (err) {
    console.error('Error fetching dashboard metrics:', err)
    return {
      stats: null,
      recentAnnouncements: [],
      recentTasks: [],
      error: err,
    }
  }
}
