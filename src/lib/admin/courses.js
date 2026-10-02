import { supabase } from '@/lib/supabaseClient'

export async function fetchAdminCourses() {
  const { data, error } = await supabase
    .from('mata_kuliah')
    .select('id, nama, kode, aktif, created_at')
    .order('nama', { ascending: true })

  if (error) {
    console.error('Error fetching admin courses:', error)
    return { data: null, error }
  }

  return { data: data ?? [], error: null }
}

export async function createCourse({ nama, kode, aktif = true }) {
  if (!nama?.trim()) {
    return { data: null, error: new Error('Nama mata kuliah harus diisi') }
  }

  const { data, error } = await supabase
    .from('mata_kuliah')
    .insert([
      {
        nama: nama.trim(),
        kode: kode?.trim() ? kode.trim().toUpperCase() : null,
        aktif: Boolean(aktif),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating course:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function updateCourse(id, { nama, kode, aktif }) {
  if (!id) return { data: null, error: new Error('ID mata kuliah diperlukan') }

  const payload = {}
  if (nama !== undefined) payload.nama = nama.trim()
  if (kode !== undefined) payload.kode = kode?.trim() ? kode.trim().toUpperCase() : null
  if (aktif !== undefined) payload.aktif = Boolean(aktif)

  const { data, error } = await supabase
    .from('mata_kuliah')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating course ${id}:`, error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function toggleCourseStatus(id, currentAktif) {
  return updateCourse(id, { aktif: !currentAktif })
}

export async function deleteCourse(id) {
  if (!id) return { error: new Error('ID mata kuliah diperlukan') }

  // Check if course is referenced by any tasks first
  const { data: relatedTasks, error: checkError } = await supabase
    .from('tugas')
    .select('id')
    .eq('mata_kuliah_id', id)
    .limit(1)

  if (checkError) {
    console.error('Error checking related tasks:', checkError)
  }

  if (relatedTasks && relatedTasks.length > 0) {
    return {
      error: new Error('Mata kuliah masih digunakan oleh data tugas dan belum dapat dihapus.')
    }
  }

  const { error } = await supabase
    .from('mata_kuliah')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting course ${id}:`, error)
    // Catch foreign key error code 23503 from Postgres
    if (error.code === '23503' || error.message?.includes('foreign key')) {
      return {
        error: new Error('Mata kuliah masih digunakan oleh data tugas dan belum dapat dihapus.')
      }
    }
    return { error: new Error('Gagal menghapus mata kuliah. Silakan coba lagi.') }
  }

  return { error: null }
}
