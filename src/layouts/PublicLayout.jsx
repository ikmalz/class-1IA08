import { Link, NavLink, Outlet } from "react-router-dom";
import { Menu, Sun, Moon, ArrowUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Pengumuman", to: "/pengumuman" },
  { label: "Tugas", to: "/tugas" },
  { label: "Mata Kuliah", to: "/mata-kuliah" },
];

function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileNav = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const scrollToTop = useCallback(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--public-bg-primary)",
        color: "var(--public-text-primary)",
      }}
    >
      {/* ── Navbar ────────────────────────────────────────────── */}
      {/* ── Navbar ────────────────────────────────────────────── */}
      <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border px-3 pl-5 transition-all duration-300 sm:h-16"
          style={{
            backgroundColor: scrolled
              ? "color-mix(in srgb, var(--public-bg-primary) 82%, transparent)"
              : "color-mix(in srgb, var(--public-bg-primary) 55%, transparent)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            borderColor: scrolled ? "var(--public-border)" : "transparent",
            boxShadow: scrolled
              ? "0 8px 30px -12px color-mix(in srgb, var(--public-accent) 35%, transparent)"
              : "none",
          }}
        >
          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-90"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold text-white shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, var(--public-accent), color-mix(in srgb, var(--public-accent) 55%, #ffffff))",
              }}
              aria-hidden="true"
            >
              1A
            </span>
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

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Navigasi utama"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-px"
                style={({ isActive }) => ({
                  color: isActive
                    ? "var(--public-accent)"
                    : "var(--public-text-muted)",
                  backgroundColor: isActive
                    ? "var(--public-accent-soft)"
                    : "transparent",
                })}
              >
                {item.label}
              </NavLink>
            ))}

            {/* Theme Toggle (Desktop) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2"
              style={{
                color: "var(--public-accent)",
                borderColor: "var(--public-border)",
                backgroundColor: "var(--public-accent-soft)",
              }}
              aria-label={
                theme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200"
              style={{
                color: "var(--public-accent)",
                backgroundColor: "var(--public-accent-soft)",
              }}
              aria-label={
                theme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-200 active:scale-95"
                  style={{ backgroundColor: "var(--public-accent)" }}
                  aria-label="Buka menu naviagasi"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-72 border-l"
                style={{
                  backgroundColor: "var(--public-bg-secondary)",
                  borderColor: "var(--public-border)",
                }}
              >
                <SheetHeader>
                  <SheetTitle
                    className="text-left text-base font-bold"
                    style={{ color: "var(--public-text-primary)" }}
                  >
                    <span>1IA08</span>
                    <span style={{ color: "var(--public-accent)" }}>.</span>
                  </SheetTitle>
                </SheetHeader>

                <nav
                  className="mt-6 flex flex-col gap-1.5 px-2"
                  aria-label="Navigasi mobile"
                >
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      onClick={handleMobileNav}
                      className="rounded-full px-4 py-3 text-sm font-medium transition-colors duration-150"
                      style={({ isActive }) => ({
                        color: isActive
                          ? "var(--public-accent)"
                          : "var(--public-text-secondary)",
                        backgroundColor: isActive
                          ? "var(--public-accent-soft)"
                          : "transparent",
                      })}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ── Page Content ──────────────────────────────────────── */}
      <Outlet />

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        className="border-t py-12 sm:py-16"
        style={{
          backgroundColor: "var(--public-bg-secondary)",
          borderColor: "var(--public-border-subtle, var(--public-border))",
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Brand + Tagline */}
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
                className="max-w-xs text-xs sm:text-sm leading-relaxed"
                style={{ color: "var(--public-text-secondary)" }}
              >
                Ruang informasi bersama untuk Class 1IA08. Pengumuman, tugas,
                dan materi kelas dalam satu tempat.
              </p>
            </div>

            {/* Navigation links & Back to Top */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
              <nav
                aria-label="Navigasi footer"
                className="flex flex-wrap gap-4 sm:gap-6"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-xs font-medium uppercase tracking-wider transition-colors duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:underline"
                    style={{ color: "var(--public-text-secondary)" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:underline self-start sm:self-auto cursor-pointer"
                style={{ color: "var(--public-accent)" }}
                aria-label="Kembali ke atas halaman"
              >
                <span>Kembali ke Atas</span>
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div
            className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
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
