import { useEffect, useState, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2, RotateCcw, Power } from 'lucide-react'
import {
  fetchAdminCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
} from '@/lib/admin/courses'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

function AdminCourses() {
  const toast = useToast()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Form Modal State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    nama: '',
    kode: '',
    aktif: true,
  })
  const [submitting, setSubmitting] = useState(false)

  // Delete Alert Modal State
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadData() {
      const { data: result, error: err } = await fetchAdminCourses()
      if (!ignore) {
        if (err) {
          setError(err)
        } else {
          setData(result)
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
    setFormData({
      nama: '',
      kode: '',
      aktif: true,
    })
    setDialogOpen(true)
  }

  // Open modal for Edit
  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setFormData({
      nama: item.nama || '',
      kode: item.kode || '',
      aktif: Boolean(item.aktif),
    })
    setDialogOpen(true)
  }

  // Submit Create or Edit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nama.trim()) {
      toast.error('Nama mata kuliah wajib diisi.')
      return
    }

    setSubmitting(true)

    if (editingItem) {
      const { data: updated, error: err } = await updateCourse(editingItem.id, formData)
      if (err) {
        toast.error('Gagal memperbarui mata kuliah.')
      } else {
        toast.success('Mata kuliah berhasil diperbarui.')
        setData((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        setDialogOpen(false)
      }
    } else {
      const { data: created, error: err } = await createCourse(formData)
      if (err) {
        toast.error('Gagal menambahkan mata kuliah.')
      } else {
        toast.success('Mata kuliah berhasil ditambahkan.')
        setData((prev) => [...prev, created].sort((a, b) => a.nama.localeCompare(b.nama)))
        setDialogOpen(false)
      }
    }

    setSubmitting(false)
  }

  // Toggle status
  const handleToggleAktif = async (item) => {
    const { data: updated, error: err } = await toggleCourseStatus(item.id, item.aktif)
    if (err) {
      toast.error('Gagal mengubah status mata kuliah.')
    } else {
      toast.success(updated.aktif ? 'Mata kuliah diaktifkan.' : 'Mata kuliah dinonaktifkan.')
      setData((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    }
  }

  // Safe delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error: err } = await deleteCourse(deleteTarget.id)
    if (err) {
      toast.error(err.message || 'Gagal menghapus mata kuliah.')
    } else {
      toast.success('Mata kuliah berhasil dihapus.')
      setData((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
    setDeleting(false)
  }

  const filteredData = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(
      (item) =>
        item.nama?.toLowerCase().includes(q) || (item.kode && item.kode.toLowerCase().includes(q))
    )
  }, [data, search])

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Mata Kuliah
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola daftar mata kuliah aktif dan kurikulum Class 1IA08.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Tambah Mata Kuliah</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kode mata kuliah..."
            className="pl-9 text-xs sm:text-sm"
          />
        </div>
        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch('')}>
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
          <p className="font-semibold text-destructive">Mata kuliah belum dapat dimuat.</p>
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
            {search ? 'Tidak ada mata kuliah yang sesuai pencarian.' : 'Belum ada mata kuliah.'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Tambahkan mata kuliah untuk semester aktif.'}
          </p>
          {!search && (
            <Button onClick={handleOpenCreate} variant="outline" size="sm" className="mt-4 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Mata Kuliah</span>
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
                <TableHead className="w-[18%]">Kode</TableHead>
                <TableHead className="w-[40%]">Nama Mata Kuliah</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="text-right w-[27%]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {item.kode || '—'}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {item.nama}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.aktif ? 'success' : 'secondary'} className="text-[10px]">
                      {item.aktif ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAktif(item)}
                        title={item.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                        className="text-xs"
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          {item.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                        </span>
                      </Button>
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Mata Kuliah</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Algoritma & Pemrograman 1C"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kode">Kode Mata Kuliah (Opsional)</Label>
              <Input
                id="kode"
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                placeholder="Contoh: AP 1C"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="aktif-course"
                type="checkbox"
                checked={formData.aktif}
                onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="aktif-course" className="cursor-pointer text-xs sm:text-sm font-normal">
                Mata kuliah aktif semester ini
              </Label>
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
                {submitting ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Buat Mata Kuliah'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mata Kuliah?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Mata kuliah &ldquo;{deleteTarget?.nama}&rdquo; akan dihapus secara permanen jika tidak sedang digunakan oleh tugas aktif.
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

export default AdminCourses
