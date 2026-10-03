import { useEffect, useState, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2, RotateCcw, Paperclip, FileText, Image as ImageIcon } from 'lucide-react'
import {
  fetchAdminTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteAttachment,
} from '@/lib/admin/tasks'
import { fetchAdminCourses } from '@/lib/admin/courses'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { formatDateCompact, formatFileSize } from '@/lib/tasks'

function AdminTasks() {
  const toast = useToast()
  const [data, setData] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Form Modal State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    mata_kuliah_id: '',
    tanggal_tugas: new Date().toISOString().split('T')[0],
    catatan: '',
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Delete Alert Modal State
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadData() {
      const [tasksRes, coursesRes] = await Promise.all([
        fetchAdminTasks(),
        fetchAdminCourses(),
      ])

      if (!ignore) {
        if (tasksRes.error) {
          setError(tasksRes.error)
        } else {
          setData(tasksRes.data)
        }

        if (coursesRes.data) {
          setCourses(coursesRes.data)
        }

        setLoading(false)
      }
    }

    loadData()

    return () => {
      ignore = true
    }
  }, [reloadKey])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setReloadKey((k) => k + 1)
  }

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null)
    const defaultCourseId = courses.find((c) => c.aktif)?.id || (courses[0]?.id ? String(courses[0].id) : '')
    setFormData({
      mata_kuliah_id: defaultCourseId ? String(defaultCourseId) : '',
      tanggal_tugas: new Date().toISOString().split('T')[0],
      catatan: '',
    })
    setSelectedFiles([])
    setDialogOpen(true)
  }

  // Open modal for Edit
  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setFormData({
      mata_kuliah_id: item.mata_kuliah_id ? String(item.mata_kuliah_id) : '',
      tanggal_tugas: item.tanggal_tugas ? item.tanggal_tugas.split('T')[0] : new Date().toISOString().split('T')[0],
      catatan: item.catatan || '',
    })
    setSelectedFiles([])
    setDialogOpen(true)
  }

  // Submit Create or Edit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.mata_kuliah_id || !formData.tanggal_tugas) {
      toast.error('Mata kuliah dan tanggal tugas wajib dipilih.')
      return
    }

    setSubmitting(true)

    if (editingItem) {
      const { data: updated, error: err, warning } = await updateTask(editingItem.id, {
        ...formData,
        files: selectedFiles,
      })
      if (err) {
        toast.error(err.message || 'Gagal memperbarui data tugas.')
      } else {
        toast.success('Tugas berhasil diperbarui.')
        if (warning) {
          toast.info(warning)
        }
        setData((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        setDialogOpen(false)
      }
    } else {
      const { data: created, error: err, warning } = await createTask({
        ...formData,
        files: selectedFiles,
      })
      if (err) {
        toast.error(err.message || 'Gagal menambahkan tugas baru.')
      } else {
        toast.success('Tugas berhasil ditambahkan.')
        if (warning) {
          toast.info(warning)
        }
        setData((prev) => [created, ...prev])
        setDialogOpen(false)
      }
    }

    setSubmitting(false)
  }

  // Delete single attachment from editing item
  const handleDeleteAttachment = async (attachmentId) => {
    const { error: err } = await deleteAttachment(attachmentId)
    if (err) {
      toast.error('Gagal menghapus lampiran.')
    } else {
      toast.success('Lampiran berhasil dihapus.')
      setEditingItem((prev) => ({
        ...prev,
        tugas_foto: prev.tugas_foto.filter((f) => f.id !== attachmentId),
      }))
      setData((prev) =>
        prev.map((t) =>
          t.id === editingItem.id
            ? { ...t, tugas_foto: (t.tugas_foto || []).filter((f) => f.id !== attachmentId) }
            : t
        )
      )
    }
  }

  // Confirm and Execute Task Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error: err } = await deleteTask(deleteTarget.id)
    if (err) {
      toast.error(err.message || 'Gagal menghapus tugas.')
    } else {
      toast.success('Tugas berhasil dihapus.')
      setData((prev) => prev.filter((t) => t.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
    setDeleting(false)
  }

  const filteredData = useMemo(() => {
    let result = data
    if (selectedCourseFilter) {
      result = result.filter((item) => String(item.mata_kuliah_id) === String(selectedCourseFilter))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (item) =>
          item.mata_kuliah?.nama?.toLowerCase().includes(q) ||
          item.catatan?.toLowerCase().includes(q)
      )
    }
    return result
  }, [data, search, selectedCourseFilter])

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Tugas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola tugas perkuliahan, instruksi, dan lampiran berkas kelas.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Tambah Tugas</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari mata kuliah atau catatan tugas..."
            className="pl-9 text-xs sm:text-sm"
          />
        </div>

        {courses.length > 0 && (
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-card px-3 text-xs sm:text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Semua Mata Kuliah</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.kode ? `[${c.kode}] ` : ''}
                {c.nama}
              </option>
            ))}
          </select>
        )}

        {(search || selectedCourseFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('')
              setSelectedCourseFilter('')
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="font-semibold text-destructive">Data tugas belum dapat dimuat.</p>
          <Button onClick={handleRetry} variant="outline" size="sm" className="mt-4 gap-2">
            <RotateCcw className="h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredData.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm font-medium text-foreground">
            {search || selectedCourseFilter
              ? 'Tidak ada tugas yang sesuai filter.'
              : 'Belum ada tugas yang terdaftar.'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search || selectedCourseFilter
              ? 'Coba ubah kata kunci atau filter mata kuliah.'
              : 'Tambahkan tugas pertama untuk mata kuliah aktif.'}
          </p>
          {!search && !selectedCourseFilter && (
            <Button onClick={handleOpenCreate} variant="outline" size="sm" className="mt-4 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Tugas</span>
            </Button>
          )}
        </div>
      )}

      {/* Table Content */}
      {!loading && !error && filteredData.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[16%]">Tanggal</TableHead>
                <TableHead className="w-[30%]">Mata Kuliah</TableHead>
                <TableHead className="w-[28%]">Catatan</TableHead>
                <TableHead className="w-[10%]">Lampiran</TableHead>
                <TableHead className="text-right w-[16%]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const attachmentsCount = item.tugas_foto?.length || 0
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateCompact(item.tanggal_tugas)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {item.mata_kuliah?.nama || 'Mata Kuliah'}
                      </div>
                      {item.mata_kuliah?.kode && (
                        <span className="font-mono text-[10px] text-primary">
                          {item.mata_kuliah.kode}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <p className="line-clamp-2">
                        {item.catatan || <span className="italic">Tanpa catatan tambahan</span>}
                      </p>
                    </TableCell>
                    <TableCell>
                      {attachmentsCount > 0 ? (
                        <Badge variant="outline" className="gap-1 font-mono text-[10px]">
                          <Paperclip className="h-3 w-3" />
                          <span>{attachmentsCount}</span>
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                          className="text-xs"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(item)}
                          className="text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Hapus</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Tugas' : 'Tambah Tugas Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
              <select
                id="mata_kuliah_id"
                value={formData.mata_kuliah_id}
                onChange={(e) => setFormData({ ...formData, mata_kuliah_id: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="" disabled>Pilih Mata Kuliah...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.kode ? `[${c.kode}] ` : ''}
                    {c.nama} {c.aktif ? '' : '(Nonaktif)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_tugas">Tanggal Tugas / Batas Waktu</Label>
              <Input
                id="tanggal_tugas"
                type="date"
                value={formData.tanggal_tugas}
                onChange={(e) => setFormData({ ...formData, tanggal_tugas: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan / Instruksi Tugas (Opsional)</Label>
              <Textarea
                id="catatan"
                rows={4}
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                placeholder="Rincian instruksi tugas, format pengumpulan, atau referensi..."
              />
            </div>

            {/* Existing Attachments in Edit Mode */}
            {editingItem && editingItem.tugas_foto && editingItem.tugas_foto.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Lampiran Tersimpan ({editingItem.tugas_foto.length})
                </Label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {editingItem.tugas_foto.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-md border border-border bg-muted/40 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {file.mime_type?.startsWith('image/') ? (
                          <ImageIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="truncate font-medium text-foreground">
                          {file.file_name}
                        </span>
                        {file.file_size && (
                          <span className="text-[10px] text-muted-foreground">
                            ({formatFileSize(file.file_size)})
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAttachment(file.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        title="Hapus lampiran ini"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload Selector */}
            <div className="space-y-2 pt-2 border-t border-border">
              <Label htmlFor="attachments">Unggah Lampiran Baru (Opsional)</Label>
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                className="text-xs file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-[11px] text-muted-foreground">
                Mendukung gambar dan dokumen. Catatan: Pengunggahan berkas aktual terhubung dengan Supabase Storage bucket.
              </p>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Buat Tugas'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tugas?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Tugas untuk mata kuliah &ldquo;{deleteTarget?.mata_kuliah?.nama || 'Mata Kuliah'}&rdquo; beserta seluruh lampiran terkait akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminTasks
