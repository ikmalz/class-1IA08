import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  formatDateCompact,
  createExcerpt,
} from '../../lib/announcements'

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

export function AnnouncementRow({ announcement, index = 0 }) {
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? rowVariantsReduced : rowVariants

  return (
    <motion.article
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="group py-6 sm:py-8 transition-colors duration-200 hover:bg-[var(--public-surface-muted)] rounded-lg px-2 -mx-2"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[140px_1fr_auto] md:gap-8 md:items-center">
        {/* Date */}
        <time
          dateTime={announcement.tanggal || announcement.created_at}
          className="text-xs font-medium uppercase tracking-[0.15em] shrink-0"
          style={{ color: 'var(--public-text-muted)' }}
        >
          {formatDateCompact(announcement.tanggal || announcement.created_at)}
        </time>

        {/* Title + excerpt */}
        <div>
          <h3
            className="text-base font-semibold leading-snug sm:text-lg transition-colors duration-200 group-hover:text-[var(--public-accent)]"
            style={{ color: 'var(--public-text-primary)' }}
          >
            {announcement.judul}
          </h3>
          <p
            className="mt-1.5 text-sm leading-relaxed line-clamp-2"
            style={{ color: 'var(--public-text-secondary)' }}
          >
            {createExcerpt(announcement.isi, 150)}
          </p>
        </div>

        {/* Arrow action */}
        <Link
          to="/pengumuman"
          className="hidden md:flex items-center justify-center h-10 w-10 rounded-md border transition-all duration-200 group-hover:border-[var(--public-border-hover)] group-hover:text-[var(--public-accent)]"
          style={{
            color: 'var(--public-text-muted)',
            borderColor: 'var(--public-border-subtle)',
          }}
          aria-label={`Baca pengumuman: ${announcement.judul}`}
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Mobile link */}
      <Link
        to="/pengumuman"
        className="md:hidden mt-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-200"
        style={{ color: 'var(--public-accent)' }}
        aria-label={`Baca pengumuman: ${announcement.judul}`}
      >
        Baca Pengumuman
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </motion.article>
  )
}
