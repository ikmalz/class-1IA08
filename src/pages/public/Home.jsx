import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Megaphone, RotateCcw } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import imageImg from "../../assets/image.png";
import { useTheme } from "../../hooks/useTheme";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import { AnnouncementRow } from "../../components/public/AnnouncementRow";
import { AnnouncementRowSkeletonList } from "../../components/public/AnnouncementSkeletons";
import { useTasks } from "../../hooks/useTasks";
import { TaskRow } from "../../components/public/TaskRow";
import { TaskRowSkeletonList } from "../../components/public/TaskSkeletons";
import { useCourses } from "../../hooks/useCourses";
import { SectionHeading } from "../../components/public/SectionHeading";
import { CoursePreviewCard } from "../../components/public/CoursePreviewCard";
import { CoursePreviewSkeleton } from "../../components/public/CourseSkeletons";

/* ──────────────────────────────────────────────────────────
   Stagger configuration for entrance animation
   ────────────────────────────────────────────────────────── */

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
};

const staggerReduced = {
  container: {
    hidden: { opacity: 1 },
    show: { opacity: 1 },
  },
  item: {
    hidden: { opacity: 1, y: 0 },
    show: { opacity: 1, y: 0 },
  },
};

/* ──────────────────────────────────────────────────────────
    Home page
    ────────────────────────────────────────────────────────── */

