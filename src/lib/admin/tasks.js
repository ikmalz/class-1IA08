import { supabase } from '@/lib/supabaseClient'

export async function fetchAdminTasks() {
  const { data, error } = await supabase
    .from('tugas')
    .select(`
      id,
      mata_kuliah_id,
      tanggal_tugas,
      catatan,
      created_at,
      updated_at,
      mata_kuliah (
        id,
        nama,
        kode,
        aktif
      ),
      tugas_foto (
        id,
        file_name,
        file_size,
        mime_type,
        storage_path
      )
    `)
    .order('tanggal_tugas', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin tasks:', error)
    return { data: null, error }
  }

  return { data: data ?? [], error: null }
}

export async function createTask({ mata_kuliah_id, tanggal_tugas, catatan, files = [] }) {
  if (!mata_kuliah_id || !tanggal_tugas) {
    return { data: null, error: new Error('Mata kuliah dan tanggal tugas harus diisi') }
  }

  // 1. Insert task
  const { data: task, error: taskError } = await supabase
    .from('tugas')
    .insert([
      {
        mata_kuliah_id: Number(mata_kuliah_id),
        tanggal_tugas,
        catatan: catatan?.trim() ? catatan.trim() : null,
      },
    ])
    .select(`
      id,
      mata_kuliah_id,
      tanggal_tugas,
      catatan,
      created_at,
      mata_kuliah (
        id,
        nama,
        kode,
        aktif
      )
    `)
    .single()

  if (taskError) {
    console.error('Error creating task:', taskError)
    return { data: null, error: taskError }
  }

  // 2. Handle files if any selected
  let attachmentWarning = null
  if (files && files.length > 0) {
    // Note: Supabase storage bucket name is not yet configured in local repo
    attachmentWarning = 'Tugas berhasil dibuat, namun unggah berkas memerlukan konfigurasi Supabase Storage bucket.'
  }

  return { data: task, error: null, warning: attachmentWarning }
}

export async function updateTask(id, { mata_kuliah_id, tanggal_tugas, catatan, files = [] }) {
  if (!id) return { data: null, error: new Error('ID tugas diperlukan') }

  const payload = {
    updated_at: new Date().toISOString(),
  }

  if (mata_kuliah_id !== undefined) payload.mata_kuliah_id = Number(mata_kuliah_id)
  if (tanggal_tugas !== undefined) payload.tanggal_tugas = tanggal_tugas
  if (catatan !== undefined) payload.catatan = catatan?.trim() ? catatan.trim() : null

  const { data: task, error: taskError } = await supabase
    .from('tugas')
    .update(payload)
    .eq('id', id)
    .select(`
      id,
      mata_kuliah_id,
      tanggal_tugas,
      catatan,
      created_at,
      updated_at,
      mata_kuliah (
        id,
        nama,
        kode,
        aktif
      ),
      tugas_foto (
        id,
        file_name,
        file_size,
        mime_type,
        storage_path
      )
    `)
    .single()

  if (taskError) {
    console.error(`Error updating task ${id}:`, taskError)
    return { data: null, error: taskError }
  }

  let attachmentWarning = null
  if (files && files.length > 0) {
    attachmentWarning = 'Perubahan tugas tersimpan, namun unggah berkas baru memerlukan konfigurasi Supabase Storage bucket.'
  }

  return { data: task, error: null, warning: attachmentWarning }
}

export async function deleteTask(id) {
  if (!id) return { error: new Error('ID tugas diperlukan') }

  // 1. Delete associated tugas_foto records first
  try {
    await supabase.from('tugas_foto').delete().eq('tugas_id', id)
  } catch (err) {
    console.error('Error cleaning up attachments:', err)
  }

  // 2. Delete tugas record
  const { error } = await supabase
    .from('tugas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting task ${id}:`, error)
    return { error: new Error('Gagal menghapus tugas. Silakan coba lagi.') }
  }

  return { error: null }
}

export async function deleteAttachment(attachmentId) {
  if (!attachmentId) return { error: new Error('ID lampiran diperlukan') }

  const { error } = await supabase
    .from('tugas_foto')
    .delete()
    .eq('id', attachmentId)

  if (error) {
    console.error(`Error deleting attachment ${attachmentId}:`, error)
    return { error: new Error('Gagal menghapus data lampiran.') }
  }

  return { error: null }
}
