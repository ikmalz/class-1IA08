import { Link } from 'react-router-dom'
import { ArrowUpRight, Paperclip } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { formatDateCompact, createExcerpt } from '../../lib/tasks'

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.08,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

const rowVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
}

export function TaskRow({ task, index = 0 }) {
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? rowVariantsReduced : rowVariants

  const courseName = task.mata_kuliah?.nama || 'Mata Kuliah'
  const courseCode = task.mata_kuliah?.kode || null
  const excerpt = createExcerpt(task.catatan, 140)
  const attachmentCount = Array.isArray(task.tugas_foto) ? task.tugas_foto.length : 0

  return (
    <motion.article
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="group py-6 sm:py-8 transition-colors duration-200 rounded-lg px-2 -mx-2 hover:bg-[var(--public-surface-hover)]"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[140px_1fr_auto] md:gap-8 md:items-center">
        {/* Date */}
        <time
          dateTime={task.tanggal_tugas || task.created_at}
          className="text-xs font-medium uppercase tracking-[0.15em] shrink-0"
          style={{ color: 'var(--public-text-muted)' }}
        >
          {formatDateCompact(task.tanggal_tugas || task.created_at)}
        </time>

        {/* Content: Course & Excerpt & Attachments */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {courseCode && (
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border"
                style={{
                  color: 'var(--public-accent)',
                  borderColor: 'var(--public-border)',
                  backgroundColor: 'var(--public-surface)',
                }}
              >
                {courseCode}
              </span>
            )}
            <h3
              className="text-base font-semibold leading-snug sm:text-lg transition-colors duration-200 group-hover:text-[var(--public-accent)]"
              style={{ color: 'var(--public-text-primary)' }}
            >
              <Link to={`/tugas/${task.id}`} className="focus-visible:outline-none focus-visible:underline">
                {courseName}
              </Link>
            </h3>
          </div>

          {excerpt && (
            <p
              className="mt-2 text-sm leading-relaxed line-clamp-2"
              style={{ color: 'var(--public-text-secondary)' }}
            >
              {excerpt}
            </p>
          )}

          {/* Attachment count tag */}
          {attachmentCount > 0 && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs" style={{ color: 'var(--public-text-muted)' }}>
              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {attachmentCount} {attachmentCount === 1 ? 'lampiran' : 'lampiran'}
              </span>
            </div>
          )}
        </div>

        {/* Action button / link to detail */}
        <Link
          to={`/tugas/${task.id}`}
          className="hidden md:flex items-center justify-center h-10 w-10 rounded-md border transition-all duration-200 group-hover:border-[var(--public-accent)] group-hover:text-[var(--public-accent)]"
          style={{
            color: 'var(--public-text-muted)',
            borderColor: 'var(--public-border-subtle, var(--public-border))',
          }}
          aria-label={`Lihat detail tugas: ${courseName}`}
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Mobile action link */}
      <div className="md:hidden mt-3">
        <Link
          to={`/tugas/${task.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-200"
          style={{ color: 'var(--public-accent)' }}
          aria-label={`Lihat detail tugas: ${courseName}`}
        >
          <span>Lihat Detail</span>
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  )
}
