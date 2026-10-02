import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useCourses } from '../../hooks/useCourses'
import { CourseRow } from '../../components/public/CourseRow'
import { CourseSkeletonList } from '../../components/public/CourseSkeletons'

const headerVariants = {
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

const headerVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
}

function Courses() {
  const { data: courses, loading, error, refetch } = useCourses()
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? headerVariantsReduced : headerVariants

  return (
    <main
      className="min-h-screen pt-24 pb-20 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32"
      style={{ backgroundColor: 'var(--public-bg-primary)' }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-opacity duration-200 hover:opacity-80"
            style={{ color: 'var(--public-text-muted)' }}
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Page Header */}
        <motion.header
          variants={variants}
          initial="hidden"
          animate="show"
          className="mb-8 border-b pb-8 sm:mb-12 sm:pb-10"
          style={{ borderColor: 'var(--public-border-subtle, var(--public-border))' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: 'var(--public-accent)' }}
          >
            03 / COURSES
          </p>
          <h1
            className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ color: 'var(--public-text-primary)' }}
          >
            MATA KULIAH
          </h1>
          <p
            className="mt-3 text-sm sm:text-base"
            style={{ color: 'var(--public-text-secondary)' }}
          >
            Daftar mata kuliah aktif Class 1IA08.
          </p>
        </motion.header>

        {/* Content States */}
        {loading && <CourseSkeletonList count={6} />}

        {!loading && error && (
          <div
            className="py-16 text-center rounded-lg border border-dashed"
            style={{ borderColor: 'var(--public-border)' }}
          >
            <p
              className="text-base font-medium"
              style={{ color: 'var(--public-text-primary)' }}
            >
              Mata kuliah belum dapat dimuat.
            </p>
            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--public-text-muted)' }}
            >
              Silakan coba lagi.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors duration-150"
              style={{
                color: 'var(--public-text-primary)',
                borderColor: 'var(--public-border)',
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && (!courses || courses.length === 0) && (
          <div
            className="py-16 text-center rounded-lg border border-dashed"
            style={{ borderColor: 'var(--public-border)' }}
          >
            <p
              className="text-base font-medium"
              style={{ color: 'var(--public-text-primary)' }}
            >
              Belum ada mata kuliah aktif.
            </p>
            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--public-text-muted)' }}
            >
              Mata kuliah baru yang terdaftar akan muncul di sini.
            </p>
          </div>
        )}

        {!loading && !error && courses && courses.length > 0 && (
          <div
            className="divide-y"
            style={{ borderColor: 'var(--public-border-subtle, var(--public-border))' }}
          >
            {courses.map((course, index) => (
              <div
                key={course.id}
                style={{ borderColor: 'var(--public-border-subtle, var(--public-border))' }}
              >
                <CourseRow course={course} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Courses
