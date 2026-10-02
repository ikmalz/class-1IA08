import { supabase } from '@/lib/supabaseClient'

export async function fetchAdminAnnouncements() {
  const { data, error } = await supabase
    .from('pengumuman')
    .select('id, judul, isi, tanggal, aktif, created_at, updated_at')
    .order('tanggal', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin announcements:', error)
    return { data: null, error }
  }

  return { data: data ?? [], error: null }
}

export async function createAnnouncement({ judul, isi, tanggal, aktif = true }) {
  if (!judul?.trim() || !isi?.trim() || !tanggal) {
    return { data: null, error: new Error('Judul, isi, dan tanggal harus diisi') }
  }

  const { data, error } = await supabase
    .from('pengumuman')
    .insert([
      {
        judul: judul.trim(),
        isi: isi.trim(),
        tanggal,
        aktif: Boolean(aktif),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating announcement:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function updateAnnouncement(id, { judul, isi, tanggal, aktif }) {
  if (!id) return { data: null, error: new Error('ID pengumuman diperlukan') }

  const payload = {
    updated_at: new Date().toISOString(),
  }

  if (judul !== undefined) payload.judul = judul.trim()
  if (isi !== undefined) payload.isi = isi.trim()
  if (tanggal !== undefined) payload.tanggal = tanggal
  if (aktif !== undefined) payload.aktif = Boolean(aktif)

  const { data, error } = await supabase
    .from('pengumuman')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating announcement ${id}:`, error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function toggleAnnouncementStatus(id, currentAktif) {
  return updateAnnouncement(id, { aktif: !currentAktif })
}

export async function deleteAnnouncement(id) {
  if (!id) return { error: new Error('ID pengumuman diperlukan') }

  const { error } = await supabase
    .from('pengumuman')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting announcement ${id}:`, error)
    return { error }
  }

  return { error: null }
}
