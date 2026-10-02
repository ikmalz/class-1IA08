import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: i * 0.05,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

const rowVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
}

export function CourseRow({ course, index = 0 }) {
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? rowVariantsReduced : rowVariants

  return (
    <motion.article
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-30px' }}
      className="group py-5 sm:py-6 transition-colors duration-150 rounded-lg px-3 -mx-3 hover:bg-[var(--public-surface-hover)]"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          {course.kode && (
            <p
              className="font-mono text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--public-accent)' }}
            >
              {course.kode}
            </p>
          )}
          <h2
            className="text-base font-semibold sm:text-lg transition-colors duration-200 group-hover:text-[var(--public-accent)]"
            style={{ color: 'var(--public-text-primary)' }}
          >
            {course.nama}
          </h2>
        </div>

        <Link
          to={`/tugas?mata_kuliah=${course.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-opacity duration-150 hover:opacity-80 self-start sm:self-auto"
          style={{ color: 'var(--public-text-muted)' }}
          aria-label={`Lihat tugas untuk mata kuliah ${course.nama}`}
        >
          <span className="hidden sm:inline">Lihat Tugas</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  )
}
