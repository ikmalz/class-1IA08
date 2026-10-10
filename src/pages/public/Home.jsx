import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  Megaphone,
  RotateCcw,
  ClipboardList,
  BookOpen,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
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
   Animation config
   ────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1];

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: EASE },
    },
  },
};

const staggerReduced = {
  container: { hidden: { opacity: 1 }, show: { opacity: 1 } },
  item: { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } },
};

const wordParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};
const wordChild = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* ──────────────────────────────────────────────────────────
   Small reusable pieces
   ────────────────────────────────────────────────────────── */

/** Reveal saat section masuk viewport */
function Reveal({ children, className, delay = 0, reduced }) {
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Paragraf yang muncul kata per kata */
function WordReveal({ text, className, reduced }) {
  if (reduced) return <p className={className}>{text}</p>;
  return (
    <motion.p variants={wordParent} className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={wordChild}
          className="inline-block"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.p>
  );
}

/** Teks berjalan tanpa henti (berhenti saat tidak terlihat) */
function Marquee({ items }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  if (!items?.length) return null;
  const row = [...items, ...items];

  return (
    <div
      ref={ref}
      data-paused={!inView}
      className="marquee border-y py-4"
      style={{
        backgroundColor: "var(--public-bg-secondary)",
        borderColor: "var(--public-border-subtle, var(--public-border))",
      }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {[0, 1].map((n) => (
          <ul key={n} className="flex shrink-0 items-center">
            {row.map((name, i) => (
              <li
                key={`${n}-${i}`}
                className="flex items-center gap-6 pr-6 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: "var(--public-text-muted)" }}
              >
                <span>{name}</span>
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ backgroundColor: "var(--public-accent)" }}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/** Kartu link dengan spotlight + tilt 3D (hanya untuk mouse, tanpa re-render) */
function SpotlightLink({ to, tag, label, reduced }) {
  const onEnter = (e) => {
    if (reduced || e.pointerType !== "mouse") return;
    e.currentTarget._rect = e.currentTarget.getBoundingClientRect();
  };
  const onMove = (e) => {
    const el = e.currentTarget;
    if (reduced || e.pointerType !== "mouse" || !el._rect) return;
    const r = el._rect;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--ry", `${(x / r.width - 0.5) * 10}deg`);
    el.style.setProperty("--rx", `${(0.5 - y / r.height) * 10}deg`);
  };
  const onLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <Link
      to={to}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="spotlight-card group flex flex-col rounded-lg border p-3 hover:border-[var(--public-accent)]"
      style={{
        backgroundColor: "var(--public-surface)",
        borderColor: "var(--public-border-subtle, var(--public-border))",
      }}
    >
      <span
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--public-accent)" }}
      >
        {tag}
      </span>
      <span
        className="mt-1 text-xs font-semibold"
        style={{ color: "var(--public-text-primary)" }}
      >
        {label}
      </span>
    </Link>
  );
}

/** Kotak untuk state error / kosong */
function StateBox({ title, hint, onRetry }) {
  return (
    <div
      className="py-12 text-center rounded-lg border border-dashed"
      style={{ borderColor: "var(--public-border)" }}
    >
      <p
        className="text-sm font-medium"
        style={{ color: "var(--public-text-primary)" }}
      >
        {title}
      </p>
      {hint && (
        <p
          className="mt-1 text-xs"
          style={{ color: "var(--public-text-muted)" }}
        >
          {hint}
        </p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider border transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
          style={{
            color: "var(--public-text-primary)",
            borderColor: "var(--public-border)",
          }}
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}

/** Link "Lihat semua ..." */
function ViewAllLink({ to, children }) {
  return (
    <div
      className="mt-12 sm:mt-16 pt-8 border-t flex justify-end"
      style={{ borderColor: "var(--public-border-subtle, var(--public-border))" }}
    >
      <Link
        to={to}
        className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-200"
        style={{ color: "var(--public-accent)" }}
      >
        <span className="relative">
          {children}
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
        </span>
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}

const sectionBase = "relative py-20 sm:py-24 lg:py-28";
const sectionBorder = "1px solid var(--public-border-subtle, var(--public-border))";

const quickLinks = [
  { to: "/pengumuman", tag: "01 / ARSIP", label: "Pengumuman" },
  { to: "/tugas", tag: "02 / TUGAS", label: "Daftar Tugas" },
  { to: "/jadwal", tag: "03 / JADWAL", label: "Jadwal Kuliah" },
  { to: "/mata-kuliah", tag: "04 / KURIKULUM", label: "Mata Kuliah" },
];

/* ──────────────────────────────────────────────────────────
   Home page
   ────────────────────────────────────────────────────────── */

function Home() {
  const heroRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const heroInView = useInView(heroRef);
  const { theme } = useTheme();

  // Ketiga hook ini berjalan paralel sejak mount (tidak saling menunggu).
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

  // Efek parallax: foto bergerak lebih lambat dari konten
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  const scrollTransformStyle = prefersReduced
    ? {}
    : { scale: heroScale, opacity: heroOpacity, y: heroY };
  const bgStyle = prefersReduced
    ? { objectPosition: "center center" }
    : { y: bgY, scale: bgScale, objectPosition: "center center" };

  const variants = prefersReduced ? staggerReduced : stagger;

  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        data-paused={!heroInView}
        className="relative flex min-h-svh items-center justify-center overflow-hidden"
      >
        {/* Background: foto kelas dengan parallax */}
        <div className="absolute inset-0">
          <motion.img
            src={imageImg}
            alt=""
            className="h-full w-full object-cover"
            style={bgStyle}
            fetchPriority="high"
            decoding="async"
            aria-hidden="true"
            initial={prefersReduced ? false : { opacity: 0, scale: 1.15 }}
            animate={prefersReduced ? undefined : { opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(to bottom, rgba(8,8,8,0.25), rgba(8,8,8,0.92))"
                  : "linear-gradient(to bottom, rgba(8,8,8,0.30), rgba(8,8,8,0.72))",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
          {/* Aurora: gradien radial yang melayang (blob ke-3 hanya di layar lebar) */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="aurora-blob -left-24 -top-24 h-[26rem] w-[26rem]"
              style={{ "--c": "var(--public-accent)" }}
            />
            <div
              className="aurora-blob b2 -right-20 top-1/3 h-[22rem] w-[22rem]"
              style={{ "--c": "#ec4899" }}
            />
            <div
              className="aurora-blob b3 bottom-0 left-1/3 hidden h-[24rem] w-[24rem] sm:block"
              style={{ "--c": "#22d3ee" }}
            />
          </div>
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28"
          style={scrollTransformStyle}
          variants={variants.container}
          initial="hidden"
          animate="show"
        >
          <motion.span
            variants={variants.item}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
            Portal Kelas
          </motion.span>

          <motion.h1
            variants={variants.item}
            className="text-shimmer mt-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Class 1IA08
          </motion.h1>

          <motion.div variants={variants.item}>
            <WordReveal
              reduced={prefersReduced}
              text="Pengumuman, tugas, dan mata kuliah dalam satu tempat. Cek tenggat dan info terbaru kapan saja tanpa menelusuri chat."
              className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/85 drop-shadow-md sm:text-base"
            />
          </motion.div>

          <motion.div
            variants={variants.item}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/tugas"
              className="btn-shine glow-pulse group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                backgroundColor: "var(--public-accent)",
                color: "#080808",
              }}
            >
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              Lihat Tugas
            </Link>
            <Link
              to="/pengumuman"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 active:translate-y-0"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Pengumuman
            </Link>
          </motion.div>
        </motion.div>

        {/* Indikator scroll */}
        <motion.a
          href="#announcements"
          aria-label="Gulir ke bawah"
          className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 text-white/70 hover:text-white md:bottom-8"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.2, duration: 0.6 },
            y: { delay: 1.2, duration: 1.8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ArrowDown className="h-5 w-5" aria-hidden="true" />
        </motion.a>
      </section>

      {/* ── Ticker mata kuliah (berjalan terus) ─────────────── */}
      <Marquee items={courses?.map((c) => c.nama)} />

      {/* ── 01 / Pengumuman ─────────────────────────────────── */}
      <section
        id="announcements"
        className={sectionBase}
        style={{ backgroundColor: "var(--public-bg-secondary)", borderTop: sectionBorder }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal reduced={prefersReduced}>
            <SectionHeading
              number="01 / LATEST UPDATES"
              title="PENGUMUMAN TERBARU"
              description="Informasi terbaru untuk Class 1IA08."
            />
          </Reveal>

          {loading && <AnnouncementRowSkeletonList count={3} />}

          {!loading && error && (
            <StateBox
              title="Pengumuman belum dapat dimuat."
              hint="Silakan coba lagi."
              onRetry={refetch}
            />
          )}

          {!loading && !error && (!announcements || announcements.length === 0) && (
            <StateBox
              title="Belum ada pengumuman terbaru."
              hint="Pengumuman baru akan muncul di sini."
            />
          )}

          {!loading && !error && announcements?.length > 0 && (
            <>
              <div className="divide-y" style={{ borderColor: "var(--public-border-subtle)" }}>
                {announcements.map((item, index) => (
                  <div key={item.id} style={{ borderColor: "var(--public-border-subtle)" }}>
                    <AnnouncementRow announcement={item} index={index} />
                  </div>
                ))}
              </div>
              <ViewAllLink to="/pengumuman">Lihat Semua Pengumuman</ViewAllLink>
            </>
          )}
        </div>
      </section>

      {/* ── 02 / Tugas ──────────────────────────────────────── */}
      <section
        id="assignments"
        className={sectionBase}
        style={{ backgroundColor: "var(--public-bg-primary)", borderTop: sectionBorder }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal reduced={prefersReduced}>
            <SectionHeading
              number="02 / ASSIGNMENTS"
              title="TUGAS TERBARU"
              description="Informasi tugas terbaru untuk Class 1IA08."
            />
          </Reveal>

          {tasksLoading && <TaskRowSkeletonList count={3} />}

          {!tasksLoading && tasksError && (
            <StateBox
              title="Tugas belum dapat dimuat."
              hint="Silakan coba lagi."
              onRetry={refetchTasks}
            />
          )}

          {!tasksLoading && !tasksError && (!tasks || tasks.length === 0) && (
            <StateBox
              title="Belum ada tugas yang ditampilkan."
              hint="Tugas baru akan muncul di sini."
            />
          )}

          {!tasksLoading && !tasksError && tasks?.length > 0 && (
            <div className="divide-y" style={{ borderColor: "var(--public-border-subtle, var(--public-border))" }}>
              {tasks.map((item, index) => (
                <div key={item.id} style={{ borderColor: "var(--public-border-subtle, var(--public-border))" }}>
                  <TaskRow task={item} index={index} />
                </div>
              ))}
            </div>
          )}

          <ViewAllLink to="/tugas">Lihat Semua Tugas</ViewAllLink>
        </div>
      </section>

      {/* ── 03 / Info Kelas ─────────────────────────────────── */}
      <section
        id="class-info"
        className={sectionBase}
        style={{ backgroundColor: "var(--public-bg-secondary)", borderTop: sectionBorder }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 md:items-start">
            <Reveal className="md:col-span-5" reduced={prefersReduced}>
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
            </Reveal>

            <Reveal className="md:col-span-7 space-y-6" delay={0.12} reduced={prefersReduced}>
              <div
                className="space-y-4 text-sm leading-relaxed sm:text-base"
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

              <div
                className="pt-6 border-t grid grid-cols-2 gap-3 sm:grid-cols-4"
                style={{ borderColor: "var(--public-border-subtle, var(--public-border))" }}
              >
                {quickLinks.map((l) => (
                  <SpotlightLink key={l.to} {...l} reduced={prefersReduced} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 04 / Mata Kuliah ────────────────────────────────── */}
      <section
        id="courses"
        className={sectionBase}
        style={{ backgroundColor: "var(--public-bg-primary)", borderTop: sectionBorder }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal reduced={prefersReduced}>
            <SectionHeading
              number="04 / COURSES"
              title="MATA KULIAH AKTIF"
              description="Pratinjau mata kuliah yang sedang dipelajari di Class 1IA08."
            />
          </Reveal>

          {coursesLoading && <CoursePreviewSkeleton count={6} />}

          {!coursesLoading && coursesError && (
            <StateBox
              title="Mata kuliah belum dapat dimuat."
              hint="Silakan coba lagi."
              onRetry={refetchCourses}
            />
          )}

          {!coursesLoading && !coursesError && (!courses || courses.length === 0) && (
            <StateBox title="Belum ada mata kuliah aktif." />
          )}

          {!coursesLoading && !coursesError && courses?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {courses.map((course, index) => (
                <CoursePreviewCard key={course.id} course={course} index={index} />
              ))}
            </div>
          )}

          <ViewAllLink to="/mata-kuliah">Lihat Semua Mata Kuliah</ViewAllLink>
        </div>
      </section>
    </main>
  );
}

export default Home;