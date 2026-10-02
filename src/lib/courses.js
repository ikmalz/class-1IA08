import { supabase } from './supabaseClient'

/**
 * Fetch all active courses from Supabase.
 * Order: nama ascending.
 */
export async function fetchCourses({ limit } = {}) {
  let query = supabase
    .from('mata_kuliah')
    .select('id, nama, kode, aktif')
    .eq('aktif', true)
    .order('nama', { ascending: true })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching courses:', error)
    return { data: null, error }
  }

  return { data: data ?? [], error: null }
}