function Home() {
  const heroRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const { theme } = useTheme();
  const {
    data: announcements,
    loading,
    error,
    refetch,
  } = useAnnouncements({ limit: 3 });
  const {
    data: tasks,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useTasks({ limit: 3 });
  const {
    data: courses,
    loading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useCourses({ limit: 6 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const scrollTransformStyle = prefersReduced
    ? {}
    : { scale: heroScale, opacity: heroOpacity, y: heroY };

  const variants = prefersReduced ? staggerReduced : stagger;

  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-svh items-center justify-center overflow-hidden"
      >
        {/* Background: Class photo (full-bleed) */}
        <div className="absolute inset-0">
          <img
            src={imageImg}
            alt="Class 1IA08 bersama di foto hitam putih"
            className="object-cover w-full h-full"
            style={{ objectPosition: "center center" }}
            aria-hidden="true"
          />
          {/* Gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(to bottom, rgba(8, 8, 8, 0.10), rgba(8, 8, 8, 0.92))"
                  : "linear-gradient(to bottom, rgba(8, 8, 8, 0.05), rgba(8, 8, 8, 0.6))",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28"
          style={scrollTransformStyle}
          variants={variants.container}
          initial="hidden"
          animate="show"
        >
          {/* Class label */}
          <motion.p
            variants={variants.item}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] sm:mb-5 sm:text-sm"
            style={{ color: "#ffffff" }}
          >
            Class 1IA08
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={variants.item}
            className="font-bold leading-[1.1] tracking-tight"
            style={{
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              color: "#ffffff",
            }}
          >
            Satu Ruang
            <br />
            <span className="inline-block">
              Untuk{" "}
              <span style={{ color: "var(--public-accent)" }}>Kelas Kita</span>
              <span style={{ color: "var(--public-accent)" }}>.</span>
            </span>
          </motion.h1>

          {/* Supporting copy */}
          <motion.p
            variants={variants.item}
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed sm:mt-5 sm:text-base"
            style={{ color: "#ffffff" }}
          >
            Pengumuman, tugas, dan informasi kelas dalam satu tempat.
          </motion.p>

          {/* CTA */}
          <motion.div variants={variants.item} className="mt-6 sm:mt-8">
            <Link
              to="/pengumuman"
              className="group inline-flex items-center gap-2.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 sm:px-6 sm:py-3"
              style={{
                backgroundColor: "var(--public-accent)",
                color: "var(--public-accent-contrast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--public-accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--public-accent)";
              }}
            >
              <Megaphone
                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                aria-hidden="true"
              />
              Lihat Pengumuman
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={variants.item}
            className="mt-12 flex flex-col items-center gap-2 sm:mt-16"
            style={{ color: "var(--public-text-muted)" }}
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
              Scroll
            </span>
            <motion.div
              animate={
                prefersReduced
                  ? {}
                  : {
                      y: [0, 6, 0],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Latest Announcements ────────────────────────────── */}
      <section
        id="announcements"
        className="relative py-20 sm:py-24 lg:py-28"
        style={{
          backgroundColor: "var(--public-bg-secondary)",
          borderTop:
            "1px solid var(--public-border-subtle, var(--public-border))",
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <SectionHeading
            number="01 / LATEST UPDATES"
            title="PENGUMUMAN TERBARU"
            description="Informasi terbaru untuk Class 1IA08."
          />

          {/* Announcements List / State Content */}
          {loading && <AnnouncementRowSkeletonList count={3} />}

          {!loading && error && (
            <div
              className="py-12 text-center rounded-lg border border-dashed"
              style={{ borderColor: "var(--public-border)" }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--public-text-primary)" }}
              >
                Pengumuman belum dapat dimuat.
              </p>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--public-text-muted)" }}
              >
                Silakan coba lagi.
              </p>
              <button
                type="button"
                onClick={refetch}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider border transition-colors duration-150"
                style={{
                  color: "var(--public-text-primary)",
                  borderColor: "var(--public-border)",
                }}
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Coba Lagi
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            (!announcements || announcements.length === 0) && (
              <div
                className="py-12 text-center rounded-lg border border-dashed"
                style={{ borderColor: "var(--public-border)" }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--public-text-primary)" }}
                >
                  Belum ada pengumuman terbaru.
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--public-text-muted)" }}
                >
                  Pengumuman baru akan muncul di sini.
                </p>
              </div>
            )}

          {!loading && !error && announcements && announcements.length > 0 && (
            <div
              className="divide-y"
              style={{ borderColor: "var(--public-border-subtle)" }}
            >
              {announcements.map((item, index) => (
                <div
                  key={item.id}
                  style={{ borderColor: "var(--public-border-subtle)" }}
                >
                  <AnnouncementRow announcement={item} index={index} />
                </div>
              ))}
            </div>
          )}

          {/* View all link */}
          {!loading && !error && announcements && announcements.length > 0 && (
            <div
              className="mt-12 sm:mt-16 pt-8 border-t flex justify-end"
              style={{ borderColor: "var(--public-border-subtle)" }}
            >
              <Link
                to="/pengumuman"
                className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-200"
                style={{ color: "var(--public-accent)" }}
              >
                <span>Lihat Semua Pengumuman</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Latest Assignments ────────────────────────────── */}
      <section
        id="assignments"
        className="relative py-20 sm:py-24 lg:py-28"
        style={{
          backgroundColor: "var(--public-bg-primary)",
          borderTop:
            "1px solid var(--public-border-subtle, var(--public-border))",
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <SectionHeading
            number="02 / ASSIGNMENTS"
            title="TUGAS TERBARU"
            description="Informasi tugas terbaru untuk Class 1IA08."
          />

          {/* Tasks List / State Content */}
          {tasksLoading && <TaskRowSkeletonList count={3} />}

          {!tasksLoading && tasksError && (
            <div
              className="py-12 text-center rounded-lg border border-dashed"
              style={{ borderColor: "var(--public-border)" }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--public-text-primary)" }}
              >
                Tugas belum dapat dimuat.
              </p>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--public-text-muted)" }}
              >
                Silakan coba lagi.
              </p>
              <button
                type="button"
                onClick={refetchTasks}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider border transition-colors duration-150"
                style={{
                  color: "var(--public-text-primary)",
                  borderColor: "var(--public-border)",
                }}
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Coba Lagi
              </button>
            </div>
          )}

          {!tasksLoading && !tasksError && (!tasks || tasks.length === 0) && (
            <div
              className="py-12 text-center rounded-lg border border-dashed"
              style={{ borderColor: "var(--public-border)" }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--public-text-primary)" }}
              >
                Belum ada tugas yang ditampilkan.
              </p>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--public-text-muted)" }}
              >
                Tugas baru akan muncul di sini.
              </p>
            </div>
          )}

          {!tasksLoading && !tasksError && tasks && tasks.length > 0 && (
            <div
              className="divide-y"
              style={{
                borderColor:
                  "var(--public-border-subtle, var(--public-border))",
              }}
            >
              {tasks.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    borderColor:
                      "var(--public-border-subtle, var(--public-border))",
                  }}
                >
                  <TaskRow task={item} index={index} />
                </div>
              ))}
            </div>
          )}

          {/* View all link */}
          <div
            className="mt-12 sm:mt-16 pt-8 border-t flex justify-end"
            style={{
              borderColor: "var(--public-border-subtle, var(--public-border))",
            }}
          >
            <Link
              to="/tugas"
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-200"
              style={{ color: "var(--public-accent)" }}
            >
              <span>Lihat Semua Tugas</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 03 / Class Information ───────────────────────── */}
      <section
        id="class-info"
        className="relative py-20 sm:py-24 lg:py-28"
        style={{
          backgroundColor: "var(--public-bg-secondary)",
          borderTop:
            "1px solid var(--public-border-subtle, var(--public-border))",
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 md:items-start">
            {/* Left: Section identifier & headline */}
            <div className="md:col-span-5">
              <p
                className="text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: "var(--public-accent)" }}
              >
                03 / CLASS INFO
              </p>
              <h2
                className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
                style={{ color: "var(--public-text-primary)" }}
              >
                TENTANG KELAS INI.
              </h2>
              <p
                className="mt-3 text-sm leading-relaxed sm:text-base font-medium"
                style={{ color: "var(--public-text-secondary)" }}
              >
                Ruang informasi bersama untuk mempermudah akses dan koordinasi
                seluruh aktivitas kelas.
              </p>
            </div>

            {/* Right: Concise descriptive narrative & fast links */}
            <div className="md:col-span-7 space-y-6">
              <div
                className="space-y-4 text-sm leading-relaxed sm:text-base sm:leading-relaxed"
                style={{ color: "var(--public-text-secondary)" }}
              >
                <p>
                  Class 1IA08 adalah wadah komunikasi dan arsip akademik bagi
                  mahasiswa. Website ini hadir untuk menyatukan jadwal tugas,
                  pengumuman penting, serta daftar mata kuliah yang sedang
                  berjalan dalam satu tempat yang teratur.
                </p>
                <p>
                  Tanpa perlu menelusuri pesan obrolan yang bertumpuk, setiap
                  mahasiswa dapat langsung memeriksa tenggat penugasan,
                  instruksi pengerjaan, dan berkas lampiran kapan saja.
                </p>
              </div>

              {/* Minimal directory / quick jump links */}
              <div
                className="pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-3"
                style={{
                  borderColor:
                    "var(--public-border-subtle, var(--public-border))",
                }}
              >
                <Link
                  to="/pengumuman"
                  className="group flex flex-col p-3 rounded-lg border transition-colors duration-200 hover:bg-[var(--public-surface-hover)]"
                  style={{
                    backgroundColor: "var(--public-surface)",
                    borderColor:
                      "var(--public-border-subtle, var(--public-border))",
                  }}
                >
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--public-accent)" }}
                  >
                    01 / ARSIP
                  </span>
                  <span
                    className="mt-1 text-xs font-semibold"
                    style={{ color: "var(--public-text-primary)" }}
                  >
                    Pengumuman
                  </span>
                </Link>

                <Link
                  to="/tugas"
                  className="group flex flex-col p-3 rounded-lg border transition-colors duration-200 hover:bg-[var(--public-surface-hover)]"
                  style={{
                    backgroundColor: "var(--public-surface)",
                    borderColor:
                      "var(--public-border-subtle, var(--public-border))",
                  }}
                >
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--public-accent)" }}
                  >
                    02 / TUGAS
                  </span>
                  <span
                    className="mt-1 text-xs font-semibold"
                    style={{ color: "var(--public-text-primary)" }}
                  >
                    Daftar Tugas
                  </span>
                </Link>

                <Link
                  to="/mata-kuliah"
                  className="group flex flex-col p-3 rounded-lg border transition-colors duration-200 hover:bg-[var(--public-surface-hover)]"
                  style={{
                    backgroundColor: "var(--public-surface)",
                    borderColor:
                      "var(--public-border-subtle, var(--public-border))",
                  }}
                >
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--public-accent)" }}
                  >
                    04 / KURIKULUM
                  </span>
                  <span
                    className="mt-1 text-xs font-semibold"
                    style={{ color: "var(--public-text-primary)" }}
                  >
                    Mata Kuliah
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 / Courses Preview ──────────────────────────── */}
      <section
        id="courses"
        className="relative py-20 sm:py-24 lg:py-28"
        style={{
          backgroundColor: "var(--public-bg-primary)",
          borderTop:
            "1px solid var(--public-border-subtle, var(--public-border))",
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            number="04 / COURSES"
            title="MATA KULIAH AKTIF"
            description="Pratinjau mata kuliah yang sedang dipelajari di Class 1IA08."
          />

          {coursesLoading && <CoursePreviewSkeleton count={6} />}

          {!coursesLoading && coursesError && (
            <div
              className="py-12 text-center rounded-lg border border-dashed"
              style={{ borderColor: "var(--public-border)" }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--public-text-primary)" }}
              >
                Mata kuliah belum dapat dimuat.
              </p>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--public-text-muted)" }}
              >
                Silakan coba lagi.
              </p>
              <button
                type="button"
                onClick={refetchCourses}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider border transition-colors duration-150"
                style={{
                  color: "var(--public-text-primary)",
                  borderColor: "var(--public-border)",
                }}
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Coba Lagi
              </button>
            </div>
          )}

          {!coursesLoading &&
            !coursesError &&
            (!courses || courses.length === 0) && (
              <div
                className="py-12 text-center rounded-lg border border-dashed"
                style={{ borderColor: "var(--public-border)" }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--public-text-primary)" }}
                >
                  Belum ada mata kuliah aktif.
                </p>
              </div>
            )}

          {!coursesLoading &&
            !coursesError &&
            courses &&
            courses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {courses.map((course, index) => (
                  <CoursePreviewCard
                    key={course.id}
                    course={course}
                    index={index}
                  />
                ))}
              </div>
            )}

          {/* View all courses link */}
          <div
            className="mt-12 sm:mt-16 pt-8 border-t flex justify-end"
            style={{
              borderColor: "var(--public-border-subtle, var(--public-border))",
            }}
          >
            <Link
              to="/mata-kuliah"
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-200"
              style={{ color: "var(--public-accent)" }}
            >
              <span>Lihat Semua Mata Kuliah</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
