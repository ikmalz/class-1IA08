import { useState } from 'react'
import { Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useMateri } from '@/hooks/useMateri'
import {
  createMateri,
  deleteMateri,
  deleteMateriFoto,
  getMateriFotoUrl,
} from '@/lib/materi'
import { formatBytes } from '@/lib/imageCompress'

// Dipakai di halaman admin Mata Kuliah: <MateriManager course={course} />
export function MateriManager({ course }) {
  const { data, loading, refetch } = useMateri(course.id)
  const [tanggal, setTanggal] = useState('')
  const [catatan, setCatatan] = useState('')
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'error' | 'warning' | 'ok', text }

  const totalSize = files.reduce((n, f) => n + f.size, 0)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)

    if (!tanggal) {
      setMessage({ type: 'error', text: 'Tanggal dan bulan pembahasan wajib diisi.' })
      return
    }

    setSaving(true)
    const { error, warning } = await createMateri({
      mata_kuliah_id: course.id,
      tanggal_materi: tanggal,
      catatan,
      files,
    })
    setSaving(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
      return
    }
    setMessage(
      warning
        ? { type: 'warning', text: warning }
        : { type: 'ok', text: 'Materi berhasil disimpan. Foto sudah dikompres otomatis.' }
    )
    setTanggal('')
    setCatatan('')
    setFiles([])
    refetch()
  }

  async function handleDeleteMateri(id) {
    if (!window.confirm('Hapus materi ini beserta semua fotonya?')) return
    const { error } = await deleteMateri(id)
    if (error) setMessage({ type: 'error', text: error.message })
    else refetch()
  }

  async function handleDeleteFoto(id) {
    if (!window.confirm('Hapus foto ini?')) return
    const { error } = await deleteMateriFoto(id)
    if (error) setMessage({ type: 'error', text: error.message })
    else refetch()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold">Tambah foto materi — {course.nama}</h3>

        <div className="space-y-1.5">
          <Label htmlFor="tanggal_materi">Tanggal pembahasan *</Label>
          <Input
            id="tanggal_materi"
            type="date"
            required
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="catatan_materi">Catatan (opsional)</Label>
          <Textarea
            id="catatan_materi"
            placeholder="Contoh: Pertemuan 3 — Normalisasi basis data"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="foto_materi">Foto / screenshot PPT</Label>
          <Input
            id="foto_materi"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          {files.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {files.length} foto dipilih ({formatBytes(totalSize)} sebelum dikompres)
            </p>
          )}
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.type === 'error'
                ? 'text-red-500'
                : message.type === 'warning'
                  ? 'text-amber-500'
                  : 'text-green-600'
            }`}
          >
            {message.text}
          </p>
        )}

        <Button type="submit" disabled={saving}>
          <Upload className="mr-2 h-4 w-4" />
          {saving ? 'Mengompres & mengunggah…' : 'Simpan materi'}
        </Button>
      </form>

      <div className="space-y-6">
        {loading && <p className="text-sm text-muted-foreground">Memuat…</p>}
        {!loading && data.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada materi untuk mata kuliah ini.</p>
        )}

        {data.map((m) => (
          <div key={m.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{m.tanggal_materi}</p>
                {m.catatan && <p className="text-sm text-muted-foreground">{m.catatan}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteMateri(m.id)}
                aria-label="Hapus materi"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {m.materi_foto.map((f) => (
                <div key={f.id} className="group relative">
                  <img
                    src={getMateriFotoUrl(f.storage_path)}
                    alt={f.file_name}
                    loading="lazy"
                    className="aspect-square w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFoto(f.id)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Hapus foto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">
                    {formatBytes(f.file_size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}