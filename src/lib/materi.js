import { supabase } from '@/lib/supabaseClient'
import { compressImage } from '@/lib/imageCompress'

const BUCKET = 'materi-foto'
const FOTO_SELECT = 'id, materi_id, file_name, file_size, mime_type, storage_path, urutan'
const MATERI_SELECT = `
  id, mata_kuliah_id, tanggal_materi, catatan, created_at,
  materi_foto ( ${FOTO_SELECT} )
`
const MAX_FILE_MB = 10 // batas file asli sebelum dikompres

export function getMateriFotoUrl(storagePath) {
  if (!storagePath) return null
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
}

function sortFoto(materi) {
  return {
    ...materi,
    materi_foto: [...(materi.materi_foto || [])].sort((a, b) => a.urutan - b.urutan),
  }
}

/* ───────────── PUBLIK ───────────── */

// Daftar materi sebuah matkul, terbaru di atas.
// Filter opsional: bulan (1-12) & tahun untuk melihat pembahasan spesifik.
export async function getMateriByCourse(courseId, { month, year } = {}) {
  let q = supabase
    .from('materi_matkul')
    .select(MATERI_SELECT)
    .eq('mata_kuliah_id', Number(courseId))
    .order('tanggal_materi', { ascending: false })

  if (year && month) {
    const m = String(month).padStart(2, '0')
    const next = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`
    q = q.gte('tanggal_materi', `${year}-${m}-01`).lt('tanggal_materi', next)
  }

  const { data, error } = await q
  if (error) {
    console.error('Error fetching materi:', error)
    return { data: [], error }
  }
  return { data: (data || []).map(sortFoto), error: null }
}

/* ───────────── ADMIN ───────────── */

async function uploadFotos(materiId, files, startOrder = 0) {
  const uploaded = []
  const failed = []

  for (let i = 0; i < files.length; i++) {
    const original = files[i]

    if (original.size > MAX_FILE_MB * 1024 * 1024) {
      failed.push(`${original.name} (lebih dari ${MAX_FILE_MB} MB)`)
      continue
    }

    const file = await compressImage(original)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${materiId}/${Date.now()}-${i}-${safeName}`

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false })
    if (upErr) {
      console.error('Error uploading foto materi:', upErr)
      failed.push(original.name)
      continue
    }

    const { data: row, error: insErr } = await supabase
      .from('materi_foto')
      .insert({
        materi_id: materiId,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: path,
        urutan: startOrder + i,
      })
      .select(FOTO_SELECT)
      .single()

    if (insErr) {
      console.error('Error saving foto materi:', insErr)
      await supabase.storage.from(BUCKET).remove([path])
      failed.push(original.name)
      continue
    }
    uploaded.push(row)
  }

  return { uploaded, failed }
}

const warn = (failed) =>
  failed.length ? `Sebagian berkas gagal diunggah: ${failed.join(', ')}` : null

export async function createMateri({ mata_kuliah_id, tanggal_materi, catatan, files = [] }) {
  if (!mata_kuliah_id) return { data: null, error: new Error('Mata kuliah harus dipilih') }
  if (!tanggal_materi) return { data: null, error: new Error('Tanggal dan bulan pembahasan wajib diisi') }

  const { data: materi, error } = await supabase
    .from('materi_matkul')
    .insert([
      {
        mata_kuliah_id: Number(mata_kuliah_id),
        tanggal_materi,
        catatan: catatan?.trim() || null,
      },
    ])
    .select('id, mata_kuliah_id, tanggal_materi, catatan, created_at')
    .single()

  if (error) {
    console.error('Error creating materi:', error)
    return { data: null, error }
  }

  const { uploaded, failed } = files.length
    ? await uploadFotos(materi.id, files)
    : { uploaded: [], failed: [] }

  return { data: { ...materi, materi_foto: uploaded }, error: null, warning: warn(failed) }
}

export async function updateMateri(id, { tanggal_materi, catatan, files = [] }) {
  if (!id) return { data: null, error: new Error('ID materi diperlukan') }
  if (tanggal_materi !== undefined && !tanggal_materi) {
    return { data: null, error: new Error('Tanggal dan bulan pembahasan wajib diisi') }
  }

  const payload = {}
  if (tanggal_materi !== undefined) payload.tanggal_materi = tanggal_materi
  if (catatan !== undefined) payload.catatan = catatan?.trim() || null

  const { data: materi, error } = await supabase
    .from('materi_matkul')
    .update(payload)
    .eq('id', id)
    .select(MATERI_SELECT)
    .single()

  if (error) {
    console.error('Error updating materi:', error)
    return { data: null, error }
  }

  let result = sortFoto(materi)
  let warning = null
  if (files.length) {
    const { uploaded, failed } = await uploadFotos(id, files, result.materi_foto.length)
    result = { ...result, materi_foto: [...result.materi_foto, ...uploaded] }
    warning = warn(failed)
  }
  return { data: result, error: null, warning }
}

export async function deleteMateri(id) {
  if (!id) return { error: new Error('ID materi diperlukan') }

  const { data: fotos } = await supabase
    .from('materi_foto')
    .select('storage_path')
    .eq('materi_id', id)

  const paths = (fotos || []).map((f) => f.storage_path).filter(Boolean)
  if (paths.length) {
    const { error: sErr } = await supabase.storage.from(BUCKET).remove(paths)
    if (sErr) console.error('Error removing files from storage:', sErr)
  }

  // materi_foto ikut terhapus lewat ON DELETE CASCADE
  const { error } = await supabase.from('materi_matkul').delete().eq('id', id)
  if (error) {
    console.error('Error deleting materi:', error)
    return { error: new Error('Gagal menghapus materi. Silakan coba lagi.') }
  }
  return { error: null }
}

export async function deleteMateriFoto(fotoId) {
  if (!fotoId) return { error: new Error('ID foto diperlukan') }

  const { data: foto } = await supabase
    .from('materi_foto')
    .select('storage_path')
    .eq('id', fotoId)
    .single()

  if (foto?.storage_path) {
    const { error: sErr } = await supabase.storage.from(BUCKET).remove([foto.storage_path])
    if (sErr) console.error('Error removing foto from storage:', sErr)
  }

  const { error } = await supabase.from('materi_foto').delete().eq('id', fotoId)
  if (error) {
    console.error('Error deleting foto materi:', error)
    return { error: new Error('Gagal menghapus foto.') }
  }
  return { error: null }
}