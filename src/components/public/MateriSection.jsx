import { useState } from "react";
import { CalendarDays, X, ImageOff } from "lucide-react";
import { useMateri } from "@/hooks/useMateri";
import { getMateriFotoUrl } from "@/lib/materi";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatTanggal(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function MateriSection({ courseId }) {
  const now = new Date();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(now.getFullYear());
  const [preview, setPreview] = useState(null);

  const { data, loading, error, refetch } = useMateri(courseId, {
    month: month ? Number(month) : undefined,
    year: month ? Number(year) : undefined,
  });

  const selectStyle = {
    color: "var(--public-text-primary)",
    borderColor: "var(--public-border)",
    backgroundColor: "var(--public-surface)",
  };

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--public-accent)" }}
          >
            MATERI / PEMBAHASAN
          </p>
          <h2
            className="mt-1 text-xl font-bold"
            style={{ color: "var(--public-text-primary)" }}
          >
            Foto Materi Perkuliahan
          </h2>
        </div>

        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
            style={selectStyle}
            aria-label="Filter bulan"
          >
            <option value="">Semua bulan</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          {month && (
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-24 rounded-md border px-3 py-2 text-sm"
              style={selectStyle}
              aria-label="Tahun"
            />
          )}
        </div>
      </div>

      <div className="mt-6 space-y-8">
        {loading && (
          <p className="text-sm" style={{ color: "var(--public-text-muted)" }}>
            Memuat materi…
          </p>
        )}

        {!loading && error && (
          <div
            className="rounded-lg border border-dashed py-10 text-center"
            style={{ borderColor: "var(--public-border)" }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--public-text-primary)" }}
            >
              Materi belum dapat dimuat.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-3 text-xs font-medium uppercase tracking-wider underline"
              style={{ color: "var(--public-accent)" }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div
            className="rounded-lg border border-dashed py-10 text-center"
            style={{ borderColor: "var(--public-border)" }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--public-text-primary)" }}
            >
              Belum ada foto materi{month ? " pada bulan ini" : ""}.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          data.map((materi) => (
            <article key={materi.id}>
              <div
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--public-accent)" }}
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {formatTanggal(materi.tanggal_materi)}
              </div>
              {materi.catatan && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--public-text-secondary)" }}
                >
                  {materi.catatan}
                </p>
              )}

              {materi.materi_foto.length === 0 ? (
                <p
                  className="mt-3 flex items-center gap-2 text-xs"
                  style={{ color: "var(--public-text-muted)" }}
                >
                  <ImageOff className="h-4 w-4" aria-hidden="true" /> Tidak ada
                  foto.
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {materi.materi_foto.map((foto) => {
                    const url = getMateriFotoUrl(foto.storage_path);
                    return (
                      <button
                        key={foto.id}
                        type="button"
                        onClick={() =>
                          setPreview({ url, name: foto.file_name })
                        }
                        className="group overflow-hidden rounded-lg border"
                        style={{
                          borderColor:
                            "var(--public-border-subtle, var(--public-border))",
                        }}
                      >
                        <img
                          src={url}
                          alt={`Materi ${formatTanggal(materi.tanggal_materi)} - ${foto.file_name}`}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </article>
          ))}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setPreview(null)}
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={preview.url}
            alt={preview.name}
            className="max-h-full max-w-full rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
