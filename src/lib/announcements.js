import { supabase } from './supabaseClient'

export async function fetchAnnouncements({ limit } = {}) {
  let query = supabase
    .from('pengumuman')
    .select('id, judul, isi, tanggal, created_at')
    .eq('aktif', true)
    .order('tanggal', { ascending: false })
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching announcements:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

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

export function createExcerpt(text, maxLength = 150) {
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
