import { supabase } from '@/lib/supabaseClient'

const BUCKET = 'tugas-foto'

const FOTO_SELECT = 'id, file_name, file_size, mime_type, storage_path'

// URL publik untuk menampilkan gambar/berkas
export function getAttachmentUrl(storagePath) {
  if (!storagePath) return null
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

// Upload file ke Storage + simpan metadata ke tabel tugas_foto
async function uploadAttachments(taskId, files) {
  const uploaded = []
  const failed = []

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${taskId}/${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      failed.push(file.name)
      continue
    }

    const { data: row, error: insertError } = await supabase
      .from('tugas_foto')
      .insert({
        tugas_id: taskId,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: path,
      })
      .select(FOTO_SELECT)
      .single()

    if (insertError) {
      console.error('Error saving attachment record:', insertError)
      // rollback file di storage supaya tidak jadi file yatim
      await supabase.storage.from(BUCKET).remove([path])
      failed.push(file.name)
      continue
    }

    uploaded.push(row)
  }

  return { uploaded, failed }
}

function buildWarning(failed) {
  return failed.length > 0
    ? `Sebagian berkas gagal diunggah: ${failed.join(', ')}`
    : null
}

export async function createTask({ mata_kuliah_id, tanggal_tugas, catatan, files = [] }) {
  if (!mata_kuliah_id || !tanggal_tugas) {
    return { data: null, error: new Error('Mata kuliah dan tanggal tugas harus diisi') }
  }

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
      id, mata_kuliah_id, tanggal_tugas, catatan, created_at,
      mata_kuliah ( id, nama, kode, aktif )
    `)
    .single()

  if (taskError) {
    console.error('Error creating task:', taskError)
    return { data: null, error: taskError }
  }

  let uploaded = []
  let warning = null
  if (files.length > 0) {
    const result = await uploadAttachments(task.id, files)
    uploaded = result.uploaded
    warning = buildWarning(result.failed)
  }

  return { data: { ...task, tugas_foto: uploaded }, error: null, warning }
}

export async function updateTask(id, { mata_kuliah_id, tanggal_tugas, catatan, files = [] }) {
  if (!id) return { data: null, error: new Error('ID tugas diperlukan') }

  const payload = { updated_at: new Date().toISOString() }
  if (mata_kuliah_id !== undefined) payload.mata_kuliah_id = Number(mata_kuliah_id)
  if (tanggal_tugas !== undefined) payload.tanggal_tugas = tanggal_tugas
  if (catatan !== undefined) payload.catatan = catatan?.trim() ? catatan.trim() : null

  const { data: task, error: taskError } = await supabase
    .from('tugas')
    .update(payload)
    .eq('id', id)
    .select(`
      id, mata_kuliah_id, tanggal_tugas, catatan, created_at, updated_at,
      mata_kuliah ( id, nama, kode, aktif ),
      tugas_foto ( id, file_name, file_size, mime_type, storage_path )
    `)
    .single()

  if (taskError) {
    console.error(`Error updating task ${id}:`, taskError)
    return { data: null, error: taskError }
  }

  let warning = null
  let result = task
  if (files.length > 0) {
    const { uploaded, failed } = await uploadAttachments(id, files)
    warning = buildWarning(failed)
    result = { ...task, tugas_foto: [...(task.tugas_foto || []), ...uploaded] }
  }

  return { data: result, error: null, warning }
}

export async function deleteTask(id) {
  if (!id) return { error: new Error('ID tugas diperlukan') }

  // 1. Ambil path file lalu hapus dari Storage
  const { data: fotos } = await supabase
    .from('tugas_foto')
    .select('storage_path')
    .eq('tugas_id', id)

  const paths = (fotos || []).map((f) => f.storage_path).filter(Boolean)
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths)
    if (storageError) console.error('Error removing files from storage:', storageError)
  }

  // 2. Hapus record lampiran
  const { error: fotoError } = await supabase.from('tugas_foto').delete().eq('tugas_id', id)
  if (fotoError) {
    console.error('Error deleting attachment records:', fotoError)
    return { error: new Error('Gagal menghapus lampiran tugas.') }
  }

  // 3. Hapus tugas
  const { error } = await supabase.from('tugas').delete().eq('id', id)
  if (error) {
    console.error(`Error deleting task ${id}:`, error)
    return { error: new Error('Gagal menghapus tugas. Silakan coba lagi.') }
  }

  return { error: null }
}

export async function deleteAttachment(attachmentId) {
  if (!attachmentId) return { error: new Error('ID lampiran diperlukan') }

  const { data: foto } = await supabase
    .from('tugas_foto')
    .select('storage_path')
    .eq('id', attachmentId)
    .single()

  if (foto?.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([foto.storage_path])
    if (storageError) console.error('Error removing file from storage:', storageError)
  }

  const { error } = await supabase.from('tugas_foto').delete().eq('id', attachmentId)
  if (error) {
    console.error(`Error deleting attachment ${attachmentId}:`, error)
    return { error: new Error('Gagal menghapus data lampiran.') }
  }

  return { error: null }
}