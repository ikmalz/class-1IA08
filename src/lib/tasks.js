import { supabase } from './supabaseClient'

/**
 * Fetch public tasks with related mata_kuliah and tugas_foto.
 * Ordered by tanggal_tugas descending, then created_at descending.
 * Only tasks with active courses (aktif = true) are included.
 */

export async function fetchTasks({ limit, mataKuliahId } = {}) {
  let query = supabase
    .from('tugas')
    .select(`
      id,
      mata_kuliah_id,
      tanggal_tugas,
      catatan,
      created_at,
      mata_kuliah!inner ( id, nama, kode, aktif ),
      tugas_foto ( id )
    `)
    .eq('mata_kuliah.aktif', true)
    .order('tanggal_tugas', { ascending: false })
    .order('created_at', { ascending: false })

  if (mataKuliahId) query = query.eq('mata_kuliah_id', mataKuliahId)
  if (limit) query = query.limit(limit)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching tasks:', error)
    return { data: null, error }
  }

  return { data: data ?? [], error: null }
}

/**
 * Fetch a single task by ID with its course and attachments.
 */
export async function fetchTaskById(id) {
  if (!id) return { data: null, error: new Error('ID tugas tidak valid') }

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
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error(`Error fetching task ${id}:`, error)
    return { data: null, error }
  }

  // Verify course is active
  if (data?.mata_kuliah && data.mata_kuliah.aktif === false) {
    return { data: null, error: new Error('Mata kuliah untuk tugas ini tidak aktif') }
  }

  return { data, error: null }
}

/**
 * Format date string into Indonesian full format: e.g. "2 Oktober 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format date string into Indonesian compact format: e.g. "02 OKT 2026"
 */
export function formatDateCompact(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase()
}

/**
 * Format bytes into human-readable B, KB, MB format.
 */
export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || isNaN(bytes) || bytes < 0) return ''
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const clampedIndex = Math.min(i, sizes.length - 1)
  const value = bytes / Math.pow(k, clampedIndex)
  return `${value >= 10 || clampedIndex === 0 ? Math.round(value) : value.toFixed(1)} ${sizes[clampedIndex]}`
}

/**
 * Create excerpt for task notes.
 * Null-safe: returns empty string if text is empty or null (never invents content).
 */
export function createExcerpt(text, maxLength = 140) {
  if (!text) return ''

  const trimmed = text.trim()
  if (trimmed.length <= maxLength) return trimmed

  const truncated = trimmed.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + '...'
  }

  return truncated + '...'
}
