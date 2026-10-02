import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  formatDate,
  createExcerpt,
} from '../../lib/announcements'

const pageRowVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.06,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

const pageRowVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
}

export function AnnouncementPageRow({ announcement, index = 0 }) {
  const [expanded, setExpanded] = useState(false)
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? pageRowVariantsReduced : pageRowVariants

  const hasLongContent = announcement.isi && announcement.isi.length > 400

  return (
    <motion.article
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="py-8 sm:py-10"
    >
      {/* Date */}
      <time
        dateTime={announcement.tanggal || announcement.created_at}
        className="text-xs font-medium uppercase tracking-[0.15em]"
        style={{ color: 'var(--public-text-muted)' }}
      >
        {formatDate(announcement.tanggal || announcement.created_at)}
      </time>

      {/* Title */}
      <h2
        className="mt-3 text-xl font-bold leading-snug sm:text-2xl"
        style={{ color: 'var(--public-text-primary)' }}
      >
        {announcement.judul}
      </h2>

      {/* Content */}
      <p
        className="mt-3 text-sm leading-relaxed sm:text-base sm:leading-relaxed"
        style={{ color: 'var(--public-text-secondary)' }}
      >
        {expanded ? announcement.isi : createExcerpt(announcement.isi, 400)}
      </p>

      {/* Expandable toggle */}
      {hasLongContent && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--public-accent)] rounded-sm"
          style={{ color: 'var(--public-accent)' }}
        >
          {expanded ? 'Tutup' : 'Baca Selengkapnya'}
          <ArrowUpRight
            className={`h-3 w-3 transition-transform duration-200 ${
              expanded ? 'rotate-90' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      )}
    </motion.article>
  )
}
