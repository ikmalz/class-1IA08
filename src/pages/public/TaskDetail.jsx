import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, RotateCcw } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTaskDetail } from '../../hooks/useTaskDetail'
import { formatDate } from '../../lib/tasks'
import { TaskAttachmentList } from '../../components/public/TaskAttachmentList'
import { TaskDetailSkeleton } from '../../components/public/TaskSkeletons'

const detailVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

const detailVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
}

function TaskDetail() {
  const { id } = useParams()
  const { data: task, loading, error, refetch } = useTaskDetail(id)
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? detailVariantsReduced : detailVariants

  const courseName = task?.mata_kuliah?.nama || 'Mata Kuliah'
  const courseCode = task?.mata_kuliah?.kode || null
  const formattedDate = formatDate(task?.tanggal_tugas)
  const attachments = task?.tugas_foto ?? []

  return (
    <main
      className="min-h-screen pt-24 pb-20 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32"
      style={{ backgroundColor: 'var(--public-bg-primary)' }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/tugas"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-opacity duration-200 hover:opacity-80"
            style={{ color: 'var(--public-text-muted)' }}
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            <span>Kembali ke Tugas</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && <TaskDetailSkeleton />}

        {/* Error State */}
        {!loading && error && (
          <div
            className="py-16 text-center rounded-lg border border-dashed"
            style={{ borderColor: 'var(--public-border)' }}
          >
            <p
              className="text-base font-medium"
              style={{ color: 'var(--public-text-primary)' }}
            >
              Tugas tidak ditemukan atau belum dapat dimuat.
            </p>
            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--public-text-muted)' }}
            >
              Pastikan tugas yang dicari valid dan masih aktif.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={refetch}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors duration-150"
                style={{
                  color: 'var(--public-text-primary)',
                  borderColor: 'var(--public-border)',
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Coba Lagi
              </button>
              <Link
                to="/tugas"
                className="inline-flex items-center rounded-md px-4 py-2 text-xs font-medium uppercase tracking-wider border"
                style={{
                  color: 'var(--public-accent)',
                  borderColor: 'var(--public-border)',
                }}
              >
                Ke Daftar Tugas
              </Link>
            </div>
          </div>
        )}

        {/* Detail Content */}
        {!loading && !error && task && (
          <motion.article
            variants={variants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Header */}
            <header
              className="border-b pb-8"
              style={{ borderColor: 'var(--public-border-subtle, var(--public-border))' }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: 'var(--public-accent)' }}
                >
                  TUGAS KELAS
                </span>
                {courseCode && (
                  <>
                    <span style={{ color: 'var(--public-text-muted)' }}>•</span>
                    <span
                      className="font-mono text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border"
                      style={{
                        color: 'var(--public-accent)',
                        borderColor: 'var(--public-border)',
                        backgroundColor: 'var(--public-surface)',
                      }}
                    >
                      {courseCode}
                    </span>
                  </>
                )}
              </div>

              <h1
                className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
                style={{ color: 'var(--public-text-primary)' }}
              >
                {courseName}
              </h1>

              {formattedDate && (
                <div
                  className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--public-text-muted)' }}
                >
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  <time dateTime={task.tanggal_tugas}>{formattedDate}</time>
                </div>
              )}
            </header>

            {/* Note / Catatan */}
            <section aria-labelledby="catatan-heading">
              <h2
                id="catatan-heading"
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: 'var(--public-text-muted)' }}
              >
                Catatan & Instruksi
              </h2>

              <div className="mt-3">
                {task.catatan ? (
                  <p
                    className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base sm:leading-relaxed"
                    style={{ color: 'var(--public-text-primary)' }}
                  >
                    {task.catatan}
                  </p>
                ) : (
                  <p
                    className="text-sm italic"
                    style={{ color: 'var(--public-text-muted)' }}
                  >
                    Tanpa catatan tambahan.
                  </p>
                )}
              </div>
            </section>

            {/* Attachments */}
            <section
              aria-labelledby="lampiran-heading"
              className="pt-6 border-t"
              style={{ borderColor: 'var(--public-border-subtle, var(--public-border))' }}
            >
              <TaskAttachmentList attachments={attachments} />
            </section>
          </motion.article>
        )}
      </div>
    </main>
  )
}

export default TaskDetail
