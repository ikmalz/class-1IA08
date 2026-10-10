import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cache ringan (stale-while-revalidate) untuk data dinamis.
 *
 * - Data yang sudah pernah diambil langsung tampil (tanpa skeleton) saat
 *   pindah halaman lalu kembali ke Home.
 * - Request yang sama yang berjalan bersamaan hanya dikirim sekali (dedupe).
 * - Data di-refresh di background jika sudah lebih tua dari `ttl`.
 *
 * Return shape sama dengan hook lama: { data, loading, error, refetch }
 */

const cache = new Map(); // key -> { data, time }
const inflight = new Map(); // key -> Promise

function load(key, fetcher) {
  if (inflight.has(key)) return inflight.get(key);
  const p = Promise.resolve(fetcher())
    .then((data) => {
      cache.set(key, { data, time: Date.now() });
      return data;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

export function invalidateQuery(keyPrefix) {
  for (const k of cache.keys()) {
    if (k.startsWith(keyPrefix)) cache.delete(k);
  }
}

export function useCachedQuery(key, fetcher, { ttl = 60_000 } = {}) {
  const cached = cache.get(key);
  const [data, setData] = useState(cached?.data ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(
    async (force = false) => {
      const hit = cache.get(key);
      if (hit) setData(hit.data);
      const fresh = hit && Date.now() - hit.time < ttl;
      if (fresh && !force) {
        setLoading(false);
        return;
      }
      if (!hit) setLoading(true);
      setError(null);
      try {
        const result = await load(key, () => fetcherRef.current());
        setData(result);
      } catch (e) {
        if (!hit) setError(e);
      } finally {
        setLoading(false);
      }
    },
    [key, ttl]
  );

  useEffect(() => {
    run();
  }, [run]);

  const refetch = useCallback(() => run(true), [run]);

  return { data, loading, error, refetch };
}