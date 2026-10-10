import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  ArrowUp,
  House,
  Megaphone,
  ClipboardList,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useAnimationControls,
} from "framer-motion";
import { useTheme } from "../hooks/useTheme";

const navItems = [
  { label: "Beranda", to: "/", icon: House },
  { label: "Pengumuman", to: "/pengumuman", icon: Megaphone },
  { label: "Tugas", to: "/tugas", icon: ClipboardList },
  { label: "Jadwal", to: "/jadwal", icon: CalendarDays },
  { label: "Mata Kuliah", to: "/mata-kuliah", icon: BookOpen },
];

const SPRING = { type: "spring", stiffness: 500, damping: 36 };
const EASE = [0.22, 1, 0.36, 1];
// Pill aktif: sedikit "melampaui" lalu mengendap (terasa kenyal)
const PILL_SPRING = { type: "spring", stiffness: 380, damping: 26, mass: 0.9 };

function isItemActive(item, pathname) {
  return item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
}

/* Kilau cahaya sekali lewat di kaca setiap pindah halaman */
function RouteSweep({ pathname, reduced }) {
  if (reduced) return null;
  return (
    <motion.span
      key={pathname}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-1/3"
      style={{
        skewX: -18,
        background:
          "linear-gradient(105deg, transparent, color-mix(in srgb, var(--public-accent) 45%, white), transparent)",
      }}
      initial={{ x: "-120%", opacity: 0.7 }}
      animate={{ x: "380%", opacity: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
    />
  );
}

/* Tombol tema dengan ikon yang berputar saat berganti */
function ThemeButton({ theme, toggleTheme, size = "h-9 w-9" }) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={reduced ? undefined : { scale: 0.88 }}
      whileHover={reduced ? undefined : { scale: 1.06 }}
      className={`relative flex ${size} items-center justify-center overflow-hidden rounded-full border focus-visible:outline-none focus-visible:ring-2`}
      style={{
        color: "var(--public-accent)",
        borderColor: "var(--public-border)",
        backgroundColor: "var(--public-accent-soft)",
      }}
      aria-label={
        theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduced ? false : { rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={reduced ? undefined : { rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  // Satu pendengar scroll untuk: ukuran navbar, progress bar, dan tab bar
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const [tabHidden, setTabHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - (scrollY.getPrevious() ?? 0);
    setScrolled(y > 24); // setState dengan nilai sama tidak me-render ulang
    if (y < 80) setTabHidden(false);
    else if (diff > 6) setTabHidden(true); // scroll turun → tab bar menyingkir
    else if (diff < -6) setTabHidden(false); // scroll naik → muncul lagi
  });

  // Navbar "berdenyut" sekali setiap pindah halaman
  const pulse = useAnimationControls();
  const firstRoute = useRef(true);

  // Kembali ke atas saat pindah halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    if (!reduced) {
      pulse.start({
        scale: [1, 1.025, 0.992, 1],
        transition: { duration: 0.55, ease: "easeOut" },
      });
    }
  }, [pathname, pulse, reduced]);

  const scrollToTop = useCallback(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, []);

  // Tingkat "ketebalan" kaca & cahaya mengikuti posisi scroll
  const glassBar = {
    "--glass-tint": scrolled ? "70%" : "38%",
    "--glass-blur": scrolled ? "28px" : "20px",
    "--glass-glow": scrolled
      ? "color-mix(in srgb, var(--public-accent) 45%, transparent)"
      : "rgba(0, 0, 0, 0.30)",
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--public-bg-primary)",
        color: "var(--public-text-primary)",
      }}
    >
      {/* ── Navbar atas (kaca) ────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
        style={{
          scaleX: progress,
          background:
            "linear-gradient(90deg, var(--public-accent), #ec4899, #22d3ee)",
        }}
      />

      <motion.header
        className="fixed top-0 right-0 left-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
        initial={reduced ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
      >
        <motion.div animate={pulse} className="w-full">
        <motion.div
          className="liquid-glass mx-auto flex items-center justify-between rounded-full px-3 pl-4 sm:pl-5"
          animate={{
            height: scrolled ? 52 : 60,
            maxWidth: scrolled ? 880 : 1024,
          }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
          style={glassBar}
        >
          <span className="glass-beam" aria-hidden="true" />
          <RouteSweep pathname={pathname} reduced={reduced} />
          {/* Brand */}
          <Link to="/" className="group flex items-center gap-2">
            <motion.span
              whileHover={reduced ? undefined : { rotate: 8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 14 }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold text-white shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--public-accent), color-mix(in srgb, var(--public-accent) 55%, #ffffff))",
              }}
              aria-hidden="true"
            >
              1A
            </motion.span>
            <span className="flex items-baseline">
              <span
                className="text-base font-bold tracking-tight sm:text-lg"
                style={{ color: "var(--public-text-primary)" }}
              >
                1IA08
              </span>
              <span
                className="text-base font-bold sm:text-lg"
                style={{ color: "var(--public-accent)" }}
              >
                .
              </span>
            </span>
          </Link>

          {/* Navigasi desktop: pill aktif meluncur + hover pill */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Navigasi utama"
            onMouseLeave={() => setHovered(null)}
          >
            {navItems.map((item) => {
              const active = isItemActive(item, pathname);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onMouseEnter={() => setHovered(item.to)}
                  onFocus={() => setHovered(item.to)}
                  className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none"
                  style={{
                    color: active
                      ? "var(--public-accent)"
                      : hovered === item.to
                        ? "var(--public-text-primary)"
                        : "var(--public-text-muted)",
                  }}
                >
                  {hovered === item.to && !active && (
                    <motion.span
                      layoutId="public-nav-hover"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--public-text-primary) 7%, transparent)",
                      }}
                      transition={SPRING}
                      aria-hidden="true"
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="public-nav-active"
                      className="glass-pill absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: "var(--public-accent-soft)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                      }}
                      transition={PILL_SPRING}
                      aria-hidden="true"
                    />
                  )}
                  {active && !reduced && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full"
                      style={{ boxShadow: "0 0 0 2px var(--public-accent)" }}
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                    />
                  )}
                  <motion.span
                    key={active ? "on" : "off"}
                    className="relative z-10 inline-block"
                    initial={active && !reduced ? { y: 8, opacity: 0 } : false}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                </NavLink>
              );
            })}
            <span className="ml-2">
              <ThemeButton theme={theme} toggleTheme={toggleTheme} />
            </span>
          </nav>

          {/* Tombol tema (mobile) */}
          <div className="md:hidden">
            <ThemeButton theme={theme} toggleTheme={toggleTheme} />
          </div>
        </motion.div>
        </motion.div>
      </motion.header>

      {/* ── Tab bar bawah ala iPhone (mobile) ─────────────────── */}
      <nav
        aria-label="Navigasi mobile"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <motion.div
          initial={reduced ? false : { y: 100, opacity: 0 }}
          animate={{ y: tabHidden ? 120 : 0, opacity: tabHidden ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="liquid-glass pointer-events-auto mx-auto flex max-w-md items-stretch gap-1 rounded-[28px] p-1.5"
          style={{
            "--glass-tint": "52%",
            "--glass-blur": "30px",
            "--glass-glow": "rgba(0, 0, 0, 0.45)",
          }}
        >
          <span className="glass-beam" aria-hidden="true" />
          <RouteSweep pathname={pathname} reduced={reduced} />
          {navItems.map((item) => {
            const active = isItemActive(item, pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-[22px] py-2 text-[10px] font-medium outline-none"
                style={{
                  color: active
                    ? "var(--public-accent)"
                    : "var(--public-text-muted)",
                }}
              >
                {active && (
                  <motion.span
                    layoutId="public-tab-pill"
                    className="glass-pill absolute inset-0 rounded-[22px]"
                    style={{
                      backgroundColor: "var(--public-accent-soft)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                    transition={PILL_SPRING}
                    aria-hidden="true"
                  />
                )}
                {active && !reduced && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[22px]"
                    style={{ boxShadow: "0 0 0 2px var(--public-accent)" }}
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.25, opacity: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                  />
                )}
                <motion.span
                  className="relative z-10"
                  animate={
                    reduced
                      ? undefined
                      : active
                        ? { scale: [1, 1.4, 1.12], y: [0, -7, -1] }
                        : { scale: 1, y: 0 }
                  }
                  whileTap={reduced ? undefined : { scale: 0.82 }}
                  transition={
                    active
                      ? { duration: 0.5, times: [0, 0.45, 1], ease: "easeOut", delay: 0.08 }
                      : { type: "spring", stiffness: 500, damping: 18 }
                  }
                >
                  <Icon
                    className="h-[22px] w-[22px]"
                    strokeWidth={active ? 2.4 : 2}
                    aria-hidden="true"
                  />
                </motion.span>
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </motion.div>
      </nav>

      {/* ── Page Content ──────────────────────────────────────── */}
      <motion.div
        key={pathname}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <Outlet />
      </motion.div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        className="border-t py-12 pb-28 sm:py-16 sm:pb-28 md:pb-16"
        style={{
          backgroundColor: "var(--public-bg-secondary)",
          borderColor: "var(--public-border-subtle, var(--public-border))",
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <Link
                to="/"
                className="inline-flex items-baseline gap-0 text-lg font-bold tracking-tight transition-opacity duration-200 hover:opacity-80"
                style={{ color: "var(--public-text-primary)" }}
              >
                <span>1IA08</span>
                <span style={{ color: "var(--public-accent)" }}>.</span>
              </Link>
              <p
                className="max-w-xs text-xs leading-relaxed sm:text-sm"
                style={{ color: "var(--public-text-secondary)" }}
              >
                Ruang informasi bersama untuk Class 1IA08. Pengumuman, tugas,
                dan materi kelas dalam satu tempat.
              </p>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <nav
                aria-label="Navigasi footer"
                className="flex flex-wrap gap-4 sm:gap-6"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-xs font-medium uppercase tracking-wider transition-colors duration-150 hover:opacity-80 focus-visible:underline focus-visible:outline-none"
                    style={{ color: "var(--public-text-secondary)" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex cursor-pointer items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-wider transition-colors duration-150 hover:opacity-80 focus-visible:underline focus-visible:outline-none sm:self-auto"
                style={{ color: "var(--public-accent)" }}
                aria-label="Kembali ke atas halaman"
              >
                <span>Kembali ke Atas</span>
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row"
            style={{
              borderColor: "var(--public-border-subtle, var(--public-border))",
              color: "var(--public-text-muted)",
            }}
          >
            <p>
              © {new Date().getFullYear()} Class 1IA08. Seluruh hak cipta
              dilindungi.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-wider">
              Kelas 1IA08 • Akademik
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;