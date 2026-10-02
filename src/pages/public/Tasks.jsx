import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Filter } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTasks } from '../../hooks/useTasks'
import { useCourses } from '../../hooks/useCourses'
import { TaskRow } from '../../components/public/TaskRow'
import { TaskRowSkeletonList } from '../../components/public/TaskSkeletons'

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

function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCourseId = searchParams.get('mata_kuliah') || ''

  const { data: courses } = useCourses()
  const { data: tasks, loading, error, refetch } = useTasks({
    mataKuliahId: selectedCourseId ? Number(selectedCourseId) : undefined,
  })

  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? headerVariantsReduced : headerVariants

  const handleCourseChange = (e) => {
    const val = e.target.value
    if (val) {
      setSearchParams({ mata_kuliah: val })
    } else {
      setSearchParams({})
    }
  }

  const selectedCourseName = useMemo(() => {
    if (!selectedCourseId || !courses) return null
    const c = courses.find((item) => String(item.id) === String(selectedCourseId))
    return c?.nama || null
  }, [selectedCourseId, courses])

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
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: 'var(--public-accent)' }}
              >
                02 / ASSIGNMENTS
              </p>
              <h1
                className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                style={{ color: 'var(--public-text-primary)' }}
              >
                TUGAS KELAS
              </h1>
              <p
                className="mt-3 text-sm sm:text-base"
                style={{ color: 'var(--public-text-secondary)' }}
              >
                Informasi tugas terbaru untuk Class 1IA08.
              </p>
            </div>

            {/* Course Filter Dropdown */}
            {courses && courses.length > 0 && (
              <div className="flex items-center gap-2">
                <label htmlFor="course-filter" className="sr-only">
                  Filter berdasarkan mata kuliah
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Filter className="h-3.5 w-3.5" style={{ color: 'var(--public-text-muted)' }} />
                  </div>
                  <select
                    id="course-filter"
                    value={selectedCourseId}
                    onChange={handleCourseChange}
                    className="h-9 rounded-md border pl-8 pr-8 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--public-accent)]"
                    style={{
                      backgroundColor: 'var(--public-surface)',
                      borderColor: 'var(--public-border)',
                      color: 'var(--public-text-primary)',
                    }}
                  >
                    <option value="">Semua Mata Kuliah</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.kode ? `[${course.kode}] ` : ''}
                        {course.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Active filter badge if course selected */}
          {selectedCourseName && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--public-text-muted)' }}>
                Menampilkan tugas untuk:
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border"
                style={{
                  backgroundColor: 'var(--public-surface)',
                  borderColor: 'var(--public-border)',
                  color: 'var(--public-accent)',
                }}
              >
                {selectedCourseName}
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="hover:opacity-75"
                  aria-label="Hapus filter mata kuliah"
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </motion.header>

        {/* Content States */}
        {loading && <TaskRowSkeletonList count={4} />}

        {!loading && error && (
          <div
            className="py-16 text-center rounded-lg border border-dashed"
            style={{ borderColor: 'var(--public-border)' }}
          >
            <p
              className="text-base font-medium"
              style={{ color: 'var(--public-text-primary)' }}
            >
              Tugas belum dapat dimuat.
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

        {!loading && !error && (!tasks || tasks.length === 0) && (
          <div
            className="py-16 text-center rounded-lg border border-dashed"
            style={{ borderColor: 'var(--public-border)' }}
          >
            <p
              className="text-base font-medium"
              style={{ color: 'var(--public-text-primary)' }}
            >
              Belum ada tugas yang ditampilkan.
            </p>
            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--public-text-muted)' }}
            >
              {selectedCourseId
                ? 'Tidak ada tugas yang terdaftar untuk mata kuliah ini.'
                : 'Tugas kelas yang aktif akan muncul di sini.'}
            </p>
            {selectedCourseId && (
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="mt-4 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium border"
                style={{
                  color: 'var(--public-accent)',
                  borderColor: 'var(--public-border)',
                }}
              >
                Lihat Semua Tugas
              </button>
            )}
          </div>
        )}

        {!loading && !error && tasks && tasks.length > 0 && (
          <div
            className="divide-y"
            style={{ borderColor: 'var(--public-border-subtle, var(--public-border))' }}
          >
            {tasks.map((item, index) => (
              <div
                key={item.id}
                style={{ borderColor: 'var(--public-border-subtle, var(--public-border))' }}
              >
                <TaskRow task={item} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Tasks
