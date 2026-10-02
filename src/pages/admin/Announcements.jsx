import { useEffect, useState, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2, RotateCcw, Power } from 'lucide-react'
import {
  fetchAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  toggleAnnouncementStatus,
  deleteAnnouncement,
} from '@/lib/admin/announcements'
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
import { formatDateCompact } from '@/lib/announcements'

function AdminAnnouncements() {
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
    judul: '',
    isi: '',
    tanggal: new Date().toISOString().split('T')[0],
    aktif: true,
  })
  const [submitting, setSubmitting] = useState(false)

  // Delete Alert Modal State
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadData() {
      const { data: result, error: err } = await fetchAdminAnnouncements()
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
      judul: '',
      isi: '',
      tanggal: new Date().toISOString().split('T')[0],
      aktif: true,
    })
    setDialogOpen(true)
  }

  // Open modal for Edit
  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setFormData({
      judul: item.judul || '',
      isi: item.isi || '',
      tanggal: item.tanggal ? item.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
      aktif: Boolean(item.aktif),
    })
    setDialogOpen(true)
  }

  // Submit Create or Edit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.judul.trim() || !formData.isi.trim() || !formData.tanggal) {
      toast.error('Mohon lengkapi judul, isi, dan tanggal.')
      return
    }

    setSubmitting(true)

    if (editingItem) {
      const { data: updated, error: err } = await updateAnnouncement(editingItem.id, formData)
      if (err) {
        toast.error('Gagal memperbarui pengumuman.')
      } else {
        toast.success('Pengumuman berhasil diperbarui.')
        setData((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        setDialogOpen(false)
      }
    } else {
      const { data: created, error: err } = await createAnnouncement(formData)
      if (err) {
        toast.error('Gagal menambahkan pengumuman.')
      } else {
        toast.success('Pengumuman berhasil ditambahkan.')
        setData((prev) => [created, ...prev])
        setDialogOpen(false)
      }
    }

    setSubmitting(false)
  }

  // Toggle publish state
  const handleToggleAktif = async (item) => {
    const { data: updated, error: err } = await toggleAnnouncementStatus(item.id, item.aktif)
    if (err) {
      toast.error('Gagal mengubah status publikasi.')
    } else {
      toast.success(updated.aktif ? 'Pengumuman diaktifkan.' : 'Pengumuman dinonaktifkan.')
      setData((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    }
  }

  // Confirm and Execute Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error: err } = await deleteAnnouncement(deleteTarget.id)
    if (err) {
      toast.error('Gagal menghapus pengumuman.')
    } else {
      toast.success('Pengumuman berhasil dihapus.')
      setData((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
    setDeleting(false)
  }

  const filteredData = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(
      (item) =>
        item.judul?.toLowerCase().includes(q) || item.isi?.toLowerCase().includes(q)
    )
  }, [data, search])

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Pengumuman
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola pengumuman kelas yang ditampilkan kepada mahasiswa.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Tambah Pengumuman</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul pengumuman..."
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
          <p className="font-semibold text-destructive">Pengumuman belum dapat dimuat.</p>
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
            {search ? 'Tidak ada pengumuman yang sesuai pencarian.' : 'Belum ada pengumuman.'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Mulai buat pengumuman baru untuk kelas.'}
          </p>
          {!search && (
            <Button onClick={handleOpenCreate} variant="outline" size="sm" className="mt-4 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Pengumuman</span>
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
                <TableHead className="w-[35%]">Judul</TableHead>
                <TableHead className="w-[18%]">Tanggal</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="text-right w-[32%]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-foreground">
                    <p className="line-clamp-1">{item.judul}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground mt-0.5">
                      {item.isi}
                    </p>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDateCompact(item.tanggal)}
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
              {editingItem ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Pengumuman</Label>
              <Input
                id="judul"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Contoh: Jadwal Ujian Tengah Semester"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isi">Isi Pengumuman</Label>
              <Textarea
                id="isi"
                rows={4}
                value={formData.isi}
                onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                placeholder="Tuliskan isi pengumuman secara rinci..."
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="aktif"
                type="checkbox"
                checked={formData.aktif}
                onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="aktif" className="cursor-pointer text-xs sm:text-sm font-normal">
                Publikasikan langsung (Status: Aktif)
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
                {submitting ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Buat Pengumuman'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengumuman?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Pengumuman &ldquo;{deleteTarget?.judul}&rdquo; akan dihapus secara permanen dari database.
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

export default AdminAnnouncements
