import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Clock, MapPin, User } from "lucide-react";
import { SectionHeading } from "../../components/public/SectionHeading";
import {
  jadwal,
  HARI_AKTIF,
  MARKER_LEGEND,
  KELAS,
} from "../../data/jadwal";

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 500, damping: 36 };

function getTodayName() {
  try {
    const name = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      timeZone: "Asia/Jakarta",
    });
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return "";
  }
}

function jamLabel([mulai, selesai]) {
  return mulai === selesai ? `${mulai}` : `${mulai}–${selesai}`;
}

function ClassCard({ item, index, reduced }) {
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
      whileHover={reduced ? undefined : { y: -3 }}
      className="group flex gap-4 rounded-2xl border p-4 transition-colors duration-200 hover:border-[var(--public-accent)] sm:p-5"
      style={{
        backgroundColor: "var(--public-surface)",
        borderColor: "var(--public-border-subtle, var(--public-border))",
      }}
    >
      {/* Blok jam */}
      <div
        className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl py-2"
        style={{ backgroundColor: "var(--public-accent-soft)" }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--public-accent)" }}
        >
          Jam
        </span>
        <span
          className="text-xl font-bold leading-tight tabular-nums"
          style={{ color: "var(--public-accent)" }}
        >
          {jamLabel(item.jam)}
        </span>
      </div>

      {/* Detail */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className="text-base font-semibold leading-snug sm:text-lg"
            style={{ color: "var(--public-text-primary)" }}
          >
            {item.mataKuliah}
          </h3>
          {item.penanda && (
            <span
              className="rounded border px-1.5 text-xs font-bold"
              style={{
                color: "var(--public-accent)",
                borderColor: "var(--public-border)",
              }}
              title="Penanda pada jadwal"
            >
              {item.penanda}
            </span>
          )}
        </div>

        <div
          className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm"
          style={{ color: "var(--public-text-secondary)" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-mono font-semibold">{item.ruang}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {item.dosen}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function Schedule() {
  const reduced = useReducedMotion();
  const today = useMemo(getTodayName, []);
  const [filter, setFilter] = useState(
    HARI_AKTIF.includes(today) ? today : "Semua",
  );

  const byDay = useMemo(() => {
    const map = {};
    HARI_AKTIF.forEach((h) => {
      map[h] = jadwal
        .filter((j) => j.hari === h)
        .sort((a, b) => a.jam[0] - b.jam[0]);
    });
    return map;
  }, []);

  const tabs = ["Semua", ...HARI_AKTIF];
  const visibleDays = filter === "Semua" ? HARI_AKTIF : [filter];
  const legend = Object.entries(MARKER_LEGEND).filter(([, v]) => v);

  return (
    <main
      className="pt-28 pb-20 sm:pt-36 sm:pb-24"
      style={{ backgroundColor: "var(--public-bg-primary)" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="JADWAL"
          title="JADWAL KULIAH"
          description={`Jadwal perkuliahan mingguan Class ${KELAS}.`}
        />

        {/* Pilihan hari */}
        <div
          role="tablist"
          aria-label="Pilih hari"
          className="mb-8 flex gap-1.5 overflow-x-auto rounded-full border p-1.5 sm:inline-flex"
          style={{
            backgroundColor: "var(--public-surface)",
            borderColor: "var(--public-border-subtle, var(--public-border))",
          }}
        >
          {tabs.map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab)}
                className="relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider outline-none transition-colors duration-200 sm:text-sm sm:normal-case sm:tracking-normal"
                style={{
                  color: active
                    ? "var(--public-accent)"
                    : "var(--public-text-muted)",
                }}
              >
                {active && (
                  <motion.span
                    layoutId="schedule-tab-pill"
                    className="glass-pill absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: "var(--public-accent-soft)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                    transition={SPRING}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  {tab}
                  {tab === today && (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "var(--public-accent)" }}
                      title="Hari ini"
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Daftar jadwal per hari */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="space-y-10"
          >
            {visibleDays.map((hari) => (
              <section key={hari} aria-labelledby={`hari-${hari}`}>
                <div className="mb-4 flex items-center gap-3">
                  <h2
                    id={`hari-${hari}`}
                    className="text-lg font-bold tracking-tight sm:text-xl"
                    style={{ color: "var(--public-text-primary)" }}
                  >
                    {hari}
                  </h2>
                  {hari === today && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
                      style={{
                        color: "var(--public-accent)",
                        backgroundColor: "var(--public-accent-soft)",
                      }}
                    >
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      Hari ini
                    </span>
                  )}
                  <span
                    className="h-px flex-1"
                    style={{
                      backgroundColor:
                        "var(--public-border-subtle, var(--public-border))",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--public-text-muted)" }}
                  >
                    {byDay[hari].length} mata kuliah
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  {byDay[hari].map((item, i) => (
                    <ClassCard
                      key={item.id}
                      item={item}
                      index={i}
                      reduced={reduced}
                    />
                  ))}
                </div>
              </section>
            ))}
          </motion.div>
        </AnimatePresence>

        {legend.length > 0 && (
          <ul
            className="mt-10 space-y-1 border-t pt-6 text-xs"
            style={{
              borderColor: "var(--public-border-subtle, var(--public-border))",
              color: "var(--public-text-muted)",
            }}
          >
            {legend.map(([mark, text]) => (
              <li key={mark}>
                <span className="font-bold">{mark}</span> {text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default Schedule;