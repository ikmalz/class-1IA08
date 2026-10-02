import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
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

const cardVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
}

export function CoursePreviewCard({ course, index = 0 }) {
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? cardVariantsReduced : cardVariants

  return (
    <motion.article
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-30px' }}
      className="group relative rounded-lg border p-4 sm:p-5 transition-colors duration-200 hover:bg-[var(--public-surface-hover)] focus-within:ring-2 focus-within:ring-[var(--public-accent)]"
      style={{
        backgroundColor: 'var(--public-surface)',
        borderColor: 'var(--public-border-subtle, var(--public-border))',
      }}
    >
      <Link
        to={`/tugas?mata_kuliah=${course.id}`}
        className="block focus:outline-none"
        aria-label={`Mata kuliah ${course.nama}${course.kode ? ` (${course.kode})` : ''}`}
      >
        {course.kode && (
          <p
            className="font-mono text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--public-accent)' }}
          >
            {course.kode}
          </p>
        )}
        <h3
          className="text-sm sm:text-base font-semibold leading-snug transition-colors duration-150 group-hover:text-[var(--public-accent)]"
          style={{ color: 'var(--public-text-primary)' }}
        >
          {course.nama}
        </h3>
      </Link>
    </motion.article>
  )
}
